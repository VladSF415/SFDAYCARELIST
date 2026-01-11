import { Link } from 'react-router-dom';
import './LegalPage.css';

export default function CookiePolicy() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>Cookie Policy</h1>
          <p className="last-updated">Last Updated: December 5, 2024</p>
        </div>

        <div className="legal-content">
          <section>
            <h2>What Are Cookies</h2>
            <p>
              Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing site usage.
            </p>
          </section>

          <section>
            <h2>Types of Cookies We Use</h2>
            <h3>Essential Cookies</h3>
            <p>Required for the website to function properly. These cannot be disabled.</p>

            <h3>Analytics Cookies</h3>
            <p>Help us understand how visitors interact with our website by collecting anonymous information.</p>

            <h3>Functional Cookies</h3>
            <p>Remember your preferences and settings to provide enhanced features.</p>

            <h3>Advertising Cookies</h3>
            <p>Used to deliver relevant advertisements and track advertising effectiveness.</p>
          </section>

          <section>
            <h2>Managing Cookies</h2>
            <p>
              You can control and delete cookies through your browser settings. However, disabling cookies may affect website functionality.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>Questions about our Cookie Policy? <Link to="/contact">Contact us</Link></p>
          </section>
        </div>
      </div>
    </div>
  );
}
