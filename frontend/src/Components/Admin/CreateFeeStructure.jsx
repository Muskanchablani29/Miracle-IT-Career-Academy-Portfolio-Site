import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaMoneyBillWave, FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import './CreateFeeStructure.css';
import { adminAxiosInstance, createFeeStructure, updateFeeStructure, addFeeInstallment, fetchFeeStructureById, fetchFeeInstallments } from '../../api';

const CreateFeeStructure = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    registration_fee: 0,
    tuition_fee: 0,
    total_amount: 0,
    installments: 5 // Default to 5 installments
  });
  // Get current date in YYYY-MM-DD format for registration fee
  const currentDate = new Date().toISOString().split('T')[0];
  
  const [installments, setInstallments] = useState([
    { amount: 0, due_date: currentDate, description: 'Registration Fee (At Admission)', isRegistrationFee: true, isPaid: false },
    { amount: 0, due_date: '', description: 'Second Installment' },
    { amount: 0, due_date: '', description: 'Third Installment' },
    { amount: 0, due_date: '', description: 'Fourth Installment' },
    { amount: 0, due_date: '', description: 'Fifth Installment' }
  ]);
  
  // We'll fetch real data from API

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Use adminAxiosInstance to fetch real course data
        const response = await adminAxiosInstance.get('courses/courses/');
        setCourses(response.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setCourses([]);
        alert('Failed to fetch courses. Please check your connection and try again.');
      }
    };

    fetchCourses();
    
    // If editing existing fee structure
    if (id) {
      const fetchFeeStructure = async () => {
        try {
          const feeStructure = await fetchFeeStructureById(id);
          
          setFormData({
            name: feeStructure.name,
            course: feeStructure.course.id,
            registration_fee: feeStructure.registration_fee || 0,
            tuition_fee: feeStructure.tuition_fee || 0,
            total_amount: feeStructure.total_amount,
            installments: feeStructure.installments
          });
          
          // Fetch installments
          const fetchedInstallments = await fetchFeeInstallments(id);
          
          // Get current date for registration fee if needed
          const currentDate = new Date().toISOString().split('T')[0];
          
          // Ensure first installment is marked as registration fee
          const processedInstallments = fetchedInstallments.map((inst, index) => {
            if (index === 0) {
              return {
                ...inst,
                description: inst.description || 'Registration Fee (At Admission)',
                isRegistrationFee: true,
                due_date: inst.due_date || currentDate
              };
            }
            return inst;
          });
          
          setInstallments(processedInstallments);
        } catch (err) {
          console.error('Error fetching fee structure:', err);
          alert('Failed to fetch fee structure. Please check your connection and try again.');
          navigate('/admin/fee-management');
        }
      };
      
      fetchFeeStructure();
    }
  }, [id]);

  useEffect(() => {
    // Calculate total amount when registration_fee or tuition_fee changes
    const total = Number(formData.registration_fee) + Number(formData.tuition_fee);
    setFormData(prev => ({ ...prev, total_amount: total }));
    
    // Update installment amounts based on the number of installments
    if (installments.length > 0) {
      // Get current date for registration fee
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Set first installment as registration fee
      const firstInstallment = installments[0];
      firstInstallment.amount = Number(formData.registration_fee);
      firstInstallment.due_date = currentDate; // Set due date to today (admission date)
      
      // Calculate remaining amount for other installments
      const remainingAmount = Number(formData.tuition_fee);
      const remainingInstallments = installments.length - 1;
      
      if (remainingInstallments > 0) {
        const baseAmount = Math.floor(remainingAmount / remainingInstallments);
        const remainder = remainingAmount % remainingInstallments;
        
        const newInstallments = installments.map((installment, index) => {
          if (index === 0) {
            // First installment is registration fee
            return {
              ...installment,
              amount: Number(formData.registration_fee),
              due_date: currentDate,
              description: 'Registration Fee (At Admission)',
              isRegistrationFee: true
            };
          } else {
            // Add remainder to second installment (first tuition installment)
            const amount = index === 1 ? baseAmount + remainder : baseAmount;
            return {
              ...installment,
              amount
            };
          }
        });
        
        setInstallments(newInstallments);
      }
    }
  }, [formData.registration_fee, formData.tuition_fee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInstallmentChange = (index, field, value) => {
    const updatedInstallments = [...installments];
    updatedInstallments[index] = { ...updatedInstallments[index], [field]: value };
    setInstallments(updatedInstallments);
    
    // If amount is changed, update total amount
    if (field === 'amount') {
      const totalInstallments = updatedInstallments.reduce((sum, inst) => sum + Number(inst.amount), 0);
      setFormData(prev => ({ 
        ...prev, 
        total_amount: Number(formData.registration_fee) + totalInstallments 
      }));
    }
  };
  
  const addInstallment = () => {
    const newInstallmentNumber = installments.length;
    const descriptions = ['Registration Fee', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'];
    const description = newInstallmentNumber <= descriptions.length 
      ? `${descriptions[newInstallmentNumber]} Installment` 
      : `Installment ${newInstallmentNumber}`;
      
    setInstallments([
      ...installments, 
      { 
        amount: Math.floor(formData.tuition_fee / installments.length), 
        due_date: '', 
        description 
      }
    ]);
    
    // Update number of installments in formData
    setFormData(prev => ({ ...prev, installments: installments.length + 1 }));
    
    // Recalculate all installment amounts
    setTimeout(() => {
      // Keep registration fee as first installment
      const registrationFee = Number(formData.registration_fee);
      const tuitionFee = Number(formData.tuition_fee);
      const remainingInstallments = installments.length; // Not including the new one yet
      
      if (remainingInstallments > 0) {
        const baseAmount = Math.floor(tuitionFee / remainingInstallments);
        const remainder = tuitionFee % remainingInstallments;
        
        const newInstallments = [...installments, { amount: 0, due_date: '', description }].map((inst, idx) => {
          if (idx === 0) {
            // First installment is registration fee
            return {
              ...inst,
              amount: registrationFee,
              isRegistrationFee: true
            };
          } else if (idx === 1) {
            // Add remainder to second installment
            return {
              ...inst,
              amount: baseAmount + remainder
            };
          } else {
            return {
              ...inst,
              amount: baseAmount
            };
          }
        });
        
        setInstallments(newInstallments);
      }
    }, 0);
  };
  
  const removeInstallment = (index) => {
    if (installments.length <= 1) {
      alert("You must have at least one installment.");
      return;
    }
    
    // Cannot remove registration fee (first installment)
    if (index === 0) {
      alert("Cannot remove registration fee installment.");
      return;
    }
    
    const updatedInstallments = installments.filter((_, idx) => idx !== index);
    setInstallments(updatedInstallments);
    
    // Update number of installments in formData
    setFormData(prev => ({ ...prev, installments: updatedInstallments.length }));
    
    // Recalculate all installment amounts
    setTimeout(() => {
      // Keep registration fee as first installment
      const registrationFee = Number(formData.registration_fee);
      const tuitionFee = Number(formData.tuition_fee);
      const remainingInstallments = updatedInstallments.length - 1; // Exclude registration fee
      
      if (remainingInstallments > 0) {
        const baseAmount = Math.floor(tuitionFee / remainingInstallments);
        const remainder = tuitionFee % remainingInstallments;
        
        const newInstallments = updatedInstallments.map((inst, idx) => {
          if (idx === 0) {
            // First installment is registration fee
            return {
              ...inst,
              amount: registrationFee,
              isRegistrationFee: true
            };
          } else if (idx === 1) {
            // Add remainder to second installment
            return {
              ...inst,
              amount: baseAmount + remainder
            };
          } else {
            return {
              ...inst,
              amount: baseAmount
            };
          }
        });
        
        setInstallments(newInstallments);
      }
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate installments due_date before submitting
    for (const [index, installment] of installments.entries()) {
      if (!installment.due_date || installment.due_date.trim() === '') {
        alert(`Please provide a valid due date for installment ${index + 1}.`);
        setLoading(false);
        return;
      }
    }

    try {
      // Create or update fee structure
      let feeStructureId;
      
      if (id) {
        // Update existing fee structure
        await updateFeeStructure(id, {
          name: formData.name,
          course: formData.course,
          registration_fee: Number(formData.registration_fee),
          tuition_fee: Number(formData.tuition_fee),
          total_amount: Number(formData.total_amount),
          installments: installments.length
        });
        feeStructureId = id;
      } else {
        // Create new fee structure
        const response = await createFeeStructure({
          name: formData.name,
          course: formData.course,
          registration_fee: Number(formData.registration_fee),
          tuition_fee: Number(formData.tuition_fee),
          total_amount: Number(formData.total_amount),
          installments: installments.length
        });
        feeStructureId = response.id;
      }

      // Create or update installments
      for (const [index, installment] of installments.entries()) {
        if (installment.id) {
          // Update existing installment
          await adminAxiosInstance.put(`fee-installments/${installment.id}/`, {
            amount: Number(installment.amount),
            due_date: installment.due_date,
            description: installment.description,
            sequence: index + 1,
            is_registration_fee: index === 0
          });
        } else {
          // Create new installment
          await addFeeInstallment(feeStructureId, {
            amount: Number(installment.amount),
            due_date: installment.due_date,
            description: installment.description,
            sequence: index + 1,
            is_registration_fee: index === 0
          });
        }
      }

      alert(`Fee structure ${id ? 'updated' : 'created'} successfully!`);
      navigate('/admin/fee-structure');
    } catch (err) {
      console.error(`Error ${id ? 'updating' : 'creating'} fee structure:`, err);
      if (err.response && err.response.data) {
        const errors = err.response.data;
        let errorMessages = '';
        for (const key in errors) {
          if (Array.isArray(errors[key])) {
            errorMessages += `${key}: ${errors[key].join(', ')}\n`;
          } else {
            errorMessages += `${key}: ${errors[key]}\n`;
          }
        }
        alert(`Error ${id ? 'updating' : 'creating'} fee structure:\n${errorMessages}`);
      } else {
        alert(`Error ${id ? 'updating' : 'creating'} fee structure. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1><FaMoneyBillWave /> {id ? 'Edit' : 'Create'} Fee Structure</h1>
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Fee Structure Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Full Stack Web Development - 2023"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="course">Course</label>
            <select
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
            >
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="registration_fee">Registration Fee (₹)</label>
              <input
                type="number"
                id="registration_fee"
                name="registration_fee"
                value={formData.registration_fee}
                onChange={handleChange}
                min="0"
                required
                className="highlighted-input"
              />
              <small>Paid at the time of admission</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="tuition_fee">Tuition Fee (₹)</label>
              <input
                type="number"
                id="tuition_fee"
                name="tuition_fee"
                value={formData.tuition_fee}
                onChange={handleChange}
                min="0"
                required
              />
              <small>This will be divided among remaining installments</small>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="total_amount">Total Amount (₹)</label>
              <input
                type="number"
                id="total_amount"
                name="total_amount"
                value={formData.total_amount}
                readOnly
                className="highlighted-input"
              />
            </div>
          </div>
          
          <div className="installments-section">
            <div className="installments-header">
              <h3>Installment Schedule</h3>
              <button 
                type="button" 
                className="add-installment-btn"
                onClick={addInstallment}
              >
                <FaPlus /> Add Installment
              </button>
            </div>
            
            <div className="installments-table">
              <table>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Description</th>
                    <th>Amount (₹)</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {installments.map((installment, index) => (
                    <tr key={index} className="installment-row">
                      <td>{index + 1}</td>
                      <td>
                        <input
                          type="text"
                          value={installment.description || `Installment ${index + 1}`}
                          onChange={(e) => handleInstallmentChange(index, 'description', e.target.value)}
                          placeholder="Description"
                          readOnly={index === 0} // Make registration fee description read-only
                          className={index === 0 ? "highlighted-input" : ""}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={installment.amount}
                          onChange={(e) => handleInstallmentChange(index, 'amount', e.target.value)}
                          min="0"
                          required
                          readOnly={index === 0} // Make registration fee amount read-only
                          className={index === 0 ? "highlighted-input" : ""}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={installment.due_date}
                          onChange={(e) => handleInstallmentChange(index, 'due_date', e.target.value)}
                          required
                          readOnly={index === 0} // Make registration fee date read-only
                          className={index === 0 ? "highlighted-input" : ""}
                        />
                        {index === 0 && <small className="admission-date-note">Admission date</small>}
                      </td>
                      <td>
                        {index === 0 ? (
                          <span className="registration-badge">At Admission</span>
                        ) : (
                          <button
                            type="button"
                            className="remove-installment-btn"
                            onClick={() => removeInstallment(index)}
                            title="Remove this installment"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/admin/fee-management')}>
              <FaTimes /> Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <FaSave /> {loading ? (id ? 'Updating...' : 'Creating...') : (id ? 'Update' : 'Create')} Fee Structure
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFeeStructure;