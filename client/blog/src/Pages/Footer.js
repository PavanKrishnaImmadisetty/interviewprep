import React from "react";
import { Link } from "react-router-dom";
import {
  FaTwitter,
  FaGithub,
  FaLinkedin,
  FaEnvelope
} from "react-icons/fa";
import "../Styles/Footer.css";

const Footer = ({ siteName = "InterviewPrep", year = new Date().getFullYear() }) => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand-section">
            <div className="footer-brand-logo">
              {siteName.charAt(0)}
            </div>
            <div className="footer-brand-info">
              <h3 className="footer-brand-name">{siteName}</h3>
              <p className="footer-brand-tagline">Share experiences, help others succeed</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="footer-links-grid">
            <div className="footer-links-column">
              <h4 className="footer-column-title">Product</h4>
              <ul className="footer-links-list">
                <li><Link to="/" className="footer-link">Home</Link></li>
                <li><Link to="/interviews" className="footer-link">Experiences</Link></li>
                <li><Link to="/create" className="footer-link">Share Experience</Link></li>
                <li><Link to="/feedback" className="footer-link">Feedback</Link></li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h4 className="footer-column-title">Company</h4>
              <ul className="footer-links-list">
                <li><Link to="/about" className="footer-link">About</Link></li>
                <li><Link to="/privacy" className="footer-link">Privacy</Link></li>
                <li><Link to="/terms" className="footer-link">Terms</Link></li>
                <li><Link to="/contact" className="footer-link">Contact</Link></li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h4 className="footer-column-title">Connect</h4>
              <div className="footer-social-links">
                <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="footer-social-icon">
                  <FaTwitter />
                </a>
                <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="footer-social-icon">
                  <FaGithub />
                </a>
                <a href="www.linkedin.com/in/pavankrishnaimmadisetty" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="footer-social-icon">
                  <FaLinkedin />
                </a>
                <a href="mailto:pavankrishna1210@gmail.com" aria-label="Email" className="footer-social-icon">
                  <FaEnvelope />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom-section">
          <p className="footer-copyright">© {year} {siteName}. All rights reserved.</p>
          <p className="footer-tagline">Built with care for interview success</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;