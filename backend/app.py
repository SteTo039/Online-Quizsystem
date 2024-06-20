from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
import random
import string

# Initialisieren der Flask-Anwendung
app = Flask(__name__)
CORS(app)  # Aktivieren von Cross-Origin Resource Sharing (CORS) für die Flask-App

# MySQL Konfiguration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'IUBHprojquiz2024'  
app.config['MYSQL_DB'] = 'online_quizsystem'  # Name der MySQL-Datenbank
app.config['MYSQL_PORT'] = 3306  

mysql = MySQL(app)  # Initialisieren von MySQL

# Login-Route zum Authentifizieren von Benutzern
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id, username, role FROM Users WHERE username = %s AND password = %s", (username, password))
    user = cursor.fetchone()
    cursor.close()

    if user:
        return jsonify({"message": "Login erfolgreich", "user_id": user[0], "username": user[1], "role": user[2]}), 200
    else:
        return jsonify({"message": "Falsche Login Daten"}), 401

# Route zum Hinzufügen einer Frage
@app.route('/add_question', methods=['POST'])
def add_question():
    data = request.get_json()
    questionText = data['questionText']
    correctAnswer = data['correctAnswer']
    wrongAnswer1 = data['wrongAnswer1']
    wrongAnswer2 = data['wrongAnswer2']
    difficulty = data['difficulty']
    subject = data['subject']

    cursor = mysql.connection.cursor()
    cursor.execute("""
        INSERT INTO Questions (text, correct_answer, wrong_answer1, wrong_answer2, difficulty, created_by, subject)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (questionText, correctAnswer, wrongAnswer1, wrongAnswer2, difficulty, 1, subject))
    mysql.connection.commit()
    cursor.close()

    return jsonify({"message": "Frage erfolgreich hinzugefügt!"}), 200

# Funktion zum Generieren eines Raumcodes
def generate_room_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

# Route zum Erstellen eines Raumes
@app.route('/create_room', methods=['POST'])
def create_room():
    data = request.get_json()
    host_user_id = data['host_user_id']
    number_of_questions = data.get('number_of_questions')
    number_of_minutes = data.get('number_of_minutes')
    difficulty = data['difficulty']
    subject = data['subject']
    quiz_type = data['quiz_type']
    room_code = generate_room_code()

    cursor = mysql.connection.cursor()
    cursor.execute("""
        INSERT INTO Rooms (room_code, host_user_id, number_of_questions, number_of_minutes, difficulty, subject, quiz_type)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (room_code, host_user_id, number_of_questions, number_of_minutes, difficulty, subject, quiz_type))
    mysql.connection.commit()
    cursor.execute("SELECT id FROM Rooms WHERE room_code = %s", (room_code,))
    room_id = cursor.fetchone()[0]

    # Hinzufügen des Hosts zur RoomParticipants-Tabelle
    cursor.execute("INSERT INTO RoomParticipants (room_id, user_id) VALUES (%s, %s)", (room_id, host_user_id))
    mysql.connection.commit()

    cursor.close()

    return jsonify({"message": "Raum erfolgreich erstellt!", "room_code": room_code, "room_id": room_id}), 200

# Route zum Beitreten eines Raumes
@app.route('/join_room', methods=['POST'])
def join_room():
    data = request.get_json()
    room_code = data['room_code']
    user_id = data['user_id']

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id FROM Rooms WHERE room_code = %s", (room_code,))
    room = cursor.fetchone()
    if room:
        room_id = room[0]
        cursor.execute("INSERT INTO RoomParticipants (room_id, user_id) VALUES (%s, %s)", (room_id, user_id))
        mysql.connection.commit()
        cursor.close()
        return jsonify({"message": "Raum erfolgreich beigetreten", "room_id": room_id}), 200
    else:
        cursor.close()
        return jsonify({"message": "Raum nicht gefunden"}), 404
    
# Route zum Abrufen der Teilnehmer eines Raumes
@app.route('/get_room_participants/<int:room_id>', methods=['GET'])
def get_room_participants(room_id):
    cursor = mysql.connection.cursor()
    cursor.execute("""
        SELECT Users.username FROM Users
        JOIN RoomParticipants ON Users.id = RoomParticipants.user_id
        WHERE RoomParticipants.room_id = %s
    """, (room_id,))
    participants = cursor.fetchall()
    cursor.close()
    return jsonify({"participants": [p[0] for p in participants]}), 200

