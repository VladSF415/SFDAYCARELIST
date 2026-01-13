import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [stats, setStats] = useState({ daycares: 5, neighborhoods: 12 });

  useEffect(() => {
    // Fetch actual stats from API
    fetch('/api/daycares?limit=0')
      .then(res => res.json())
      .then(data => {
        setStats(prev => ({ ...prev, daycares: data.total || prev.daycares }));
      })
      .catch(() => {});

    fetch('/api/neighborhoods')
      .then(res => res.json())
      .then(data => {
        setStats(prev => ({ ...prev, neighborhoods: data.length || prev.neighborhoods }));
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* About Section */}
          <div className="footer-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <img
                src="/logo-temp.svg"
                alt="SF Daycare List Logo"
                style={{ width: '40px', height: '40px' }}
              />
              <h3 style={{ margin: 0 }}>SF Daycare List</h3>
            </div>
            <p>
              The most comprehensive directory of licensed daycares in San Francisco.
              Find trusted childcare options across all SF neighborhoods with verified reviews and transparent pricing.
            </p>
            <div className="footer-stats">
              <div className="stat">
                <strong>{stats.daycares}+</strong>
                <span>Daycares</span>
              </div>
              <div className="stat">
                <strong>{stats.neighborhoods}+</strong>
                <span>Neighborhoods</span>
              </div>
              <div className="stat">
                <strong>Licensed</strong>
                <span>& Verified</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/submit">List Your Daycare</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h4>Parent Resources</h4>
            <ul>
              <li><Link to="/choosing-a-daycare">Choosing a Daycare Guide</Link></li>
              <li><Link to="/licensing-information">Understanding Licensing</Link></li>
              <li><Link to="/financial-aid">Financial Aid & Subsidies</Link></li>
              <li><Link to="/preschool-readiness">Preschool Readiness</Link></li>
              <li><Link to="/contact">Questions? Contact Us</Link></li>
            </ul>
          </div>

          {/* Neighborhoods */}
          <div className="footer-section">
            <h4>Popular Neighborhoods</h4>
            <ul>
              <li><Link to="/neighborhood/mission">Mission District</Link></li>
              <li><Link to="/neighborhood/noe-valley">Noe Valley</Link></li>
              <li><Link to="/neighborhood/castro">Castro</Link></li>
              <li><Link to="/neighborhood/soma">SoMa</Link></li>
              <li><Link to="/neighborhood/sunset">Sunset District</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h4>Legal & Policies</h4>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookie-policy">Cookie Policy</Link></li>
              <li><Link to="/dmca">DMCA Policy</Link></li>
              <li><Link to="/disclaimer">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} SF Daycare List. Operated by <strong>Badly Creative LLC</strong>. All rights reserved.
            </p>
            <div className="footer-links">
              <Link to="/sitemap.xml">Sitemap</Link>
              <span className="separator">•</span>
              <Link to="/rss">RSS Feed</Link>
              <span className="separator">•</span>
              <a href="https://github.com/VladSF415/SFDAYCARELIST" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
