import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ExperienceForm from '../components/ExperienceForm.js'; // Import the REUSABLE FORM

const EditExperiencePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useAuth();
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                // Fetch the existing data for the specific experience
                const response = await axios.get(`http://localhost:5000/api/experiences/${id}`);
                setInitialData(response.data.experience);
            } catch (error) {
                console.error("Failed to fetch experience for editing:", error);
                navigate('/'); // Redirect home if the experience isn't found
            } finally {
                setLoading(false);
            }
        };
        fetchExperience();
    }, [id, navigate]);

    const handleUpdate = async (formData) => {
        try {
            const config = { headers: { Authorization: `Bearer ${auth.token}` } };
            // Send a PUT request to the update endpoint
            await axios.put(`http://localhost:5000/api/experiences/${id}`, formData, config);
            alert('Experience updated successfully!');
            navigate(`/experiences/${id}`); // Go back to the experience page
        } catch (error) {
            console.error('Error updating experience:', error);
            alert('Failed to update experience.');
        }
    };

    if (loading) return <div className="loading-message">Loading Editor...</div>;

    return (
        <div>
            {/* Render the form, NOT the card, and pass it the data and functions */}
            <ExperienceForm 
                initialData={initialData} 
                onSubmit={handleUpdate} 
                isEditing={true} 
            />
        </div>
    );
};

export default EditExperiencePage;