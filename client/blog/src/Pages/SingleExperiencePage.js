import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { useAuth } from '../context/AuthContext';
import { FaBuilding, FaCalendarAlt, FaMapMarkerAlt, FaTrophy, FaListOl } from 'react-icons/fa';
import '../Styles/SingleExperiencePage.css';

const SingleExperiencePage = () => {
  const { id } = useParams();
  const { auth } = useAuth();

  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate()
  const local = 'http://localhost:5000'
  


  // Fetch experience
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${auth.token}` } };
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/experiences/${id}`, config);
        const comments = await axios.get(`${process.env.REACT_APP_API_URL}/api/comments/${id}`,config)
        setExperience(res.data.experience);
        setComments(comments.data.comments)
      } catch (err) {
        setError('Experience not found or an error occurred.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, [id, auth.token]);

  const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return; // Don't submit empty comments

        try {
          
            const config = { headers: { Authorization: `Bearer ${auth.token}` } };
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/comments/${id}`, 
                { content: newComment }, 
                config
            );
            // Add the new comment to the top of the list instantly
            setComments([response.data.comment, ...comments]);
            setNewComment(''); // Clear the input box
        } catch (error) {
            console.error("Failed to post comment:", error);
            alert("Failed to post comment.");
        }
    };

  if (loading) return <div className="loading-message">Loading Experience...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!experience) return <div className="error-message">Experience not found.</div>;

  const isAuthor = auth.user && auth.user._id === experience.author?._id;
  const interviewDate = new Date(experience.interviewDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Verdict tag styles
  const getVerdictClass = (verdict) => {
    switch (verdict) {
      case 'Selected': return 'verdict-selected';
      case 'Not Selected': return 'verdict-not-selected';
      default: return 'verdict-in-progress';
    }
  };

  const handleClick = () =>{
    navigate(`/edit-experience/${experience._id}`);
  }

  return (
    <div className="single-experience-layout">
      {/* --- Main Content --- */}
      <main className="experience-main-content">
        <div className="main-header">
          <p className="main-company-name">{experience.companyName}</p>
          <h1 className="main-role-title">{experience.role}</h1>
          <p className="main-shared-by">
            Shared by {experience.author?.name || 'Anonymous'}
          </p>
        </div>

        <div className="experience-rounds">
          <h2>Interview Rounds</h2>
          {experience.rounds.map((round, index) => (
            <div key={index} className="round-item">
              <h3><FaListOl className="round-icon" /> Round {index + 1}: {round.roundType}</h3>
              <div
                className="round-description"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(round.description) }}
              />
              {round.links && round.links.filter(link => link.trim() !== '').length > 0 && (
                <div className="round-links">
                  <strong>Resources / Links:</strong>
                  <ul>
                    {round.links.filter(link => link.trim() !== '').map((link, i) => (
                      <li key={i}>
                        <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {experience.tips && (
          <div className="experience-tips">
            <h2>Tips & Resources</h2>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(experience.tips) }} />
          </div>
        )}
        <div className="comments-section">
                    <h2>Comments ({(comments || []).length})</h2>

                    {/* Comment Form for logged-in users */}
                    {auth.token ? (
                        <form onSubmit={handleCommentSubmit} className="comment-form">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Leave a comment..."
                                rows="3"
                            ></textarea>
                            <button type="submit">Post Comment</button>
                        </form>
                    ) : (
                        <p className="comment-login-prompt">
                            <Link to="/login">Log in</Link> to leave a comment.
                        </p>
                    )}

                    <div className="comments-list">
                      {(comments || []).map(comment => (
                        <div key={comment._id} className="comment-item">
                          <div className="comment-author-avatar">{comment.author.name.charAt(0)}</div>
                          <div className="comment-content">
                            <p className="comment-author-name">{comment.author.name}</p>
                            <p className="comment-text">{comment.content}</p>

                            {/* Show delete button only if the logged-in user is the comment author */}
                            {auth.user && auth.user._id === comment.author._id && (
                              <button
                                className="delete-comment-btn"
                                onClick={async () => {
                                  if (!window.confirm("Are you sure you want to delete this comment?")) return;

                                  try {
                                    const config = { headers: { Authorization: `Bearer ${auth.token}` } };
                                    await axios.delete(`${process.env.REACT_APP_API_URL}/api/comments/${comment._id}`, config);

                                    // Update state to remove deleted comment
                                    setComments(comments.filter(c => c._id !== comment._id));
                                  } catch (error) {
                                    console.error("Failed to delete comment:", error);
                                    alert("Failed to delete comment.");
                                  }
                                }}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

        </div>
      </main>

      {/* --- Sidebar --- */}
      <aside className="experience-sidebar">
        <div className="sidebar-card">
          {isAuthor && (
            <button className="edit-button" onClick={handleClick}>Edit Experience</button> 
              
            
          )}
          <h3>Details</h3>
          <div className="details-list">
            <div className="detail-item">
              <FaBuilding className="detail-icon" />
              <div>
                <strong>Company</strong>
                <p>{experience.companyName}</p>
              </div>
            </div>
            <div className="detail-item">
              <FaTrophy className="detail-icon" />
              <div>
                <strong>Verdict</strong>
                <p className={`tag ${getVerdictClass(experience.verdict)}`}>
                  {experience.verdict}
                </p>
              </div>
            </div>
            <div className="detail-item">
              <FaCalendarAlt className="detail-icon" />
              <div>
                <strong>Interview Date</strong>
                <p>{interviewDate}</p>
              </div>
            </div>
            <div className="detail-item">
              <FaMapMarkerAlt className="detail-icon" />
              <div>
                <strong>Location</strong>
                <p>{experience.location}</p>
              </div>
            </div>
            <div className="detail-item">
              <strong>Difficulty</strong>
              <p className="tag tag-difficulty">{experience.difficulty}</p>
            </div>
            
          </div>
        </div>

        <div className="sidebar-card">
          <h3>Author</h3>
          <div className="author-details">
            <div className="author-avatar">
              {experience.author?.name?.charAt(0) || 'A'}
            </div>
            <div className="author-info">
              <strong>{experience.author?.name || 'Anonymous'}</strong>
              <p>{experience.author?.branch} | {experience.author?.batch}</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SingleExperiencePage;
