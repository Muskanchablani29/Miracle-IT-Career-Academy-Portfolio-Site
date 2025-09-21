import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, fetchCourses } from '../../api';
import { FaPlus, FaTimes, FaEdit, FaTrash, FaFilter, FaBullhorn, FaPaperclip, FaExclamationTriangle, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import './FacultyAnnouncements.css';

const FacultyAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [filterCourse, setFilterCourse] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    course: '',
    priority: 'normal',
    attachment: null
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [announcementsData, coursesData] = await Promise.all([
        fetchAnnouncements(),
        fetchCourses()
      ]);
      setAnnouncements(announcementsData);
      setCourses(coursesData);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('message', formData.message);
      submitData.append('priority', formData.priority);
      if (formData.course) submitData.append('course', formData.course);
      if (formData.attachment) submitData.append('attachment', formData.attachment);

      if (editingAnnouncement) {
        await updateAnnouncement(editingAnnouncement.id, submitData);
        toast.success('Announcement updated successfully');
      } else {
        await createAnnouncement(submitData);
        toast.success('Announcement created successfully');
      }
      
      resetForm();
      loadData();
    } catch (error) {
      toast.error('Failed to save announcement');
    }
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      course: announcement.course || '',
      priority: announcement.priority,
      attachment: null
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await deleteAnnouncement(id);
        toast.success('Announcement deleted successfully');
        loadData();
      } catch (error) {
        toast.error('Failed to delete announcement');
      }
    }
  };

  const resetForm = () => {
    setFormData({ title: '', message: '', course: '', priority: 'normal', attachment: null });
    setEditingAnnouncement(null);
    setShowForm(false);
  };

  const filteredAnnouncements = announcements.filter(announcement => 
    filterCourse === 'all' || announcement.course == filterCourse
  );

  if (loading) return (
    <div className="modern-loading">
      <div className="loading-spinner"></div>
      <p>Loading announcements...</p>
    </div>
  );

  return (
    <div className="modern-announcements-container">
      <div className="announcements-header">
        <div className="header-content">
          <div className="header-title">
            <FaBullhorn className="header-icon" />
            <div>
              <h1>Faculty Announcements</h1>
              <p>Manage and broadcast important updates to your students</p>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className={`modern-btn ${showForm ? 'cancel' : 'primary'}`}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? <FaTimes /> : <FaPlus />}
              <span>{showForm ? 'Cancel' : 'New Announcement'}</span>
            </button>
          </div>
        </div>
      </div>
        
      {showForm && (
        <div className="modern-form-container">
          <div className="form-header">
            <h2>{editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}</h2>
            <p>Share important updates with your students</p>
          </div>
          
          <form onSubmit={handleSubmit} className="modern-form">
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="modern-label">Announcement Title</label>
                <input 
                  type="text" 
                  placeholder="Enter a clear, descriptive title" 
                  className="modern-input"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="modern-label">Target Course</label>
                <select 
                  className="modern-select"
                  value={formData.course}
                  onChange={(e) => setFormData({...formData, course: e.target.value})}
                >
                  <option value="">📢 All Courses</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>📚 {course.title}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="modern-label">Priority Level</label>
                <div className="priority-selector">
                  {[
                    { value: 'normal', label: 'Normal', icon: FaInfoCircle, color: '#3b82f6' },
                    { value: 'important', label: 'Important', icon: FaExclamationTriangle, color: '#f59e0b' },
                    { value: 'urgent', label: 'Urgent', icon: FaExclamationTriangle, color: '#ef4444' }
                  ].map(priority => {
                    const IconComponent = priority.icon;
                    return (
                      <label key={priority.value} className={`priority-option ${formData.priority === priority.value ? 'selected' : ''}`}>
                        <input 
                          type="radio" 
                          name="priority" 
                          value={priority.value}
                          checked={formData.priority === priority.value}
                          onChange={(e) => setFormData({...formData, priority: e.target.value})}
                        />
                        <div className="priority-content" style={{'--priority-color': priority.color}}>
                          <IconComponent className="priority-icon" />
                          <span>{priority.label}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="form-group full-width">
              <label className="modern-label">Message Content</label>
              <textarea 
                placeholder="Write your announcement message here..." 
                className="modern-textarea" 
                rows="6"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
              ></textarea>
              <div className="character-count">{formData.message.length} characters</div>
            </div>
            
            <div className="form-group full-width">
              <label className="modern-label">Attachment (Optional)</label>
              <div className="file-upload-area">
                <input 
                  type="file" 
                  id="attachment"
                  className="file-input"
                  onChange={(e) => setFormData({...formData, attachment: e.target.files[0]})}
                />
                <label htmlFor="attachment" className="file-upload-label">
                  <FaPaperclip className="upload-icon" />
                  <span>{formData.attachment ? formData.attachment.name : 'Choose file or drag here'}</span>
                </label>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="modern-btn secondary" onClick={resetForm}>
                <FaTimes />
                <span>Cancel</span>
              </button>
              <button type="submit" className="modern-btn primary">
                <FaCheckCircle />
                <span>{editingAnnouncement ? 'Update Announcement' : 'Post Announcement'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="announcements-list">
        <div className="list-header">
          <h3>Recent Announcements ({filteredAnnouncements.length})</h3>
          <div className="filter-controls">
            <select 
              className="filter-select"
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
            >
              <option value="all">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>
        </div>
        
        {filteredAnnouncements.length === 0 ? (
          <div className="empty-state">
            <FaBullhorn className="empty-icon" />
            <h3>No announcements yet</h3>
            <p>Create your first announcement to communicate with students</p>
          </div>
        ) : (
          <div className="announcements-grid">
            {filteredAnnouncements.map(announcement => (
              <div key={announcement.id} className={`announcement-card priority-${announcement.priority}`}>
                <div className="card-header">
                  <div className="announcement-meta">
                    <div className={`priority-badge priority-${announcement.priority}`}>
                      {announcement.priority === 'urgent' && <FaExclamationTriangle />}
                      {announcement.priority === 'important' && <FaExclamationTriangle />}
                      {announcement.priority === 'normal' && <FaInfoCircle />}
                      <span>{announcement.priority.toUpperCase()}</span>
                    </div>
                    <span className="course-tag">
                      {announcement.course_title || 'All Courses'}
                    </span>
                  </div>
                  <div className="card-actions">
                    <button 
                      className="action-btn edit"
                      onClick={() => handleEdit(announcement)}
                      title="Edit announcement"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDelete(announcement.id)}
                      title="Delete announcement"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                
                <div className="card-content">
                  <h4 className="announcement-title">{announcement.title}</h4>
                  <p className="announcement-message">{announcement.message}</p>
                  
                  {announcement.attachment_url && (
                    <div className="attachment-info">
                      <FaPaperclip className="attachment-icon" />
                      <a href={announcement.attachment_url} target="_blank" rel="noopener noreferrer">
                        View Attachment
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="card-footer">
                  <div className="author-info">
                    <span className="author-name">By {announcement.created_by_name}</span>
                    <span className="post-date">
                      {new Date(announcement.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyAnnouncements;