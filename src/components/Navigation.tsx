import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';

interface Category {
  name: string;
  slug: string;
  count: number;
}

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  // Featured neighborhoods to display in dropdown
  const featuredNeighborhoods = [
    { slug: 'mission', icon: '🌮', name: 'Mission District' },
    { slug: 'noe-valley', icon: '🏡', name: 'Noe Valley' },
    { slug: 'castro', icon: '🌈', name: 'Castro' },
    { slug: 'pacific-heights', icon: '🏛️', name: 'Pacific Heights' },
    { slug: 'sunset', icon: '🌅', name: 'Sunset District' },
    { slug: 'richmond', icon: '🌳', name: 'Richmond District' },
    { slug: 'soma', icon: '🏢', name: 'SoMa' },
    { slug: 'haight-ashbury', icon: '🎸', name: 'Haight-Ashbury' },
    { slug: 'marina', icon: '⛵', name: 'Marina District' },
    { slug: 'potrero-hill', icon: '⛰️', name: 'Potrero Hill' },
    { slug: 'bernal-heights', icon: '🐕', name: 'Bernal Heights' },
    { slug: 'north-beach', icon: '🍝', name: 'North Beach' },
  ];

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.nav-container')) {
        setIsMenuOpen(false);
        setIsCategoriesOpen(false);
        setIsResourcesOpen(false);
      }
    };

    if (isMenuOpen || isCategoriesOpen || isResourcesOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMenuOpen, isCategoriesOpen, isResourcesOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
      setSearchQuery('');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsCategoriesOpen(false);
  };

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
    setIsResourcesOpen(false);
  };

  const toggleResources = () => {
    setIsResourcesOpen(!isResourcesOpen);
    setIsCategoriesOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsCategoriesOpen(false);
    setIsResourcesOpen(false);
  };

  const scrollToCategories = () => {
    closeMenu();
    // If already on home page, just scroll
    if (window.location.pathname === '/') {
      const el = document.getElementById('all-categories');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Navigate to home then scroll
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('all-categories');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <nav className={`main-nav ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo and Brand */}
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <img src="/logo-temp.svg" alt="SF Daycare List Logo" />
          <span className="nav-brand">
            SF Daycare<span className="nav-brand-sub">List</span>
          </span>
        </Link>

        {/* Desktop Search */}
        <form className="nav-search desktop-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search daycares..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search daycares"
          />
          <button type="submit" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </form>

        {/* Desktop Menu */}
        <ul className="nav-menu desktop-menu">
          <li>
            <Link to="/" onClick={closeMenu}>Home</Link>
          </li>
          <li className="nav-dropdown">
            <button
              onClick={toggleCategories}
              className="nav-dropdown-trigger"
              aria-expanded={isCategoriesOpen}
              aria-haspopup="true"
              aria-label="Browse categories menu"
            >
              Neighborhoods
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {isCategoriesOpen && (
              <div className="nav-dropdown-menu categories-dropdown">
                <div className="dropdown-header">
                  <span className="dropdown-title">📍 SF NEIGHBORHOODS</span>
                </div>
                <div className="nav-dropdown-grid">
                  {featuredNeighborhoods.map((neighborhood) => {
                    const neighborhoodData = categories.find(c => c.slug === neighborhood.slug);
                    return (
                      <Link
                        key={neighborhood.slug}
                        to={`/neighborhood/${neighborhood.slug}`}
                        onClick={closeMenu}
                        className="nav-dropdown-item category-item"
                      >
                        <span className="category-icon">{neighborhood.icon}</span>
                        <div className="category-info">
                          <span className="category-name">{neighborhood.name}</span>
                          {neighborhoodData && (
                            <span className="category-count">{neighborhoodData.count} daycares</span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <button
                  onClick={scrollToCategories}
                  className="nav-dropdown-all view-all-categories"
                  type="button"
                >
                  View All Neighborhoods →
                </button>
              </div>
            )}
          </li>
          <li className="nav-dropdown">
            <button
              onClick={toggleResources}
              className="nav-dropdown-trigger"
              aria-expanded={isResourcesOpen}
              aria-haspopup="true"
              aria-label="Resources menu"
            >
              Resources
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {isResourcesOpen && (
              <div className="nav-dropdown-menu" style={{ minWidth: '400px' }}>
                <Link
                  to="/choosing-a-daycare"
                  onClick={closeMenu}
                  className="nav-dropdown-item"
                  style={{ marginBottom: '8px' }}
                >
                  🎯 Choosing a Daycare Guide
                </Link>
                <Link
                  to="/licensing-information"
                  onClick={closeMenu}
                  className="nav-dropdown-item"
                  style={{ marginBottom: '8px' }}
                >
                  📋 Understanding Licensing
                </Link>
                <Link
                  to="/financial-aid"
                  onClick={closeMenu}
                  className="nav-dropdown-item"
                  style={{ marginBottom: '8px' }}
                >
                  💰 Financial Aid & Subsidies
                </Link>
                <Link
                  to="/preschool-readiness"
                  onClick={closeMenu}
                  className="nav-dropdown-item"
                  style={{ marginBottom: '8px' }}
                >
                  🎓 Preschool Readiness
                </Link>
                <Link
                  to="/contact"
                  onClick={closeMenu}
                  className="nav-dropdown-item"
                >
                  📧 Contact Us
                </Link>
              </div>
            )}
          </li>
          <li>
            <Link to="/blog" onClick={closeMenu}>Blog</Link>
          </li>
          <li>
            <Link to="/about" onClick={closeMenu}>About</Link>
          </li>
          <li>
            <Link to="/submit" className="nav-cta" onClick={closeMenu}>
              List Your Daycare
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className={`nav-hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          {/* Mobile Search */}
          <form className="nav-search mobile-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search AI tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search AI tools"
            />
            <button type="submit" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </form>

          <ul className="mobile-menu-list">
            <li>
              <Link to="/" onClick={closeMenu}>Home</Link>
            </li>
            <li className={`mobile-dropdown ${isCategoriesOpen ? 'active' : ''}`}>
              <button
                onClick={toggleCategories}
                className="mobile-dropdown-trigger"
                aria-expanded={isCategoriesOpen}
                aria-haspopup="true"
                aria-label="Browse neighborhoods menu"
              >
                Neighborhoods
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {isCategoriesOpen && (
                <div className="mobile-dropdown-content">
                  <div className="nav-dropdown-grid" style={{ gridTemplateColumns: '1fr' }}>
                    {categories.map((neighborhood) => (
                      <Link
                        key={neighborhood.slug}
                        to={`/neighborhood/${neighborhood.slug}`}
                        onClick={closeMenu}
                        className="nav-dropdown-item"
                        style={{ fontSize: '11px', padding: '10px' }}
                      >
                        <span>{neighborhood.name}</span>
                        <span style={{ fontSize: '10px' }}>{neighborhood.count} daycares</span>
                      </Link>
                    ))}
                  </div>
                  <button
                    onClick={scrollToCategories}
                    className="nav-dropdown-all"
                    style={{ background: 'transparent', border: '4px solid #000' }}
                  >
                    View All Neighborhoods →
                  </button>
                </div>
              )}
            </li>
            <li>
              <Link to="/blog" onClick={closeMenu}>Blog</Link>
            </li>
            <li>
              <Link to="/about" onClick={closeMenu}>About</Link>
            </li>
            <li>
              <Link to="/submit" onClick={closeMenu}>List Your Daycare</Link>
            </li>
          </ul>

          {/* Mobile Menu Footer */}
          <div className="mobile-menu-footer">
            <div className="mobile-menu-links">
              <Link to="/privacy" onClick={closeMenu}>Privacy</Link>
              <Link to="/terms" onClick={closeMenu}>Terms</Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && <div className="mobile-menu-overlay" onClick={closeMenu}></div>}
      </div>
    </nav>
  );
}
