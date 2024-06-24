CREATE DATABASE online_quizsystem;
USE online_quizsystem;

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);



CREATE TABLE Questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text TEXT NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    wrong_answer1 VARCHAR(255) NOT NULL,
    wrong_answer2 VARCHAR(255) NOT NULL,
    difficulty ENUM('Leicht', 'Mittel', 'Schwer') NOT NULL,
    created_by INT NOT NULL,
    subject ENUM('Mathematik', 'Informatik', 'Maschinenbau', 'Wirtschaftswissenschaften', 'Allgemeinwissen') NOT NULL,
    FOREIGN KEY (created_by) REFERENCES Users(id)
);




CREATE TABLE Rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_code VARCHAR(255) UNIQUE NOT NULL,
    host_user_id INT NOT NULL,
    FOREIGN KEY (host_user_id) REFERENCES Users(id)
);

CREATE TABLE RoomParticipants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES Rooms(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

ALTER TABLE Rooms ADD COLUMN number_of_questions INT NOT NULL;
ALTER TABLE Rooms ADD COLUMN difficulty ENUM('Leicht', 'Mittel', 'Schwer') NOT NULL;

ALTER TABLE RoomParticipants ADD COLUMN score INT DEFAULT 0;

ALTER TABLE Users
ADD COLUMN role ENUM('student', 'admin') NOT NULL DEFAULT 'student';

ALTER TABLE Rooms
ADD COLUMN number_of_minutes INT;

ALTER TABLE Rooms
ADD COLUMN quiz_type ENUM('klassisch', 'zeitdruck') NOT NULL DEFAULT 'klassisch';

INSERT INTO Users (username, password, role) VALUES ('otto.normalverbraucher', '654321', 'student');
INSERT INTO Users (username, password, role) VALUES ('max.mustermann', '123456', 'student');
INSERT INTO Users (username, password, role) VALUES ('alex.professor', 'Pass789', 'admin');

SELECT * FROM RoomParticipants;

ALTER TABLE Rooms
MODIFY COLUMN number_of_questions INT NULL;

ALTER TABLE Questions
ADD COLUMN subject ENUM('Mathematik', 'Geografie', 'Geschichte') NOT NULL;

ALTER TABLE Rooms
ADD COLUMN subject ENUM('Mathematik', 'Geografie', 'Geschichte') NOT NULL;

DROP TABLE Questions;