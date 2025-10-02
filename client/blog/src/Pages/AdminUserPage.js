import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../Styles/AdminTable.css';

const AdminUserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const { auth } = useAuth();

    const local = 'http://localhost:5000'

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${auth.token}` } };
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/users`, config);
                setUsers(res.data.users);
            } catch (error) {
                console.error("Could not fetch users", error);
            } finally {
                setLoading(false);
            }
        };
        if (auth.token) fetchUsers();
    }, [auth.token]);

    const handleRoleChange = async (userId, newRole) => {
        if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            try {
                const config = { headers: { Authorization: `Bearer ${auth.token}` } };
                const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/users/${userId}/role`, { role: newRole }, config);
                setUsers(users.map(user => user._id === userId ? res.data.user : user));
            } catch (error) {
                alert("Failed to update role.");
            }
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to PERMANENTLY delete this user?")) {
            try {
                const config = { headers: { Authorization: `Bearer ${auth.token}` } };
                await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/users/${userId}`, config);
                setUsers(users.filter(user => user._id !== userId));
            } catch (error) {
                alert("Failed to delete user.");
            }
        }
    };

    // Filter and search users
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    // Get role badge class
    const getRoleBadgeClass = (role) => {
        return role === 'admin' ? 'role-badge-admin' : 'role-badge-user';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading users...</p>
            </div>
        );
    }

    return (
        <div className="admin-users-page">
            <div className="admin-container">
                
                {/* Header Section */}
                <div className="admin-header">
                    <div className="header-content">
                        <h1 className="page-title">User Management</h1>
                        <p className="page-subtitle">
                            Manage user roles and permissions
                        </p>
                    </div>
                    <div className="header-stats">
                        <div className="stat-badge">
                            <span className="stat-number">{users.length}</span>
                            <span className="stat-label">Total Users</span>
                        </div>
                        <div className="stat-badge stat-badge-secondary">
                            <span className="stat-number">{users.filter(u => u.role === 'admin').length}</span>
                            <span className="stat-label">Admins</span>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="controls-section">
                    <div className="search-box">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="filter-buttons">
                        <button 
                            className={`filter-btn ${filterRole === 'all' ? 'active' : ''}`}
                            onClick={() => setFilterRole('all')}
                        >
                            All ({users.length})
                        </button>
                        <button 
                            className={`filter-btn ${filterRole === 'admin' ? 'active' : ''}`}
                            onClick={() => setFilterRole('admin')}
                        >
                            Admins ({users.filter(u => u.role === 'admin').length})
                        </button>
                        <button 
                            className={`filter-btn ${filterRole === 'user' ? 'active' : ''}`}
                            onClick={() => setFilterRole('user')}
                        >
                            Users ({users.filter(u => u.role === 'user').length})
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="table-wrapper">
                    {filteredUsers.length > 0 ? (
                        <div className="table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Batch</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(user => (
                                        <tr key={user._id}>
                                            <td>
                                                <div className="user-cell">
                                                    <div className="user-avatar">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="user-name">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="email-cell">{user.email}</td>
                                            <td>
                                                <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="batch-cell">{user.batch}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    {user.role !== 'admin' ? (
                                                        <button 
                                                            onClick={() => handleRoleChange(user._id, 'admin')} 
                                                            className="btn-action btn-promote"
                                                            title="Promote to Admin"
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                                                            </svg>
                                                            Promote
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleRoleChange(user._id, 'user')} 
                                                            className="btn-action btn-demote"
                                                            disabled={user._id === auth.user._id}
                                                            title="Demote to User"
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M12 22L8.91 15.74L2 14.73L7 9.86L5.82 2.98L12 6.23L18.18 2.98L17 9.86L22 14.73L15.09 15.74L12 22Z"/>
                                                            </svg>
                                                            Demote
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleDeleteUser(user._id)} 
                                                        className="btn-action btn-delete"
                                                        disabled={user._id === auth.user._id}
                                                        title="Delete User"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polyline points="3 6 5 6 21 6"/>
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                                        </svg>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>
                            </div>
                            <h3>No Users Found</h3>
                            <p>
                                {searchTerm 
                                    ? `No users match your search "${searchTerm}"`
                                    : 'No users available in this category'
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminUserManagementPage;