import React, { useState } from 'react';
import type { FilterState } from '../types/components';
import '../styles/FilterPanel.css';

interface FilterPanelProps {
  neighborhoods: Array<{
    slug: string;
    name: string;
    daycare_count?: number;
  }>;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  resultCount?: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  neighborhoods,
  filters,
  onFilterChange,
  resultCount
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const ageGroupOptions: Array<{
    value: 'infant' | 'toddler' | 'preschool';
    label: string;
    icon: string;
  }> = [
    { value: 'infant' as const, label: 'Infant (0-12 months)', icon: '👶' },
    { value: 'toddler' as const, label: 'Toddler (1-3 years)', icon: '🧒' },
    { value: 'preschool' as const, label: 'Preschool (3-5 years)', icon: '👧' }
  ];

  const handleNeighborhoodToggle = (neighborhoodSlug: string) => {
    const newNeighborhoods = filters.neighborhoods.includes(neighborhoodSlug)
      ? filters.neighborhoods.filter(n => n !== neighborhoodSlug)
      : [...filters.neighborhoods, neighborhoodSlug];

    onFilterChange({
      ...filters,
      neighborhoods: newNeighborhoods
    });
  };

  const handleAgeGroupToggle = (ageGroup: 'infant' | 'toddler' | 'preschool') => {
    const newAgeGroups = filters.ageGroups.includes(ageGroup)
      ? filters.ageGroups.filter(a => a !== ageGroup)
      : [...filters.ageGroups, ageGroup];

    onFilterChange({
      ...filters,
      ageGroups: newAgeGroups
    });
  };

  const handleAcceptingEnrollmentChange = (value: boolean | null) => {
    onFilterChange({
      ...filters,
      acceptingEnrollment: value
    });
  };

  const handleVerifiedChange = (checked: boolean) => {
    onFilterChange({
      ...filters,
      verified: checked ? true : null
    });
  };

  const handlePriceRangeChange = (min: number | null, max: number | null) => {
    onFilterChange({
      ...filters,
      priceRange: { min, max }
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      neighborhoods: [],
      ageGroups: [],
      acceptingEnrollment: null,
      verified: null,
      priceRange: { min: null, max: null }
    });
  };

  const hasActiveFilters =
    filters.neighborhoods.length > 0 ||
    filters.ageGroups.length > 0 ||
    filters.acceptingEnrollment !== null ||
    filters.verified !== null ||
    filters.priceRange.min !== null ||
    filters.priceRange.max !== null;

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3 className="filter-title">Filters</h3>
        <button
          className="filter-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {resultCount !== undefined && (
        <div className="filter-results">
          <span className="results-count">{resultCount}</span> daycare{resultCount !== 1 ? 's' : ''} found
        </div>
      )}

      {hasActiveFilters && (
        <button className="clear-filters-btn" onClick={handleClearFilters}>
          Clear all filters
        </button>
      )}

      {isExpanded && (
        <div className="filter-content">
          {/* Age Groups Filter */}
          <div className="filter-section">
            <h4 className="filter-section-title">Age Groups</h4>
            <div className="filter-options">
              {ageGroupOptions.map(option => (
                <label key={option.value} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.ageGroups.includes(option.value)}
                    onChange={() => handleAgeGroupToggle(option.value)}
                  />
                  <span className="checkbox-label">
                    <span className="checkbox-icon">{option.icon}</span>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Neighborhoods Filter */}
          <div className="filter-section">
            <h4 className="filter-section-title">Neighborhoods</h4>
            <div className="filter-options neighborhoods-list">
              {neighborhoods.map(neighborhood => (
                <label key={neighborhood.slug} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.neighborhoods.includes(neighborhood.slug)}
                    onChange={() => handleNeighborhoodToggle(neighborhood.slug)}
                  />
                  <span className="checkbox-label">
                    {neighborhood.name}
                    {neighborhood.daycare_count !== undefined && (
                      <span className="count-badge">({neighborhood.daycare_count})</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div className="filter-section">
            <h4 className="filter-section-title">Availability</h4>
            <div className="filter-options">
              <label className="filter-radio">
                <input
                  type="radio"
                  name="availability"
                  checked={filters.acceptingEnrollment === null}
                  onChange={() => handleAcceptingEnrollmentChange(null)}
                />
                <span className="radio-label">All daycares</span>
              </label>
              <label className="filter-radio">
                <input
                  type="radio"
                  name="availability"
                  checked={filters.acceptingEnrollment === true}
                  onChange={() => handleAcceptingEnrollmentChange(true)}
                />
                <span className="radio-label">
                  Accepting enrollment
                  <span className="status-indicator status-available"></span>
                </span>
              </label>
              <label className="filter-radio">
                <input
                  type="radio"
                  name="availability"
                  checked={filters.acceptingEnrollment === false}
                  onChange={() => handleAcceptingEnrollmentChange(false)}
                />
                <span className="radio-label">
                  Waitlist only
                  <span className="status-indicator status-waitlist"></span>
                </span>
              </label>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-section">
            <h4 className="filter-section-title">Monthly Price Range</h4>
            <div className="price-range-inputs">
              <div className="price-input-group">
                <label htmlFor="min-price" className="price-label">Min</label>
                <div className="price-input-wrapper">
                  <span className="price-symbol">$</span>
                  <input
                    id="min-price"
                    type="number"
                    className="price-input"
                    placeholder="1000"
                    value={filters.priceRange.min || ''}
                    onChange={(e) => handlePriceRangeChange(
                      e.target.value ? parseInt(e.target.value) : null,
                      filters.priceRange.max
                    )}
                  />
                </div>
              </div>
              <span className="price-separator">to</span>
              <div className="price-input-group">
                <label htmlFor="max-price" className="price-label">Max</label>
                <div className="price-input-wrapper">
                  <span className="price-symbol">$</span>
                  <input
                    id="max-price"
                    type="number"
                    className="price-input"
                    placeholder="3000"
                    value={filters.priceRange.max || ''}
                    onChange={(e) => handlePriceRangeChange(
                      filters.priceRange.min,
                      e.target.value ? parseInt(e.target.value) : null
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Verified Filter */}
          <div className="filter-section">
            <h4 className="filter-section-title">Verification</h4>
            <div className="filter-options">
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.verified === true}
                  onChange={(e) => handleVerifiedChange(e.target.checked)}
                />
                <span className="checkbox-label">
                  Verified listings only
                  <span className="verified-icon" title="Verified">✓</span>
                </span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
