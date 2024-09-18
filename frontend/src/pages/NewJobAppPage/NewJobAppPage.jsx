import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJobApp } from '../../services/jobAppService';
import styles from './NewJobApp.module.css';

export default function NewJobApp({ setColumns }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    jobDescription: '',
    status: 'wishlist',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newJobApp = await createJobApp(formData);
      setFormData({
        companyName: '',
        jobTitle: '',
        jobDescription: '',
        status: 'wishlist',
        notes: ''
      });
      setColumns((prevColumns) => {
        const updatedColumn = { ...prevColumns[newJobApp.status], items: [...prevColumns[newJobApp.status].items, newJobApp] };
        return { ...prevColumns, [newJobApp.status]: updatedColumn };
      });
      navigate('/board');
    } catch (error) {
      console.error('Failed to create job application:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Add New Job Application</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="companyName">Company Name</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="jobTitle">Job Title</label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="jobDescription">Job Description</label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="wishlist">Wishlist</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className={styles.submitButton}>Add Job Application</button>
      </form>
    </div>
  );
}
