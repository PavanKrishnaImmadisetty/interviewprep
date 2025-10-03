import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaExternalLinkAlt, FaCheckCircle, FaUser, FaBuilding } from 'react-icons/fa';
import '../Styles/AdminPage.css';

function AdminPage() {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const { auth } = useAuth();

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${auth.token}` } };
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/pending`, config);
                setPending(res.data.experiences);
            } catch (error) {
                console.error("Could not fetch pending experiences", error);
            } finally {
                setLoading(false);
            }
        };
        if (auth.token) fetchPending();
    }, [auth.token]);

    const handleApprove = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${auth.token}` } };
            await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/approve/${id}`, {}, config);
            setPending(pending.filter(exp => exp._id !== id));
        } catch (error) {
            alert("Failed to approve experience.");
        }
    };

    if (loading) {
        return (
            <div className="admin-moderation-loading">
                <div className="admin-moderation-spinner"></div>
                <p>Loading pending experiences...</p>
            </div>
        );
    }

    return (
        <div className="admin-moderation-container">
            <div className="admin-moderation-header">
                <div>
                    <h1 className="admin-moderation-title">Moderation Queue</h1>
                    <p className="admin-moderation-subtitle">
                        Review and approve pending interview experiences
                    </p>
                </div>
                <div className="admin-moderation-badge">
                    {pending.length} Pending
                </div>
            </div>

            <div className="admin-pending-list">
                {pending.length > 0 ? (
                    pending.map(exp => (
                        <div key={exp._id} className="admin-pending-card">
                            <div className="admin-pending-content">
                                <div className="admin-pending-main">
                                    <div className="admin-pending-company">
                                        <FaBuilding className="admin-pending-icon" />
                                        <h3 className="admin-pending-company-name">
                                            {exp.companyName}
                                        </h3>
                                    </div>
                                    <p className="admin-pending-role">{exp.role}</p>
                                    <div className="admin-pending-author">
                                        <FaUser className="admin-pending-author-icon" />
                                        <span>Posted by {exp.author?.name || 'Unknown'}</span>
                                    </div>
                                </div>
                                <div className="admin-pending-actions">
                                    <a 
                                        href={`/experiences/${exp._id}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="admin-btn admin-btn-review"
                                    >
                                        <FaExternalLinkAlt />
                                        <span>Review</span>
                                    </a>
                                    <button 
                                        onClick={() => handleApprove(exp._id)} 
                                        className="admin-btn admin-btn-approve"
                                    >
                                        <FaCheckCircle />
                                        <span>Approve</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="admin-empty-state">
                        <div className="admin-empty-icon">
                            <FaCheckCircle />
                        </div>
                        <h3 className="admin-empty-title">All Clear!</h3>
                        <p className="admin-empty-description">
                            No experiences are currently pending approval.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminPage;