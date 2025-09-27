import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../Styles/AdminSideBar.css';

const AdminSidebar = () => {
    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <h2>Admin Panel</h2>
            </div>
            <ul className="sidebar-nav">
                <li>
                    <NavLink to="/admin" end>Dashboard</NavLink>
                </li>
                <li>
                    <NavLink to="/admin/moderation">Moderation</NavLink>
                </li>
                <li>
                    <NavLink to="/admin/users">Users</NavLink>
                </li>
            </ul>
        </aside>
    );
};

export default AdminSidebar;