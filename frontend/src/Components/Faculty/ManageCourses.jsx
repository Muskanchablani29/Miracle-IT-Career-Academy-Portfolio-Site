import React, { useState, useEffect } from 'react';
import { userAxiosInstance } from '../../api';
import { Link } from 'react-router-dom';
import './ManageCourses.css';
import {
  FaEdit, FaBook, FaPlus, FaUsers, FaArrowLeft,
  FaLayerGroup, FaClock, FaSignal, FaSearch,
  FaGraduationCap, FaSitemap, FaChalkboardTeacher
} from 'react-icons/fa';
import CourseBatchCreation from './CourseBatchCreation';
import ViewBatches from './ViewBatches';
import AddCourse from '../Admin/AddCourse';

const FacultyManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [syllabus, setSyllabus] = useState([]);
  const [editingSyllabus, setEditingSyllabus] = useState(null);
  const [editingSyllabusItem, setEditingSyllabusItem] = useState(null);
  const [syllabusFormData, setSyllabusFormData] = useState({ title: '', order: 1 });
  const [syllabusItemFormData, setSyllabusItemFormData] = useState({
    title: '', description: '', order: 1, module_id: null
  });
  const [activeTab, setActiveTab] = useState('courses');
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showViewBatches, setShowViewBatches] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [selectedCourseForBatch, setSelectedCourseForBatch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await userAxiosInstance.get('courses/courses/');
      setCourses(response.data);
    } catch (err) {
      setError('Failed to load courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSyllabus = async (courseId) => {
    try {
      const response = await userAxiosInstance.get(`courses/syllabus/?course_id=${courseId}`);
      setSyllabus(response.data);
    } catch (err) {
      console.error('Error fetching syllabus:', err);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    fetchSyllabus(course.id);
    setActiveTab('syllabus');
  };

  const handleUpdateSyllabus = async (e) => {
    e.preventDefault();
    try {
      await userAxiosInstance.put(`courses/syllabus/${editingSyllabus.id}/`, {
        ...syllabusFormData, course: selectedCourse.id
      });
      fetchSyllabus(selectedCourse.id);
      setEditingSyllabus(null);
      setSyllabusFormData({ title: '', order: 1 });
    } catch (err) {
      console.error('Error updating syllabus module:', err);
    }
  };

  const handleUpdateSyllabusItem = async (e) => {
    e.preventDefault();
    try {
      await userAxiosInstance.put(`courses/syllabus-items/${editingSyllabusItem.id}/`, {
        title: syllabusItemFormData.title,
        description: syllabusItemFormData.description,
        order: syllabusItemFormData.order,
        module: editingSyllabusItem.module
      });
      fetchSyllabus(selectedCourse.id);
      setEditingSyllabusItem(null);
      setSyllabusItemFormData({ title: '', description: '', order: 1, module_id: null });
    } catch (err) {
      console.error('Error updating syllabus item:', err);
    }
  };

  const filteredCourses = courses.filter(c =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.level?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLevelColor = (level) => {
    const l = level?.toLowerCase();
    if (l === 'beginner') return 'level-beginner';
    if (l === 'intermediate') return 'level-intermediate';
    if (l === 'advanced') return 'level-advanced';
    return 'level-default';
  };

  if (loading) return (
    <div className="mc-loading">
      <div className="mc-spinner"></div>
      <span>Loading courses...</span>
    </div>
  );

  if (error) return <div className="mc-error"><span>⚠</span> {error}</div>;

  return (
    <div className="mc-container">
      {/* ── Modals ── */}
      {showBatchModal && (
        <CourseBatchCreation
          onClose={() => setShowBatchModal(false)}
          onSuccess={fetchCourses}
          courseId={selectedCourseForBatch?.id}
          courseName={selectedCourseForBatch?.title}
        />
      )}
      {showViewBatches && (
        <ViewBatches
          onClose={() => setShowViewBatches(false)}
          courseId={selectedCourseForBatch?.id}
          courseName={selectedCourseForBatch?.title}
        />
      )}
      {showAddCourseModal && (
        <div className="mc-modal-overlay">
          <div className="mc-modal-box">
            <button className="mc-modal-close" onClick={() => setShowAddCourseModal(false)}>×</button>
            <AddCourse />
          </div>
        </div>
      )}

      {!selectedCourse ? (
        <>
          {/* ── Page Header ── */}
          <div className="mc-page-header">
            <div className="mc-page-header-left">
              <div className="mc-header-icon"><FaChalkboardTeacher /></div>
              <div>
                <h1>Manage Courses</h1>
                <p>Organize courses, create batches and manage syllabus content</p>
              </div>
            </div>
            <button className="mc-add-btn" onClick={() => setShowAddCourseModal(true)}>
              <FaPlus /> Add New Course
            </button>
          </div>

          {/* ── Stats Bar ── */}
          <div className="mc-stats-bar">
            <div className="mc-stat">
              <span className="mc-stat-value">{courses.length}</span>
              <span className="mc-stat-label">Total Courses</span>
            </div>
            <div className="mc-stat-divider" />
            <div className="mc-stat">
              <span className="mc-stat-value">
                {courses.filter(c => c.level?.toLowerCase() === 'beginner').length}
              </span>
              <span className="mc-stat-label">Beginner</span>
            </div>
            <div className="mc-stat-divider" />
            <div className="mc-stat">
              <span className="mc-stat-value">
                {courses.filter(c => c.level?.toLowerCase() === 'intermediate').length}
              </span>
              <span className="mc-stat-label">Intermediate</span>
            </div>
            <div className="mc-stat-divider" />
            <div className="mc-stat">
              <span className="mc-stat-value">
                {courses.filter(c => c.level?.toLowerCase() === 'advanced').length}
              </span>
              <span className="mc-stat-label">Advanced</span>
            </div>
          </div>

          {/* ── Search ── */}
          <div className="mc-search-bar">
            <FaSearch className="mc-search-icon" />
            <input
              type="text"
              placeholder="Search courses by name or level..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="mc-search-clear" onClick={() => setSearchTerm('')}>×</button>
            )}
          </div>

          {/* ── Course Cards Grid ── */}
          {filteredCourses.length === 0 ? (
            <div className="mc-empty">
              <FaGraduationCap />
              <p>No courses found{searchTerm ? ` for "${searchTerm}"` : ''}.</p>
            </div>
          ) : (
            <div className="mc-grid">
              {filteredCourses.map((course, idx) => (
                <div className="mc-card" key={course.id} style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="mc-card-image">
                    {course.image
                      ? <img src={course.image} alt={course.title} />
                      : <div className="mc-card-image-placeholder"><FaGraduationCap /></div>
                    }
                    <span className={`mc-level-badge ${getLevelColor(course.level)}`}>
                      <FaSignal /> {course.level || 'N/A'}
                    </span>
                  </div>

                  <div className="mc-card-body">
                    <h3 className="mc-card-title" title={course.title}>{course.title}</h3>
                    <div className="mc-card-meta">
                      <span><FaClock /> {course.duration || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="mc-card-actions">
                    <Link
                      to={`/faculty/courses/${course.id}/syllabus`}
                      className="mc-action-btn mc-btn-syllabus"
                      title="Edit Syllabus"
                    >
                      <FaBook />
                      <span>Syllabus</span>
                    </Link>
                    <button
                      className="mc-action-btn mc-btn-batch"
                      onClick={() => { setSelectedCourseForBatch(course); setShowBatchModal(true); }}
                      title="Create Batch"
                    >
                      <FaPlus />
                      <span>New Batch</span>
                    </button>
                    <button
                      className="mc-action-btn mc-btn-view"
                      onClick={() => { setSelectedCourseForBatch(course); setShowViewBatches(true); }}
                      title="View Batches"
                    >
                      <FaUsers />
                      <span>Batches</span>
                    </button>
                    <button
                      className="mc-action-btn mc-btn-edit"
                      onClick={() => handleCourseSelect(course)}
                      title="Manage Syllabus Modules"
                    >
                      <FaEdit />
                      <span>Modules</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* ── Syllabus Management View ── */
        <div className="mc-syllabus-view">
          <div className="mc-syllabus-topbar">
            <button className="mc-back-btn" onClick={() => { setSelectedCourse(null); setActiveTab('courses'); }}>
              <FaArrowLeft /> Back to Courses
            </button>
            <div className="mc-syllabus-course-info">
              <FaGraduationCap />
              <span>{selectedCourse.title}</span>
            </div>
          </div>

          <div className="mc-tabs">
            <button
              className={`mc-tab ${activeTab === 'syllabus' ? 'mc-tab-active' : ''}`}
              onClick={() => setActiveTab('syllabus')}
            >
              <FaBook /> Syllabus Modules
            </button>
            <button
              className={`mc-tab ${activeTab === 'items' ? 'mc-tab-active' : ''}`}
              onClick={() => setActiveTab('items')}
            >
              <FaLayerGroup /> Module Items
            </button>
          </div>

          {activeTab === 'syllabus' && (
            <div className="mc-tab-content">
              <div className="mc-section-title">
                <FaSitemap /> <span>Syllabus Modules</span>
                <span className="mc-count-pill">{syllabus.length}</span>
              </div>
              {syllabus.length === 0 ? (
                <div className="mc-empty"><FaBook /><p>No syllabus modules found.</p></div>
              ) : (
                <div className="mc-module-list">
                  {syllabus.map((module) => (
                    <div className="mc-module-row" key={module.id}>
                      <div className="mc-module-order">{module.order}</div>
                      <div className="mc-module-info">
                        <span className="mc-module-title">{module.title}</span>
                        <span className="mc-module-date">
                          Updated {new Date(module.last_updated).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        className="mc-icon-btn mc-icon-edit"
                        onClick={() => {
                          setSyllabusFormData({ title: module.title, order: module.order });
                          setEditingSyllabus(module);
                        }}
                        title="Edit Module"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {editingSyllabus && (
                <div className="mc-form-card">
                  <h3><FaEdit /> Edit Module</h3>
                  <form onSubmit={handleUpdateSyllabus}>
                    <div className="mc-form-row">
                      <div className="mc-form-group">
                        <label>Module Title</label>
                        <input
                          type="text"
                          name="title"
                          value={syllabusFormData.title}
                          onChange={e => setSyllabusFormData({ ...syllabusFormData, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mc-form-group mc-form-group-sm">
                        <label>Order</label>
                        <input
                          type="number"
                          name="order"
                          min="1"
                          value={syllabusFormData.order}
                          onChange={e => setSyllabusFormData({ ...syllabusFormData, order: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="mc-form-actions">
                      <button type="submit" className="mc-btn-primary">Update Module</button>
                      <button type="button" className="mc-btn-ghost" onClick={() => setEditingSyllabus(null)}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {activeTab === 'items' && (
            <div className="mc-tab-content">
              <div className="mc-section-title">
                <FaLayerGroup /> <span>Module Items</span>
              </div>
              {syllabus.map((module) => (
                <div className="mc-module-section" key={module.id}>
                  <div className="mc-module-section-header">
                    <span className="mc-module-num">Module {module.order}</span>
                    <span className="mc-module-name">{module.title}</span>
                    <span className="mc-items-count">{module.items?.length || 0} items</span>
                  </div>
                  {module.items?.length > 0 ? (
                    <div className="mc-items-list">
                      {module.items.map((item) => (
                        <div className="mc-item-row" key={item.id}>
                          <div className="mc-item-order">{item.order}</div>
                          <span className="mc-item-title">{item.title}</span>
                          <button
                            className="mc-icon-btn mc-icon-edit"
                            onClick={() => {
                              setSyllabusItemFormData({
                                title: item.title, description: item.description || '',
                                order: item.order, module_id: item.module
                              });
                              setEditingSyllabusItem(item);
                            }}
                            title="Edit Item"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mc-no-items">No items in this module</p>
                  )}
                </div>
              ))}

              {editingSyllabusItem && (
                <div className="mc-form-card">
                  <h3><FaEdit /> Edit Item</h3>
                  <form onSubmit={handleUpdateSyllabusItem}>
                    <div className="mc-form-group">
                      <label>Item Title</label>
                      <input
                        type="text"
                        value={syllabusItemFormData.title}
                        onChange={e => setSyllabusItemFormData({ ...syllabusItemFormData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mc-form-group">
                      <label>Description <span className="mc-optional">(optional)</span></label>
                      <textarea
                        value={syllabusItemFormData.description}
                        onChange={e => setSyllabusItemFormData({ ...syllabusItemFormData, description: e.target.value })}
                      />
                    </div>
                    <div className="mc-form-group mc-form-group-sm">
                      <label>Order</label>
                      <input
                        type="number"
                        min="1"
                        value={syllabusItemFormData.order}
                        onChange={e => setSyllabusItemFormData({ ...syllabusItemFormData, order: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mc-form-actions">
                      <button type="submit" className="mc-btn-primary">Update Item</button>
                      <button type="button" className="mc-btn-ghost" onClick={() => setEditingSyllabusItem(null)}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FacultyManageCourses;
