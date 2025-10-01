import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserFriends, FaBuilding, FaClipboardList, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import '../Styles/HomePage.css';
import { useAuth } from '../context/AuthContext.js';

const HomePage = () => {
  const { auth } = useAuth();

  const totalExperiences = 120; 
  const uniqueCompanies = 45;
  const contributors = 60;

  return (
    <div className="homepage-container">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Your Interview Prep Companion
          </div>
          <h1 className="hero-title">
            Learn From Real <span className="highlight">Interview Experiences</span>
          </h1>
          <p className="hero-description">
            Explore authentic stories from students who cracked (and failed) interviews.  
            Save time, learn proven strategies, and prepare smarter for your dream company.
          </p>
          <div className="hero-buttons">
            {auth.user ? (
              <Link to="/interviews" className="btn btn-primary btn-lg">
                Explore Experiences
                <FaArrowRight />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary btn-lg">
                  Get Started
                  <FaArrowRight />
                </Link>
                <Link to="/signup" className="btn btn-secondary btn-lg">
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
          
          {/* Trust Indicators */}
          <div className="hero-stats-inline">
            <div className="stat-inline">
              <FaCheckCircle />
              <span>{totalExperiences}+ Real Experiences</span>
            </div>
            <div className="stat-inline">
              <FaCheckCircle />
              <span>{contributors}+ Active Contributors</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <FaClipboardList className="stat-icon"/>
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{totalExperiences}+</h3>
              <p className="stat-label">Interview Experiences</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <FaBuilding className="stat-icon"/>
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{uniqueCompanies}+</h3>
              <p className="stat-label">Top Companies</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <FaUserFriends className="stat-icon"/>
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{contributors}+</h3>
              <p className="stat-label">Active Contributors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="why-section">
        <div className="why-content">
          <div className="section-header">
            <h2 className="section-title">Why Choose InterviewPrep?</h2>
            <p className="section-subtitle">
              Everything you need to ace your next interview in one place
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">📘</div>
              <h3>Real-World Experiences</h3>
              <p>Access authentic interview stories from students who've been through the process</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h3>Proven Strategies</h3>
              <p>Learn from techniques and approaches that actually worked in real interviews</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">🤝</div>
              <h3>Give Back</h3>
              <p>Share your interview journey and help fellow students succeed</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">🚀</div>
              <h3>Smart Preparation</h3>
              <p>Target your prep with company-specific insights and practice patterns</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Crack Your Dream Interview?</h2>
          <p className="cta-description">
            Join hundreds of students who are preparing smarter with real interview insights
          </p>
          {auth.user 
            ? <Link to="/interviews" className="btn btn-primary btn-lg">
                Explore Now
                <FaArrowRight />
              </Link>
            : <Link to="/login" className="btn btn-primary btn-lg">
                Get Started Free
                <FaArrowRight />
              </Link>
          }
        </div>
      </section>
      
    </div>
  );
};

export default HomePage;