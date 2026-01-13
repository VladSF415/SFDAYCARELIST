import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DaycareStructuredData from '../components/LocalBusinessSchema';
import '../styles/DaycareDetail.css';

// Import data directly for now
import daycaresData from '../../data/daycares.json';

interface Daycare {
  id: string;
  name: string;
  slug: string;
  description: string;
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  location: {
    address: string;
    city: string;
    state: string;
    zip: string;
    neighborhood: string;
    latitude: number;
    longitude: number;
    public_transit: string[];
  };
  licensing: {
    license_number: string;
    status: string;
    type: string;
    capacity: number;
    issued_date: string;
    expiration_date: string;
    last_inspection: string;
    inspection_score: number;
    violations: string[];
    data_source: string;
  };
  program: {
    age_groups: string[];
    ages_min_months: number;
    ages_max_years: number;
    languages: string[];
    curriculum: string;
    special_programs: string[];
  };
  availability: {
    accepting_enrollment: boolean;
    infant_spots: number;
    toddler_spots: number;
    preschool_spots: number;
    waitlist_available: boolean;
    last_updated: string;
  };
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  pricing: {
    infant_monthly: number;
    toddler_monthly: number;
    preschool_monthly: number;
    part_time_available: boolean;
    financial_aid: boolean;
    accepts_subsidy: string[];
  };
  features: string[];
  ratings: {
    overall: number;
    safety: number;
    education: number;
    staff: number;
    facilities: number;
    nutrition: number;
    review_count: number;
    verified_reviews: number;
  };
  premium?: {
    is_premium: boolean;
    tier: string | null;
    featured_until: string | null;
  };
  verified: boolean;
  claimed_by_owner: boolean;
  owner_email: string | null;
  seo: {
    meta_title: string;
    meta_description: string;
  };
  created_at: string;
  updated_at: string;
}

function DaycareDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [daycare, setDaycare] = useState<Daycare | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'program' | 'pricing'>('overview');

  useEffect(() => {
    const found = daycaresData.find((d: any) => d.slug === slug);
    if (found) {
      setDaycare(found as Daycare);
      // Update page title
      document.title = found.seo?.meta_title || `${found.name} - SF Daycare List`;
    }
  }, [slug]);

  if (!daycare) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Daycare not found</h2>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  // Format neighborhood name
  const formatNeighborhood = (neighborhood: string) => {
    return neighborhood
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get availability status
  const getAvailabilityStatus = () => {
    const { infant_spots, toddler_spots, preschool_spots, accepting_enrollment } =
      daycare.availability;
    const totalSpots = infant_spots + toddler_spots + preschool_spots;

    if (!accepting_enrollment) {
      return { text: 'Waitlist Only', className: 'status-waitlist', icon: '⏳' };
    }
    if (totalSpots > 5) {
      return {
        text: `${totalSpots} Spots Available`,
        className: 'status-available',
        icon: '✓'
      };
    }
    if (totalSpots > 0) {
      return { text: `${totalSpots} Spots Left`, className: 'status-limited', icon: '⚠️' };
    }
    return { text: 'Waitlist Available', className: 'status-waitlist', icon: '⏳' };
  };

  const availabilityStatus = getAvailabilityStatus();

  // Calculate minimum monthly price
  const getMinPrice = () => {
    const prices = [
      daycare.pricing.infant_monthly,
      daycare.pricing.toddler_monthly,
      daycare.pricing.preschool_monthly
    ].filter((p) => p && p > 0);
    return prices.length > 0 ? Math.min(...prices) : null;
  };

  const minPrice = getMinPrice();

  return (
    <div className="daycare-detail-page">
      {/* Structured Data for SEO */}
      <DaycareStructuredData daycare={daycare} />

      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <div className="container">
          <Link to="/">Home</Link>
          <span className="separator">/</span>
          <Link to={`/?neighborhood=${daycare.location.neighborhood}`}>
            {formatNeighborhood(daycare.location.neighborhood)}
          </Link>
          <span className="separator">/</span>
          <span>{daycare.name}</span>
        </div>
      </div>

      {/* Header */}
      <section className="detail-header">
        <div className="container">
          <div className="header-content">
            <div className="header-main">
              <div className="header-top">
                {daycare.premium?.is_premium && (
                  <span className="badge badge-premium">⭐ Premium</span>
                )}
                {daycare.verified && <span className="badge badge-success">✓ Verified</span>}
                {daycare.claimed_by_owner && (
                  <span className="badge badge-info">Claimed by Owner</span>
                )}
              </div>

              <h1 className="daycare-name">{daycare.name}</h1>

              <div className="header-meta">
                <div className="rating-display">
                  <span className="rating-stars">
                    ★ {daycare.ratings.overall.toFixed(1)}
                  </span>
                  <span className="rating-count">
                    ({daycare.ratings.review_count} reviews, {daycare.ratings.verified_reviews}{' '}
                    verified)
                  </span>
                </div>

                <div className="location-display">
                  <span className="location-icon">📍</span>
                  <span>{formatNeighborhood(daycare.location.neighborhood)}, San Francisco</span>
                </div>
              </div>

              <p className="daycare-description">{daycare.description}</p>

              <div className={`availability-banner ${availabilityStatus.className}`}>
                <span className="status-icon">{availabilityStatus.icon}</span>
                <span className="status-text">{availabilityStatus.text}</span>
                {daycare.availability.waitlist_available && (
                  <span className="waitlist-text">• Waitlist Available</span>
                )}
              </div>
            </div>

            <div className="header-actions">
              <div className="action-card">
                <div className="price-display">
                  {minPrice ? (
                    <>
                      <div className="price-label">Starting at</div>
                      <div className="price-amount">${minPrice.toLocaleString()}/mo</div>
                    </>
                  ) : (
                    <div className="price-label">Contact for Pricing</div>
                  )}
                </div>

                <a href={`tel:${daycare.contact.phone}`} className="btn btn-primary btn-large">
                  <span>📞</span> Call Now
                </a>

                <a
                  href={daycare.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-large"
                >
                  Visit Website →
                </a>

                <a
                  href={`mailto:${daycare.contact.email}?subject=Inquiry about ${daycare.name}`}
                  className="btn btn-secondary btn-large"
                >
                  <span>✉️</span> Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="detail-tabs">
        <div className="container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab ${activeTab === 'program' ? 'active' : ''}`}
              onClick={() => setActiveTab('program')}
            >
              Program Details
            </button>
            <button
              className={`tab ${activeTab === 'pricing' ? 'active' : ''}`}
              onClick={() => setActiveTab('pricing')}
            >
              Pricing & Availability
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="detail-content">
        <div className="container">
          <div className="content-grid">
            {/* Main Content */}
            <div className="main-column">
              {activeTab === 'overview' && (
                <div className="tab-content">
                  {/* Key Information */}
                  <div className="info-section">
                    <h2 className="section-title">Key Information</h2>
                    <div className="info-grid">
                      <div className="info-item">
                        <div className="info-label">License Type</div>
                        <div className="info-value">{daycare.licensing.type}</div>
                      </div>
                      <div className="info-item">
                        <div className="info-label">Capacity</div>
                        <div className="info-value">{daycare.licensing.capacity} children</div>
                      </div>
                      <div className="info-item">
                        <div className="info-label">Inspection Score</div>
                        <div className="info-value">
                          {daycare.licensing.inspection_score}/100
                          {daycare.licensing.inspection_score >= 90 && ' 🏆'}
                        </div>
                      </div>
                      <div className="info-item">
                        <div className="info-label">Last Inspection</div>
                        <div className="info-value">
                          {new Date(daycare.licensing.last_inspection).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="info-section">
                    <h2 className="section-title">Features & Amenities</h2>
                    <div className="features-grid">
                      {daycare.features.map((feature, index) => (
                        <div key={index} className="feature-item">
                          <span className="feature-icon">✓</span>
                          <span className="feature-text">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ratings Breakdown */}
                  <div className="info-section">
                    <h2 className="section-title">Ratings Breakdown</h2>
                    <div className="ratings-breakdown">
                      {Object.entries(daycare.ratings)
                        .filter(([key]) => !['review_count', 'verified_reviews'].includes(key))
                        .map(([key, value]) => (
                          <div key={key} className="rating-row">
                            <div className="rating-label">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </div>
                            <div className="rating-bar-container">
                              <div
                                className="rating-bar"
                                style={{ width: `${(value as number * 20)}%` }}
                              />
                            </div>
                            <div className="rating-score">{(value as number).toFixed(1)}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'program' && (
                <div className="tab-content">
                  {/* Program Details */}
                  <div className="info-section">
                    <h2 className="section-title">Program Information</h2>
                    <div className="program-details">
                      <div className="program-item">
                        <div className="program-label">Age Groups</div>
                        <div className="program-value">
                          {daycare.program.age_groups
                            .map((age) => age.charAt(0).toUpperCase() + age.slice(1))
                            .join(', ')}
                        </div>
                      </div>
                      <div className="program-item">
                        <div className="program-label">Age Range</div>
                        <div className="program-value">
                          {daycare.program.ages_min_months} months - {daycare.program.ages_max_years}{' '}
                          years
                        </div>
                      </div>
                      <div className="program-item">
                        <div className="program-label">Curriculum</div>
                        <div className="program-value">{daycare.program.curriculum}</div>
                      </div>
                      <div className="program-item">
                        <div className="program-label">Languages</div>
                        <div className="program-value">
                          {daycare.program.languages.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Special Programs */}
                  {daycare.program.special_programs.length > 0 && (
                    <div className="info-section">
                      <h2 className="section-title">Special Programs</h2>
                      <div className="special-programs-list">
                        {daycare.program.special_programs.map((program, index) => (
                          <div key={index} className="special-program-item">
                            <span className="program-icon">🎯</span>
                            <span className="program-name">{program}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hours */}
                  <div className="info-section">
                    <h2 className="section-title">Operating Hours</h2>
                    <div className="hours-list">
                      {Object.entries(daycare.hours).map(([day, hours]) => (
                        <div key={day} className="hours-row">
                          <div className="hours-day">
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </div>
                          <div className="hours-time">{hours}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'pricing' && (
                <div className="tab-content">
                  {/* Pricing */}
                  <div className="info-section">
                    <h2 className="section-title">Monthly Tuition</h2>
                    <div className="pricing-grid">
                      {daycare.pricing.infant_monthly > 0 && (
                        <div className="pricing-item">
                          <div className="pricing-label">Infant (0-12 months)</div>
                          <div className="pricing-amount">
                            ${daycare.pricing.infant_monthly.toLocaleString()}/month
                          </div>
                        </div>
                      )}
                      {daycare.pricing.toddler_monthly > 0 && (
                        <div className="pricing-item">
                          <div className="pricing-label">Toddler (1-3 years)</div>
                          <div className="pricing-amount">
                            ${daycare.pricing.toddler_monthly.toLocaleString()}/month
                          </div>
                        </div>
                      )}
                      {daycare.pricing.preschool_monthly > 0 && (
                        <div className="pricing-item">
                          <div className="pricing-label">Preschool (3-5 years)</div>
                          <div className="pricing-amount">
                            ${daycare.pricing.preschool_monthly.toLocaleString()}/month
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pricing-notes">
                      {daycare.pricing.part_time_available && (
                        <div className="pricing-note">
                          <span className="note-icon">✓</span> Part-time options available
                        </div>
                      )}
                      {daycare.pricing.financial_aid && (
                        <div className="pricing-note">
                          <span className="note-icon">✓</span> Financial aid available
                        </div>
                      )}
                      {daycare.pricing.accepts_subsidy.length > 0 && (
                        <div className="pricing-note">
                          <span className="note-icon">✓</span> Accepts:{' '}
                          {daycare.pricing.accepts_subsidy.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="info-section">
                    <h2 className="section-title">Current Availability</h2>
                    <div className="availability-grid">
                      <div className="availability-item">
                        <div className="availability-label">Infant Spots</div>
                        <div className="availability-count">
                          {daycare.availability.infant_spots || 0}
                        </div>
                      </div>
                      <div className="availability-item">
                        <div className="availability-label">Toddler Spots</div>
                        <div className="availability-count">
                          {daycare.availability.toddler_spots || 0}
                        </div>
                      </div>
                      <div className="availability-item">
                        <div className="availability-label">Preschool Spots</div>
                        <div className="availability-count">
                          {daycare.availability.preschool_spots || 0}
                        </div>
                      </div>
                    </div>
                    <div className="availability-updated">
                      Last updated:{' '}
                      {new Date(daycare.availability.last_updated).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="sidebar-column">
              {/* Contact Card */}
              <div className="sidebar-card">
                <h3 className="sidebar-title">Contact Information</h3>
                <div className="contact-list">
                  <div className="contact-item">
                    <span className="contact-icon">📍</span>
                    <div>
                      <div className="contact-value">{daycare.location.address}</div>
                      <div className="contact-label">
                        {daycare.location.city}, {daycare.location.state} {daycare.location.zip}
                      </div>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">📞</span>
                    <a href={`tel:${daycare.contact.phone}`} className="contact-link">
                      {daycare.contact.phone}
                    </a>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">✉️</span>
                    <a href={`mailto:${daycare.contact.email}`} className="contact-link">
                      {daycare.contact.email}
                    </a>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">🌐</span>
                    <a
                      href={daycare.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-link"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              </div>

              {/* Transit Card */}
              {daycare.location.public_transit.length > 0 && (
                <div className="sidebar-card">
                  <h3 className="sidebar-title">Public Transit</h3>
                  <div className="transit-list">
                    {daycare.location.public_transit.map((transit, index) => (
                      <div key={index} className="transit-item">
                        <span className="transit-icon">🚇</span>
                        <span className="transit-text">{transit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Licensing Card */}
              <div className="sidebar-card">
                <h3 className="sidebar-title">Licensing Information</h3>
                <div className="license-details">
                  <div className="license-item">
                    <div className="license-label">License Number</div>
                    <div className="license-value">{daycare.licensing.license_number}</div>
                  </div>
                  <div className="license-item">
                    <div className="license-label">Status</div>
                    <div className="license-value">
                      <span className="badge badge-success">{daycare.licensing.status}</span>
                    </div>
                  </div>
                  <div className="license-item">
                    <div className="license-label">Expiration</div>
                    <div className="license-value">
                      {new Date(daycare.licensing.expiration_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="license-source">
                    Source: {daycare.licensing.data_source}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DaycareDetail;
