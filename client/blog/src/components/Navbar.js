// In Navbar.jsx

import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../Styles/Navbar.css';

const Navbar = () => {
    const { auth, logout } = useAuth();
    console.log(auth)
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate('/login');
    };

    const closeMobileMenu = () => setMenuOpen(false);

    return (
        <header className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                    InterviewPrep
                </Link>

                <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </div>

                {/* All links are now inside this single list */}
                <ul className={menuOpen ? "navbar-menu active" : "navbar-menu"}>
                    {auth.token ? (
                        <>
                            <li className='navbar-item'>
                                <NavLink to='/' className='navbar-link' onClick={closeMobileMenu} end>Home</NavLink>
                            </li>
                            <li className='navbar-item'>
                                <NavLink to='/interviews' className='navbar-link' onClick={closeMobileMenu}>Interviews</NavLink>
                            </li>
                            <li className='navbar-item'>
                                <NavLink to='/feedback' className='navbar-link' onClick={closeMobileMenu}>Feedback</NavLink>
                            </li>
                            <li className="navbar-item">
                                <NavLink to="/create" className="navbar-link" onClick={closeMobileMenu}>Post Experience</NavLink>
                            </li>
                            <li className="navbar-item">
                                <NavLink to={`/profile/${auth.user?._id}`} className="navbar-link" onClick={closeMobileMenu}>Profile</NavLink>
                            </li>
                            <li className="navbar-item">
                                <button onClick={handleLogout} className="navbar-link navbar-logout-button">Logout</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="navbar-item">
                                <NavLink to="/login" className="navbar-link" onClick={closeMobileMenu}>Login</NavLink>
                            </li>
                            <li className="navbar-item">
                                <NavLink to="/signup" className="navbar-link" onClick={closeMobileMenu}>Sign Up</NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </header>
    );
};

export default Navbar;