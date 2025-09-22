import React, { useState, useEffect } from 'react';
import axios from 'axios';
// We'll need to create or refactor this component next
import ExperienceCard from '../components/ExperienceCard.js'; 
import '../Styles/HomePage.css'; 
import {useAuth} from '../context/AuthContext.js'

const HomePage = () => {
    // 1. Renamed state from 'posts' to 'experiences' for clarity
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {auth} = useAuth()

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                // 2. Updated the API endpoint to '/api/experiences'
                const config = {headers : {Authorization :`Bearer ${auth.token}` }}
                const response = await axios.get('http://localhost:5000/api/experiences',config);
                console.log(response.data)
                // 3. Using the new 'experiences' key from the API response
                setExperiences(response.data.experiences);
            } catch (err) {
                setError('Failed to fetch experiences. Please try again later.');
                console.error("Failed to fetch experiences:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
    }, []); // The empty array ensures this runs only once on mount

    if (loading) {
        return <div className="loading-message">Loading Experiences...</div>;
    }
    
    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="homepage-container">
            {/* 4. Updated the title to match the new theme */}
            <h1 className="homepage-title">Latest Interview Experiences</h1>
            <div className="posts-list">
                {experiences.length > 0 ? (
                    // 5. Mapping over 'experiences' and using a new 'ExperienceCard' component
                    experiences.map(experience => (
                        <ExperienceCard key={experience._id} experience={experience} />
                    ))
                ) : (
                    // 6. Updated the "no posts" message
                    <p>No experiences have been shared yet. Be the first!</p>
                )}
            </div>
        </div>
    );
};

export default HomePage;