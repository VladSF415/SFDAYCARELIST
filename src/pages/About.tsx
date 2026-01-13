import { Link } from 'react-router-dom';
import { SocialMetaTags } from '../components/SocialMetaTags';
import './legal/LegalPage.css';

export default function About() {
  return (
    <>
      <SocialMetaTags
        title="About Us - SF Daycare List"
        description="Learn about SF Daycare List, the most comprehensive directory of licensed daycares in San Francisco. Find quality childcare near you."
        url="https://sfdaycarelist.com/about"
      />

      <div className="legal-page">
        <div className="legal-container">
          <div className="legal-header">
            <Link to="/" className="back-link">← Back to Home</Link>
            <h1>About SF Daycare List</h1>
            <p className="last-updated">San Francisco's Trusted Daycare Directory</p>
          </div>

          <div className="legal-content">
            <section>
              <h2>Our Mission</h2>
              <p>
                SF Daycare List is the most comprehensive directory of licensed daycares in San Francisco.
                Our mission is to help parents find safe, quality childcare options across all SF neighborhoods.
              </p>
              <p>
                We provide detailed information about licensed daycares, including availability, pricing, programs,
                and verified parent reviews to help you make the best choice for your family.
              </p>
            </section>

            <section>
              <h2>What We Offer</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '24px' }}>
                <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '24px', border: '2px solid #e2e8f0' }}>
                  <h3 style={{ color: '#1e3a8a', marginBottom: '12px' }}>Comprehensive Directory</h3>
                  <p>Browse licensed daycares across all 12 major SF neighborhoods with detailed profiles, photos, and contact information.</p>
                </div>
                <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '24px', border: '2px solid #e2e8f0' }}>
                  <h3 style={{ color: '#1e3a8a', marginBottom: '12px' }}>Verified Reviews</h3>
                  <p>Read authentic reviews from real SF parents to learn about their experiences with local daycares.</p>
                </div>
                <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '24px', border: '2px solid #e2e8f0' }}>
                  <h3 style={{ color: '#1e3a8a', marginBottom: '12px' }}>Licensing Information</h3>
                  <p>View California licensing status, inspection scores, and compliance records for complete transparency.</p>
                </div>
                <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '24px', border: '2px solid #e2e8f0' }}>
                  <h3 style={{ color: '#1e3a8a', marginBottom: '12px' }}>Parent Resources</h3>
                  <p>Access guides on choosing daycares, understanding licensing, financial aid, and preschool readiness.</p>
                </div>
              </div>
            </section>

            <section>
              <h2>Why Trust Us?</h2>
              <p>SF Daycare List is operated by <strong>Badly Creative LLC</strong>, a San Francisco-based company dedicated to helping local families.</p>
              <ul style={{ lineHeight: '1.8', marginTop: '16px' }}>
                <li><strong>Local Focus:</strong> We exclusively serve San Francisco families and understand SF's unique childcare landscape</li>
                <li><strong>Verified Data:</strong> All licensing information is sourced from California Department of Social Services</li>
                <li><strong>No Bias:</strong> We don't favor certain daycares - all listings are treated equally unless premium</li>
                <li><strong>Parent-First:</strong> Built by parents, for parents, to make the childcare search easier</li>
                <li><strong>Transparency:</strong> Clear pricing, availability, and honest reviews from real SF families</li>
              </ul>
            </section>

            <section>
              <h2>SF Neighborhoods We Cover</h2>
              <p>Find licensed daycares in all major San Francisco neighborhoods:</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '20px' }}>
                <Link to="/neighborhood/mission" style={{ padding: '12px', background: '#fff', border: '2px solid #e2e8f0', borderRadius: '8px', textDecoration: 'none', color: '#1e3a8a', fontWeight: '600', transition: 'all 0.2s' }}>
                  📍 Mission District
                </Link>
                <Link to="/neighborhood/noe-valley" style={{ padding: '12px', background: '#fff', border: '2px solid #e2e8f0', borderRadius: '8px', textDecoration: 'none', color: '#1e3a8a', fontWeight: '600' }}>
                  📍 Noe Valley
                </Link>
                <Link to="/neighborhood/castro" style={{ padding: '12px', background: '#fff', border: '2px solid #e2e8f0', borderRadius: '8px', textDecoration: 'none', color: '#1e3a8a', fontWeight: '600' }}>
                  📍 Castro
                </Link>
                <Link to="/neighborhood/pacific-heights" style={{ padding: '12px', background: '#fff', border: '2px solid #e2e8f0', borderRadius: '8px', textDecoration: 'none', color: '#1e3a8a', fontWeight: '600' }}>
                  📍 Pacific Heights
                </Link>
                <Link to="/neighborhood/marina" style={{ padding: '12px', background: '#fff', border: '2px solid #e2e8f0', borderRadius: '8px', textDecoration: 'none', color: '#1e3a8a', fontWeight: '600' }}>
                  📍 Marina
                </Link>
                <Link to="/neighborhood/sunset" style={{ padding: '12px', background: '#fff', border: '2px solid #e2e8f0', borderRadius: '8px', textDecoration: 'none', color: '#1e3a8a', fontWeight: '600' }}>
                  📍 Sunset District
                </Link>
              </div>
            </section>

            <section>
              <h2>Get In Touch</h2>
              <p>
                Have questions? Want to list your daycare? We'd love to hear from you!
              </p>
              <p style={{ marginTop: '16px' }}>
                <Link to="/contact" style={{ display: 'inline-block', padding: '12px 24px', background: 'linear-gradient(135deg, #ff6b35, #ee6c4d)', color: 'white', borderRadius: '24px', textDecoration: 'none', fontWeight: '700' }}>
                  Contact Us
                </Link>
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
