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
              AI Platforms Directory is owned and operated by <strong>Badly Creative LLC</strong>. All payments, subscriptions, and transactions are processed by Badly Creative LLC, which is the name that will appear on your statements.
            </p>
          </section>

          <section>
            <h2>Information Accuracy</h2>
            <p>
              The information on AI Platforms Directory is provided for general informational purposes only. While we strive for accuracy, we make no warranties about the completeness, reliability, or accuracy of this information.
            </p>
          </section>

          <section>
            <h2>No Professional Advice</h2>
            <p>
              Content on this site does not constitute professional advice. Always consult with qualified professionals for specific guidance related to your situation.
            </p>
          </section>

          <section>
            <h2>Third-Party Content</h2>
            <p>
              Platform descriptions, features, and pricing are provided by third parties or publicly available information. We are not responsible for inaccuracies in third-party content.
            </p>
          </section>

          <section>
            <h2>Affiliate Disclosure</h2>
            <p>
              This website contains affiliate links. We may earn a commission when you click on or make purchases through these links at no additional cost to you.
            </p>
          </section>

          <section>
            <h2>No Endorsement</h2>
            <p>
              Listing a platform does not constitute an endorsement. Users should conduct their own research before making any decisions.
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
