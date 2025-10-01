import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../Styles/AdminTable.css';

const AdminUserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { auth } = useAuth();

    const local = 'http://localhost:5000'
    const global = 'https://interviewprep-mepc.onrender.com'


     useEffect(() => {
        const fetchUsers = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${auth.token}` } };
                const res = await axios.get(`${global}/api/admin/users`, config);
                setUsers(res.data.users);
            } catch (error) {
                console.error("Could not fetch users", error);
            } finally {
                setLoading(false);
            }
        };
        if (auth.token) fetchUsers();
    }, [auth.token]);

    if (loading) return <div>Loading users...</div>;

    const handleRoleChange = async (userId, newRole) => {
        if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            try {
                const config = { headers: { Authorization: `Bearer ${auth.token}` } };
                const res = await axios.put(`${global}/api/admin/users/${userId}/role`, { role: newRole }, config);
                // Update the user's role in the local state for instant UI feedback
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
                await axios.delete(`${global}/api/admin/users/${userId}`, config);
                // Remove the deleted user from the local state
                setUsers(users.filter(user => user._id !== userId));
            } catch (error) {
                alert("Failed to delete user.");
            }
        }
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>User Management</h1>
                <h2>Total Users ({users.length})</h2>
            </div>
            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Batch</th>
                            <th>Actions</th> {/* New Column */}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.batch}</td>
                                {/* --- NEW Actions Cell --- */}
                                <td>
                                    <div className="action-buttons">
                                        {user.role !== 'admin' ? (
                                            <button onClick={() => handleRoleChange(user._id, 'admin')} className="btn-promote">
                                                Promote to Admin
                                            </button>
                                        ) : (
                                            <button onClick={() => handleRoleChange(user._id, 'user')} className="btn-demote" disabled={user._id === auth.user._id}>
                                                Demote to User
                                            </button>
                                        )}
                                        <button onClick={() => handleDeleteUser(user._id)} className="btn-delete" disabled={user._id === auth.user._id}>
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUserManagementPage;