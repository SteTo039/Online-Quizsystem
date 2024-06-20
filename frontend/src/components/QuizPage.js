import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './QuizPage.css';

function QuizPage() {
    // Definieren der Zustände
    const { roomId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30); 
    const [totalTimeLeft, setTotalTimeLeft] = useState(null);
    const [quizType, setQuizType] = useState(null);
    const [answered, setAnswered] = useState(false);
    const [answerCorrect, setAnswerCorrect] = useState(false);
    const [shuffledAnswers, setShuffledAnswers] = useState([]);
    const navigate = useNavigate(); //useNavigate Hooks für die Navigation

    // Funktion zum Handhaben der nächsten Frage
    const handleNextQuestion = useCallback(async () => {
        if (answered) {
            try {
                // Senden einer POST-Anfrage zum Aktualisieren des Scores
                await axios.post('http://localhost:5000/update_score', {
                    room_id: roomId,
                    user_id: localStorage.getItem('user_id'),
                    score: answerCorrect ? (quizType === 'zeitdruck' ? totalTimeLeft : timeLeft) : 0
                });
            } catch (error) {
                console.error('Es gab einen Fehler beim Aktualisieren des Scores!', error);
            }
        }
        setAnswered(false);
        setAnswerCorrect(false);
        setTimeLeft(30);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // Erhöhen des Fragenindex
        } else {
            navigate(`/results/${roomId}`); // Navigation zur Ergebnisseite, wenn alle Fragen beantwortet sind
        }
    }, [answered, answerCorrect, currentQuestionIndex, navigate, questions.length, roomId, timeLeft, totalTimeLeft, quizType]);

    // Abrufen der Fragen beim Laden der Komponente
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // Senden einer POST-Anfrage zum Abrufen der Fragen
                const response = await axios.post('http://localhost:5000/get_questions', {
                    room_id: roomId
                });
                setQuestions(response.data.questions);
                setCurrentQuestionIndex(0);

                // Abrufen der Raumdaten
                const roomResponse = await axios.get(`http://localhost:5000/get_room/${roomId}`);
                const { quiz_type, number_of_minutes } = roomResponse.data;
                setQuizType(quiz_type);
                if (quiz_type === 'zeitdruck') {
                    setTotalTimeLeft(number_of_minutes * 60);
                }
            } catch (error) {
                console.error('Es gab einen Fehler beim Abrufen der Fragen!', error);
            }
        };
        fetchQuestions();
    }, [roomId]);

    // Mischen der Antworten nach jeder Frage
    useEffect(() => {
        if (questions.length > 0) {
            const currentQuestion = questions[currentQuestionIndex];
            const answers = [
                { text: currentQuestion[2], isCorrect: true },
                { text: currentQuestion[3], isCorrect: false },
                { text: currentQuestion[4], isCorrect: false }
            ];
            setShuffledAnswers(answers.sort(() => Math.random() - 0.5));
        }
    }, [currentQuestionIndex, questions]);

    // Verwalten der Zeit
    useEffect(() => {
        if (quizType === 'zeitdruck') {
            if (totalTimeLeft === 0) {
                navigate(`/results/${roomId}`);
                return;
            }

            const timer = setInterval(() => {
                setTotalTimeLeft((prevTotalTimeLeft) => prevTotalTimeLeft - 1); // Verringern der gesamten verbleibenden Zeit
            }, 1000);

            return () => clearInterval(timer);
        } else {
            if (timeLeft === 0) {
                handleNextQuestion();
                return;
            }

            const timer = setInterval(() => {
                setTimeLeft((prevTimeLeft) => prevTimeLeft - 1); // Verringern der Zeit für die aktuelle Frage
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [timeLeft, totalTimeLeft, handleNextQuestion, navigate, quizType, roomId]);

    // Funktion zum Handhaben der Antwort
    const handleAnswer = (isCorrect) => {
        setAnswered(true);
        setAnswerCorrect(isCorrect);
    };

    if (questions.length === 0) {
        return <div>Loading...</div>; // Ladehinweises, wenn die Fragen noch geladen werden
    }

    const currentQuestion = questions[currentQuestionIndex]; // Abrufen der aktuellen Frage

    return (
        <div className="quiz-page">
            <div className="question-counter">
                {currentQuestionIndex + 1} / {questions.length}
            </div>
            <h2>{currentQuestion[1]}</h2>
            <div className="answers">
                {shuffledAnswers.map((answer, index) => (
                    <button
                        key={index}
                        className={answered ? (answer.isCorrect ? 'correct' : 'incorrect') : ''}
                        onClick={() => handleAnswer(answer.isCorrect)}
                        disabled={answered}
                    >
                        {answer.text}
                    </button>
                ))}
            </div>
            {quizType === 'klassisch' ? (
                <p>Zeit: {timeLeft} Sekunden</p>
            ) : (
                <p>Gesamtzeit: {totalTimeLeft} Sekunden</p>
            )}
            <button onClick={handleNextQuestion}>Weiter</button>
        </div>
    );
}

export default QuizPage;