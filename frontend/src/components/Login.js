import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    // Definieren von Zuständen für Benutzername und Passwort
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // useNavigate Hook für die Navigation

    // Funktion zur Behandlung des Submits Formulars
    const handleSubmit = async (e) => {
        e.preventDefault(); // Standard-Formular verhindern
        try {
            // Senden einer POST-Anfrage an den Server mit Benutzernamen und Passwort
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password
            });
            if (response.status === 200) {
                const { user_id, username, role } = response.data; // Extrahieren der Benutzerdaten aus der Antwort
                // Speichern der Benutzerdaten im Local Storage
                localStorage.setItem('user_id', user_id);
                localStorage.setItem('username', username);
                localStorage.setItem('role', role);
                navigate('/start'); // Navigation zur Startseite
            }
        } catch (error) {
            // Anzeigen einer Fehlermeldung, wenn die Anfrage fehlschlägt
            alert(error.response.data.message);
        }
    };

    return (
        <div className="login-form">
            <h2>Login Form</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Benutzername:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Passwort:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Einloggen</button>
            </form>
        </div>
    );
}

export default Login;