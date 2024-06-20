import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ResultsPage.css';

function ResultsPage() {
    
    const { roomId } = useParams(); // useParams, um die Raum-ID aus der URL zu extrahieren
    const [results, setResults] = useState([]); // Zustand für die Ergebnisliste
    const navigate = useNavigate();

    // Abrufen der Ergebnisse beim Laden der Komponente
    useEffect(() => {
        const fetchResults = async () => {
            try {
                // Senden einer GET-Anfrage zum Abrufen der Ergebnisse
                const response = await axios.get(`http://localhost:5000/get_results/${roomId}`);
                console.log(response.data.results);  
                setResults(response.data.results); // Setzen der Ergebnisse in den Zustand
            } catch (error) {
                console.error('Es gab einen Fehler beim Abrufen der Ergebnisse!', error); // Fehlerbehandlung
            }
        };
        fetchResults(); // Aufruf der Funktion zum Abrufen der Ergebnisse
    }, [roomId]);

    // Funktion zum Handhaben des Beenden-Buttons
    const handleFinish = () => {
        navigate('/start'); // Navigation zur Startseite
    };

    return (
        <div className="results-page">
            <h2>Ergebnisse</h2>
            <table>
                <thead>
                    <tr>
                        <th>Benutzername</th>
                        <th>Punkte</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((result, index) => (
                        <tr key={index}>
                            <td>{result[0]}</td>
                            <td>{result[1]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleFinish}>Beenden</button>
        </div>
    );
}

export default ResultsPage;