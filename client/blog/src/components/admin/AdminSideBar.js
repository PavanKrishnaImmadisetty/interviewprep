import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaShieldAlt, FaUsers, FaComments } from 'react-icons/fa';
import '../../Styles/AdminSideBar.css';

const AdminSidebar = () => {
    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar-header">
                <div className="admin-logo">A</div>
                <h2 className="admin-title">Admin Panel</h2>
            </div>
            <nav className="admin-nav">
                <ul className="admin-nav-list">
                    <li className="admin-nav-item">
                        <NavLink to="/admin" end className="admin-nav-link">
                            <FaTachometerAlt className="admin-nav-icon" />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li className="admin-nav-item">
                        <NavLink to="/admin/moderation" className="admin-nav-link">
                            <FaShieldAlt className="admin-nav-icon" />
                            <span>Moderation</span>
                        </NavLink>
                    </li>
                    <li className="admin-nav-item">
                        <NavLink to="/admin/users" className="admin-nav-link">
                            <FaUsers className="admin-nav-icon" />
                            <span>Users</span>
                        </NavLink>
                    </li>
                    <li className="admin-nav-item">
                        <NavLink to="/admin/feedbacks" className="admin-nav-link">
                            <FaComments className="admin-nav-icon" />
                            <span>Feedbacks</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default AdminSidebar;