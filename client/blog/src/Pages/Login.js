import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../Styles/Form.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.js';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isVisible, setIsVisible] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);

            if (res.data.success) {
                const { token, user } = res.data;
                login(token, user);
                alert('Login successful!');
                navigate('/');
            } else {
                alert('Login failed: ');
            }
        } catch (error) {
            alert('Login failed: ' + (error.response?.data?.message || 'Please check your credentials.'));
            console.error(error);
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-form-card">
                <div className="auth-form-header">
                    <h2 className="auth-form-title">Welcome Back</h2>
                    <p className="auth-form-subtitle">Sign in to your account to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-input-group">
                        <label htmlFor="email" className="auth-label">Email Address</label>
                        <input
                            type="email" 
                            id="email" 
                            name="email"
                            value={formData.email} 
                            onChange={handleChange}
                            className="auth-input"
                            placeholder="your.email@example.com" 
                            required
                        />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="password" className="auth-label">Password</label>
                        <div className="auth-password-wrapper">
                            <input
                                type={isVisible ? "text" : "password"}
                                id="password" 
                                name="password"
                                value={formData.password} 
                                onChange={handleChange}
                                className="auth-input auth-password-input"
                                placeholder="Enter your password" 
                                required
                            />
                            <button 
                                type="button"
                                className="auth-password-toggle" 
                                onClick={() => setIsVisible(!isVisible)}
                            >
                                {isVisible ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="auth-submit-btn">
                        Login
                    </button>

                    <p className="auth-footer-text">
                        New user? <Link to='/signup' className="auth-link">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;