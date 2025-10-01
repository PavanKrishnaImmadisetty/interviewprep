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
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="brand-logo">{siteName.charAt(0)}</div>
          <div>
            <h3 className="brand-title">{siteName}</h3>
            <p className="brand-sub">Interview experiences & tips — crowd-driven</p>
          </div>
        </div>

        <nav className="footer-nav">
          <div className="footer-col">
            <h4>Product</h4>
            <Link to="/home">Home</Link>
            <Link to="/interviews">Experiences</Link>
            <Link to="/create">Share Experience</Link>
            <Link to="/feedback">Feedback</Link>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/about">About</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer-col">
            <h4>Connect</h4>
            <div className="social-row">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="mailto:hello@example.com" aria-label="Email"><FaEnvelope /></a>
            </div>
          </div>
        </nav>
      </div>

      <div className="footer-bottom">
        <p>© {year} {siteName}. All rights reserved.</p>
        <p className="small-note">Built with ❤️ • Designed for interview demos</p>
      </div>
    </footer>
  );
};

export default Footer;
