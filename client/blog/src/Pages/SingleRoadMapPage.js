import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { useAuth } from '../context/AuthContext';
import '../Styles/SingleRoadmapPage.css';

const SingleRoadmapPage = () => {
    const { id } = useParams();
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                // Simplified to fetch only the roadmap data
                const config = { headers: { Authorization: `Bearer ${auth.token}` } };
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/roadmaps/${id}`,config);
                setRoadmap(response.data.roadmap);
            } catch (err) {
                console.error('Failed to fetch roadmap data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRoadmap();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this roadmap?")) {
            try {
                const config = { headers: { Authorization: `Bearer ${auth.token}` } };
                await axios.delete(`http://localhost:5000/api/roadmaps/${id}`, config);
                alert("Roadmap deleted successfully!");
                navigate('/roadmaps'); // Navigate to the main roadmaps page
            } catch (error) {
                alert("Failed to delete roadmap.");
            }
        }
    };

    if (loading) return <div className="loading-message">Loading Roadmap...</div>;
    if (!roadmap) return <div className="error-message">Roadmap not found.</div>;

    const isAuthor = auth.user && auth.user._id === roadmap.author?._id;
    const postDate = new Date(roadmap.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="roadmap-page-container">
            <article className="roadmap-content">
                <header className="roadmap-header">
                    <h1>{roadmap.title}</h1>
                    <p>Published by {roadmap.author?.name || 'Anonymous'} on {postDate}</p>
                    {isAuthor && (
                        <div className="roadmap-actions">
                            <Link to={`/edit-roadmap/${roadmap._id}`} className="btn-edit">Edit Roadmap</Link>
                            <button onClick={handleDelete} className="btn-delete">Delete Roadmap</button>
                        </div>
                    )}
                </header>

                <div
                    className="roadmap-body"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(roadmap.description) }}
                />
            </article>
        </div>
    );
};

export default SingleRoadmapPage;