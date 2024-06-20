// Importieren der notwendigen Bibliotheken und Komponenten
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importieren von Router, Route und Routes für die Navigation
import Login from './components/Login'; // Importieren der Login-Komponente
import StartPage from './components/StartPage'; // Importieren der StartPage-Komponente
import AddQuestion from './components/AddQuestion'; // Importieren der AddQuestion-Komponente
import RoomPage from './components/RoomPage'; // Importieren der RoomPage-Komponente
import QuizPage from './components/QuizPage'; // Importieren der QuizPage-Komponente
import ResultsPage from './components/ResultsPage'; // Importieren der ResultsPage-Komponente
import QuestionCatalog from './components/QuestionCatalog'; // Importieren der QuestionCatalog-Komponente
import './App.css'; // Importieren der CSS-Datei für das Styling


// Definition der Hauptkomponente App
function App() {
    return (
        // Einrichten des Routers für die Handhabung verschiedener Routen
        <Router>
            <div className="App">
                <Routes>
                    {/* Definition der Routen für verschiedene Komponenten */}
                    <Route path="/" element={<Login />} />
                    <Route path="/start" element={<StartPage />} />
                    <Route path="/add_question" element={<AddQuestion />} />
                    <Route path="/room/:roomCode/:roomId" element={<RoomPage />} />
                    <Route path="/quiz/:roomCode/:roomId" element={<QuizPage />} />
                    <Route path="/results/:roomId" element={<ResultsPage />} />
                    <Route path="/question_catalog" element={<QuestionCatalog />} />
                </Routes>
            </div>
        </Router>
    );
}

// Exportieren der App-Komponente als Standard-Export
export default App;
