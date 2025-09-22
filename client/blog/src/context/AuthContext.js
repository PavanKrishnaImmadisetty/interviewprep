import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: localStorage.getItem('token') || null,
        user: null  
    });

    // **NEW**: useEffect to fetch user data on initial load
    useEffect(() => {
        const fetchUserProfile = async () => {
            // Only run if a token exists
            if (auth.token) {
                try {
                    const config = {
                        headers: { Authorization: `Bearer ${auth.token}` }
                    };
                    // Fetch user profile from the new backend route
                    const response = await axios.get('http://localhost:5000/api/auth/profile', config);
                    
                    // Update the user in our state
                    setAuth(prevAuth => ({ ...prevAuth, user: response.data.user }));

                } catch (error) {
                    // If the token is invalid or expired, log the user out
                    console.error("Token validation failed, logging out.");
                    logout();
                }
            }
        };

        fetchUserProfile();
    }, [auth.token]); // This effect depends on the token

    const login = (token, user) => {
        localStorage.setItem('token', token);
        // **FIX**: setAuth expects a single object
        setAuth({ token, user });
    };

    const logout = () => {
        // **FIX**: Also remove the token from localStorage
        localStorage.removeItem('token');
        setAuth({ token: null, user: null });
    };

    const value = {
        auth,
        login,
        logout    
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};