import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { fetchUserQuizAchievements, fetchEnrolledCourseQuizzes } from '../../api';
import './StudentAchievements.css';

const StudentAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [skills, setSkills] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [quizAchievements, setQuizAchievements] = useState([]);
  const [enrolledQuizzes, setEnrolledQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('achievements');
  const [studentRank, setStudentRank] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Get student ID
        const userResponse = await axios.get('http://localhost:8000/api/current-user/', { headers });
        const studentId = userResponse.data.student_id;
        const batchId = userResponse.data.batch_id;
        
        if (!studentId) {
          setLoading(false);
          return;
        }
        
        // Fetch student achievements
        const achievementsResponse = await axios.get(
          `http://localhost:8000/api/student-achievements/?student_id=${studentId}`,
          { headers }
        );
        setAchievements(achievementsResponse.data);
        
        // Fetch student skills
        const skillsResponse = await axios.get(
          `http://localhost:8000/api/student-skills/?student_id=${studentId}`,
          { headers }
        );
        setSkills(skillsResponse.data);
        
        // Fetch leaderboard for student's batch
        const leaderboardResponse = await axios.get(
          `http://localhost:8000/api/leaderboard/?batch_id=${batchId}`,
          { headers }
        );
        setLeaderboard(leaderboardResponse.data);
        
        // Find student's rank in leaderboard
        const studentIndex = leaderboardResponse.data.findIndex(
          item => item.student_id === studentId
        );
        
        if (studentIndex !== -1) {
          setStudentRank(studentIndex + 1);
        }
        
        // Fetch quiz achievements
        try {
          const quizAchievementsResponse = await fetchUserQuizAchievements();
          setQuizAchievements(quizAchievementsResponse);
        } catch (quizError) {
          console.error('Error fetching quiz achievements:', quizError);
        }
        
        // Fetch enrolled course quizzes
        try {
          const enrolledQuizzesResponse = await fetchEnrolledCourseQuizzes();
          setEnrolledQuizzes(enrolledQuizzesResponse);
        } catch (quizError) {
          console.error('Error fetching enrolled quizzes:', quizError);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load achievements data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getSkillsByCategory = () => {
    const categories = {};
    
    skills.forEach(skill => {
      const category = skill.skill_details.category;
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(skill);
    });
    
    return categories;
  };

  if (loading) {
    return <div className="loading">Loading achievements...</div>;
  }

  const skillsByCategory = getSkillsByCategory();
  const currentStudent = leaderboard.find(student => student.student_id === parseInt(localStorage.getItem('student_id')));

  return (
    <div className="student-achievements-container">
      <h2>My Learning Journey</h2>
      
      <div className="tabs">
        <button 
          className={activeTab === 'achievements' ? 'active' : ''}
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
        <button 
          className={activeTab === 'skills' ? 'active' : ''}
          onClick={() => setActiveTab('skills')}
        >
          Skills Tree
        </button>
        <button 
          className={activeTab === 'quizzes' ? 'active' : ''}
          onClick={() => setActiveTab('quizzes')}
        >
          Quiz Achievements
        </button>
        <button 
          className={activeTab === 'leaderboard' ? 'active' : ''}
          onClick={() => setActiveTab('leaderboard')}
        >
          Leaderboard
        </button>
      </div>
      
      {activeTab === 'achievements' && (
        <div className="achievements-section">
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-value">{achievements.length + quizAchievements.length}</div>
              <div className="stat-label">Total Achievements</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{quizAchievements.length}</div>
              <div className="stat-label">Quiz Badges</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{skills.length}</div>
              <div className="stat-label">Skills</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {currentStudent?.total_points || 0}
              </div>
              <div className="stat-label">Total Points</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {studentRank ? `#${studentRank}` : 'N/A'}
              </div>
              <div className="stat-label">Rank</div>
            </div>
          </div>
          
          <h3>My Achievements</h3>
          
          {achievements.length === 0 && quizAchievements.length === 0 ? (
            <p>You haven't earned any achievements yet. Complete projects and quizzes to earn badges!</p>
          ) : (
            <div className="achievements-grid">
              {/* Project Achievements */}
              {achievements.map(achievement => (
                <div key={`project-${achievement.id}`} className="achievement-card">
                  <div className="achievement-icon">
                    <i className={achievement.achievement_details.icon}></i>
                  </div>
                  <div className="achievement-info">
                    <h4>{achievement.achievement_details.name}</h4>
                    <p>{achievement.achievement_details.description}</p>
                    <div className="achievement-meta">
                      <span className="points">
                        +{achievement.achievement_details.points} points
                      </span>
                      <span className="earned-date">
                        Earned: {new Date(achievement.earned_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Quiz Achievements */}
              {quizAchievements.map(achievement => (
                <div key={`quiz-${achievement.id}`} className="achievement-card quiz-achievement">
                  <div className="achievement-icon">
                    <i className="fas fa-trophy" style={{color: achievement.badge_type === 'gold' ? '#f1c40f' : '#95a5a6'}}></i>
                  </div>
                  <div className="achievement-info">
                    <h4>{achievement.quiz_title}</h4>
                    <p>{achievement.course_title} - {achievement.language}</p>
                    <div className="achievement-meta">
                      <span className="badge-type">
                        {achievement.badge_type.charAt(0).toUpperCase() + achievement.badge_type.slice(1)} Badge
                      </span>
                      <span className="quiz-score">
                        Score: {achievement.score}/{achievement.total_questions}
                      </span>
                      <span className="earned-date">
                        Earned: {new Date(achievement.earned_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'skills' && (
        <div className="skills-section">
          <h3>My Skills</h3>
          
          {Object.keys(skillsByCategory).length === 0 ? (
            <p>You haven't developed any skills yet. Complete projects to build your skill tree!</p>
          ) : (
            <div className="skills-tree">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <div key={category} className="skill-category">
                  <h4>{category}</h4>
                  <div className="skills-list">
                    {categorySkills.map(skill => (
                      <div key={skill.id} className="skill-item">
                        <div className="skill-header">
                          {skill.skill_details.icon && (
                            <i className={skill.skill_details.icon}></i>
                          )}
                          <span>{skill.skill_details.name}</span>
                        </div>
                        <div className="skill-level">
                          <div className="progress-bar">
                            <div 
                              className="progress" 
                              style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                            ></div>
                          </div>
                          <span className="proficiency-label">
                            {skill.proficiency_display}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'quizzes' && (
        <div className="quizzes-section">
          <h3>Quiz Progress</h3>
          
          {enrolledQuizzes.length === 0 ? (
            <p>No quizzes available for your enrolled courses.</p>
          ) : (
            <div className="quizzes-grid">
              {enrolledQuizzes.map(quiz => (
                <div key={quiz.id} className={`quiz-card ${quiz.completed ? 'completed' : 'pending'}`}>
                  <div className="quiz-header">
                    <h4>{quiz.title}</h4>
                    <span className={`quiz-status ${quiz.completed ? 'completed' : 'pending'}`}>
                      {quiz.completed ? 'Completed' : 'Available'}
                    </span>
                  </div>
                  <div className="quiz-details">
                    <p><strong>Course:</strong> {quiz.course_title}</p>
                    <p><strong>Language:</strong> {quiz.language}</p>
                    <p><strong>Questions:</strong> {quiz.total_questions}</p>
                    <p><strong>Time Limit:</strong> {quiz.time_limit} minutes</p>
                    <p><strong>Passing Score:</strong> {quiz.passing_score}/{quiz.total_questions}</p>
                  </div>
                  {quiz.completed && (
                    <div className="quiz-result">
                      <div className="score-display">
                        <span className="score">{quiz.score}/{quiz.total_questions}</span>
                        <span className="percentage">({quiz.percentage.toFixed(1)}%)</span>
                      </div>
                      {quiz.badge_earned && (
                        <div className="badge-earned">
                          <i className="fas fa-trophy" style={{color: '#f1c40f'}}></i>
                          <span>Gold Badge Earned!</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'leaderboard' && (
        <div className="leaderboard-section">
          <h3>Batch Leaderboard</h3>
          
          {leaderboard.length === 0 ? (
            <p>No leaderboard data available.</p>
          ) : (
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Student</th>
                  <th>Projects</th>
                  <th>Skills</th>
                  <th>Achievements</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((student, index) => (
                  <tr 
                    key={student.student_id}
                    className={student.student_id === parseInt(localStorage.getItem('student_id')) ? 'current-user' : ''}
                  >
                    <td>#{index + 1}</td>
                    <td>{student.username}</td>
                    <td>{student.projects_completed}</td>
                    <td>{student.skills_count}</td>
                    <td>{student.achievements_count}</td>
                    <td>{student.total_points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentAchievements;