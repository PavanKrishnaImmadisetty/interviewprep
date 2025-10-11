import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../Styles/PostExperience.css'; // You can reuse your existing form styles

// 1. Simplified initial state for a roadmap
const INITIAL_STATE = {
    title: '',
    description: '',
};

function CreateRoadmapPage() {
    const [formData, setFormData] = useState(INITIAL_STATE);
    const { auth } = useAuth();
    const navigate = useNavigate();

    // 2. Simplified handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDescriptionChange = (value) => {
        setFormData(prev => ({ ...prev, description: value }));
    };

    const handleClear = () => {
        setFormData(INITIAL_STATE);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${auth.token}` } };
            // 3. Updated API endpoint
            await axios.post(`${process.env.REACT_APP_API_URL}/api/roadmaps/create`, formData, config);
            
            alert('Roadmap submitted for approval!');
            handleClear();
            navigate('/'); // Navigate to homepage after submission
        } catch (error) {
            console.error(error);
            alert('Failed to submit roadmap.');
        }
    };

    return (
        <div className="form-container-flex">
            <form onSubmit={handleSubmit} className="experience-form-card">
                <div className="form-header">
                    <h1>Share a Roadmap</h1>
                    <p>Help guide others by sharing a roadmap for a specific role or technology.</p>
                </div>

                {/* --- Simplified Form Fields --- */}
                <div className="form-section">
                    <div className="form-group">
                        <label htmlFor="title">Roadmap Title</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="e.g., Frontend Developer Roadmap for 2025"
                            required
                        />
                    </div>
                </div>

                <div className="form-group round-description">
                    <label>Roadmap Content</label>
                    <ReactQuill
                        theme="snow"
                        value={formData.description}
                        onChange={handleDescriptionChange}
                    />
                </div>

                {/* --- Actions --- */}
                <div className="form-actions">
                    <button type="button" onClick={handleClear} className="btn btn-secondary">
                        Clear Form
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Submit Roadmap
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateRoadmapPage;