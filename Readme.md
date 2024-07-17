# Online-Quizsystem

Dies ist ein Online-Quizsystem, das mit Flask und MySQL entwickelt wurde. Das System ermöglicht es Benutzern, Quizfragen hinzuzufügen, Räume zu erstellen und an Quizräumen teilzunehmen. Es bietet auch Funktionen zum Abrufen von Raumteilnehmern, Fragen und Ergebnissen.

## Funktionen

- Benutzer-Authentifizierung (Login)
- Hinzufügen von Quizfragen
- Erstellen von Quizräumen
- Beitreten zu bestehenden Quizräumen
- Abrufen von Raumteilnehmern
- Abrufen von Fragen eines Raumes
- Aktualisieren des Benutzer-Scores
- Abrufen der Ergebnisse eines Raumes
- Löschen von Quizfragen
- Abrufen der Fragen für den Fragenkatalog

## Voraussetzungen

- Python 3.x
- Flask
- Flask-CORS
- Flask-MySQLdb
- MySQL

## Installation

1. Klonen Sie das Repository:
    ```sh
    git clone https://github.com/SteTo039/Online-Quizsystem.git
    cd Online-Quizsystem
    ```

2. Erstellen und aktivieren Sie eine virtuelle Umgebung:
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Installieren Sie die Abhängigkeiten:
    ```sh
    pip install -r requirements.txt
    ```

4. Konfigurieren Sie die MySQL-Datenbank:
    - Erstellen Sie eine neue Datenbank `online_quizsystem`.
    - Aktualisieren Sie die Datenbankkonfigurationsparameter in der `app.config` in der Datei `app.py`:
        ```python
        app.config['MYSQL_HOST'] = 'localhost'
        app.config['MYSQL_USER'] = 'root'
        app.config['MYSQL_PASSWORD'] = 'IUBHprojquiz2024'
        app.config['MYSQL_DB'] = 'online_quizsystem'
        app.config['MYSQL_PORT'] = 3306
        ```

5. Starten Sie die Flask-Anwendung:
    ```sh
    flask run
    ```

## API-Endpunkte

### POST /login

Authentifiziert einen Benutzer mit Benutzernamen und Passwort.

**Parameter:**
- `username` (str): Der Benutzername des Benutzers.
- `password` (str): Das Passwort des Benutzers.

**Antworten:**
- `200 OK`: Erfolgreiche Authentifizierung. Antwort enthält die Benutzer-ID, den Benutzernamen und die Rolle.
- `401 Unauthorized`: Fehlgeschlagene Authentifizierung. Antwort enthält eine Fehlermeldung.

### POST /add_question

Fügt eine neue Quizfrage hinzu.

**Parameter:**
- `questionText` (str): Der Text der Frage.
- `correctAnswer` (str): Die richtige Antwort.
- `wrongAnswer1` (str): Falsche Antwort 1.
- `wrongAnswer2` (str): Falsche Antwort 2.
- `difficulty` (str): Der Schwierigkeitsgrad der Frage.
- `subject` (str): Das Fachgebiet der Frage.

**Antworten:**
- `200 OK`: Erfolgreiches Hinzufügen der Frage. Antwort enthält eine Erfolgsmeldung.

### POST /create_room

Erstellt einen neuen Quizraum.

**Parameter:**
- `host_user_id` (int): Die Benutzer-ID des Hosts.
- `number_of_questions` (int, optional): Die Anzahl der Fragen im Quiz.
- `number_of_minutes` (int, optional): Die Anzahl der Minuten für das Quiz.
- `difficulty` (str): Der Schwierigkeitsgrad der Fragen.
- `subject` (str): Das Fachgebiet der Fragen.
- `quiz_type` (str): Der Typ des Quiz (z.B. "klassisch" oder "zeitdruck").

**Antworten:**
- `200 OK`: Erfolgreiches Erstellen des Raumes. Antwort enthält den Raumcode und die Raum-ID.

### POST /join_room

Tritt einem bestehenden Quizraum bei.

**Parameter:**
- `room_code` (str): Der Code des Raumes.
- `user_id` (int): Die Benutzer-ID des Teilnehmers.

**Antworten:**
- `200 OK`: Erfolgreicher Beitritt zum Raum. Antwort enthält die Raum-ID.
- `404 Not Found`: Raum nicht gefunden. Antwort enthält eine Fehlermeldung.

### GET /get_room_participants/<int:room_id>

Ruft die Teilnehmer eines Raumes ab.

**Antworten:**
- `200 OK`: Erfolgreiches Abrufen der Teilnehmer. Antwort enthält eine Liste der Benutzernamen.

### POST /get_questions

Ruft die Fragen eines Raumes ab.

**Parameter:**
- `room_id` (int): Die ID des Raumes.

**Antworten:**
- `200 OK`: Erfolgreiches Abrufen der Fragen. Antwort enthält eine Liste der Fragen.

### POST /update_score

Aktualisiert den Score eines Benutzers.

**Parameter:**
- `room_id` (int): Die ID des Raumes.
- `user_id` (int): Die Benutzer-ID des Teilnehmers.
- `score` (int): Der zu aktualisierende Score.

**Antworten:**
- `200 OK`: Erfolgreiches Aktualisieren des Scores. Antwort enthält eine Erfolgsmeldung.

### GET /get_results/<int:room_id>

Ruft die Ergebnisse eines Raumes ab.

**Antworten:**
- `200 OK`: Erfolgreiches Abrufen der Ergebnisse. Antwort enthält eine Liste der Benutzer und deren Scores.

### DELETE /delete_question/<int:question_id>

Löscht eine Quizfrage.

**Parameter:**
- `user_id` (int, Query Parameter): Die Benutzer-ID des Admins.

**Antworten:**
- `200 OK`: Erfolgreiches Löschen der Frage. Antwort enthält eine Erfolgsmeldung.
- `403 Forbidden`: Benutzer hat keine Berechtigung. Antwort enthält eine Fehlermeldung.

### GET /get_questions_for_catalog

Ruft die Fragen für den Fragenkatalog ab.

**Parameter:**
- `user_id` (int, Query Parameter): Die Benutzer-ID des Admins.

**Antworten:**
- `200 OK`: Erfolgreiches Abrufen der Fragen. Antwort enthält eine Liste der Fragen.
- `403 Forbidden`: Benutzer hat keine Berechtigung. Antwort enthält eine Fehlermeldung.

### GET /get_room/<int:room_id>

Ruft die Daten eines Raumes ab.

**Antworten:**
- `200 OK`: Erfolgreiches Abrufen der Raumdaten. Antwort enthält den Quiztyp, die Anzahl der Minuten und die Anzahl der Fragen.
- `404 Not Found`: Raum nicht gefunden. Antwort enthält eine Fehlermeldung.

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Weitere Informationen finden Sie in der Datei [LICENSE](LICENSE).

## Autoren

- **SteTo039** - [GitHub Profile](https://github.com/SteTo039)
