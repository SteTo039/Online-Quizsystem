import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddQuestion.css';

function AddQuestion() {
    // Definieren der Zustände für die Eingabefelder
    const [questionText, setQuestionText] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [wrongAnswer1, setWrongAnswer1] = useState('');
    const [wrongAnswer2, setWrongAnswer2] = useState('');
    const [difficulty, setDifficulty] = useState('Leicht');
    const [subject, setSubject] = useState('Mathematik');
    const navigate = useNavigate(); // useNavigate Hook für die Navigation

    // Funktion zum Speichern der Frage
    const handleSave = async (e) => {
        e.preventDefault(); //Standard Submit Formular verhindern
        try {
            // Senden einer POST-Anfrage zum Hinzufügen einer neuen Frage
            await axios.post('http://localhost:5000/add_question', {
                questionText,
                correctAnswer,
                wrongAnswer1,
                wrongAnswer2,
                difficulty,
                subject: subject
            });
            navigate('/start');   // Navigation zur Startseite nach dem erfolgreichen Hinzufügen
        } catch (error) {
            console.error('Es gab einen Fehler beim Hinzufügen der Frage!', error); // Fehlerbehandlung
        }
    };

    // Funktion zum Abbrechen und Rückkehr zur Startseite
    const handleCancel = () => {
        navigate('/start');  
    };

    return (
        <div className="add-question-form">
            <h2>Frage hinzufügen</h2>
            <form onSubmit={handleSave}>
                <div>
                    <label>Fragetext:</label>
                    <input
                        type="text"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Richtige Antwort:</label>
                    <input
                        type="text"
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Falsche Antwort 1:</label>
                    <input
                        type="text"
                        value={wrongAnswer1}
                        onChange={(e) => setWrongAnswer1(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Falsche Antwort 2:</label>
                    <input
                        type="text"
                        value={wrongAnswer2}
                        onChange={(e) => setWrongAnswer2(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Schwierigkeitsgrad:</label>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        required
                    >
                        <option value="Leicht">Leicht</option>
                        <option value="Mittel">Mittel</option>
                        <option value="Schwer">Schwer</option>
                    </select>
                    
                </div>
                <div>
                    <label>Fach:</label>
                    <select 
                        value={subject} 
                        onChange={(e) => setSubject(e.target.value)}>
                            
                        <option value="Mathematik">Mathematik</option>
                        <option value="Informatik">Informatik</option>
                        <option value="Maschinenbau">Maschinenbau</option>
                        <option value="Wirtschaftswissenschaften">Wirtschaftswissenschaften</option>
                        <option value="Allgemeinwissen">Allgemeinwissen</option>
                    </select>

                </div>
                <div className="buttons">
                    <button type="submit">Speichern</button>
                    <button type="button" onClick={handleCancel}>Abbrechen</button>
                </div>
            </form>
        </div>
    );
}

export default AddQuestion;