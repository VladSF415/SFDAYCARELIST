import { Link } from 'react-router-dom';
import './LegalPage.css';

export default function TermsOfService() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>Terms of Service</h1>
          <p className="last-updated">Last Updated: December 5, 2024</p>
        </div>

        <div className="legal-content">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using SF Daycare List ("the Service"), operated by <strong>Badly Creative LLC</strong>, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
            <p>
              Any payments, subscriptions, or transactions will be processed by <strong>Badly Creative LLC</strong>. This name will appear on your bank statements and invoices.
            </p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>
              SF Daycare List is a comprehensive directory of daycare, tools, and services operated by Badly Creative LLC. We provide information, comparisons, and resources to help users discover and evaluate AI solutions.
            </p>
          </section>

          <section>
            <h2>3. User Responsibilities</h2>
            <h3>3.1 Acceptable Use</h3>
            <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Submit false, misleading, or inaccurate information</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Engage in any form of automated data collection (scraping) without permission</li>
              <li>Transmit viruses, malware, or malicious code</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Impersonate any person or entity</li>
            </ul>

            <h3>3.2 Platform Submissions</h3>
            <p>When submitting platforms, you represent that:</p>
            <ul>
              <li>You have the right to submit the information</li>
              <li>The information is accurate and not misleading</li>
              <li>The submission does not violate any third-party rights</li>
              <li>You grant us a license to display and distribute the information</li>
            </ul>
          </section>

          <section>
            <h2>4. Intellectual Property</h2>
            <h3>4.1 Our Content</h3>
            <p>
              The Service, including its design, text, graphics, logos, and software, is owned by us or our licensors and is protected by copyright, trademark, and other intellectual property laws.
            </p>

            <h3>4.2 User Content</h3>
            <p>
              By submitting content to the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, publish, and distribute that content in connection with the Service.
            </p>

            <h3>4.3 Third-Party Content</h3>
            <p>
              Platform listings, descriptions, and logos are property of their respective owners. We claim no ownership over third-party trademarks or content.
            </p>
          </section>

          <section>
            <h2>5. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul>
              <li>Accuracy, completeness, or reliability of content</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement of third-party rights</li>
              <li>Uninterrupted or error-free operation</li>
            </ul>
          </section>

          <section>
            <h2>6. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
          </section>

          <section>
            <h2>7. Affiliate Relationships</h2>
            <p>
              This website may contain affiliate links to products and services. We may receive compensation when you click on or make purchases through these links. This does not affect our editorial independence or the accuracy of our content.
            </p>
          </section>

          <section>
            <h2>8. Third-Party Links</h2>
            <p>
              The Service contains links to third-party websites. We are not responsible for the content, privacy policies, or practices of these external sites. You access them at your own risk.
            </p>
          </section>

          <section>
            <h2>9. Modifications to Service</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue the Service at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation.
            </p>
          </section>

          <section>
            <h2>10. Content Removal</h2>
            <p>
              We reserve the right to remove any content from the Service at our sole discretion, including platform listings that violate these Terms or are deemed inappropriate.
            </p>
          </section>

          <section>
            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify and hold us harmless from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section>
            <h2>12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2>13. Dispute Resolution</h2>
            <p>
              Any disputes arising from these Terms or the Service shall be resolved through binding arbitration, except where prohibited by law.
            </p>
          </section>

          <section>
            <h2>14. Changes to Terms</h2>
            <p>
              We may revise these Terms at any time by posting the updated terms on this page. Your continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2>15. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
            </p>
          </section>

          <section>
            <h2>16. Contact Information</h2>
            <p>For questions about these Terms, contact us at:</p>
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
