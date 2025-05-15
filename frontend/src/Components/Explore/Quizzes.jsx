import React from 'react';
import './components.css';

const Quizzes = () => {
  return (
    <div className="quizzes-container">
      <h2>Take a Quiz</h2>
      <p>Test your knowledge and skills with our interactive quizzes.</p>
      
      <div className="quizzes-list">
        {quizzesList.map((quiz) => (
          <div className="quiz-card" key={quiz.id}>
            <div className="quiz-image">
              <img src={quiz.image} alt={quiz.title} />
            </div>
            <div className="quiz-details">
              <h3>{quiz.title}</h3>
              <p>{quiz.description}</p>
              <div className="quiz-meta">
                <span><strong>Questions:</strong> {quiz.questions}</span>
                <span><strong>Time:</strong> {quiz.time}</span>
                <span><strong>Difficulty:</strong> {quiz.difficulty}</span>
              </div>
              <button className="start-quiz-btn">Start Quiz</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sample quizzes data
const quizzesList = [
  {
    id: 1,
    title: "HTML & CSS Fundamentals",
    description: "Test your knowledge of HTML and CSS basics",
    image: "https://via.placeholder.com/300x200",
    questions: 20,
    time: "30 minutes",
    difficulty: "Beginner"
  },
  {
    id: 2,
    title: "JavaScript Essentials",
    description: "Challenge yourself with core JavaScript concepts",
    image: "https://via.placeholder.com/300x200",
    questions: 25,
    time: "45 minutes",
    difficulty: "Intermediate"
  },
  {
    id: 3,
    title: "React.js Mastery",
    description: "Advanced quiz on React components, hooks, and state management",
    image: "https://via.placeholder.com/300x200",
    questions: 30,
    time: "60 minutes",
    difficulty: "Advanced"
  },
  {
    id: 4,
    title: "Database Concepts",
    description: "Test your knowledge of SQL and NoSQL databases",
    image: "https://via.placeholder.com/300x200",
    questions: 25,
    time: "40 minutes",
    difficulty: "Intermediate"
  }
];

export default Quizzes;