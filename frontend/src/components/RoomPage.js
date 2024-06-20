import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './RoomPage.css';

function RoomPage() {
    const { roomCode, roomId } = useParams(); // useParams, um die Raumdaten aus der URL zu extrahieren
    const location = useLocation(); // Verwenden von useLocation, um auf den aktuellen Standort und Zustandsdaten zuzugreifen
    const { username } = location.state || { username: '' }; // Extrahieren des Benutzernamens aus dem Zustand
    const [participants, setParticipants] = useState([username]); // Zustand für die Teilnehmerliste
    const navigate = useNavigate(); //useNavigate Hook für die Navigation

    // useEffect Hook zum Abrufen der Teilnehmer beim Laden der Komponente
    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                // Senden einer GET-Anfrage zum Abrufen der Teilnehmer des Raumes
                const response = await axios.get(`http://localhost:5000/get_room_participants/${roomId}`);
                setParticipants((prevParticipants) => [
                    ...prevParticipants,
                    ...response.data.participants.filter((participant) => participant !== username)
                ]); // Aktualisieren der Teilnehmerliste
            } catch (error) {
                console.error('Es gab einen Fehler beim Abrufen der Teilnehmer!', error); // Fehlerbehandlung
            }
        };
        fetchParticipants(); // Aufruf der Funktion zum Abrufen der Teilnehmer
    }, [roomId, username]);

    // Funktion zum Abbrechen und zur Rückkehr zur Startseite
    const handleCancel = () => {
        navigate('/start');
    };

    // Funktion zum Starten des Quiz
    const handleStart = () => {
        navigate(`/quiz/${roomCode}/${roomId}`);
    };

    return (
        <div className="room-page">
            <h2>Raumcode: {roomCode}</h2>
            <p>Warten auf Teilnehmer...</p>
            <ul>
                {participants.map((participant, index) => (
                    <li key={index}>{participant}</li>
                ))}
            </ul>
            <div className="buttons">
                <button onClick={handleStart}>Starten</button>
                <button onClick={handleCancel}>Abbrechen</button>
            </div>
        </div>
    );
}

export default RoomPage;