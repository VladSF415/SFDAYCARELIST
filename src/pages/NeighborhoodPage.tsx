import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DaycareGrid from '../components/DaycareGrid';
import '../styles/NeighborhoodPage.css';

interface Neighborhood {
  slug: string;
  name: string;
  description?: string;
  daycare_count?: number;
  center?: {
    lat: number;
    lng: number;
  };
  zipCodes?: string[];
  bartStations?: string[];
  parks?: string[];
}

interface Daycare {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: {
    address: string;
    neighborhood: string;
  };
  licensing: {
    status: string;
  };
  program: {
    age_groups: string[];
  };
  availability: {
    accepting_enrollment: boolean;
  };
  pricing: {
    infant_monthly?: number;
    toddler_monthly?: number;
    preschool_monthly?: number;
  };
  ratings: {
    overall: number;
    review_count: number;
  };
  premium?: {
    is_premium: boolean;
  };
  verified?: boolean;
}

function NeighborhoodPage() {
  const { slug } = useParams<{ slug: string }>();
  const [neighborhood, setNeighborhood] = useState<Neighborhood | null>(null);
  const [daycares, setDaycares] = useState<Daycare[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    // Fetch neighborhood data
    fetch(`/api/neighborhoods/${slug}`)
      .then(res => res.json())
      .then(data => {
        setNeighborhood(data);
        document.title = `${data.name} Daycares - SF Daycare List`;
      })
      .catch(err => console.error('Failed to fetch neighborhood:', err));

    // Fetch daycares in this neighborhood
    fetch(`/api/daycares?neighborhood=${slug}`)
      .then(res => res.json())
      .then(data => {
        setDaycares(data.daycares || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch daycares:', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!neighborhood) {
    return (
      <div className="error-container">
        <h1>Neighborhood Not Found</h1>
        <p>We couldn't find the neighborhood you're looking for.</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="neighborhood-page">
      {/* Neighborhood Hero */}
      <section className="neighborhood-hero">
        <div className="container">
          <nav className="breadcrumbs">
            <Link to="/">Home</Link>
            <span className="separator">›</span>
            <span className="current">{neighborhood.name}</span>
          </nav>

          <h1 className="neighborhood-title">
            {neighborhood.name} Daycares
          </h1>

          {neighborhood.description && (
            <p className="neighborhood-description">
              {neighborhood.description}
            </p>
          )}

          <div className="neighborhood-stats">
            <div className="stat-card">
              <div className="stat-number">{daycares.length}</div>
              <div className="stat-label">Licensed Daycares</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {daycares.filter(d => d.availability.accepting_enrollment).length}
              </div>
              <div className="stat-label">Accepting Enrollment</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {daycares.filter(d => d.verified).length}
              </div>
              <div className="stat-label">Verified</div>
            </div>
          </div>

          {/* Neighborhood Info Cards */}
          {(neighborhood.bartStations?.length || neighborhood.parks?.length || neighborhood.zipCodes?.length) ? (
            <div className="neighborhood-info-grid">
              {neighborhood.bartStations && neighborhood.bartStations.length > 0 && (
                <div className="info-card">
                  <h3>🚇 BART Stations</h3>
                  <ul>
                    {neighborhood.bartStations.map((station, i) => (
                      <li key={i}>{station}</li>
                    ))}
                  </ul>
                </div>
              )}

              {neighborhood.parks && neighborhood.parks.length > 0 && (
                <div className="info-card">
                  <h3>🌳 Nearby Parks</h3>
                  <ul>
                    {neighborhood.parks.map((park, i) => (
                      <li key={i}>{park}</li>
                    ))}
                  </ul>
                </div>
              )}

              {neighborhood.zipCodes && neighborhood.zipCodes.length > 0 && (
                <div className="info-card">
                  <h3>📍 Zip Codes</h3>
                  <div className="zip-codes">
                    {neighborhood.zipCodes.map((zip, i) => (
                      <span key={i} className="zip-badge">{zip}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </section>

      {/* Daycares Section */}
      <section className="daycares-section">
        <div className="container">
          <h2 className="section-title">
            All Daycares in {neighborhood.name}
          </h2>

          {daycares.length > 0 ? (
            <DaycareGrid daycares={daycares} />
          ) : (
            <div className="no-results">
              <p>No daycares found in this neighborhood yet.</p>
              <Link to="/submit" className="btn-primary">
                List Your Daycare
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default NeighborhoodPage;
