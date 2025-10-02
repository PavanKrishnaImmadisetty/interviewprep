import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../Styles/AdminFeedbackPage.css';

const AdminFeedbackPage = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, bug, suggestion, other
    const { auth } = useAuth();

    const local = 'http://localhost:5000'

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${auth.token}` } };
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/feedbacks`, config);
                setFeedbacks(res.data.feedbacks);
            } catch (error) {
                console.error("Could not fetch feedbacks", error);
            } finally {
                setLoading(false);
            }
        };
        if (auth.token) fetchFeedbacks();
    }, [auth.token]);

    // Filter feedbacks based on type
    const filteredFeedbacks = filter === 'all' 
        ? feedbacks 
        : feedbacks.filter(item => item.feedbackType.toLowerCase() === filter);

    // Get feedback type badge class
    const getBadgeClass = (type) => {
        const typeMap = {
            'bug': 'badge-error',
            'suggestion': 'badge-primary',
            'feature': 'badge-success',
            'other': 'badge-gray'
        };
        return typeMap[type.toLowerCase()] || 'badge-gray';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading feedbacks...</p>
            </div>
        );
    }

    return (
        <div className="admin-feedback-page">
            <div className="admin-container">
                
                {/* Header Section */}
                <div className="admin-header">
                    <div className="header-content">
                        <h1 className="page-title">User Feedbacks</h1>
                        <p className="page-subtitle">
                            Monitor and review feedback submitted by users
                        </p>
                    </div>
                    <div className="header-stats">
                        <div className="stat-badge">
                            <span className="stat-number">{feedbacks.length}</span>
                            <span className="stat-label">Total Feedbacks</span>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="filter-section">
                    <div className="filter-buttons">
                        <button 
                            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All ({feedbacks.length})
                        </button>
                        <button 
                            className={`filter-btn ${filter === 'bug' ? 'active' : ''}`}
                            onClick={() => setFilter('bug')}
                        >
                            Bugs ({feedbacks.filter(f => f.feedbackType.toLowerCase() === 'bug').length})
                        </button>
                        <button 
                            className={`filter-btn ${filter === 'suggestion' ? 'active' : ''}`}
                            onClick={() => setFilter('suggestion')}
                        >
                            Suggestions ({feedbacks.filter(f => f.feedbackType.toLowerCase() === 'suggestion').length})
                        </button>
                        <button 
                            className={`filter-btn ${filter === 'other' ? 'active' : ''}`}
                            onClick={() => setFilter('other')}
                        >
                            Other ({feedbacks.filter(f => f.feedbackType.toLowerCase() === 'other').length})
                        </button>
                    </div>
                </div>

                {/* Feedback List */}
                <div className="feedback-list">
                    {filteredFeedbacks.length > 0 ? (
                        filteredFeedbacks.map(item => (
                            <div key={item._id} className="feedback-card">
                                <div className="feedback-card-header">
                                    <div className="feedback-left">
                                        <span className={`feedback-badge ${getBadgeClass(item.feedbackType)}`}>
                                            {item.feedbackType}
                                        </span>
                                        <div className="feedback-author">
                                            <span className="author-name">{item.author.name}</span>
                                        </div>
                                    </div>
                                    <div className="feedback-date">
                                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                                <div className="feedback-body">
                                    <p className="feedback-message">{item.message}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                </svg>
                            </div>
                            <h3>No Feedbacks Found</h3>
                            <p>
                                {filter === 'all' 
                                    ? 'No feedbacks have been submitted yet.'
                                    : `No ${filter} feedbacks available.`
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminFeedbackPage;