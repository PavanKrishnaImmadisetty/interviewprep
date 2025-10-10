import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoadmapCard from '../components/RoadMapCard'; 
import '../Styles/InterviewPage.css'; 
import { useAuth } from '../context/AuthContext';

const RoadmapsPage = () => {
    // 1. Simplified state for just roadmaps
    const [roadmaps, setRoadmaps] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { auth, setAuth } = useAuth()  

    useEffect(() => {
        const fetchRoadmaps = async () => {
            try {
                // 2. Updated API endpoint to fetch all roadmaps
                const config = { headers : { Authorization : `Bearer ${auth.token}` } };
                const response = await axios.get('http://localhost:5000/api/roadmaps/all',config);
                setRoadmaps(response.data.roadmaps || []);
            } catch (err) {
                setError('Failed to fetch roadmaps.');
                console.error("Failed to fetch roadmaps:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRoadmaps();
    }, []);

    if (loading) return <div className="loading-message">Loading Roadmaps...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <main className="interview-container">
            <header>
                {/* 3. Updated title */}
                <h1 className="interview-title">All Community Roadmaps</h1>
            </header>

            {/* 4. Filter bar removed for simplicity */}

            <section className="posts-list">
                {roadmaps.length > 0 ? (
                    // 5. Mapping over 'roadmaps' and using a new 'RoadmapCard'
                    roadmaps.map(roadmap => (
                        <RoadmapCard key={roadmap._id} roadmap={roadmap} />
                    ))
                ) : (
                    <p className="empty-message">No roadmaps have been shared yet.</p>
                )}
            </section>
        </main>
    );
};

export default RoadmapsPage;