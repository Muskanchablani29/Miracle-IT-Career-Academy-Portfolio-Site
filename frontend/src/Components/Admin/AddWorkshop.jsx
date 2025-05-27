import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { adminAxiosInstance } from '../../api';
import './AddCourse.css'; // Reusing the same CSS

const AddWorkshop = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    available_seats: 0
  });
  
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is authorized
  React.useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'faculty')) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create FormData object to handle file upload
      const workshopData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        workshopData.append(key, formData[key]);
      });
      
      // Add image if selected
      if (image) {
        workshopData.append('image', image);
      }

      // Send request to create workshop
      const response = await adminAxiosInstance.post('/users/workshops/', workshopData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setLoading(false);
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'faculty') {
        navigate('/faculty/dashboard');
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || 'Failed to create workshop. Please try again.');
      console.error('Error creating workshop:', err);
    }
  };

  return (
    <div className="add-course-container">
      <h1>Add New Workshop</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-group">
          <label htmlFor="title">Workshop Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description*</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>
        
        <div className="form-group image-upload">
          <label htmlFor="image">Workshop Image*</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Workshop preview" />
            </div>
          )}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date*</label>
            <input
              type="text"
              id="date"
              name="date"
              placeholder="e.g. June 15, 2024"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Location*</label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="e.g. Main Campus, Room 101"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="available_seats">Available Seats*</label>
          <input
            type="number"
            id="available_seats"
            name="available_seats"
            min="1"
            value={formData.available_seats}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => {
              if (user.role === 'admin') {
                navigate('/admin/dashboard');
              } else if (user.role === 'faculty') {
                navigate('/faculty/dashboard');
              }
            }}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Workshop'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWorkshop;