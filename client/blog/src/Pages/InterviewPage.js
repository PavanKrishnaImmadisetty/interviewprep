// src/pages/InterviewsPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExperienceCard from '../components/ExperienceCard';
import FilterBar from '../components/FilterBar'; 
import '../Styles/HomePage.css';
import {useAuth} from '../context/AuthContext.js'

const INITIAL_FILTERS = {
    sortBy: 'Recent',
    verdict: 'All',
    company: 'All',
};

const InterviewsPage = () => {
    const [allExperiences, setAllExperiences] = useState([]);
    const [filteredExperiences, setFilteredExperiences] = useState([]);
    const [companyOptions, setCompanyOptions] = useState([]);
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [loading, setLoading] = useState(true);
    const {auth} = useAuth()

    // 1. Fetch all data once on initial load
    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const config = {headers : {Authorization : `Bearer ${auth.token}`}}
                const response = await axios.get('http://localhost:5000/api/experiences',config);
                const experiences = response.data.experiences;
                setAllExperiences(experiences);
                setFilteredExperiences(experiences); // Initially, show all

                // Create a unique list of company names for the dropdown
                const uniqueCompanies = [...new Set(experiences.map(exp => exp.companyName))];
                setCompanyOptions(uniqueCompanies);

            } catch (err) {
                console.error("Failed to fetch experiences:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchExperiences();
    }, []);

    // 2. Apply filters whenever 'filters' or 'allExperiences' change
    useEffect(() => {
        let result = [...allExperiences];

        // Filter by company
        if (filters.company !== 'All') {
            result = result.filter(exp => exp.companyName === filters.company);
        }
        // Filter by verdict
        if (filters.verdict !== 'All') {
            result = result.filter(exp => exp.verdict === filters.verdict);
        }
        // Sort the results
        if (filters.sortBy === 'Popular') {
            result.sort((a, b) => b.likes.length - a.likes.length);
        } else { // Default to 'Recent'
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setFilteredExperiences(result);
    }, [filters, allExperiences]);

    // 3. Handler function to be passed to the FilterBar
    const handleFilterChange = (filterName, value) => {
        if (filterName === 'clear') {
            setFilters(INITIAL_FILTERS);
        } else {
            setFilters(prevFilters => ({
                ...prevFilters,
                [filterName]: value,
            }));
        }
    };

    if (loading) return <div className="loading-message">Loading Experiences...</div>;

    return (
        <div className="homepage-container">
            <h1 className="homepage-title">All Interview Experiences</h1>
            
            <FilterBar 
                filters={filters}
                onFilterChange={handleFilterChange}
                companyOptions={companyOptions}
            />

            <div className="posts-list">
                {filteredExperiences.length > 0 ? (
                    filteredExperiences.map(experience => (
                        <ExperienceCard key={experience._id} experience={experience} />
                    ))
                ) : (
                    <p>No experiences match your filters.</p>
                )}
            </div>
        </div>
    );
};

export default InterviewsPage;