import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../Styles/PostExperience.css';

// --- Constants ---
const Roles = [
  "SDE",
  "Frontend Developer",
  "Backend Developer",
  "Full-Stack Developer",
  "Associate Software Engineer",
  "Intern"
];
const Applied_At = ["On-campus", "Off-campus"];
const BRANCH_OPTIONS = ["CSE","CSM","CSD", "ECE", "IT", "Mechanical", "Other"];
const VERDICT_OPTIONS = ["Selected", "Not Selected", "In Progress"];
const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];
const ROUND_TYPE_OPTIONS = ["Online Assessment", "Technical Round", "Managerial Round", "HR Round"];

// --- Initial State ---
const INITIAL_STATE = {
  companyName: '',
  role: '',
  location: '',
  interviewDate: '',
  appliedAt: '',
  branch: '',
  verdict: '',
  difficulty: '',
  rounds: [{ roundType: '', description: '', links: '' }],
  tips: '',
};

function PostExperiencePage() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const local = 'http://localhost:5000'
  


  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoundDescriptionChange = (value, index) => {
    const updatedRounds = [...formData.rounds];
    updatedRounds[index].description = value;
    setFormData(prev => ({ ...prev, rounds: updatedRounds }));
  };

  const handleRoundChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRounds = [...formData.rounds];
    updatedRounds[index][name] = value;
    setFormData(prev => ({ ...prev, rounds: updatedRounds }));
  };

  const addRound = () => {
    setFormData(prev => ({
      ...prev,
      rounds: [...prev.rounds, { roundType: 'Technical Round', description: '', links: '' }],
    }));
  };

  const removeRound = (index) => {
    const updatedRounds = formData.rounds.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, rounds: updatedRounds }));
  };

  const handleClear = () => {
    setFormData(INITIAL_STATE);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      await axios.post(`${process.env.REACT_APP_API_URL}/api/postexperience`, formData, config);
      alert('Experience submitted successfully!');
      handleClear()
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Failed to submit experience.');
    }
  };

  return (
    <div className="form-container-flex">
      <form onSubmit={handleSubmit} className="experience-form-card">
        <div className="form-header">
          <h1>Share Your Interview Experience</h1>
          <p>Your story can help someone else and their dream job.</p>
        </div>

        {/* --- General Details --- */}
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              name="companyName"
              id="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role / Position</label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="" disabled>Select Role</option>
              {Roles.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="location">Company Location</label>
            <input
              type="text"
              name="location"
              id="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="interviewDate">Interview Date</label>
            <input
              type="date"
              name="interviewDate"
              id="interviewDate"
              value={formData.interviewDate}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="appliedAt">Applied At</label>
            <select
              name="appliedAt"
              id="appliedAt"
              value={formData.appliedAt}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="" disabled>Select </option>
              {Applied_At.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="branch">Branch</label>
            <select
              name="branch"
              id="branch"
              value={formData.branch}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="" disabled>Select Branch</option>
              {BRANCH_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="verdict">Verdict</label>
            <select
              name="verdict"
              id="verdict"
              value={formData.verdict}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="" disabled>Select Verdict</option>
              {VERDICT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>

        {/* --- Difficulty --- */}
        <div className="form-section">
          <label htmlFor="difficulty">Overall Difficulty</label>
          <select
            name="difficulty"
            id="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="" disabled>Select Difficulty</option>
            {DIFFICULTY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        {/* --- Rounds --- */}
        <div className="form-section">
          <h2>Interview Rounds</h2>
          {formData.rounds.map((round, index) => (
            <div key={index} className="round-card">
              <div className="round-header">
                <p className="round-title">Round {index + 1}</p>
                {formData.rounds.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRound(index)}
                    className="remove-round-btn"
                  >
                    &times;
                  </button>
                )}
              </div>

              <div className="round-grid">
                <div className="form-group">
                  <label>Round Type</label>
                  <select
                    name="roundType"
                    value={round.roundType}
                    onChange={(e) => handleRoundChange(index, e)}
                    className="form-input"
                    required
                  >
                    <option value="" disabled>Select Round</option>
                    {ROUND_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div className="form-group round-description">
                  <label>Description</label>
                  <ReactQuill
                    theme="snow"
                    value={round.description}
                    onChange={(value) => handleRoundDescriptionChange(value, index)}
                  />
                </div>

                <div className="form-group round-links">
                  <label>Relevant Links (optional)</label>
                  <textarea
                    name="links"
                    value={round.links}
                    onChange={(e) => handleRoundChange(index, e)}
                    rows="3"
                    className="form-input"
                    placeholder="e.g., LeetCode links, article URLs, one per line"
                  ></textarea>
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={addRound} className="add-round-btn">
            + Add Another Round
          </button>
        </div>

        {/* --- Tips --- */}
        <div className="form-section">
          <label htmlFor="tips">Tips / Resources</label>
          <textarea
            name="tips"
            id="tips"
            value={formData.tips}
            onChange={handleChange}
            rows="5"
            className="form-input"
          ></textarea>
        </div>

        {/* --- Actions --- */}
        <div className="form-actions">
          <button type="button" onClick={handleClear} className="btn btn-secondary">
            Clear Form
          </button>
          <button type="submit" className="btn btn-primary">
            Submit Experience
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostExperiencePage;
