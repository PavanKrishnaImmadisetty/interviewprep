import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './Styles/Global.css';  // Add this FIRST
import './Styles/InterviewPage.css';
// ... other imports

// --- Core Components ---
import Navbar from './components/Navbar.js';
import Footer from './Pages/Footer.js'

// --- Page Components (Consistent Naming) ---
import HomePage from './Pages/HomePage.js';
import LoginPage from './Pages/Login.js';
import SignupPage from './Pages/Signup.js';
import InterviewsPage from './Pages/InterviewPage.js';
import FeedbackPage from './Pages/FeedBackPage.js';
import CreateExperiencePage from './Pages/PostExperience.js';
import SingleExperiencePage from './Pages/SingleExperiencePage.js';
import EditExperiencePage from './Pages/EditExperiencePage.js';
import ProfilePage from './Pages/ProfilePage.js';
import CreateRoadmapPage from './Pages/PostRoadMap.js';
import RoadmapsPage from './Pages/RoadMaps.js';
import SingleRoadmapPage from './Pages/SingleRoadMapPage.js';

// --- Admin Components ---
import AdminLayout from './components/admin/AdminLayout.js';
import AdminRoute from './components/routing/AdminRouting.js';
import AdminDashboardPage from './Pages/AdminDashBoardPage.js';
import AdminModerationPage from './Pages/AdminPage.js';
import AdminUserManagementPage from './Pages/AdminUserPage.js';
import AdminFeedbackPage from './Pages/AdminFeedbackPage.js';


function App() {
    return (
        <>
            <Router>
            <Navbar />
            <Routes>
                {/* --- Public & User Routes --- */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/interviews" element={<InterviewsPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/create" element={<CreateExperiencePage />} />
                <Route path="/experiences/:id" element={<SingleExperiencePage />} />
                <Route path="/edit-experience/:id" element={<EditExperiencePage />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route path="/create-roadmap" element={<CreateRoadmapPage />} />
                <Route path="/roadmaps" element={<RoadmapsPage />} />
                <Route path="/roadmaps/:id" element={<SingleRoadmapPage />} />
                
                {/* --- Admin Protected Routes --- */}
                <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboardPage />} />
                        <Route path="moderation" element={<AdminModerationPage />} />
                        <Route path="users" element={<AdminUserManagementPage />} />
                        <Route path="feedbacks" element={<AdminFeedbackPage />} />
                    </Route>
                </Route>
            </Routes>
            <Footer siteName="InterviewPrep" />
        </Router>

        
        </>
        
    );
}

export default App;