import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

  // Fetch experience
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${auth.token}` } };
        const res = await axios.get(`http://localhost:5000/api/experiences/${id}`, config);
        setExperience(res.data.experience);
      } catch (err) {
        setError('Experience not found or an error occurred.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, [id, auth.token]);

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
              {round.links && (
                <div className="round-links">
                  <strong>Resources / Links:</strong>
                  <ul>
                    {round.links.split('\n').map((link, i) => (
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
      </main>

      {/* --- Sidebar --- */}
      <aside className="experience-sidebar">
        <div className="sidebar-card">
          {isAuthor && (
            <Link to={`/edit-experience/${experience._id}`} className="edit-button">
              Edit Experience
            </Link>
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
