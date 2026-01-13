import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import DaycareGrid from '../components/DaycareGrid';
import FilterPanel from '../components/FilterPanel';
import BentoGrid from '../components/BentoGrid/BentoGrid';
import MatchmakerQuiz from '../components/MatchmakerQuiz/MatchmakerQuiz';
import type { ViewMode, Daycare as DaycareType, FilterState } from '../types/components';
import '../styles/Home.css';

// Lazy load map component for better performance
const TransitPulseMap = lazy(() => import('../components/TransitPulseMap/TransitPulseMap'));

interface Daycare {
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
}

interface Neighborhood {
  slug: string;
  name: string;
  daycare_count?: number;
}

function Home() {
  const [daycares, setDaycares] = useState<Daycare[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [filteredDaycares, setFilteredDaycares] = useState<Daycare[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    neighborhoods: [],
    ageGroups: [],
    acceptingEnrollment: null,
    verified: null,
    priceRange: { min: null, max: null }
  });
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showQuiz, setShowQuiz] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Load data on mount from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch daycares from API
        const daycaresResponse = await fetch('/api/daycares');
        if (daycaresResponse.ok) {
          const daycaresData = await daycaresResponse.json();
          setDaycares(daycaresData);
        }

        // Fetch neighborhoods from API
        const neighborhoodsResponse = await fetch('/api/neighborhoods');
        if (neighborhoodsResponse.ok) {
          const neighborhoodsData = await neighborhoodsResponse.json();
          setNeighborhoods(neighborhoodsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Apply filters whenever filters, search, or daycares change
  useEffect(() => {
    let filtered = [...daycares];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.description.toLowerCase().includes(query) ||
          d.location.neighborhood.toLowerCase().includes(query) ||
          d.program.curriculum?.toLowerCase().includes(query)
      );
    }

    // Apply neighborhood filter
    if (filters.neighborhoods.length > 0) {
      filtered = filtered.filter((d) =>
        filters.neighborhoods.includes(d.location.neighborhood)
      );
    }

    // Apply age group filter
    if (filters.ageGroups.length > 0) {
      filtered = filtered.filter((d) =>
        filters.ageGroups.some((age: string) => d.program.age_groups.includes(age))
      );
    }

    // Apply accepting enrollment filter
    if (filters.acceptingEnrollment !== null) {
      filtered = filtered.filter(
        (d) => d.availability.accepting_enrollment === filters.acceptingEnrollment
      );
    }

    // Apply verified filter
    if (filters.verified) {
      filtered = filtered.filter((d) => d.verified === true);
    }

    // Apply price range filter
    if (filters.priceRange.min !== null || filters.priceRange.max !== null) {
      filtered = filtered.filter((d) => {
        const prices = [
          d.pricing.infant_monthly,
          d.pricing.toddler_monthly,
          d.pricing.preschool_monthly
        ].filter((p): p is number => p !== undefined && p > 0);

        if (prices.length === 0) return false;

        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        if (filters.priceRange.min !== null && maxPrice < filters.priceRange.min) {
          return false;
        }
        if (filters.priceRange.max !== null && minPrice > filters.priceRange.max) {
          return false;
        }

        return true;
      });
    }

    setFilteredDaycares(filtered);
  }, [daycares, filters, searchQuery]);

  // Get featured daycares (premium listings)
  const featuredDaycares = daycares.filter((d) => d.premium?.is_premium);

  // Handle search form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <h1 className="hero-title">
            Find the Perfect Daycare in San Francisco
          </h1>
          <p className="hero-subtitle">
            Discover licensed, verified daycares across SF's neighborhoods. Compare programs,
            availability, and pricing in one place.
          </p>

          {/* Hero Search */}
          <form className="hero-search" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search by name, neighborhood, or curriculum..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">
                <span className="search-icon">🔍</span>
                Search
              </button>
            </div>
          </form>

          {/* Quiz CTA */}
          <div className="hero-quiz-cta">
            <p className="quiz-cta-text">Not sure where to start?</p>
            <button
              className="quiz-cta-btn"
              onClick={() => setShowQuiz(true)}
            >
              <span className="quiz-cta-icon">🎯</span>
              Find My Perfect Match
            </button>
          </div>

          {/* Quick Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">{daycares.length}</div>
              <div className="stat-label">Licensed Daycares</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{neighborhoods.length}</div>
              <div className="stat-label">Neighborhoods</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {daycares.filter((d) => d.availability.accepting_enrollment).length}
              </div>
              <div className="stat-label">Accepting Enrollment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Daycares Section */}
      {featuredDaycares.length > 0 && !searchQuery && filters.neighborhoods.length === 0 && (
        <section className="featured-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Featured Daycares</h2>
              <p className="section-subtitle">
                Top-rated daycares verified by our team
              </p>
            </div>
            <DaycareGrid daycares={featuredDaycares.slice(0, 4)} />
          </div>
        </section>
      )}

      {/* Browse by Neighborhood Section */}
      {!searchQuery && filters.neighborhoods.length === 0 && (
        <section className="neighborhoods-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Browse by Neighborhood</h2>
              <p className="section-subtitle">
                Find daycares in your SF neighborhood
              </p>
            </div>
            <div className="neighborhoods-grid">
              {neighborhoods.slice(0, 12).map((neighborhood) => (
                <button
                  key={neighborhood.slug}
                  className="neighborhood-card"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      neighborhoods: [neighborhood.slug]
                    })
                  }
                >
                  <div className="neighborhood-icon">📍</div>
                  <div className="neighborhood-name">{neighborhood.name}</div>
                  {neighborhood.daycare_count !== undefined && (
                    <div className="neighborhood-count">
                      {neighborhood.daycare_count} daycare{neighborhood.daycare_count !== 1 ? 's' : ''}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Browse Section with Filters */}
      <section className="browse-section" ref={resultsRef}>
        <div className="container browse-container">
          {/* Sidebar Filter Panel */}
          <aside className="sidebar">
            <FilterPanel
              neighborhoods={neighborhoods}
              filters={filters}
              onFilterChange={setFilters}
              resultCount={filteredDaycares.length}
            />
          </aside>

          {/* Main Content */}
          <main className="main-content">
            <div className="content-header">
              <div className="header-row">
                <div className="header-text">
                  {searchQuery && (
                    <div className="search-results-header">
                      <h2 className="results-title">
                        Search results for "{searchQuery}"
                      </h2>
                      <button
                        className="clear-search-btn"
                        onClick={() => setSearchQuery('')}
                      >
                        Clear search
                      </button>
                    </div>
                  )}
                  {!searchQuery && filters.neighborhoods.length === 0 && (
                    <h2 className="results-title">All Daycares</h2>
                  )}
                  {filters.neighborhoods.length > 0 && (
                    <h2 className="results-title">
                      Daycares in{' '}
                      {filters.neighborhoods
                        .map(
                          (slug: string) =>
                            neighborhoods.find((n) => n.slug === slug)?.name || slug
                        )
                        .join(', ')}
                    </h2>
                  )}
                </div>

                {/* View Mode Toggle */}
                {filteredDaycares.length > 0 && (
                  <div className="view-mode-toggle">
                    <button
                      className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => setViewMode('grid')}
                      title="List View"
                    >
                      <span className="view-mode-icon">☰</span>
                      List
                    </button>
                    <button
                      className={`view-mode-btn ${viewMode === 'bento' ? 'active' : ''}`}
                      onClick={() => setViewMode('bento')}
                      title="Bento View"
                    >
                      <span className="view-mode-icon">▦</span>
                      Bento
                    </button>
                    <button
                      className={`view-mode-btn ${viewMode === 'map' ? 'active' : ''}`}
                      onClick={() => setViewMode('map')}
                      title="Map View"
                    >
                      <span className="view-mode-icon">🗺️</span>
                      Map
                    </button>
                  </div>
                )}
              </div>
            </div>

            {filteredDaycares.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3 className="no-results-title">No daycares found</h3>
                <p className="no-results-text">
                  Try adjusting your filters or search query
                </p>
                <button
                  className="reset-btn"
                  onClick={() => {
                    setFilters({
                      neighborhoods: [],
                      ageGroups: [],
                      acceptingEnrollment: null,
                      verified: null,
                      priceRange: { min: null, max: null }
                    });
                    setSearchQuery('');
                  }}
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <>
                {/* List View */}
                {viewMode === 'grid' && <DaycareGrid daycares={filteredDaycares} />}

                {/* Bento Grid View */}
                {viewMode === 'bento' && <BentoGrid daycares={filteredDaycares as DaycareType[]} />}

                {/* Map View */}
                {viewMode === 'map' && (
                  <Suspense fallback={<div className="map-loading">Loading map...</div>}>
                    <TransitPulseMap
                      daycares={filteredDaycares as DaycareType[]}
                      filters={filters}
                    />
                  </Suspense>
                )}
              </>
            )}
          </main>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="seo-section">
        <div className="container">
          <div className="seo-content">
            <h2 className="seo-title">
              Find Licensed Daycares in San Francisco
            </h2>
            <p className="seo-text">
              SF Daycare List is your comprehensive guide to finding quality childcare in San
              Francisco. We provide detailed information about licensed daycares across all SF
              neighborhoods, including Mission District, Noe Valley, Castro, Pacific Heights,
              Marina, and more.
            </p>
            <p className="seo-text">
              Our directory includes information about program curricula (Montessori, Reggio
              Emilia, play-based), age groups served (infant, toddler, preschool), pricing,
              availability, and parent reviews. All listings are verified and updated regularly.
            </p>
          </div>
        </div>
      </section>

      {/* Matchmaker Quiz Modal */}
      {showQuiz && (
        <MatchmakerQuiz
          daycares={daycares as DaycareType[]}
          onComplete={(matches) => {
            setFilteredDaycares(matches as Daycare[]);
            setShowQuiz(false);
            if (resultsRef.current) {
              resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </div>
  );
}

export default Home;
