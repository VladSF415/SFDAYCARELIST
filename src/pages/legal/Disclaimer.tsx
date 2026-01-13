import { Link } from 'react-router-dom';
import './LegalPage.css';

export default function Disclaimer() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>Disclaimer</h1>
          <p className="last-updated">Last Updated: December 5, 2024</p>
        </div>

        <div className="legal-content">
          <section>
            <h2>Operating Entity</h2>
            <p>
              SF Daycare List is owned and operated by <strong>Badly Creative LLC</strong>. All payments, subscriptions, and transactions are processed by Badly Creative LLC, which is the name that will appear on your statements.
            </p>
          </section>

          <section>
            <h2>Information Accuracy</h2>
            <p>
              The information on SF Daycare List is provided for general informational purposes only. While we strive for accuracy, we make no warranties about the completeness, reliability, or accuracy of this information. Daycare details, availability, and pricing may change without notice.
            </p>
          </section>

          <section>
            <h2>No Professional Advice</h2>
            <p>
              Content on this site does not constitute professional childcare advice or recommendations. Always conduct your own research, visit facilities in person, verify licensing status with California Department of Social Services, and consult with childcare professionals for specific guidance related to your family's needs.
            </p>
          </section>

          <section>
            <h2>Third-Party Content</h2>
            <p>
              Daycare descriptions, photos, pricing, and availability information are provided by the facilities themselves or from publicly available sources. We are not responsible for inaccuracies in third-party content. Parents should verify all information directly with the daycare facility.
            </p>
          </section>

          <section>
            <h2>Licensing Verification</h2>
            <p>
              While we list licensing information, parents are strongly encouraged to independently verify the current licensing status, inspection records, and compliance history of any daycare facility through the California Department of Social Services website.
            </p>
          </section>

          <section>
            <h2>No Endorsement</h2>
            <p>
              Listing a daycare in our directory does not constitute an endorsement or recommendation. Parents should conduct their own thorough research, visit facilities, check references, and make informed decisions about childcare.
            </p>
          </section>

          <section>
            <h2>Limitation of Liability</h2>
            <p>
              We shall not be liable for any damages arising from the use of or inability to use this website or its content.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
