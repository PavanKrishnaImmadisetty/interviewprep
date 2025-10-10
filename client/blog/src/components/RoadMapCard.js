import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaRegHeart, FaRegComment } from 'react-icons/fa';
import axios from 'axios';
import '../Styles/RoadMapCard.css'; // We'll create a new, simpler CSS file for this

const RoadmapCard = ({ roadmap, showActions }) => {
    // 1. Destructure props from the 'roadmap' object
    const { _id, title, author, createdAt, likes = [] } = roadmap;
    const { auth } = useAuth();
    const navigate = useNavigate();

    // State for the component
    const [likeCount, setLikeCount] = useState(likes.length);
    const [isLiked, setIsLiked] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    
    const postDate = new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    useEffect(() => {
        const checkStatusAndFetchComments = async () => {
            // Check like status
            if (auth.user) {
                setIsLiked(likes.includes(auth.user._id));
            } else {
                setIsLiked(false);
            }
            // Fetch comment count
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/comments/${_id}`);
                setCommentCount(res.data.comments?.length || 0);
            } catch (error) {
                console.error("Failed to fetch comment count:", error);
            }
        };
        checkStatusAndFetchComments();
    }, [likes, auth.user, _id]);

    const handleLike = async () => {
        if (!auth.token) return alert('Please log in to like a roadmap.');
        
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

        try {
            const config = { headers: { Authorization: `Bearer ${auth.token}` } };
            // 2. Update API URL to point to roadmaps
            await axios.put(`${process.env.REACT_APP_API_URL}/api/roadmaps/like/${_id}`, {}, config);
        } catch (error) {
            console.error("Failed to update like status:", error);
            // Revert on error
            setIsLiked(isLiked); 
            setLikeCount(likeCount);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this roadmap?")) return;
        try {
            const config = { headers: { Authorization: `Bearer ${auth.token}` } };
            // 3. Update API URL to point to roadmaps
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/roadmaps/${_id}`, config);
            alert("Roadmap deleted successfully!");
            window.location.reload(); // Simple way to refresh the list
        } catch (error) {
            alert("Failed to delete roadmap.");
        }
    };

    const handleUpdate = () => {
        // 4. Update navigate URL to point to roadmaps
        navigate(`/edit-roadmap/${_id}`);
    };

    return (
        <article className="roadmap-card">
            <div className="roadmap-card-content">
                {/* 5. Simplified Header */}
                <header className="roadmap-card-header">
                    <h2 className="roadmap-card-title">{title}</h2>
                </header>

                <div className="roadmap-card-meta-info">
                    <span>Posted by {author?.name || 'Anonymous'}</span>
                    <span>{postDate}</span>
                </div>

                <footer className="roadmap-card-footer">
                    <div className="roadmap-card-actions">
                        <button 
                            onClick={handleLike} 
                            className={`roadmap-action-btn ${isLiked ? 'roadmap-action-btn-liked' : ''}`}
                        >
                            {isLiked ? <FaHeart /> : <FaRegHeart />}
                            <span className="action-count">{likeCount}</span>
                        </button>
                        
                    </div>

                    <Link to={`/roadmaps/${_id}`} className="roadmap-card-read-more">
                        View Roadmap →
                    </Link>
                </footer>

                {showActions && auth.user && author?._id === auth.user._id && (
                    <div className="roadmap-card-owner-actions">
                        <button onClick={handleUpdate} className="roadmap-btn-update">Edit</button>
                        <button onClick={handleDelete} className="roadmap-btn-delete">Delete</button>
                    </div>
                )}
            </div>
        </article>
    );
};

export default RoadmapCard;