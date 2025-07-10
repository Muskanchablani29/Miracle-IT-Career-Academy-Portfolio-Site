import React, { useState, useEffect } from 'react';
import './components.css';
import './Quiz.css';
import { fetchCoursesWithQuizzes, fetchCourseQuizzes, fetchQuizByCourseLanguage, startQuiz, submitQuiz } from '../../api';
import { FaPlay, FaClock, FaQuestionCircle, FaTrophy, FaArrowLeft, FaGraduationCap, FaStar, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { HiSparkles, HiLightningBolt, HiAcademicCap } from 'react-icons/hi';

const Quizzes = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await fetchCoursesWithQuizzes();
      setCourses(data);
    } catch (err) {
      setError('Failed to load courses. Please try again later.');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSelectedLanguage(null);
    setCurrentQuiz(null);
  };

  const handleLanguageSelect = async (language) => {
    try {
      setLoading(true);
      const quiz = await fetchQuizByCourseLanguage(selectedCourse.id, language);
      setSelectedLanguage(language);
      setCurrentQuiz(quiz);
    } catch (err) {
      setError('Failed to load quiz. Please try again.');
      console.error('Error fetching quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await startQuiz(currentQuiz.id);
      
      if (!response.questions || response.questions.length === 0) {
        setError('No questions available for this quiz.');
        return;
      }
      
      setAttemptId(response.attempt_id);
      setQuizQuestions(response.questions);
      setTimeLeft(currentQuiz.time_limit * 60);
      setQuizStarted(true);
      setStartTime(Date.now());
      setCurrentQuestionIndex(0);
      setAnswers({});
    } catch (err) {
      console.error('Error starting quiz:', err);
      setError('Failed to start quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      setLoading(true);
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const answersArray = Object.entries(answers).map(([questionId, optionId]) => ({
        question_id: parseInt(questionId),
        selected_option_id: optionId
      }));
      
      const result = await submitQuiz(attemptId, answersArray, timeTaken);
      setQuizResult(result);
      setQuizCompleted(true);
      setQuizStarted(false);
    } catch (err) {
      setError('Failed to submit quiz. Please try again.');
      console.error('Error submitting quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setSelectedCourse(null);
    setSelectedLanguage(null);
    setCurrentQuiz(null);
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeLeft(0);
    setQuizStarted(false);
    setQuizCompleted(false);
    setQuizResult(null);
    setAttemptId(null);
    setStartTime(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your quiz experience...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quizzes-container">
        <div className="quizzes-header">
          <h2>🎯 Knowledge Challenge</h2>
          <p>Master your skills with our comprehensive quiz system</p>
        </div>
        <div className="error-message">
          <FaTimesCircle style={{fontSize: '3rem', marginBottom: '1rem'}} />
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button onClick={() => { setError(null); loadCourses(); }}>
            <FaArrowLeft /> Try Again
          </button>
        </div>
      </div>
    );
  }

  // Quiz completed view
  if (quizCompleted && quizResult) {
    return (
      <div className="quiz-result-container">
        <div className="quiz-result-card">
          <div className="result-header">
            {quizResult.badge_earned ? (
              <HiSparkles className="trophy-icon gold" />
            ) : (
              <FaStar className="trophy-icon silver" />
            )}
            <h2>{quizResult.passed ? '🎉 Outstanding Performance!' : '💪 Great Effort!'}</h2>
          </div>
          <div className="result-details">
            <div className="score-display">
              <span className="score">{quizResult.score}</span>
              <span className="total">/{quizResult.total_questions}</span>
            </div>
            <div className="percentage">{quizResult.percentage.toFixed(1)}%</div>
            {quizResult.badge_earned && (
              <div className="badge-earned">
                <HiAcademicCap className="badge-icon" />
                <span>🏆 Gold Badge Earned!</span>
              </div>
            )}
            {!quizResult.badge_earned && (
              <div style={{color: '#7f8c8d', marginTop: '1rem', fontSize: '1.1rem'}}>
                Need {currentQuiz?.passing_score || 16}+ correct answers for Gold Badge
              </div>
            )}
          </div>
          <div className="result-actions">
            <button onClick={resetQuiz} className="back-btn">
              <FaArrowLeft /> Explore More Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz in progress view
  if (quizStarted && quizQuestions.length > 0) {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

    return (
      <div className="quiz-taking-container">
        <div className="quiz-header">
          <div className="quiz-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="progress-text">
              Question {currentQuestionIndex + 1} of {quizQuestions.length}
            </span>
          </div>
          <div className="quiz-timer">
            <FaClock /> {formatTime(timeLeft)}
          </div>
        </div>

        <div className="question-container">
          <h3 className="question-text">{currentQuestion.question_text}</h3>
          <div className="options-container">
            {currentQuestion.options.map((option) => (
              <div
                key={option.id}
                className={`option ${
                  answers[currentQuestion.id] === option.id ? 'selected' : ''
                }`}
                onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + option.order - 1)}
                </span>
                <span className="option-text">{option.option_text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="quiz-navigation">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className="nav-btn prev-btn"
          >
            Previous
          </button>
          
          {currentQuestionIndex === quizQuestions.length - 1 ? (
            <button onClick={handleSubmitQuiz} className="submit-btn">
              Submit Quiz
            </button>
          ) : (
            <button onClick={handleNextQuestion} className="nav-btn next-btn">
              Next
            </button>
          )}
        </div>
      </div>
    );
  }

  // Course and language selection view
  return (
    <div className="quizzes-container">
      <div className="quizzes-header">
        <h2>🎯 Knowledge Challenge</h2>
        <p>Master your skills with our comprehensive quiz system</p>
      </div>

      {!selectedCourse ? (
        <div className="courses-grid">
          <h3>🚀 Choose Your Learning Path</h3>
          {courses.length > 0 ? (
            <div className="course-cards">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="course-card"
                  onClick={() => handleCourseSelect(course)}
                >
                  <div className="course-image">
                    <img
                      src={course.image || 'https://via.placeholder.com/300x200?text=Course'}
                      alt={course.title || 'Course'}
                    />
                  </div>
                  <div className="course-details">
                    <h4>{course.title || 'Untitled Course'}</h4>
                    <div className="course-meta">
                      <span><FaQuestionCircle /> {(course.languages?.length || 0)} Quiz{(course.languages?.length || 0) !== 1 ? 'zes' : ''}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No courses with quizzes available at the moment.</p>
          )}
        </div>
      ) : !selectedLanguage ? (
        <div className="languages-selection">
          <div className="selection-header">
            <button onClick={() => setSelectedCourse(null)} className="back-btn">
              <FaArrowLeft /> Back to Courses
            </button>
            <h3>🎨 Pick Your Specialty in {selectedCourse.title}</h3>
          </div>
          <div className="languages-grid">
            {(selectedCourse.languages || []).map((language) => (
              <div
                key={language}
                className="language-card"
                onClick={() => handleLanguageSelect(language)}
              >
                <h4>{language}</h4>
                <div className="quiz-info">
                  <span><FaQuestionCircle /> 20 Questions</span>
                  <span><FaClock /> 30 Minutes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : currentQuiz ? (
        <div className="quiz-start">
          <div className="selection-header">
            <button onClick={() => setSelectedLanguage(null)} className="back-btn">
              <FaArrowLeft /> Back to Languages
            </button>
          </div>
          <div className="quiz-info-card">
            <h3>🎪 {currentQuiz.title}</h3>
            <p>🎯 {currentQuiz.description}</p>
            <div className="quiz-details">
              <div className="detail-item">
                <FaQuestionCircle />
                <span>📝 {currentQuiz.total_questions} Questions</span>
              </div>
              <div className="detail-item">
                <FaClock />
                <span>⏰ {currentQuiz.time_limit} Minutes</span>
              </div>
              <div className="detail-item">
                <HiAcademicCap />
                <span>🏆 Pass: {currentQuiz.passing_score}/{currentQuiz.total_questions}</span>
              </div>
            </div>
            <button onClick={handleStartQuiz} className="start-quiz-btn">
              <HiLightningBolt /> Begin Challenge
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Quizzes;