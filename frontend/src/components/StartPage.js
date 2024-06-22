import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StartPage.css';

function StartPage() {
    const navigate = useNavigate(); // useNavigate Hook für die Navigation
    const userId = localStorage.getItem('user_id'); // Abrufen der Benutzer-ID aus dem Local Storage
    const username = localStorage.getItem('username'); // Abrufen des Benutzernamens aus dem Local Storage
    const role = localStorage.getItem('role');  // Abrufen der Rolle des Benutzers aus dem Local Storage
    const [roomCode, setRoomCode] = useState(''); // Zustand für den Raumcode
    const [numberOfQuestions, setNumberOfQuestions] = useState(''); // Zustand für die Anzahl der Fragen
    const [numberOfMinutes, setNumberOfMinutes] = useState(''); // Zustand für die Anzahl der Minuten
    const [difficulty, setDifficulty] = useState('Leicht'); // Zustand für den Schwierigkeitsgrad
    const [subject, setSubject] = useState('Mathematik'); // Zustand für das Fach
    const [quizType, setQuizType] = useState('klassisch'); // Zustand für den Quiztyp

    // Funktion zum Erstellen eines Raumes
    const handleCreateRoom = async () => {
        try {
            // Senden einer POST-Anfrage zum Erstellen eines Raumes
            const response = await axios.post('http://localhost:5000/create_room', {
                host_user_id: userId,
                number_of_questions: quizType === 'klassisch' ? numberOfQuestions : null,
                number_of_minutes: quizType === 'zeitdruck' ? numberOfMinutes : null,
                difficulty: difficulty,
                subject: subject,
                quiz_type: quizType
            });
            const { room_code, room_id } = response.data; // Extrahieren des Raumcodes und der Raum-ID aus der Antwort
            navigate(`/room/${room_code}/${room_id}`, { state: { username } }); // Navigation zur RoomPage
        } catch (error) {
            console.error('Es gab ein Fehler bei der Erstellung eines Raumes!', error); // Fehlerbehandlung
        }
    };

    // Funktion zum Navigieren zur AddQuestion-Seite
    const handleAddQuestion = () => {
        navigate('/add_question');
    };

    // Funktion zum Beitreten eines Raumes
    const handleJoinRoom = async () => {
        try {
            // Senden einer POST-Anfrage zum Beitreten eines Raumes
            const response = await axios.post('http://localhost:5000/join_room', {
                room_code: roomCode,
                user_id: userId
            });
            if (response.status === 200) {
                const { room_id } = response.data; // Extrahieren der Raum-ID aus der Antwort
                navigate(`/room/${roomCode}/${room_id}`, { state: { username } }); // Navigation zur RoomPage
            } else {
                alert(response.data.message); // Anzeige einer Fehlermeldung wenn Beitritt fehlschlägt
            }
        } catch (error) {
            console.error('Es gab einen Fehler beim Betreten eines Raumes!', error); // Fehlerbehandlung
        }
    };

    // Funktion zum Anzeigen des Fragenkatalogs, wenn der Benutzer eine Adminirolle hat
    const handleViewQuestionCatalog = () => {
        if (role === 'admin') {
            navigate('/question_catalog');
        } else {
            alert('Sie haben keine Berechtigung, den Fragenkatalog zu sehen!'); // Anzeige einer Fehlermeldung bei fehlender Berechtigung
        }
    };

    return (
        <div className="start-page">
            <div className="room-section">
                <div className="room-code">
                    <label>Raumcode:</label>
                    <input
                        type="text"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                    />
                    <button onClick={handleJoinRoom}>Beitreten</button>
                </div>
                <div className="quiz-type">
                    <div className="group">
                        <input
                            type="radio"
                            id="klassisch"
                            name="quizType"
                            value="klassisch"
                            checked={quizType === 'klassisch'}
                            onChange={() => setQuizType('klassisch')}
                        />
                        <label htmlFor="klassisch">Klassisch</label>
                        <label>Anzahl der Fragen:</label>
                        <input
                            type="text"
                            value={numberOfQuestions}
                            onChange={(e) => setNumberOfQuestions(e.target.value)}
                            disabled={quizType !== 'klassisch'}
                        />
                    </div>
                    <div className="group">
                        <input
                            type="radio"
                            id="zeitdruck"
                            name="quizType"
                            value="zeitdruck"
                            checked={quizType === 'zeitdruck'}
                            onChange={() => setQuizType('zeitdruck')}
                        />
                        <label htmlFor="zeitdruck">Zeitdruck</label>
                        <label>Anzahl an Minuten:</label>
                        <input
                            type="text"
                            value={numberOfMinutes}
                            onChange={(e) => setNumberOfMinutes(e.target.value)}
                            disabled={quizType !== 'zeitdruck'}
                        />
                    </div>
                </div>
                <div className="difficulty-level">
                    <button onClick={() => setDifficulty('Leicht')}>Leicht</button>
                    <button onClick={() => setDifficulty('Mittel')}>Mittel</button>
                    <button onClick={() => setDifficulty('Schwer')}>Schwer</button>
                </div>
                <div className="subject">
                    <label>Fach:</label>
                    <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                        <option value="Mathematik">Mathematik</option>
                        <option value="Informatik">Informatik</option>
                        <option value="Maschinenbau">Maschinenbau</option>
                        <option value="Wirtschaftswissenschaften">Wirtschaftswissenschaften</option>
                        <option value="Allgemeinwissen">Allgemeinwissen</option>
                    </select>
                </div>
                <div className="create-room-container">
                    <button className="create-room" onClick={handleCreateRoom}>Raum Erstellen</button>
                </div>                
                <div className="questions-container">
                    <button /*className="view-catalog"*/ onClick={handleViewQuestionCatalog}>Fragenkatalog</button>
                    <button /*className='add-question'*/ onClick={handleAddQuestion}>Fragen hinzufügen</button>
                </div>
                
            </div>
        </div>
    );
}

export default StartPage;