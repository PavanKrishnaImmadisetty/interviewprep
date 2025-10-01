import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../Styles/AdminFeedbackPage.css';

const AdminFeedbackPage = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { auth } = useAuth();

    const local = 'http://localhost:5000'
    const global = 'https://interviewprep-mepc.onrender.com'


    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${auth.token}` } };
                const res = await axios.get(`${global}/api/feedbacks`, config);
                setFeedbacks(res.data.feedbacks);
            } catch (error) {
                console.error("Could not fetch feedbacks", error);
            } finally {
                setLoading(false);
            }
        };
        if (auth.token) fetchFeedbacks();
    }, [auth.token]);

    if (loading) return <div>Loading feedbacks...</div>;

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>User Feedbacks</h1>
                <h2>Total Feedbacks ({feedbacks.length})</h2>
            </div>
            <div className="feedback-list">
                {feedbacks.length > 0 ? (
                    feedbacks.map(item => (
                        <div key={item._id} className="feedback-card">
                            <div className="feedback-card-header">
                                <span className="feedback-type">{item.feedbackType}</span>
                                <span className="feedback-meta">
                                    From: {item.author.name} on {new Date(item.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="feedback-message">{item.message}</p>
                        </div>
                    ))
                ) : (
                    <p className="no-pending-message">No feedbacks have been submitted yet.</p>
                )}
            </div>
        </div>
    );
};

export default AdminFeedbackPage;