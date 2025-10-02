import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSideBar';
import '../../Styles/AdminLayout.css';

const AdminLayout = () => {
    return (
        <div className="admin-layout-container">
            <AdminSidebar />
            <main className="admin-main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;