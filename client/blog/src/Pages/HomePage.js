import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExperienceCard from '../components/ExperienceCard.js'; 
import '../Styles/HomePage.css'; 
import { useAuth } from '../context/AuthContext.js';
import { Link } from 'react-router-dom';
import { FaUserFriends, FaBuilding, FaClipboardList } from "react-icons/fa";

const HomePage = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${auth.token}` } };
        const response = await axios.get('http://localhost:5000/api/experiences', config);
        setExperiences(response.data.experiences);
      } catch (err) {
        setError('Failed to fetch experiences. Please try again later.');
        console.error("Failed to fetch experiences:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, [auth.token]);

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const totalExperiences = experiences.length;
  const uniqueCompanies = new Set(experiences.map(exp => exp.companyName)).size;
  const contributors = new Set(experiences.map(exp => exp.author?.name || 'Anonymous')).size;

  const featuredExperiences = experiences.slice(0, 3);

  return (
    <div className="homepage-container">
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <h1>Learn From Real Interviews 🚀</h1>
          <p>
            Explore real stories from students who cracked (and failed) interviews.  
            Save time, learn strategies, and prepare smarter for your dream company.
          </p>
          <div className="hero-buttons">
            <Link to="/interviews" className="cta-button">Explore Experiences</Link>
            {!auth.user && <Link to="/login" className="cta-button secondary">Login / Signup</Link>}
          </div>
        </div>
        <div className="hero-illustration">
          <img src="/assets/hero-illustration.svg" alt="Interview prep" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-card">
          <FaClipboardList className="stat-icon"/>
          <h2>{totalExperiences}+</h2>
          <p>Experiences</p>
        </div>
        <div className="stat-card">
          <FaBuilding className="stat-icon"/>
          <h2>{uniqueCompanies}+</h2>
          <p>Companies</p>
        </div>
        <div className="stat-card">
          <FaUserFriends className="stat-icon"/>
          <h2>{contributors}+</h2>
          <p>Contributors</p>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured-section">
        <h2>Latest Experiences ✨</h2>
        <div className="posts-list">
          {featuredExperiences.length > 0 ? (
            featuredExperiences.map(experience => (
              <ExperienceCard key={experience._id} experience={experience} />
            ))
          ) : (
            <p>No experiences yet. Be the first to share!</p>
          )}
        </div>
        <div className="view-all-btn">
          <Link to="/interviews">View All →</Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-banner">
        <h2>Ready to crack your interviews?</h2>
        <p>Join the community and access exclusive interview insights from real students.</p>
        <Link to="/login" className="cta-button">Get Started</Link>
      </section>
    </div>
  );
};

export default HomePage;
