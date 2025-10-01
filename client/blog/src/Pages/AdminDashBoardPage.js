// src/pages/AdminDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../Styles/AdminDashBoard.css'; // We'll create this next

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { auth } = useAuth();

    const local = 'http://localhost:5000'
    


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

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
            </div>

            <div className="stats-grid">
                <Link to="/admin/moderation" className="stat-card">
                    <h2>{stats?.pendingExperiences}</h2>
                    <p>Pending Experiences</p>
                </Link>
                <Link to='/admin/users' className="stat-card">
                    <h2>{stats?.totalUsers}</h2>
                    <p>Total Users</p>
                </Link>
                <div className="stat-card">
                    <h2>{stats?.approvedExperiences}</h2>
                    <p>Approved Experiences</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;