import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaCommentDots, FaUserShield } from 'react-icons/fa';
import '../Styles/Navbar.css';

const Navbar = () => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        setDropdownOpen(false);
        navigate('/');
    };

    const closeMobileMenu = () => setMenuOpen(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    const handleDropdownItemClick = () => {
        setDropdownOpen(false);
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (auth.user?.name) {
            const names = auth.user.name.split(' ');
            if (names.length >= 2) {
                return `${names[0][0]}${names[1][0]}`.toUpperCase();
            }
            return names[0][0].toUpperCase();
        }
        return 'U';
    };

    return (
        <header className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                    InterviewPrep
                </Link>

                <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </div>

                <ul className={menuOpen ? "navbar-menu active" : "navbar-menu"}>
                    {auth.token ? (
                        <>
                            <li className='navbar-item'>
                                <NavLink to='/' className='navbar-link' onClick={closeMobileMenu} end>
                                    Home
                                </NavLink>
                            </li>
                            <li className='navbar-item'>
                                <NavLink to='/interviews' className='navbar-link' onClick={closeMobileMenu}>
                                    Interviews
                                </NavLink>
                            </li>
                            <li className="navbar-item">
                                <NavLink to="/create" className="navbar-link" onClick={closeMobileMenu}>
                                    Post Experience
                                </NavLink>
                            </li>

                            {/* Profile Dropdown */}
                            <li className="navbar-item profile-dropdown-container" ref={dropdownRef}>
                                <button 
                                    className="profile-avatar" 
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    aria-label="User menu"
                                >
                                    {getUserInitials()}
                                </button>

                                {dropdownOpen && (
                                    <div className="profile-dropdown">
                                        <div className="dropdown-header">
                                            <div className="dropdown-avatar">
                                                {getUserInitials()}
                                            </div>
                                            <div className="dropdown-user-info">
                                                <p className="dropdown-username">{auth.user?.name || 'User'}</p>
                                                <p className="dropdown-email">{auth.user?.email || ''}</p>
                                            </div>
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <ul className="dropdown-menu">
                                            <li>
                                                <Link 
                                                    to={`/profile/${auth.user?._id}`} 
                                                    className="dropdown-item"
                                                    onClick={handleDropdownItemClick}
                                                >
                                                    <FaUser className="dropdown-icon" />
                                                    Profile
                                                </Link>
                                            </li>
                                            <li>
                                                <Link 
                                                    to="/feedback" 
                                                    className="dropdown-item"
                                                    onClick={handleDropdownItemClick}
                                                >
                                                    <FaCommentDots className="dropdown-icon" />
                                                    Feedback
                                                </Link>
                                            </li>
                                            {auth.user?.role === 'admin' && (
                                                <li>
                                                    <Link 
                                                        to="/admin" 
                                                        className="dropdown-item"
                                                        onClick={handleDropdownItemClick}
                                                    >
                                                        <FaUserShield className="dropdown-icon" />
                                                        Admin Panel
                                                    </Link>
                                                </li>
                                            )}
                                        </ul>
                                        <div className="dropdown-divider"></div>
                                        <button 
                                            onClick={handleLogout} 
                                            className="dropdown-item dropdown-logout"
                                        >
                                            <FaSignOutAlt className="dropdown-icon" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="navbar-item">
                                <NavLink to="/login" className="navbar-link" onClick={closeMobileMenu}>
                                    Login
                                </NavLink>
                            </li>
                            <li className="navbar-item">
                                <NavLink to="/signup" className="navbar-link navbar-link-signup" onClick={closeMobileMenu}>
                                    Sign Up
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </header>
    );
};

export default Navbar;