import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ExperienceCard from '../components/ExperienceCard.js'; // Use the correct component
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
                // FIX: Update API endpoints to use '/api/experiences'
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
                // FIX: Update the delete URL
                await axios.delete(`http://localhost:5000/api/experiences/${experienceId}`, config);
                
                alert('Experience deleted!');
                setExperiences(experiences.filter(exp => exp._id !== experienceId));
            } catch (error) {
                console.error(`Unable to delete this experience:`, error);
                alert('Failed to delete this experience.');
            }
        }
    };

    if (loading) return <div className="loading-message">Loading profile...</div>;
    if (!user) return <div className="error-message">User not found.</div>;

    const createdDate = new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="profile-page-container">
            <div className="profile-header">
                <div className="profile-avatar"></div>
                <div className="profile-info">
                    <h1>{user.name}</h1>
                    {user.createdAt && <p>Joined on {createdDate}</p>}
                </div>
            </div>
            <div className="posts-list-container">
                <h2 className="posts-list-title">Experiences Shared by {user.name}</h2>
                <div className="posts-list">
                    {experiences.length > 0 ? (
                        experiences.map(experience => (
                            <ExperienceCard 
                                key={experience._id} 
                                experience={experience} 
                                showActions={true} 
                                onDelete={handleDelete} 
                            />
                        ))
                    ) : (
                        <p className="no-posts-message">{user.name} hasn't shared any experiences yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;