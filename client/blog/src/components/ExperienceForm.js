import React, { useState, useEffect } from 'react';
import '../Styles/ExperienceForm.css';

// --- Constants ---
const Applied_At = ["On-campus", "Off-campus"] 
const VERDICT_OPTIONS = ["Selected", "Not Selected", "In Progress"];
const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];
const ROUND_TYPE_OPTIONS = ["Online Assessment", "Technical Round", "Managerial Round", "HR Round"];

const generateYearOptions = (startOffset = 0, endOffset = 10) => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear + startOffset; i >= currentYear - endOffset; i--) {
        years.push(i);
    }
    return years;
};
const YEAR_OPTIONS = generateYearOptions(6, 10);

const INITIAL_STATE = {
    companyName: '',
    role: 'Software Engineer',
    location: '',
    interviewDate: '',
    appliedAt: 'On-campus',
    verdict: 'Selected',
    difficulty: 'Medium',
    rounds: [{ roundType: 'Online Assessment', description: '' }],
    tips: '',
};

function ExperienceForm({ initialData, onSubmit, isEditing = false }) {
    const [formData, setFormData] = useState(initialData || INITIAL_STATE);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleRoundChange = (index, e) => {
        const { name, value } = e.target;
        const updatedRounds = [...formData.rounds];
        updatedRounds[index][name] = value;
        setFormData(prevData => ({ ...prevData, rounds: updatedRounds }));
    };

    const addRound = () => {
        setFormData(prevData => ({
            ...prevData,
            rounds: [...prevData.rounds, { roundType: 'Technical Round', description: '' }],
        }));
    };

    const removeRound = (index) => {
        const updatedRounds = formData.rounds.filter((_, i) => i !== index);
        setFormData(prevData => ({ ...prevData, rounds: updatedRounds }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const date = formatDateForInput(formData.interviewDate)

    return (
        <div className="form-container">
            <div className="form-card">
                <form onSubmit={handleSubmit} className="experience-form">
                    <div className="form-header">
                        <h1>{isEditing ? 'Edit Your Experience' : 'Share Your Interview Experience'}</h1>
                        <p>{isEditing ? 'Update the details of your interview process.' : 'Help the community by sharing your journey!'}</p>
                    </div>

                    <div className="form-section">
                        <h2>Basic Information</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="companyName">Company Name *</label>
                                <input 
                                    type="text" 
                                    name="companyName" 
                                    id="companyName" 
                                    value={formData.companyName} 
                                    onChange={handleChange} 
                                    className="form-input" 
                                    placeholder="e.g., Google, Microsoft" 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="role">Role / Position *</label>
                                <input 
                                    type="text" 
                                    name="role" 
                                    id="role" 
                                    value={formData.role} 
                                    onChange={handleChange} 
                                    className="form-input" 
                                    placeholder="e.g., Software Engineer" 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="location">Location</label>
                                <input 
                                    type="text" 
                                    name="location" 
                                    id="location" 
                                    value={formData.location} 
                                    onChange={handleChange} 
                                    className="form-input" 
                                    placeholder="e.g., Bangalore, Remote" 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="interviewDate">Interview Date *</label>
                                <input 
                                    type="date" 
                                    name="interviewDate" 
                                    id="interviewDate" 
                                    value={date} 
                                    onChange={handleChange} 
                                    className="form-input" 
                                    required 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Interview Details</h2>
                        <div className="form-grid-three">
                            <div className="form-group">
                                <label htmlFor="appliedAt">Applied At *</label>
                                <select 
                                    name="appliedAt" 
                                    id="appliedAt" 
                                    value={formData.appliedAt} 
                                    onChange={handleChange} 
                                    className="form-input"
                                >
                                    {Applied_At.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="verdict">Verdict *</label>
                                <select 
                                    name="verdict" 
                                    id="verdict" 
                                    value={formData.verdict} 
                                    onChange={handleChange} 
                                    className="form-input" 
                                    required
                                >
                                    {VERDICT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="difficulty">Overall Difficulty *</label>
                                <select 
                                    name="difficulty" 
                                    id="difficulty" 
                                    value={formData.difficulty} 
                                    onChange={handleChange} 
                                    className="form-input"
                                >
                                    {DIFFICULTY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="section-header">
                            <h2>Interview Rounds</h2>
                            <p className="section-description">Describe each round of your interview process</p>
                        </div>
                        {formData.rounds.map((round, index) => (
                            <div key={index} className="round-card">
                                <div className="round-header">
                                    <span className="round-number">Round {index + 1}</span>
                                    {formData.rounds.length > 1 && (
                                        <button 
                                            type="button" 
                                            onClick={() => removeRound(index)} 
                                            className="remove-round-btn"
                                            title="Remove this round"
                                        >
                                            &times;
                                        </button>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`roundType-${index}`}>Round Type</label>
                                    <select 
                                        name="roundType" 
                                        id={`roundType-${index}`} 
                                        value={round.roundType} 
                                        onChange={(e) => handleRoundChange(index, e)} 
                                        className="form-input"
                                    >
                                        {ROUND_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`description-${index}`}>Description</label>
                                    <textarea 
                                        name="description" 
                                        id={`description-${index}`} 
                                        value={round.description} 
                                        onChange={(e) => handleRoundChange(index, e)} 
                                        rows="4" 
                                        className="form-input"
                                        placeholder="Describe what happened in this round, questions asked, topics covered..."
                                    ></textarea>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addRound} className="add-round-btn">
                            + Add Another Round
                        </button>
                    </div>
                    
                    <div className="form-section">
                        <h2>Additional Tips & Resources</h2>
                        <div className="form-group">
                            <label htmlFor="tips">Share your preparation tips, helpful resources, or advice</label>
                            <textarea 
                                name="tips" 
                                id="tips" 
                                value={formData.tips} 
                                onChange={handleChange} 
                                rows="5" 
                                className="form-input"
                                placeholder="Share any preparation tips, resources, study materials, or advice that helped you..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            {isEditing ? 'Update Experience' : 'Submit Experience'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ExperienceForm;