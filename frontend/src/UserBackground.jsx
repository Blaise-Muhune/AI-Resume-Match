import React, { useState } from 'react';
import './UserBackground.css';

const UserBackground = () => {
  const [status, setStatus] = useState('');
  const [jobType, setJobType] = useState('');

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleJobTypeChange = (e) => {
    setJobType(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Status:', status);
    console.log('Job Type:', jobType);
    // Add form submission logic here
  };

  return (
    <div className="career-form-container">
      <h2>Career Path Selection</h2>
      <form onSubmit={handleSubmit} className="career-form">
        <div className="form-group">
          <label>Are you a student or currently working?</label>
          <select value={status} onChange={handleStatusChange} required>
            <option value="" disabled>Select your status</option>
            <option value="student">Student</option>
            <option value="working">Currently Working</option>
            <option value="working">Jobless</option>
          </select>
        </div>

        <div className="form-group">
          <label>What type of opportunity are you looking for?</label>
          <select value={jobType} onChange={handleJobTypeChange} required>
            <option value="" disabled>Select job type</option>
            <option value="internship">Internship</option>
            <option value="professional">Professional Job</option>
          </select>
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default UserBackground;