# Route zum Abrufen der Fragen eines Raumes
@app.route('/get_questions', methods=['POST'])
def get_questions():
    data = request.get_json()
    room_id = data['room_id']

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT difficulty, subject, quiz_type, number_of_questions FROM Rooms WHERE id = %s", (room_id,))
    room = cursor.fetchone()
    difficulty = room[0]
    subject = room[1]
    quiz_type = room[2]
    number_of_questions = room[3]

    if quiz_type == 'klassisch':
        cursor.execute("""
            SELECT id, text, correct_answer, wrong_answer1, wrong_answer2, difficulty, subject
            FROM Questions
            WHERE difficulty = %s AND subject = %s
            ORDER BY RAND()
            LIMIT %s
        """, (difficulty, subject, number_of_questions))
    else:  # zeitdruck
        cursor.execute("""
            SELECT id, text, correct_answer, wrong_answer1, wrong_answer2, difficulty, subject
            FROM Questions
            WHERE difficulty = %s AND subject = %s
            ORDER BY RAND()
        """, (difficulty, subject))

    questions = cursor.fetchall()
    cursor.close()

    return jsonify({"questions": questions}), 200

# Route zum Aktualisieren des Scores eines Benutzers
@app.route('/update_score', methods=['POST'])
def update_score():
    data = request.get_json()
    room_id = data['room_id']
    user_id = data['user_id']
    score = data['score']

    cursor = mysql.connection.cursor()
    cursor.execute("UPDATE RoomParticipants SET score = score + %s WHERE room_id = %s AND user_id = %s", (score, room_id, user_id))
    mysql.connection.commit()
    cursor.close()

    return jsonify({"message": "Punkte erfolgreich aktualisiert"}), 200

# Route zum Abrufen der Ergebnisse eines Raumes
@app.route('/get_results/<int:room_id>', methods=['GET'])
def get_results(room_id):
    cursor = mysql.connection.cursor()
    cursor.execute("""
        SELECT Users.username, RoomParticipants.score FROM Users
        JOIN RoomParticipants ON Users.id = RoomParticipants.user_id
        WHERE RoomParticipants.room_id = %s
        ORDER BY RoomParticipants.score DESC
    """, (room_id,))
    results = cursor.fetchall()
    cursor.close()

    print(results)  

    return jsonify({"results": results}), 200

# Route zum Löschen einer Frage
@app.route('/delete_question/<int:question_id>', methods=['DELETE'])
def delete_question(question_id):
    user_id = request.args.get('user_id')
    
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT role FROM Users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    
    if user and user[0] == 'admin':
        cursor.execute("DELETE FROM Questions WHERE id = %s", (question_id,))
        mysql.connection.commit()
        cursor.close()
        return jsonify({"message": "Frage erfolgreich gelöscht"}), 200
    else:
        cursor.close()
        return jsonify({"message": "Du hast nicht die Berechtigung die Frage zu löschen!"}), 403

# Route zum Abrufen der Fragen für den Katalog
@app.route('/get_questions_for_catalog', methods=['GET'])
def get_questions_for_catalog():
    user_id = request.args.get('user_id')
    
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT role FROM Users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    
    if user and user[0] == 'admin':
        cursor.execute("SELECT id, text, correct_answer, wrong_answer1, wrong_answer2, difficulty, subject FROM Questions")
        questions = cursor.fetchall()
        cursor.close()
        return jsonify({"questions": questions}), 200
    else:
        cursor.close()
        return jsonify({"message": "Du hast nicht die Berechtigung den Fragenkatalog einzusehen!"}), 403

 # Route zum Abrufen der Raumdaten   
@app.route('/get_room/<int:room_id>', methods=['GET'])
def get_room(room_id):
    cursor = mysql.connection.cursor()
    cursor.execute("""
        SELECT quiz_type, number_of_minutes, number_of_questions
        FROM Rooms
        WHERE id = %s
    """, (room_id,))
    room = cursor.fetchone()
    cursor.close()

    if room:
        return jsonify({
            "quiz_type": room[0],
            "number_of_minutes": room[1],
            "number_of_questions": room[2]
        }), 200
    else:
        return jsonify({"message": "Raum nicht gefunden"}), 404


# Flask-Anwendung ausführen
if __name__ == '__main__':
    app.run(debug=True)