// src/components/FilterBar.jsx

import React from 'react';
import '../Styles/FilterBar.css';

const FilterBar = ({ filters, onFilterChange, companyOptions }) => {
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onFilterChange(name, value);
    };

    const handleSortClick = (sortByValue) => {
        onFilterChange('sortBy', sortByValue);
    };

    const handleClear = () => {
        onFilterChange('clear', null);
    };

    return (
        <div className="filter-bar">
            <div className="filter-group sort-group">
                <span className="filter-label">Sort by:</span>
                <button 
                    onClick={() => handleSortClick('Recent')}
                    className={`sort-button ${filters.sortBy === 'Recent' ? 'active' : ''}`}
                >
                    Recent
                </button>
                <button 
                    onClick={() => handleSortClick('Popular')}
                    className={`sort-button ${filters.sortBy === 'Popular' ? 'active' : ''}`}
                >
                    Popular
                </button>
            </div>

            <div className="filter-group">
                <select 
                    name="verdict" 
                    value={filters.verdict} 
                    onChange={handleInputChange} 
                    className="filter-select"
                >
                    <option value="All">All Verdicts</option>
                    <option value="Selected">Selected</option>
                    <option value="Not Selected">Not Selected</option>
                    <option value='On Progress'>On Progress</option>
                </select>
            </div>

            <div className="filter-group">
                <select 
                    name="company" 
                    value={filters.company} 
                    onChange={handleInputChange} 
                    className="filter-select"
                >
                    <option value="All">All Companies</option>
                    {companyOptions.map(company => (
                        <option key={company} value={company}>{company}</option>
                    ))}
                </select>
            </div>
            
            <button onClick={handleClear} className="clear-button">Clear Filters</button>
        </div>
    );
};

export default FilterBar;