import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaClock, FaUsers, FaCheckCircle, FaComments } from 'react-icons/fa';
import '../Styles/AdminDashBoard.css';

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { auth } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${auth.token}` } };
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/stats`, config);
                setStats(res.data.stats);
            } catch (error) {
                console.error("Could not fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };
        if (auth.token) fetchStats();
    }, [auth.token]);

    if (loading) {
        return (
            <div className="admin-dashboard-loading">
                <div className="admin-loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard-container">
            <div className="admin-dashboard-header">
                <h1 className="admin-dashboard-title">Dashboard Overview</h1>
                <p className="admin-dashboard-subtitle">Monitor your platform's key metrics</p>
            </div>

            <div className="admin-stats-grid">
                <Link to="/admin/moderation" className="admin-stat-card admin-stat-pending">
                    <div className="admin-stat-icon">
                        <FaClock />
                    </div>
                    <div className="admin-stat-info">
                        <h2 className="admin-stat-value">{stats?.pendingExperiences || 0}</h2>
                        <p className="admin-stat-label">Pending Experiences</p>
                    </div>
                </Link>

                <Link to="/admin/users" className="admin-stat-card admin-stat-users">
                    <div className="admin-stat-icon">
                        <FaUsers />
                    </div>
                    <div className="admin-stat-info">
                        <h2 className="admin-stat-value">{stats?.totalUsers || 0}</h2>
                        <p className="admin-stat-label">Total Users</p>
                    </div>
                </Link>

                <div className="admin-stat-card admin-stat-approved">
                    <div className="admin-stat-icon">
                        <FaCheckCircle />
                    </div>
                    <div className="admin-stat-info">
                        <h2 className="admin-stat-value">{stats?.approvedExperiences || 0}</h2>
                        <p className="admin-stat-label">Approved Experiences</p>
                    </div>
                </div>

                <Link to="/admin/feedbacks" className="admin-stat-card admin-stat-feedback">
                    <div className="admin-stat-icon">
                        <FaComments />
                    </div>
                    <div className="admin-stat-info">
                        <h2 className="admin-stat-value">{stats?.totalFeedbacks || 0}</h2>
                        <p className="admin-stat-label">Feedbacks</p>
                    </div>
                </Link>
            </div>

            <div className="admin-quick-actions">
                <h2 className="admin-section-title">Quick Actions</h2>
                <div className="admin-actions-grid">
                    <Link to="/admin/moderation" className="admin-action-button">
                        <FaClock />
                        <span>Review Pending</span>
                    </Link>
                    <Link to="/admin/users" className="admin-action-button">
                        <FaUsers />
                        <span>Manage Users</span>
                    </Link>
                    <Link to="/admin/feedbacks" className="admin-action-button">
                        <FaComments />
                        <span>View Feedbacks</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;