import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaRegHeart, FaRegComment, FaRegBookmark,FaBookmark } from 'react-icons/fa';
import axios from 'axios';
import '../Styles/ExperienceCard.css';

const ExperienceCard = ({ experience }) => {
    const { _id, companyName, role, author, appliedAt, verdict, difficulty, createdAt, likes } = experience;
    const { auth,setUser } = useAuth();
    
    // State for the component
    const [likeCount, setLikeCount] = useState(likes.length);
    const [isLiked, setIsLiked] = useState(false);

    
    const [isSaved,setIsSaved] = useState(false)
    
    const postDate = new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // FIX: This useEffect correctly checks if the logged-in user's ID is in the likes array
    useEffect(() => {
        if (auth.user) {
            setIsLiked(likes.includes(auth.user._id));
            setIsSaved((auth.user.saves || []).includes(_id))
        } else {
            setIsLiked(false);
            setIsSaved(false)
        }
    }, [likes, auth.user,_id]);

    // FIX: The complete, corrected handleLike function
    const handleLike = async () => {
        if (!auth.token) {
            return alert('Please log in to like an experience.');
        }

        // Optimistic UI Update for a great user experience
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

        try {
            // FIX: Correct Authorization header syntax
            const config = { headers: { Authorization: `Bearer ${auth.token}` } };
            
            // FIX: Correct API URL
            await axios.put(`http://localhost:5000/api/experiences/${_id}/like`, {}, config);
        } catch (error) {
            console.error("Failed to update like status:", error);
            // If API call fails, revert the UI changes
            setIsLiked(isLiked);
            setLikeCount(likeCount);
            alert("Failed to update like.");
        }
    };

     const handleSave = async () => {
        if (!auth.token) {
            return alert('Please log in to save an experience.');
        }
        setIsSaved(!isSaved); // Optimistic UI update
        try {
            const config = { headers: { Authorization: `Bearer ${auth.token}` } };
            // FIX: Call the correct API route in the user router
            console.log(_id)
            const response = await axios.put(`http://localhost:5000/api/experiences/${_id}/save`, {}, config);
            
            // FIX: Update the global user state with the new user object from the server
            setUser(response.data.user);
        } catch (error) {
            console.error("Failed to update save status:", error);
            setIsSaved(isSaved); // Revert on error
        }
    };
    
   const getVerdictClass = (v) => {
        switch (v) {
            case 'Selected': return 'verdict-selected';
            case 'Not Selected': return 'verdict-not-selected';
            default: return 'verdict-in-progress';
        }
    };

    return (
        <div className="experience-card">
            <div className="card-main-content">
                <div className="card-header">
                    <div className="company-logo">{companyName.charAt(0)}</div>
                    <div className="company-info">
                        <h2 className="company-name">{companyName}</h2>
                        <p className="card-role">Role : {role}</p>
                    </div>
                </div>
                <div className="card-meta">
                    <p className='meta-line'>Posted by {author?.name || 'Anonymous'} | {author?.branch || 'N/A'}</p>
                    <p className='meta-line'>Applied: {appliedAt}</p>
                    <p className='meta-line'>Difficulty : {difficulty}</p>
                </div>
            </div>
            <div className="card-tags">
                <span className={`tag ${getVerdictClass(verdict)}`}>{verdict}</span>
                
            </div>
            <div className="card-footer">
                <div className="footer-actions">
                    <button onClick={handleLike} className={`action-button ${isLiked ? 'liked' : ''}`}>
                        {isLiked ? <FaHeart /> : <FaRegHeart />}
                        <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
                    </button>
                    <button className="action-button">
                        <FaRegComment />
                        <span>Comment</span>
                    </button>
                    <button onClick ={handleSave} className={`action-button ${isSaved ? 'saved' : ''}`} >
                        {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                        <span>{isSaved ? 'Saved' : 'Save'}</span>
                    </button>
                </div>
                <Link to={`/experiences/${_id}`} className="card-readmore">
                    Read More →
                </Link>
            </div>
        </div>
    );
};

export default ExperienceCard;