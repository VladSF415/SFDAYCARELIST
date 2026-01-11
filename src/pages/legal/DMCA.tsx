import { Link } from 'react-router-dom';
import './LegalPage.css';

export default function DMCA() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>DMCA Policy</h1>
          <p className="last-updated">Last Updated: December 5, 2024</p>
        </div>

        <div className="legal-content">
          <section>
            <h2>Copyright Infringement</h2>
            <p>
              We respect intellectual property rights. If you believe content on our site infringes your copyright, please notify us with the following information:
            </p>
            <ul>
              <li>Identification of the copyrighted work</li>
              <li>Location of the infringing material (URL)</li>
              <li>Your contact information</li>
              <li>A statement of good faith belief</li>
              <li>A statement under penalty of perjury</li>
              <li>Your physical or electronic signature</li>
            </ul>
          </section>

          <section>
            <h2>Contact for DMCA</h2>
            <p>Send notices to: info@aiplatformslist.com</p>
          </section>

          <section>
            <h2>Counter-Notification</h2>
            <p>
              If your content was removed due to a DMCA notice, you may file a counter-notification if you believe the removal was mistaken.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
