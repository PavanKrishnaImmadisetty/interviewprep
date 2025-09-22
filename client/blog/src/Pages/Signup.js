import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../Styles/Form.css'; 
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// --- Dropdown Options ---
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
    
    // FIX 1: Initialize startYear and endYear with a single value, not the whole array.
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
            // FIX 2: Create a clean data object to send to the backend.
            const dataToSend = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                branch: formData.branch,
                batch: `${formData.startYear}-${formData.endYear}` // Combine into a batch string
            };

            const res = await axios.post('http://localhost:5000/api/auth/signup', dataToSend);
            
            if (res.data.success) {
                alert('Signup successful! Please log in.');
                navigate('/login');
            } else {
                alert('Signup failed: ' + res.data.message);
            }
        } catch (error) {
            alert('Signup failed: ' + (error.response?.data?.message || 'An error occurred.'));
            console.error(error);
        }
    };

    // In SignupPage.jsx

return (
    <div className="form-container">
        <form onSubmit={handleSubmit} className="form-wrapper">
            <h2 className="form-title">Create an Account</h2>

            <div className="input-group">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-input" required />
            </div>

            <div className="input-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-input" required />
            </div>
            
            {/* --- CORRECTED BATCH & BRANCH LAYOUT --- */}
            
            {/* Batch input group (full width) */}
            <div className="input-group">
                <label className="form-label">Batch</label>
                <div className="batch-container">
                    <select name="startYear" value={formData.startYear} onChange={handleChange} className="form-input">
                        {START_YEAR_OPTIONS.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                    <span className="batch-separator">-</span>
                    <select name="endYear" value={formData.endYear} onChange={handleChange} className="form-input">
                        {END_YEAR_OPTIONS.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                </div>
            </div>

            {/* Branch input group (full width, on the next line) */}
            <div className="input-group">
                <label htmlFor="branch" className="form-label">Branch</label>
                <select id="branch" name="branch" value={formData.branch} onChange={handleChange} className="form-input">
                    {BRANCH_OPTIONS.map(branch => <option key={branch} value={branch}>{branch}</option>)}
                </select>
            </div>

            {/* --- Password Inputs --- */}

            <div className="input-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="password-input-wrapper">
                    <input type={isPasswordVisible ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleChange} className="form-input" required />
                    <div className="password-icon" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                        {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </div>
                </div>
            </div>
            
            <div className="input-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <div className="password-input-wrapper">
                    <input type={isConfirmVisible ? "text" : "password"} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="form-input" required />
                    <div className="password-icon" onClick={() => setIsConfirmVisible(!isConfirmVisible)}>
                        {isConfirmVisible ? <FaEyeSlash /> : <FaEye />}
                    </div>
                </div>
            </div>

            <button type="submit" className="form-button">Sign Up</button>
            <p className="form-text">Already have an account? <Link to='/login' className="form-link">Login</Link></p>
        </form>
    </div>
);
};

export default SignupPage;