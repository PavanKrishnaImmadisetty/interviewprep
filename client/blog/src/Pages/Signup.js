import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../Styles/Form.css'; 
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const BRANCH_OPTIONS = ["CSE", "CSD", "CSM", "ECE", "IT", "Mechanical", "Civil", "Other"];

const generateYearOptions = (startOffset = 0, endOffset = 10) => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear + startOffset; i >= currentYear - endOffset; i--) {
        years.push(i);
    }
    return years;
};

const START_YEAR_OPTIONS = generateYearOptions(0, 10);
const END_YEAR_OPTIONS = generateYearOptions(6, 0);

const SignupPage = () => {
    const currentYear = new Date().getFullYear();
    
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '',
        startYear: currentYear,
        endYear: currentYear + 4,
        branch: BRANCH_OPTIONS[0],
    });

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const navigate = useNavigate();

    const local = 'http://localhost:5000'
    const global = 'https://interviewprep-mepc.onrender.com'


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const dataToSend = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                branch: formData.branch,
                batch: `${formData.startYear}-${formData.endYear}`
            };

            const res = await axios.post(`${global}/api/auth/signup`, dataToSend);
            
            if (res.data.success) {
                alert('Signup successful! Please log in.');
                navigate('/login');
            } else {
                alert('Signup failed: ');
            }
        } catch (error) {
            alert('Signup failed: ' + (error.response?.data?.message || 'An error occurred.'));
            console.error(error);
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-form-card">
                <div className="auth-form-header">
                    <h2 className="auth-form-title">Create an Account</h2>
                    <p className="auth-form-subtitle">Join the community and share your experiences</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-input-group">
                        <label htmlFor="name" className="auth-label">Full Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            className="auth-input" 
                            placeholder="Enter your full name"
                            required 
                        />
                    </div>

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
                        <label className="auth-label">Batch</label>
                        <div className="auth-batch-container">
                            <select 
                                name="startYear" 
                                value={formData.startYear} 
                                onChange={handleChange} 
                                className="auth-input auth-batch-select"
                            >
                                {START_YEAR_OPTIONS.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                            <span className="auth-batch-separator">to</span>
                            <select 
                                name="endYear" 
                                value={formData.endYear} 
                                onChange={handleChange} 
                                className="auth-input auth-batch-select"
                            >
                                {END_YEAR_OPTIONS.map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="branch" className="auth-label">Branch</label>
                        <select 
                            id="branch" 
                            name="branch" 
                            value={formData.branch} 
                            onChange={handleChange} 
                            className="auth-input"
                        >
                            {BRANCH_OPTIONS.map(branch => <option key={branch} value={branch}>{branch}</option>)}
                        </select>
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="password" className="auth-label">Password</label>
                        <div className="auth-password-wrapper">
                            <input 
                                type={isPasswordVisible ? "text" : "password"} 
                                id="password" 
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                className="auth-input auth-password-input" 
                                placeholder="Create a strong password"
                                required 
                            />
                            <button 
                                type="button"
                                className="auth-password-toggle" 
                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                            >
                                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="auth-input-group">
                        <label htmlFor="confirmPassword" className="auth-label">Confirm Password</label>
                        <div className="auth-password-wrapper">
                            <input 
                                type={isConfirmVisible ? "text" : "password"} 
                                id="confirmPassword" 
                                name="confirmPassword" 
                                value={formData.confirmPassword} 
                                onChange={handleChange} 
                                className="auth-input auth-password-input" 
                                placeholder="Re-enter your password"
                                required 
                            />
                            <button 
                                type="button"
                                className="auth-password-toggle" 
                                onClick={() => setIsConfirmVisible(!isConfirmVisible)}
                            >
                                {isConfirmVisible ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="auth-submit-btn">
                        Sign Up
                    </button>

                    <p className="auth-footer-text">
                        Already have an account? <Link to='/login' className="auth-link">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;