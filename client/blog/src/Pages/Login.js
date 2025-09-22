import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../Styles/Form.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.js';
import { useNavigate,Link } from 'react-router-dom';

const LoginPage = () => {
    // Fix 4: Removed unnecessary 'name' from initial state
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
    console.log("1. Starting login submission with data:", formData);

    try {
        const res = await axios.post('http://localhost:5000/api/auth/login', formData);
        
        // This log is CRUCIAL. What does the server actually send back?
        console.log("2. API response received:", res.data); 

        if (res.data.success) {
            console.log("3. Login was successful. Calling context's login function...");
            const { token, user } = res.data;

            // This is the function that saves the token.
            login(token, user); 

            console.log("4. Context login function finished. Navigating...");
            alert('Login successful!');
            navigate('/');
        } else {
            console.log("3b. Login failed according to the server's response.");
            alert('Login failed: ' + res.data.message);
        }
    } catch (error) {
        console.error("4b. An error occurred in the API call:", error);
        alert('Login failed. Please check the console for details.');
    }
};

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="form-wrapper">
                {/* ... your JSX remains the same ... */}
                <h2 className="form-title">SignIn to Account</h2>
                <div className="input-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email" id="email" name="email"
                        value={formData.email} onChange={handleChange}
                        className="form-input" required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password" className="form-label">Password</label>
                    <div className="password-input-wrapper">
                        <input
                            type={isVisible ? "text" : "password"}
                            id="password" name="password"
                            value={formData.password} onChange={handleChange}
                            className="form-input form-input-password" required
                        />
                        <div className="password-icon" onClick={() => setIsVisible(!isVisible)}>
                            {isVisible ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>
                </div>
                <button type="submit" className="form-button">
                    Login
                </button>
                <p>if you are a new user? <Link to='/signup'>SignUp</Link></p>
            </form>
        </div>
    );
};

export default LoginPage;