import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../Styles/FeedBackPage.css';

function FeedbackPage() {
    const [feedbackType, setFeedbackType] = useState('General Comment');
    const [message, setMessage] = useState('');
    const { auth } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) {
            return alert('Please enter your feedback before submitting.');
        }
        try {
            const config = { headers: { Authorization: `Bearer ${auth.token}` } };
            const response = await axios.post(
                'http://localhost:5000/api/feedback',
                { feedbackType, message },
                config
            );
            alert(response.data.message);
            navigate('/'); // Redirect home after successful submission
        } catch (error) {
            alert('Failed to submit feedback. Please try again.');
            console.error('Feedback submission error:', error);
        }
    };

    return (
        <div className="feedback-container">
            <div className="feedback-card">
                <div className="form-header">
                    <h1>Submit Feedback</h1>
                    <p>We'd love to hear your thoughts and suggestions!</p>
                </div>
                <form onSubmit={handleSubmit} className="feedback-form">
                    <div className="form-group">
                        <label htmlFor="feedbackType">Feedback Type</label>
                        <select
                            id="feedbackType"
                            value={feedbackType}
                            onChange={(e) => setFeedbackType(e.target.value)}
                            className="form-input"
                        >
                            <option>General Comment</option>
                            <option>Feature Request</option>
                            <option>Bug Report</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="form-input"
                            rows="8"
                            placeholder="Tell us what's on your mind..."
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit Feedback</button>
                </form>
            </div>
        </div>
    );
}

export default FeedbackPage;