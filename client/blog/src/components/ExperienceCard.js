import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaRegHeart, FaRegComment, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import axios from 'axios';
import '../Styles/ExperienceCard.css';

const ExperienceCard = ({ experience, showActions }) => {
  const { _id, companyName, role, author, appliedAt, verdict, difficulty, createdAt, likes } = experience;
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const [likeCount, setLikeCount] = useState(likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const postDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const local = 'http://localhost:5000'
  

  useEffect(() => {
    const fetchData = async () => {
      if (auth.user) {
        try {
          const config = { headers: { Authorization: `Bearer ${auth.token}` } };
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/comments/${_id}`, config);
          setCommentCount(res.data.comments?.length || 0);

          const savedArr = auth.user.saves || [];
          setIsSaved(savedArr.some(s => String(s) === String(_id)));

          setIsLiked(likes.some(l => String(l) === String(auth.user._id)));
        } catch (error) {
          console.error("Failed to fetch comments:", error);
        }
      } else {
        setIsLiked(false);
        setIsSaved(false);
        setCommentCount(0);
      }
    };
    fetchData();
  }, [likes, auth.user, _id, auth.token]);

  const handleLike = async () => {
    if (!auth.token) return alert('Please log in to like an experience.');
    const prevLiked = isLiked;
    const prevCount = likeCount;
    setIsLiked(!prevLiked);
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);
    try {
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      await axios.put(`${process.env.REACT_APP_API_URL}/api/experiences/${_id}/like`, {}, config);
    } catch (error) {
      console.error("Failed to update like status:", error);
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
    }
  };

  const handleSave = async () => {
    if (!auth.token) return alert('Please log in to save an experience.');
    const prevIsSaved = isSaved;
    setIsSaved(!prevIsSaved);
    try {
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/experiences/${_id}/save`, {}, config);
      if (response?.data?.user) {
        setAuth(prev => ({ ...prev, user: response.data.user }));
      } else {
        const profileRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/profile`, config);
        if (profileRes?.data?.user) {
          setAuth(prev => ({ ...prev, user: profileRes.data.user }));
        }
      }
    } catch (error) {
      
      setIsSaved(prevIsSaved);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this experience?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/experiences/${_id}`, config);
      alert("Experience deleted successfully!");
      window.location.reload();
    } catch (error) {
      alert("Failed to delete post.");
    }
  };

  const handleUpdate = () => navigate(`/edit-experience/${_id}`);

  const getVerdictClass = (v) => {
    switch (v) {
      case 'Selected': return 'verdict-selected';
      case 'Not Selected': return 'verdict-not-selected';
      default: return 'verdict-in-progress';
    }
  };

  return (
    <article className="experience-card">
      {/* Company Logo */}
      <div className="card-logo-container">
        <div className="company-logo">{companyName.charAt(0)}</div>
      </div>

      <div className="card-content">
        {/* Header Section */}
        <div className="card-header">
          <div className="card-title-section">
            <h2 className="card-company-name">{companyName}</h2>
            <p className="card-role">{role}</p>
          </div>
          <span className={`card-verdict ${getVerdictClass(verdict)}`}>
            {verdict}
          </span>
        </div>

        {/* Meta Information */}
        <div className="card-meta-info">
          <div className="meta-row">
            <span className="meta-label">Posted by</span>
            <span className="meta-value">{author?.name || 'Anonymous'}</span>
            <span className="meta-branch">({author?.branch || 'N/A'})</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Applied</span>
            <span className="meta-value">{appliedAt}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Difficulty</span>
            <span className="meta-difficulty">{difficulty}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Posted on</span>
            <span className="meta-date">{postDate}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <footer className="card-footer">
          <div className="card-actions">
            <button 
              onClick={handleLike} 
              className={`action-btn ${isLiked ? 'action-btn-liked' : ''}`}
              aria-label="Like"
            >
              {isLiked ? <FaHeart /> : <FaRegHeart />}
              <span className="action-count">{likeCount}</span>
            </button>

            <Link 
              to={`/experiences/${_id}`} 
              className="action-btn"
              aria-label="Comments"
            >
              <FaRegComment />
              <span className="action-count">{commentCount}</span>
            </Link>

            <button 
              onClick={handleSave} 
              className={`action-btn ${isSaved ? 'action-btn-saved' : ''}`}
              aria-label="Save"
            >
              {isSaved ? <FaBookmark /> : <FaRegBookmark />}
            </button>
          </div>

          <Link to={`/experiences/${_id}`} className="card-read-more">
            Read More →
          </Link>
        </footer>

        {/* Edit/Delete Actions (Only for Author) */}
        {showActions && auth.user && author?._id === auth.user._id && (
          <div className="card-owner-actions">
            <button onClick={handleUpdate} className="btn-update">
              Edit
            </button>
            <button onClick={handleDelete} className="btn-delete">
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default ExperienceCard;