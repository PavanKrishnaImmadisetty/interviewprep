import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ExperienceCard from '../components/ExperienceCard.js';
import '../Styles/ProfilePage.css';
import { useAuth } from '../context/AuthContext.js';

const ProfilePage = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const { auth } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {headers : {Authorization : `Bearer ${auth.token}`}}
                const [userResponse, experiencesResponse] = await Promise.all([
                    axios.get(`http://localhost:5000/api/auth/${userId}`),
                    axios.get(`http://localhost:5000/api/experiences/user/${userId}`,config)
                ]);
                
                setUser(userResponse.data.user);
                setExperiences(experiencesResponse.data.experiences);
            } catch (error) {
                console.error("Failed to fetch profile data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    const handleDelete = async (experienceId) => {
        if (window.confirm("Are you sure you want to delete this experience?")) {
            try {
                const config = { headers: { Authorization: `Bearer ${auth.token}` } };
                await axios.delete(`http://localhost:5000/api/experiences/${experienceId}`, config);
                
                alert('Experience deleted!');
                setExperiences(experiences.filter(exp => exp._id !== experienceId));
            } catch (error) {
                console.error(`Unable to delete this experience:`, error);
                alert('Failed to delete this experience.');
            }
        }
    };

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading profile...</p>
            </div>
        );
    }
    
    if (!user) {
        return (
            <div className="error-container">
                <div className="error-content">
                    <h2>User Not Found</h2>
                    <p>The profile you're looking for doesn't exist or has been removed.</p>
                </div>
            </div>
        );
    }

    const createdDate = new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="profile-page-container">
            {/* Professional Header Section */}
            <div className="profile-header-section">
                <div className="profile-header">
                    <div className="profile-avatar">
                        <span className="avatar-initials">{getInitials(user.name)}</span>
                    </div>
                    <div className="profile-info">
                        <h1 className="profile-name">{user.name}</h1>
                        <div className="profile-meta">
                            <span className="meta-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                                </svg>
                                Joined {createdDate}
                            </span>
                            <span className="meta-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                                {experiences.length} {experiences.length === 1 ? 'Experience' : 'Experiences'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Experiences Section */}
            <div className="experiences-section">
                <div className="section-header">
                    <h2 className="section-title">Interview Experiences</h2>
                    <p className="section-description">
                        Professional insights and interview experiences shared by {user.name}
                    </p>
                </div>
                
                <div className="experiences-list">
                    {experiences.length > 0 ? (
                        experiences.map((experience) => (
                            <div key={experience._id} className="experience-item">
                                <ExperienceCard 
                                    experience={experience} 
                                    showActions={true} 
                                    onDelete={handleDelete} 
                                />
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <div className="empty-content">
                                <div className="empty-icon">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                        <polyline points="14,2 14,8 20,8"/>
                                        <line x1="16" y1="13" x2="8" y2="13"/>
                                        <line x1="16" y1="17" x2="8" y2="17"/>
                                        <polyline points="10,9 9,9 8,9"/>
                                    </svg>
                                </div>
                                <h3>No Experiences Shared</h3>
                                <p>{user.name} hasn't shared any interview experiences yet.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;