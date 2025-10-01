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
            {/* Sort Buttons Group */}
            <div className="filter-group sort-group">
                <label className="filter-label">Sort by</label>
                <div className="sort-buttons">
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
            </div>

            {/* Verdict Filter */}
            <div className="filter-group">
                <label className="filter-label">Verdict</label>
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

            {/* Company Filter */}
            <div className="filter-group">
                <label className="filter-label">Company</label>
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
            
            {/* Clear Button */}
            <button onClick={handleClear} className="clear-filters-btn">
                Clear Filters
            </button>
        </div>
    );
};

export default FilterBar;