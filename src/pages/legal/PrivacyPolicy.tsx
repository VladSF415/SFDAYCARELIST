import { Link } from 'react-router-dom';
import './LegalPage.css';

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: December 5, 2024</p>
        </div>

        <div className="legal-content">
          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to SF Daycare List ("we," "our," or "us"), operated by <strong>Badly Creative LLC</strong>. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website.
            </p>
            <p>
              When you make payments or subscriptions, you may see <strong>Badly Creative LLC</strong> on your statements. This is the legal entity that operates SF Daycare List.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <h3>2.1 Information You Provide</h3>
            <ul>
              <li>Platform submissions (name, email, platform details)</li>
              <li>Contact form submissions</li>
              <li>Newsletter subscriptions (if applicable)</li>
              <li>Comments and feedback</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <ul>
              <li>IP addresses and browser information</li>
              <li>Pages visited and time spent on site</li>
              <li>Referring websites and search terms</li>
              <li>Device and operating system information</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use collected information for:</p>
            <ul>
              <li>Operating and improving our directory service</li>
              <li>Reviewing and adding submitted daycares</li>
              <li>Responding to your inquiries</li>
              <li>Sending updates (with your consent)</li>
              <li>Analyzing site usage and trends</li>
              <li>Preventing fraud and abuse</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2>4. Cookies and Tracking</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Remember your preferences</li>
              <li>Analyze site traffic and usage</li>
              <li>Provide personalized content</li>
              <li>Measure advertising effectiveness</li>
            </ul>
            <p>
              You can control cookies through your browser settings. See our{' '}
              <Link to="/cookie-policy">Cookie Policy</Link> for more details.
            </p>
          </section>

          <section>
            <h2>5. Third-Party Services</h2>
            <p>We may use third-party services including:</p>
            <ul>
              <li><strong>Analytics:</strong> Google Analytics, Plausible, or similar services</li>
              <li><strong>Hosting:</strong> Railway, Vercel, or similar providers</li>
              <li><strong>CDN:</strong> Cloudflare or similar services</li>
              <li><strong>Affiliate Networks:</strong> Impact, PartnerStack, ShareASale</li>
            </ul>
            <p>These services have their own privacy policies governing their use of your information.</p>
          </section>

          <section>
            <h2>6. Data Retention</h2>
            <p>
              We retain your personal data only as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
            </p>
          </section>

          <section>
            <h2>7. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to data processing</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
            </ul>
            <p>To exercise these rights, contact us at: info@sfdaycarelist.com</p>
          </section>

          <section>
            <h2>8. Children's Privacy</h2>
            <p>
              Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
            </p>
          </section>

          <section>
            <h2>9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data.
            </p>
          </section>

          <section>
            <h2>10. Security</h2>
            <p>
              We implement reasonable security measures to protect your personal data. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated "Last Updated" date.
            </p>
          </section>

          <section>
            <h2>12. Contact Us</h2>
            <p>If you have questions about this privacy policy, please contact us at:</p>
            <ul>
              <li>Email: info@sfdaycarelist.com</li>
              <li>Website: <Link to="/contact">Contact Form</Link></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
