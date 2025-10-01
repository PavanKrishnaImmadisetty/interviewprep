import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExperienceCard from '../components/ExperienceCard';
import FilterBar from '../components/FilterBar'; 
import { useAuth } from '../context/AuthContext.js';
import '../Styles/InterviewPage.css';

const INITIAL_FILTERS = {
  sortBy: 'Recent',
  verdict: 'All',
  company: 'All',
};

const InterviewsPage = () => {
  const { auth } = useAuth();
  const [allExperiences, setAllExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [loading, setLoading] = useState(true);

  const local = 'http://localhost:5000'
  


  // Fetch data on mount
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${auth.token}` } };
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/experiences`, config);

        const experiences = response.data.experiences || [];
        setAllExperiences(experiences);
        setFilteredExperiences(experiences);

        // Create a unique list of company names for filter dropdown
        const uniqueCompanies = [...new Set(experiences.map(exp => exp.companyName))];
        setCompanyOptions(uniqueCompanies);
      } catch (err) {
        console.error("Failed to fetch experiences:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [auth.token]);

  // Apply filters
  useEffect(() => {
    let result = [...allExperiences];

    if (filters.company !== 'All') {
      result = result.filter(exp => exp.companyName === filters.company);
    }
    if (filters.verdict !== 'All') {
      result = result.filter(exp => exp.verdict === filters.verdict);
    }
    if (filters.sortBy === 'Popular') {
      result.sort((a, b) => b.likes.length - a.likes.length);
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredExperiences(result);
  }, [filters, allExperiences]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    if (filterName === 'clear') {
      setFilters(INITIAL_FILTERS);
    } else {
      setFilters(prev => ({ ...prev, [filterName]: value }));
    }
  };

  // Loading state
  if (loading) {
    return <div className="loading-message">Loading experiences...</div>;
  }

  return (
    <main className="interview-container">
      {/* Page Title */}
      <header>
        <h1 className="interview-title">All Interview Experiences</h1>
      </header>

      {/* Filters */}
      <section className="filter-section">
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          companyOptions={companyOptions}
        />
      </section>

      {/* Posts */}
      <section className="posts-list">
        {filteredExperiences.length > 0 ? (
          filteredExperiences.map(exp => (
            <ExperienceCard key={exp._id} experience={exp} />
          ))
        ) : (
          <p className="empty-message">No experiences match your filters.</p>
        )}
      </section>
    </main>
  );
};

export default InterviewsPage;

