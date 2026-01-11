import { Link } from 'react-router-dom';
import { SocialMetaTags } from '../components/SocialMetaTags';
import './legal/LegalPage.css';

export default function Methodology() {
  return (
    <>
      <SocialMetaTags
        title="Our Research Methodology - AI Platforms List"
        description="Learn how we evaluate, test, and review AI tools and platforms. Our rigorous methodology ensures accurate, unbiased recommendations."
        url="https://aiplatformslist.com/methodology"
        type="website"
      />

      <div className="legal-page">
        <div className="legal-container">
          <div className="legal-header">
            <Link to="/" className="back-link">← Back to Directory</Link>
            <h1>Research Methodology</h1>
            <p className="last-updated">
              How we evaluate and review AI platforms
            </p>
          </div>

          <div className="legal-content">
            {/* Trust Badge */}
            <div style={{
              padding: '1.5rem',
              background: '#FFFF00',
              border: '4px solid #000',
              marginBottom: '2rem',
              fontFamily: "'Courier New', monospace",
              fontWeight: '700'
            }}>
              <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                📊 Independent Research Since 2024
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                870+ platforms evaluated | 800+ comparisons published | Updated quarterly
              </div>
            </div>

            <h2>Our Evaluation Process</h2>
            <p>
              AI Platforms List maintains one of the most comprehensive AI tool directories online. Our research methodology combines hands-on testing, data analysis, and community feedback to provide accurate, actionable recommendations.
            </p>

            <h3>1. Platform Discovery & Cataloging</h3>
            <p>
              We continuously monitor the AI ecosystem for new platforms through:
            </p>
            <ul>
              <li><strong>Direct submissions</strong> from developers and companies</li>
              <li><strong>Industry monitoring</strong> of product launches, funding announcements, and tech news</li>
              <li><strong>Community recommendations</strong> from our user base</li>
              <li><strong>Academic research</strong> and published papers on emerging AI technologies</li>
              <li><strong>Conference attendance</strong> and industry event coverage</li>
            </ul>

            <h3>2. Initial Assessment Criteria</h3>
            <p>
              Each platform undergoes an initial screening to determine relevance and quality:
            </p>
            <ul>
              <li><strong>Accessibility:</strong> Is the platform publicly available or in beta?</li>
              <li><strong>Functionality:</strong> Does it provide working AI capabilities?</li>
              <li><strong>Documentation:</strong> Are features and use cases clearly explained?</li>
              <li><strong>Pricing transparency:</strong> Is pricing information publicly available?</li>
              <li><strong>Market fit:</strong> Does it serve a genuine use case?</li>
            </ul>

            <h3>3. Hands-On Testing</h3>
            <p>
              For guides and comparison articles, we conduct firsthand testing when possible:
            </p>
            <ul>
              <li><strong>Free tier evaluation:</strong> Test free plans or trials to assess core functionality</li>
              <li><strong>Feature verification:</strong> Confirm claimed capabilities match reality</li>
              <li><strong>Performance benchmarking:</strong> Measure speed, accuracy, and output quality</li>
              <li><strong>User experience assessment:</strong> Evaluate ease of use, UI/UX, and learning curve</li>
              <li><strong>Documentation review:</strong> Test API docs, tutorials, and support resources</li>
            </ul>

            <h3>4. Data Collection & Analysis</h3>
            <p>
              We gather quantitative and qualitative data across multiple dimensions:
            </p>

            <h4>Pricing Analysis</h4>
            <ul>
              <li>Free tier limitations and quotas</li>
              <li>Paid plan pricing per tier</li>
              <li>API costs and rate limits</li>
              <li>Enterprise pricing (when available)</li>
              <li>Cost-per-use calculations for comparable workloads</li>
            </ul>

            <h4>Feature Comparison</h4>
            <ul>
              <li>Core capabilities and supported use cases</li>
              <li>Input/output formats and limitations</li>
              <li>Integration options (API, SDKs, plugins)</li>
              <li>Platform-specific advantages</li>
              <li>Unique differentiators vs competitors</li>
            </ul>

            <h4>Technical Specifications</h4>
            <ul>
              <li>Model architecture and parameters (when disclosed)</li>
              <li>Context windows and token limits</li>
              <li>Supported languages and modalities</li>
              <li>Deployment options (cloud, on-premise, edge)</li>
              <li>Security and compliance certifications</li>
            </ul>

            <h3>5. User Research & Community Input</h3>
            <p>
              We value real-world experiences from actual users:
            </p>
            <ul>
              <li>Review aggregation from verified users</li>
              <li>Developer community feedback (GitHub, Discord, forums)</li>
              <li>Support quality assessment</li>
              <li>Update frequency and changelog monitoring</li>
              <li>Company responsiveness to issues and feedback</li>
            </ul>

            <h3>6. Content Creation Standards</h3>
            <p>
              All guides, comparisons, and articles follow strict editorial standards:
            </p>

            <h4>Research Requirements</h4>
            <ul>
              <li>Minimum 8-12 platforms evaluated per category guide</li>
              <li>Data current within 3 months of publication</li>
              <li>All pricing claims verified from official sources</li>
              <li>Screenshots or documentation for feature claims</li>
              <li>Competitor analysis including emerging alternatives</li>
            </ul>

            <h4>Writing Standards</h4>
            <ul>
              <li><strong>Objectivity:</strong> No promotional language or affiliate bias</li>
              <li><strong>Accuracy:</strong> All claims must be verifiable</li>
              <li><strong>Transparency:</strong> Methodology and limitations disclosed</li>
              <li><strong>Depth:</strong> 1,800-2,500 words for comprehensive coverage</li>
              <li><strong>Actionability:</strong> Clear recommendations for different use cases</li>
            </ul>

            <h4>Review Process</h4>
            <ul>
              <li>Fact-checking by editorial team</li>
              <li>Technical accuracy review</li>
              <li>Pricing and feature verification</li>
              <li>Link validation (platform URLs, documentation)</li>
              <li>SEO and readability optimization</li>
            </ul>

            <h3>7. Ongoing Maintenance</h3>
            <p>
              The AI landscape evolves rapidly. We maintain content freshness through:
            </p>
            <ul>
              <li><strong>Quarterly reviews:</strong> Major guides reviewed every 3 months</li>
              <li><strong>Breaking updates:</strong> Immediate updates for major product launches or changes</li>
              <li><strong>Pricing monitoring:</strong> Regular checks for price changes across platforms</li>
              <li><strong>Deprecation tracking:</strong> Removal of discontinued platforms</li>
              <li><strong>User reports:</strong> Community-flagged inaccuracies addressed within 48 hours</li>
            </ul>

            <h2>Editorial Independence</h2>
            <p>
              AI Platforms List operates with strict editorial independence:
            </p>
            <ul>
              <li><strong>No pay-for-placement:</strong> Directory inclusion is merit-based only</li>
              <li><strong>Transparent sponsorships:</strong> Sponsored content is clearly labeled (when applicable)</li>
              <li><strong>Affiliate disclosure:</strong> We may earn commissions on some links, but this does not influence our recommendations</li>
              <li><strong>Balanced coverage:</strong> Both pros and cons are documented for every platform</li>
              <li><strong>Correction policy:</strong> Errors are corrected promptly with notation</li>
            </ul>

            <h2>How to Use This Directory to Choose AI Tools</h2>
            <p>
              Beyond our curation, here's a framework for making the right choice for your specific needs:
            </p>

            <div style={{
              background: '#f5f5f5',
              border: '4px solid #000',
              padding: '2rem',
              marginBottom: '2rem',
              marginTop: '1.5rem'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px', marginTop: 0 }}>Step 1: Define Your Use Case</h3>
              <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>
                Start by clearly identifying what you need the AI tool to accomplish. Are you looking for content creation, code assistance,
                data analysis, or automation? Different tools excel at different tasks.
              </p>
              <p style={{ lineHeight: '1.6', marginBottom: '0' }}>
                <strong>Questions to ask:</strong> What problem am I solving? What's my primary workflow? What outputs do I need?
              </p>
            </div>

            <div style={{
              background: '#f5f5f5',
              border: '4px solid #000',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px', marginTop: 0 }}>Step 2: Consider Pricing & Budget</h3>
              <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>
                AI platforms range from free tools to enterprise solutions costing thousands per month. Compare pricing tiers, free trials,
                and what features are included at each level. Many tools offer freemium models with generous free tiers.
              </p>
              <p style={{ lineHeight: '1.6', marginBottom: '0' }}>
                <strong>Pro tip:</strong> Calculate cost per use, not just monthly fees. A $20/month tool you use daily may be cheaper than a $5/month tool with usage limits.
              </p>
            </div>

            <div style={{
              background: '#f5f5f5',
              border: '4px solid #000',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px', marginTop: 0 }}>Step 3: Evaluate Integration Capabilities</h3>
              <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>
                Check if the AI tool integrates with your existing workflow, tech stack, and favorite applications. API access, SDKs,
                and pre-built integrations can save significant implementation time.
              </p>
              <p style={{ lineHeight: '1.6', marginBottom: '0' }}>
                <strong>Key considerations:</strong> Does it have an API? SDKs for your programming language? Zapier/Make.com integrations? Native app integrations?
              </p>
            </div>

            <div style={{
              background: '#f5f5f5',
              border: '4px solid #000',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px', marginTop: 0 }}>Step 4: Review Performance & Quality</h3>
              <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>
                Test output quality, speed, accuracy, and reliability. Read user reviews, compare benchmarks, and try free trials before
                committing to paid plans. Different models have different strengths.
              </p>
              <p style={{ lineHeight: '1.6', marginBottom: '0' }}>
                <strong>Testing checklist:</strong> Run the same prompts across platforms. Check output quality. Measure response times. Test edge cases. Read recent reviews.
              </p>
            </div>

            <div style={{
              background: '#f5f5f5',
              border: '4px solid #000',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px', marginTop: 0 }}>Step 5: Check Support & Documentation</h3>
              <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>
                Ensure the platform offers adequate documentation, tutorials, customer support, and community resources. Good support
                can make the difference between success and frustration.
              </p>
              <p style={{ lineHeight: '1.6', marginBottom: '0' }}>
                <strong>Support essentials:</strong> Comprehensive docs? Active community forum? Responsive support team? Regular updates and changelogs?
              </p>
            </div>

            <h2>Limitations & Disclosure</h2>
            <p>
              We believe in transparency about our methodology's limitations:
            </p>
            <ul>
              <li><strong>Testing scope:</strong> We cannot test every feature of every platform exhaustively</li>
              <li><strong>Enterprise features:</strong> Some enterprise-only features are documented but not hands-on tested</li>
              <li><strong>Regional availability:</strong> Platform availability and pricing may vary by region</li>
              <li><strong>Rapid changes:</strong> AI products evolve quickly; some details may be outdated between quarterly reviews</li>
              <li><strong>Subjective elements:</strong> Use-case fit assessments involve editorial judgment</li>
            </ul>

            <h2>Data Sources</h2>
            <p>
              We rely on these primary sources for our research:
            </p>
            <ul>
              <li>Official platform documentation and websites</li>
              <li>Public API documentation and SDKs</li>
              <li>Verified user reviews (G2, Capterra, Product Hunt)</li>
              <li>Company announcements and press releases</li>
              <li>Academic papers and technical reports</li>
              <li>Developer community discussions (GitHub, Stack Overflow, Reddit)</li>
              <li>Industry analyst reports (when publicly available)</li>
            </ul>

            <h2>Contact Us</h2>
            <p>
              Questions about our methodology? Found an error in our research?
            </p>
            <ul>
              <li><strong>Corrections:</strong> <Link to="/contact">Report an inaccuracy</Link></li>
              <li><strong>Platform submissions:</strong> <Link to="/submit">Submit your platform</Link></li>
              <li><strong>Partnership inquiries:</strong> <Link to="/contact">Get in touch</Link></li>
            </ul>

            {/* CTA */}
            <div style={{
              marginTop: '3rem',
              padding: '2rem',
              background: '#000',
              color: '#fff',
              border: '4px solid #000',
              textAlign: 'center'
            }}>
              <h3 style={{ marginTop: 0 }}>Explore Our Research</h3>
              <p>Browse 870+ evaluated platforms and 800+ detailed comparisons</p>
              <Link
                to="/"
                style={{
                  display: 'inline-block',
                  padding: '1rem 2rem',
                  background: '#FFFF00',
                  color: '#000',
                  textDecoration: 'none',
                  fontFamily: "'Courier New', monospace",
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  marginRight: '1rem'
                }}
              >
                View Directory
              </Link>
              <Link
                to="/blog"
                style={{
                  display: 'inline-block',
                  padding: '1rem 2rem',
                  background: '#fff',
                  color: '#000',
                  textDecoration: 'none',
                  fontFamily: "'Courier New', monospace",
                  fontWeight: '900',
                  textTransform: 'uppercase'
                }}
              >
                Read Guides
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
