import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ExperienceCard from '../components/ExperienceCard.js';
import '../Styles/ProfilePage.css';
import { useAuth } from '../context/AuthContext.js';

const ProfilePage = () => {
    const { userId } = useParams();
    const { auth } = useAuth();

    const [profileUser, setProfileUser] = useState(null);
    const [experiences, setExperiences] = useState([]);
    const [savedExperiences, setSavedExperiences] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [loading, setLoading] = useState(true);
    const local = 'http://localhost:5000'
    


    const isOwnProfile = auth.user && String(auth.user._id) === String(userId);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const config = auth.token ? { headers: { Authorization: `Bearer ${auth.token}` } } : {};

                // 1. Get user details
                if (isOwnProfile && auth.user) {
                    setProfileUser(auth.user);
                } else {
                    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, config);
                    setProfileUser(res.data.user || res.data);
                }

                // 2. Get user's posts
                const postsRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/experiences/user/${userId}`, config);
                setExperiences(postsRes.data.experiences || []);

                // 3. If own profile, fetch saved experiences
                if (isOwnProfile && auth.user?.saves?.length > 0) {
                    const savedIds = auth.user.saves;
                    const savedRes = await axios.get(
                        `${process.env.REACT_APP_API_URL}/api/experiences?ids=${savedIds.join(',')}`,
                        config
                    );
                    setSavedExperiences(savedRes.data.experiences || []);
                }
            } catch (err) {
                console.error("Failed fetching profile data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId, auth.token, auth.user, isOwnProfile]);

    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

    if (loading) {
        return (
            <div className="profile-loading-container">
                <div className="profile-loading-spinner"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    if (!profileUser) {
        return (
            <div className="profile-error-container">
                <h2>User Not Found</h2>
            </div>
        );
    }

    const createdDate = profileUser.createdAt
        ? new Date(profileUser.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : 'N/A';

    const displayedExperiences = activeTab === 'posts' ? experiences : savedExperiences;

    return (
        <div className="user-profile-container">
            {/* Profile Header Card */}
            <div className="user-profile-header-card">
                <div className="user-profile-cover"></div>
                <div className="user-profile-content">
                    <div className="user-profile-avatar">
                        {getInitials(profileUser.name)}
                    </div>
                    <div className="user-profile-details">
                        <h1 className="user-profile-name">{profileUser.name}</h1>
                        

                        {/* 🔹 Added User Info Section */}
                        <div className="user-profile-extra">
                            <p className="user-profile-branch">Email : {profileUser.email}</p>
                            <p className="user-profile-branch">Branch: {profileUser.branch}</p>
                            <p className="user-profile-batch">Batch: {profileUser.batch}</p>
                        </div>

                        <div className="user-profile-stats">
                            <div className="user-stat-item">
                                <span className="user-stat-value">Experience{experiences.length !== 1 ? 's' : ''} Shared</span>
                                <span  className="user-stat-value">{experiences.length}</span>
                                
                            </div>
                            <div className="user-stat-divider"></div>
                            <div className="user-stat-item">
                                <span className="user-stat-value">Joined</span>
                                <span className="user-stat-label">{createdDate}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="user-profile-tabs-container">
                <button
                    className={`user-tab-button ${activeTab === 'posts' ? 'user-tab-active' : ''}`}
                    onClick={() => setActiveTab('posts')}
                >
                    Posts ({experiences.length})
                </button>
                {isOwnProfile && (
                    <button
                        className={`user-tab-button ${activeTab === 'saves' ? 'user-tab-active' : ''}`}
                        onClick={() => setActiveTab('saves')}
                    >
                        Saved ({savedExperiences.length})
                    </button>
                )}
            </div>

            {/* Experiences List */}
            <div className="user-experiences-list">
                {displayedExperiences.length > 0 ? (
                    displayedExperiences.map((exp) => (
                        <ExperienceCard
                            key={exp._id}
                            experience={exp}
                            showActions={activeTab === 'posts' && isOwnProfile}
                        />
                    ))
                ) : (
                    <div className="user-empty-state-card">
                        <svg className="user-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="user-empty-title">No experiences yet</h3>
                        <p className="user-empty-description">
                            {activeTab === 'posts'
                                ? isOwnProfile 
                                    ? "You haven't shared any experiences yet. Share your first interview experience!"
                                    : `${profileUser.name} hasn't shared any experiences yet.`
                                : "You haven't saved any experiences yet."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
