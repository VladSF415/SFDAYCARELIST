import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Platform } from '../types';
import '../styles/InteractiveComponents.css';

interface FilterState {
  category: string;
  pricing: string;
  features: string[];
}

export function ComparisonWidget() {
  const navigate = useNavigate();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [filteredPlatforms, setFilteredPlatforms] = useState<Platform[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    pricing: 'all',
    features: []
  });
  const [loading, setLoading] = useState(true);

  const categories = ['ml-frameworks', 'llm-ops', 'data-governance'];
  const pricingOptions = ['free', 'freemium', 'paid'];
  const featureOptions = ['API Access', 'Custom Models', 'Team Collaboration', 'Analytics'];

  useEffect(() => {
    fetchPlatforms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, platforms]);

  const fetchPlatforms = async () => {
    setLoading(true);
    try {
      const categoryQuery = categories.map(c => `category=${c}`).join('&');
      const response = await fetch(`/api/platforms?${categoryQuery}&limit=100`);
      const data = await response.json();
      setPlatforms(data.platforms || []);
    } catch (error) {
      console.error('Failed to fetch platforms:', error);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...platforms];

    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.pricing !== 'all') {
      filtered = filtered.filter(p => p.pricing === filters.pricing);
    }

    if (filters.features.length > 0) {
      filtered = filtered.filter(p =>
        p.features && filters.features.some(f =>
          p.features!.some(pf => pf.toLowerCase().includes(f.toLowerCase()))
        )
      );
    }

    // Sort by rating
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    setFilteredPlatforms(filtered);
  };

  const togglePlatformSelection = (platform: Platform) => {
    if (selectedPlatforms.find(p => p.id === platform.id)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p.id !== platform.id));
    } else if (selectedPlatforms.length < 4) {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const toggleFeature = (feature: string) => {
    if (filters.features.includes(feature)) {
      setFilters({ ...filters, features: filters.features.filter(f => f !== feature) });
    } else {
      setFilters({ ...filters, features: [...filters.features, feature] });
    }
  };

  if (loading) {
    return <div className="loading">Loading platforms...</div>;
  }

  return (
    <div className="comparison-widget">
      <h3>🔍 Compare ML Tools & Platforms</h3>
      <p className="widget-description">
        Filter and compare machine learning frameworks, MLOps tools, and data governance platforms
      </p>

      {/* Filters */}
      <div className="filter-section">
        <div className="filter-group">
          <label className="filter-label">Category</label>
          <div className="filter-tags">
            <div
              className={`filter-tag ${filters.category === 'all' ? 'active' : ''}`}
              onClick={() => setFilters({ ...filters, category: 'all' })}
            >
              All Categories
            </div>
            {categories.map(cat => (
              <div
                key={cat}
                className={`filter-tag ${filters.category === cat ? 'active' : ''}`}
                onClick={() => setFilters({ ...filters, category: cat })}
              >
                {cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Pricing</label>
          <div className="filter-tags">
            <div
              className={`filter-tag ${filters.pricing === 'all' ? 'active' : ''}`}
              onClick={() => setFilters({ ...filters, pricing: 'all' })}
            >
              All Pricing
            </div>
            {pricingOptions.map(pricing => (
              <div
                key={pricing}
                className={`filter-tag ${filters.pricing === pricing ? 'active' : ''}`}
                onClick={() => setFilters({ ...filters, pricing: pricing })}
              >
                {pricing.charAt(0).toUpperCase() + pricing.slice(1)}
              </div>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Features</label>
          <div className="filter-tags">
            {featureOptions.map(feature => (
              <div
                key={feature}
                className={`filter-tag ${filters.features.includes(feature) ? 'active' : ''}`}
                onClick={() => toggleFeature(feature)}
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="comparison-results">
        <div className="results-header">
          <h4>Found {filteredPlatforms.length} platforms</h4>
          <p>Select up to 4 platforms to compare ({selectedPlatforms.length}/4 selected)</p>
        </div>

        {selectedPlatforms.length > 0 && (
          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Rating</th>
                  <th>Pricing</th>
                  <th>Category</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedPlatforms.map(platform => (
                  <tr key={platform.id}>
                    <td>
                      <strong>{platform.name}</strong>
                      {platform.verified && <span className="badge verified-badge">✓</span>}
                    </td>
                    <td>{platform.rating ? `⭐ ${platform.rating.toFixed(1)}` : 'N/A'}</td>
                    <td>{platform.pricing || 'N/A'}</td>
                    <td>{platform.category}</td>
                    <td>
                      <button
                        onClick={() => navigate(`/platform/${platform.slug}`)}
                        className="view-btn"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="platforms-list">
          {filteredPlatforms.slice(0, 20).map(platform => (
            <div
              key={platform.id}
              className={`platform-item ${selectedPlatforms.find(p => p.id === platform.id) ? 'selected' : ''}`}
              onClick={() => togglePlatformSelection(platform)}
            >
              <div className="platform-info">
                <h5>{platform.name}</h5>
                <p>{platform.description?.substring(0, 100)}...</p>
              </div>
              <div className="platform-meta">
                {platform.rating && <span>⭐ {platform.rating.toFixed(1)}</span>}
                <span className="pricing-badge">{platform.pricing}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ComparisonWidget;
