import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/DaycareCard.css';

interface DaycareCardProps {
  daycare: {
    id: string;
    name: string;
    slug: string;
    description: string;
    location: {
      address: string;
      neighborhood: string;
      public_transit?: string[];
    };
    licensing: {
      status: string;
      inspection_score?: number;
    };
    program: {
      age_groups: string[];
      curriculum?: string;
      languages?: string[];
    };
    availability: {
      accepting_enrollment: boolean;
      infant_spots?: number;
      toddler_spots?: number;
      preschool_spots?: number;
    };
    pricing: {
      infant_monthly?: number;
      toddler_monthly?: number;
      preschool_monthly?: number;
    };
    features?: string[];
    ratings: {
      overall: number;
      review_count: number;
    };
    premium?: {
      is_premium: boolean;
      tier?: string | null;
    };
    verified?: boolean;
  };
}

const DaycareCard: React.FC<DaycareCardProps> = ({ daycare }) => {
  // Calculate minimum monthly price
  const getMinPrice = () => {
    const prices = [
      daycare.pricing.infant_monthly,
      daycare.pricing.toddler_monthly,
      daycare.pricing.preschool_monthly
    ].filter(p => p && p > 0);
    return prices.length > 0 ? Math.min(...prices) : null;
  };

  // Get availability status
  const getAvailabilityStatus = () => {
    const { infant_spots = 0, toddler_spots = 0, preschool_spots = 0 } = daycare.availability;
    const totalSpots = infant_spots + toddler_spots + preschool_spots;

    if (!daycare.availability.accepting_enrollment) {
      return { text: 'Waitlist Only', className: 'status-waitlist' };
    }
    if (totalSpots > 5) {
      return { text: `${totalSpots} Spots Available`, className: 'status-available' };
    }
    if (totalSpots > 0) {
      return { text: `${totalSpots} Spots Left`, className: 'status-limited' };
    }
    return { text: 'Waitlist Available', className: 'status-waitlist' };
  };

  // Get license status badge
  const getLicenseStatus = () => {
    const { status, inspection_score } = daycare.licensing;
    if (status === 'active' && inspection_score && inspection_score >= 90) {
      return { text: 'Licensed & Inspected', className: 'license-excellent' };
    }
    if (status === 'active') {
      return { text: 'Licensed', className: 'license-active' };
    }
    return { text: 'Check License', className: 'license-warning' };
  };

  // Format neighborhood name
  const formatNeighborhood = (neighborhood: string) => {
    return neighborhood.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const minPrice = getMinPrice();
  const availabilityStatus = getAvailabilityStatus();
  const licenseStatus = getLicenseStatus();

  return (
    <Link to={`/daycare/${daycare.slug}`} className="daycare-card-link">
      <div className="daycare-card">
        {/* Premium Badge */}
        {daycare.premium?.is_premium && (
          <div className="premium-badge">
            <span className="premium-icon">⭐</span> Premium
          </div>
        )}

        {/* Image Placeholder */}
        <div className="daycare-image">
          <div className="image-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="9 22 9 12 15 12 15 22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Availability Badge */}
          <div className={`availability-badge ${availabilityStatus.className}`}>
            {availabilityStatus.text}
          </div>
        </div>

        {/* Card Content */}
        <div className="daycare-content">
          {/* Header */}
          <div className="daycare-header">
            <h3 className="daycare-name">{daycare.name}</h3>

            {/* Rating */}
            <div className="daycare-rating">
              <span className="rating-stars">★ {daycare.ratings.overall.toFixed(1)}</span>
              <span className="rating-count">({daycare.ratings.review_count})</span>
            </div>
          </div>

          {/* Location */}
          <div className="daycare-location">
            <span className="location-icon">📍</span>
            <span className="location-text">{formatNeighborhood(daycare.location.neighborhood)}</span>
            {daycare.verified && (
              <span className="verified-badge" title="Verified Listing">✓</span>
            )}
          </div>

          {/* Transit */}
          {daycare.location.public_transit && daycare.location.public_transit.length > 0 && (
            <div className="daycare-transit">
              <span className="transit-icon">🚇</span>
              <span className="transit-text">{daycare.location.public_transit[0]}</span>
            </div>
          )}

          {/* Description */}
          <p className="daycare-description">
            {daycare.description.slice(0, 120)}...
          </p>

          {/* Key Info Grid */}
          <div className="daycare-info-grid">
            {/* Age Groups */}
            <div className="info-item">
              <span className="info-label">Ages</span>
              <span className="info-value">
                {daycare.program.age_groups.map(age =>
                  age.charAt(0).toUpperCase() + age.slice(1)
                ).slice(0, 2).join(', ')}
              </span>
            </div>

            {/* Curriculum */}
            {daycare.program.curriculum && (
              <div className="info-item">
                <span className="info-label">Program</span>
                <span className="info-value">{daycare.program.curriculum}</span>
              </div>
            )}

            {/* Price */}
            {minPrice && (
              <div className="info-item">
                <span className="info-label">From</span>
                <span className="info-value">${minPrice.toLocaleString()}/mo</span>
              </div>
            )}
          </div>

          {/* Features Tags */}
          {daycare.features && daycare.features.length > 0 && (
            <div className="daycare-features">
              {daycare.features.slice(0, 3).map((feature, index) => (
                <span key={index} className="feature-tag">{feature}</span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="daycare-footer">
            <span className={`license-badge ${licenseStatus.className}`}>
              {licenseStatus.text}
            </span>
            {daycare.program.languages && daycare.program.languages.length > 1 && (
              <span className="language-badge">
                Bilingual
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DaycareCard;
