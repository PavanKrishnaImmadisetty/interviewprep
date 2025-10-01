import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ExperienceForm from '../components/ExperienceForm.js';
import '../Styles/EditExperiencePage.css';


const EditExperiencePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useAuth();
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);

    const local = 'http://localhost:5000'
    const global = 'https://interviewprep-mepc.onrender.com'


    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${auth.token}` } };
                const response = await axios.get(`${global}/api/experiences/${id}`, config);
                setInitialData(response.data.experience);
            } catch (error) {
                
                alert('Experience not found or you do not have permission to edit it.');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchExperience();
    }, [id, navigate, auth.token]);

    const handleUpdate = async (formData) => {
        try {
            const config = { headers: { Authorization: `Bearer ${auth.token}` } };
            await axios.put(`${global}/api/experiences/${id}`, formData, config);
            alert('Experience updated successfully!');
            navigate(`/experiences/${id}`);
        } catch (error) {
            
            alert('Failed to update experience. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="edit-page-loading">
                <div className="loading-spinner"></div>
                <p>Loading experience data...</p>
            </div>
        );
    }

    return (
        <div className='page-wrapper' >
            
            <div className="edit-experience-page">
                <ExperienceForm 
                    initialData={initialData} 
                    onSubmit={handleUpdate} 
                    isEditing={true} 
                />
            </div>
            
        </div>
        
    );
};

export default EditExperiencePage;