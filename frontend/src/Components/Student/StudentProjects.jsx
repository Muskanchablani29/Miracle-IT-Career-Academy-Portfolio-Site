import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './StudentProjects.css';

const StudentProjects = () => {
  const [projects, setProjects] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    repository_url: '',
    live_url: '',
    notes: ''
  });
  const [filters, setFilters] = useState({
    technology: '',
    status: ''
  });
  const [technologies, setTechnologies] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Get student ID and batch
        const userResponse = await axios.get('http://localhost:8000/api/current-user/', { headers });
        const studentId = userResponse.data.student_id;
        const batchId = userResponse.data.batch_id;
        
        if (!batchId) {
          setLoading(false);
          return;
        }
        
        // Fetch projects for student's batch
        const projectsResponse = await axios.get(`http://localhost:8000/api/projects/?batch_id=${batchId}`, { headers });
        setProjects(projectsResponse.data);
        
        // Fetch technologies
        const techResponse = await axios.get('http://localhost:8000/api/projects/technologies/', { headers });
        setTechnologies(techResponse.data);
        
        // Fetch student's submissions
        const submissionsResponse = await axios.get(`http://localhost:8000/api/project-submissions/?student_id=${studentId}`, { headers });
        
        // Create a map of project_id to submission
        const submissionsMap = {};
        submissionsResponse.data.forEach(submission => {
          submissionsMap[submission.project] = submission;
        });
        
        setSubmissions(submissionsMap);
        
        // Fetch student achievements
        const achievementsResponse = await axios.get(`http://localhost:8000/api/student-achievements/?student_id=${studentId}`, { headers });
        setAchievements(achievementsResponse.data);
        
        // Fetch leaderboard data
        const leaderboardResponse = await axios.get(`http://localhost:8000/api/project-leaderboard/?batch_id=${batchId}`, { headers });
        setLeaderboard(leaderboardResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const getFilteredProjects = () => {
    return projects.filter(project => {
      // Filter by technology
      if (filters.technology && !project.technologies.includes(filters.technology)) {
        return false;
      }
      
      // Filter by submission status
      if (filters.status) {
        const submission = submissions[project.id];
        
        if (filters.status === 'submitted' && !submission) {
          return false;
        }
        
        if (filters.status === 'not-submitted' && submission) {
          return false;
        }
        
        if (filters.status === 'approved' && (!submission || submission.status !== 'approved')) {
          return false;
        }
        
        if (filters.status === 'rejected' && (!submission || submission.status !== 'rejected')) {
          return false;
        }
      }
      
      return true;
    });
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    
    // If there's an existing submission, pre-fill the form
    const submission = submissions[project.id];
    if (submission) {
      setFormData({
        repository_url: submission.repository_url || '',
        live_url: submission.live_url || '',
        notes: submission.notes || ''
      });
    } else {
      // Reset form for new submission
      setFormData({
        repository_url: '',
        live_url: '',
        notes: ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProject) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('access');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      // Get student ID
      const userResponse = await axios.get('http://localhost:8000/api/current-user/', { headers });
      const studentId = userResponse.data.student_id;
      
      const submission = submissions[selectedProject.id];
      
      if (submission) {
        // Update existing submission
        await axios.patch(
          `http://localhost:8000/api/project-submissions/${submission.id}/`,
          {
            ...formData,
            status: 'submitted' // Reset status to submitted on update
          },
          { headers }
        );
        
        toast.success('Project submission updated successfully');
      } else {
        // Create new submission
        await axios.post(
          'http://localhost:8000/api/project-submissions/',
          {
            ...formData,
            project: selectedProject.id,
            student: studentId
          },
          { headers }
        );
        
        toast.success('Project submitted successfully');
      }
      
      // Refresh submissions
      const submissionsResponse = await axios.get(
        `http://localhost:8000/api/project-submissions/?student_id=${studentId}`,
        { headers }
      );
      
      // Update submissions map
      const submissionsMap = {};
      submissionsResponse.data.forEach(submission => {
        submissionsMap[submission.project] = submission;
      });
      
      setSubmissions(submissionsMap);
      
      // Refresh achievements
      const achievementsResponse = await axios.get(`http://localhost:8000/api/student-achievements/?student_id=${studentId}`, { headers });
      setAchievements(achievementsResponse.data);
      
      // Refresh leaderboard
      const batchId = userResponse.data.batch_id;
      const leaderboardResponse = await axios.get(`http://localhost:8000/api/project-leaderboard/?batch_id=${batchId}`, { headers });
      setLeaderboard(leaderboardResponse.data);
      
      setSelectedProject(null);
    } catch (error) {
      console.error('Error submitting project:', error);
      toast.error('Failed to submit project');
    } finally {
      setLoading(false);
    }
  };

  const getSubmissionStatus = (projectId) => {
    const submission = submissions[projectId];
    if (!submission) return 'Not Submitted';
    return submission.status.charAt(0).toUpperCase() + submission.status.slice(1);
  };

  const getStatusClass = (projectId) => {
    const submission = submissions[projectId];
    if (!submission) return 'not-submitted';
    return submission.status;
  };

  const getProjectIcon = (technologies) => {
    if (technologies.includes('JavaScript') || technologies.includes('React')) return 'ri-code-s-slash-line';
    if (technologies.includes('SQL') || technologies.includes('Database')) return 'ri-database-2-line';
    if (technologies.includes('Network') || technologies.includes('Security')) return 'ri-server-line';
    if (technologies.includes('HTML') || technologies.includes('CSS')) return 'ri-layout-4-line';
    if (technologies.includes('Cloud') || technologies.includes('AWS')) return 'ri-cloud-line';
    return 'ri-file-code-line';
  };

  const getProjectIconClass = (technologies) => {
    if (technologies.includes('JavaScript') || technologies.includes('React')) return 'programming';
    if (technologies.includes('SQL') || technologies.includes('Database')) return 'database';
    if (technologies.includes('Network') || technologies.includes('Security')) return 'networking';
    if (technologies.includes('HTML') || technologies.includes('CSS')) return 'webdev';
    if (technologies.includes('Cloud') || technologies.includes('AWS')) return 'cloud';
    return 'programming';
  };

  if (loading && projects.length === 0) {
    return (
      <div className="student-projects-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  const filteredProjects = getFilteredProjects();
  const completedProjects = Object.values(submissions).filter(sub => sub.status === 'approved').length;
  const totalProjects = projects.length;
  const submittedProjects = Object.keys(submissions).length;
  const pendingProjects = totalProjects - submittedProjects;
  const overdueProjects = Object.values(submissions).filter(sub => {
    const project = projects.find(p => p.id === sub.project);
    return project && project.deadline && new Date(project.deadline) < new Date() && sub.status !== 'approved';
  }).length;

  return (
    <div className="student-projects-container">
      <div className="projects-header">
        <h1 className="page-title">Your Projects</h1>
        
        <div className="projects-stats">
          <div className="stat-card glass-effect custom-shadow">
            <div className="flex">
              <div>
                <p className="stat-label">Total</p>
                <p className="stat-number">{totalProjects}</p>
              </div>
              <div className="stat-icon total">
                <i className="ri-folder-line"></i>
              </div>
            </div>
          </div>
          
          <div className="stat-card glass-effect custom-shadow">
            <div className="flex">
              <div>
                <p className="stat-label">Completed</p>
                <p className="stat-number">{completedProjects}</p>
              </div>
              <div className="stat-icon completed">
                <i className="ri-check-double-line"></i>
              </div>
            </div>
          </div>
          
          <div className="stat-card glass-effect custom-shadow">
            <div className="flex">
              <div>
                <p className="stat-label">Pending</p>
                <p className="stat-number">{pendingProjects}</p>
              </div>
              <div className="stat-icon pending">
                <i className="ri-time-line"></i>
              </div>
            </div>
          </div>
          
          <div className="stat-card glass-effect custom-shadow">
            <div className="flex">
              <div>
                <p className="stat-label">Overdue</p>
                <p className="stat-number">{overdueProjects}</p>
              </div>
              <div className="stat-icon overdue">
                <i className="ri-error-warning-line"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Badges Section */}
      {achievements.length > 0 && (
        <div className="sidebar-section">
          <h3 className="sidebar-title">🏆 Your Achievements</h3>
          <div className="achievements-grid">
            {achievements.map(achievement => (
              <div key={achievement.id} className="achievement-badge">
                <i className={`ri-${achievement.icon || 'award'}-line`}></i>
                <span>{achievement.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Skills Section */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">🎯 Your Skills</h3>
        <div className="skills-grid">
          {Object.values(submissions)
            .filter(sub => sub.status === 'approved')
            .flatMap(sub => {
              const project = projects.find(p => p.id === sub.project);
              return project ? project.technologies : [];
            })
            .filter((tech, index, self) => self.indexOf(tech) === index)
            .map(tech => (
              <span key={tech} className="skill-tag">{tech}</span>
            ))}
        </div>
      </div>
      
      {/* Leaderboard Section */}
      {leaderboard.length > 0 && (
        <div className="sidebar-section">
          <h3 className="sidebar-title">🏅 Project Leaderboard</h3>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student</th>
                <th>Projects</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.slice(0, 5).map((entry, index) => (
                <tr key={entry.student_id}>
                  <td className={`rank rank-${index + 1}`}>{index + 1}</td>
                  <td>{entry.student_name}</td>
                  <td>{entry.completed_projects}</td>
                  <td>{entry.average_grade ? `${entry.average_grade.toFixed(1)}%` : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="filters-section glass-effect custom-shadow">
        <div className="filters-row">
          <div className="filter-group">
            <select 
              name="technology"
              value={filters.technology} 
              onChange={handleFilterChange}
              className="custom-select"
            >
              <option value="">All Technologies</option>
              {technologies.map(tech => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>
            
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filters.status === '' ? 'active' : ''}`}
                onClick={() => setFilters({...filters, status: ''})}
              >
                All
              </button>
              <button 
                className={`filter-btn ${filters.status === 'not-submitted' ? 'active' : ''}`}
                onClick={() => setFilters({...filters, status: 'not-submitted'})}
              >
                Pending
              </button>
              <button 
                className={`filter-btn ${filters.status === 'submitted' ? 'active' : ''}`}
                onClick={() => setFilters({...filters, status: 'submitted'})}
              >
                Submitted
              </button>
              <button 
                className={`filter-btn ${filters.status === 'approved' ? 'active' : ''}`}
                onClick={() => setFilters({...filters, status: 'approved'})}
              >
                Graded
              </button>
            </div>
          </div>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Search projects..."
              className="search-input"
            />
            <div className="search-icon">
              <i className="ri-search-line"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div className="projects-content">
        <div className="projects-list">
          <div className="projects-grid">
            {filteredProjects.length === 0 ? (
              <div style={{textAlign: 'center', padding: '3rem', color: '#6b7280'}}>
                <div style={{fontSize: '4rem', marginBottom: '1rem'}}>📁</div>
                <h3>No Projects Found</h3>
                <p>No projects match your current filters.</p>
              </div>
            ) : (
              filteredProjects.map(project => {
                const submission = submissions[project.id];
                const progress = submission ? 100 : 0;
                const isOverdue = project.deadline && new Date(project.deadline) < new Date() && !submission;
                
                return (
                  <div 
                    key={project.id} 
                    className={`project-card ${selectedProject?.id === project.id ? 'selected' : ''}`}
                    onClick={() => handleProjectSelect(project)}
                  >
                    <div className="project-header">
                      <div className={`project-icon ${getProjectIconClass(project.technologies)}`}>
                        <i className={getProjectIcon(project.technologies)}></i>
                      </div>
                      <div className="project-content">
                        <div className="project-title-row">
                          <h3 className="project-title">{project.title}</h3>
                          <span className={`status-badge status-${getStatusClass(project.id)}`}>
                            {isOverdue ? 'Overdue' : getSubmissionStatus(project.id)}
                          </span>
                        </div>
                        <p className="project-description">
                          {project.description.substring(0, 120)}...
                        </p>
                        
                        <div className="project-tech-list">
                          {project.technologies.slice(0, 3).map(tech => (
                            <span key={tech} className="tech-tag">{tech}</span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="tech-tag">+{project.technologies.length - 3}</span>
                          )}
                        </div>
                        
                        <div className="progress-section">
                          <div className="progress-header">
                            <span className="progress-label">
                              {submission ? 'Submitted' : 'Progress'}
                            </span>
                            <span className="progress-value">{progress}%</span>
                          </div>
                          <div className="progress-bar">
                            <div 
                              className={`progress-fill ${
                                submission?.status === 'approved' ? 'success' :
                                submission?.status === 'rejected' ? 'danger' :
                                submission ? 'secondary' : 'primary'
                              }`}
                              style={{width: `${progress}%`}}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="project-footer">
                          <div className="project-meta">
                            <div className="meta-item">
                              <i className="ri-calendar-line"></i>
                              <span>{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}</span>
                            </div>
                            <div className="meta-item">
                              <i className="ri-time-line"></i>
                              <span>11:59 PM</span>
                            </div>
                          </div>
                          <div className={`project-action ${
                            submission?.status === 'approved' ? 'success' :
                            submission?.status === 'rejected' ? 'danger' :
                            submission ? 'secondary' :
                            isOverdue ? 'danger' : 'primary'
                          }`}>
                            <span>
                              {submission?.status === 'approved' ? 'View Feedback' :
                               submission?.status === 'rejected' ? 'Resubmit' :
                               submission ? 'View Feedback' :
                               isOverdue ? 'Start Now' : 'Continue'}
                            </span>
                            <i className="ri-arrow-right-line"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      
      {/* Submission Form Modal/Sidebar */}
      {selectedProject && (
        <div className="submission-form">
          <h3 className="form-title">
            {submissions[selectedProject.id] ? 'Update Submission' : 'Submit Project'}:
            {' '}{selectedProject.title}
          </h3>
            
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>GitHub Repository URL:</label>
              <input
                type="url"
                name="repository_url"
                value={formData.repository_url}
                onChange={handleInputChange}
                placeholder="https://github.com/username/repository"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Live Demo URL (optional):</label>
              <input
                type="url"
                name="live_url"
                value={formData.live_url}
                onChange={handleInputChange}
                placeholder="https://your-project-demo.com"
              />
            </div>
            
            <div className="form-group">
              <label>Notes (optional):</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add any notes or comments about your submission"
                rows="4"
              ></textarea>
            </div>
            
            {submissions[selectedProject.id] && (
              <div className="submission-feedback">
                <h4 className="feedback-title">Feedback</h4>
                <div className="feedback-item">
                  <strong>Status:</strong> {getSubmissionStatus(selectedProject.id)}
                </div>
                
                {submissions[selectedProject.id].grade !== null && (
                  <div className="feedback-item">
                    <strong>Grade:</strong> {submissions[selectedProject.id].grade}/100
                  </div>
                )}
                
                {submissions[selectedProject.id].feedback && (
                  <div className="feedback-text">
                    <strong>Instructor Feedback:</strong>
                    <p>{submissions[selectedProject.id].feedback}</p>
                  </div>
                )}
              </div>
            )}
            
            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => setSelectedProject(null)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Submitting...' : (submissions[selectedProject.id] ? 'Update Submission' : 'Submit Project')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default StudentProjects;