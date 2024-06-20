import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QuestionCatalog.css';

function QuestionCatalog() {
    const [questions, setQuestions] = useState([]); // Zustand für die Fragenliste
    const [filterSubject, setFilterSubject] = useState('All'); // Zustand für den Filter nach Fach
    const userId = localStorage.getItem('user_id'); // Abrufen der Benutzer-ID aus dem Local Storage

    // useEffect Hook zum Abrufen der Fragen beim Laden der Komponente
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // Senden einer GET-Anfrage zum Abrufen der Fragen
                const response = await axios.get(`http://localhost:5000/get_questions_for_catalog?user_id=${userId}`);
                console.log(response.data.questions);  
                setQuestions(response.data.questions);
            } catch (error) {
                console.error('Es gab einen Fehler beim Abrufen der Fragen!', error); // Fehlerbehandlung
            }
        };
        fetchQuestions(); // Aufruf der Funktion zum Abrufen der Fragen
    }, [userId]);

    // Funktion zum Löschen einer Frage
    const handleDelete = async (questionId) => {
        try {
            // Senden einer DELETE-Anfrage zum Löschen der Frage
            await axios.delete(`http://localhost:5000/delete_question/${questionId}?user_id=${userId}`);
            // Aktualisieren des Fragenzustands, indem die gelöschte Frage herausgefiltert wird
            setQuestions(questions.filter(question => question[0] !== questionId));
        } catch (error) {
            console.error('Es gab einen Fehler beim Löschen der Frage!', error); // Fehlerbehandlung
        }
    };

    // Filtern der Fragen basierend auf dem ausgewählten Fach
    const filteredQuestions = filterSubject === 'All'
        ? questions
        : questions.filter(question => question[6] === filterSubject);

        return (
            <div className="question-catalog">
                <h2>Fragenkatalog</h2>
                <label>Filter nach Fach:</label>
                <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
                    <option value="All">Alle</option>
                    <option value="Mathematik">Mathematik</option>
                    <option value="Geografie">Geografie</option>
                    <option value="Geschichte">Geschichte</option>
                </select>
                <table>
                    <thead>
                        <tr>
                            <th>Frage</th>
                            <th>Richtige Antwort</th>
                            <th>Falsche Antwort 1</th>
                            <th>Falsche Antwort 2</th>
                            <th>Schwierigkeitsgrad</th>
                            <th>Fach</th>
                            <th>Aktion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredQuestions.map((question, index) => (
                            <tr key={index}>
                                <td>{question[1]}</td>
                                <td>{question[2]}</td>
                                <td>{question[3]}</td>
                                <td>{question[4]}</td>
                                <td>{question[5]}</td>
                                <td>{question[6]}</td>
                                <td>
                                    <button onClick={() => handleDelete(question[0])} className="delete-button">
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
}

export default QuestionCatalog;