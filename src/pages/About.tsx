import { Link } from 'react-router-dom';
import { SocialMetaTags } from '../components/SocialMetaTags';
import './legal/LegalPage.css';

export default function About() {
  return (
    <>
      <SocialMetaTags
        title="About Us - AI Platforms List"
        description="Learn about AI Platforms List, the most comprehensive directory of AI tools and software. Discover our mission, team, and how we curate the best AI platforms."
        url="https://aiplatformslist.com/about"
      />

      <div className="legal-page">
        <div className="legal-container">
          <div className="legal-header">
            <Link to="/" className="back-link">← Back to Home</Link>
            <h1>About AI Platforms List</h1>
            <p className="last-updated">Your Trusted AI Tools Directory Since 2024</p>
          </div>

          <div className="legal-content">
            <section>
              <h2>Our Mission</h2>
              <p>
                AI Platforms List is the most comprehensive and curated directory of artificial intelligence tools and software. Our mission is to help businesses, developers, and enthusiasts discover the right AI solutions for their needs.
              </p>
              <p>
                With over <strong>743+ AI platforms</strong> and growing, we provide detailed information, comparisons, and guides to help you navigate the rapidly evolving AI landscape.
              </p>
            </section>

            <section>
              <h2>What We Offer</h2>
              <div className="feature-grid">
                <div>
                  <h3>Comprehensive Directory</h3>
                  <p>Browse 743+ AI tools across 17 categories including writing, coding, image generation, video creation, analytics, and more.</p>
                </div>
                <div>
                  <h3>Expert Curation</h3>
                  <p>Every platform is carefully reviewed and verified to ensure quality and legitimacy.</p>
                </div>
                <div>
                  <h3>Detailed Comparisons</h3>
                  <p>Side-by-side comparisons of popular AI tools to help you make informed decisions.</p>
                </div>
                <div>
                  <h3>In-Depth Guides</h3>
                  <p>Comprehensive guides and best practices for different AI use cases and categories.</p>
                </div>
              </div>
            </section>

            <section>
              <h2>How We Curate</h2>
              <p>Quality is our top priority. Here's how we ensure the best directory experience:</p>
              <ul>
                <li><strong>Manual Review:</strong> Every submission is manually reviewed by our team</li>
                <li><strong>Quality Checks:</strong> We verify functionality, legitimacy, and user reviews</li>
                <li><strong>Regular Updates:</strong> Platforms are continuously monitored for changes and updates</li>
                <li><strong>Community Feedback:</strong> We listen to user feedback and ratings</li>
                <li><strong>Transparency:</strong> Clear distinction between free, freemium, and paid tools</li>
              </ul>
            </section>

            <section>
              <h2>Our Categories</h2>
              <p>We organize AI tools into intuitive categories to help you find exactly what you need. Each category features in-depth guides, comparisons, and curated tool selections:</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                <div style={{ border: '3px solid #000', padding: '20px', background: '#fff' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>🤖 Large Language Models (LLMs)</h3>
                  <p style={{ lineHeight: '1.6', marginBottom: '10px' }}>
                    Discover powerful language models like ChatGPT, Claude, GPT-4, and open-source alternatives. Compare capabilities,
                    pricing, and use cases for content generation, coding, research, and conversational AI.
                  </p>
                  <Link to="/category/llms" style={{ color: '#000', textDecoration: 'underline', fontWeight: '900', textDecorationThickness: '2px' }}>
                    Explore LLMs →
                  </Link>
                </div>

                <div style={{ border: '3px solid #000', padding: '20px', background: '#fff' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>✨ Generative AI Tools</h3>
                  <p style={{ lineHeight: '1.6', marginBottom: '10px' }}>
                    Explore cutting-edge generative AI platforms for creating text, images, videos, and audio. From Midjourney and DALL-E
                    to music generators and video synthesis tools.
                  </p>
                  <Link to="/category/generative-ai" style={{ color: '#000', textDecoration: 'underline', fontWeight: '900', textDecorationThickness: '2px' }}>
                    Explore Generative AI →
                  </Link>
                </div>

                <div style={{ border: '3px solid #000', padding: '20px', background: '#fff' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>💻 Code AI Assistants</h3>
                  <p style={{ lineHeight: '1.6', marginBottom: '10px' }}>
                    Find the best AI coding tools including GitHub Copilot alternatives, code completion, debugging assistants, and
                    automated testing platforms to boost developer productivity.
                  </p>
                  <Link to="/category/code-ai" style={{ color: '#000', textDecoration: 'underline', fontWeight: '900', textDecorationThickness: '2px' }}>
                    Explore Code AI →
                  </Link>
                </div>

                <div style={{ border: '3px solid #000', padding: '20px', background: '#fff' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>👁️ Computer Vision</h3>
                  <p style={{ lineHeight: '1.6', marginBottom: '10px' }}>
                    Access advanced computer vision platforms for object detection, facial recognition, image classification, OCR, and
                    visual AI applications across industries.
                  </p>
                  <Link to="/category/computer-vision" style={{ color: '#000', textDecoration: 'underline', fontWeight: '900', textDecorationThickness: '2px' }}>
                    Explore Computer Vision →
                  </Link>
                </div>

                <div style={{ border: '3px solid #000', padding: '20px', background: '#fff' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>📝 Natural Language Processing</h3>
                  <p style={{ lineHeight: '1.6', marginBottom: '10px' }}>
                    Discover NLP tools for text analysis, sentiment detection, entity extraction, translation, summarization, and
                    language understanding capabilities.
                  </p>
                  <Link to="/category/nlp" style={{ color: '#000', textDecoration: 'underline', fontWeight: '900', textDecorationThickness: '2px' }}>
                    Explore NLP →
                  </Link>
                </div>

                <div style={{ border: '3px solid #000', padding: '20px', background: '#fff' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>🎨 Image Generation</h3>
                  <p style={{ lineHeight: '1.6', marginBottom: '10px' }}>
                    Compare the best AI image generators from text-to-image tools like Midjourney and DALL-E to specialized art AI platforms.
                  </p>
                  <Link to="/category/image-generation" style={{ color: '#000', textDecoration: 'underline', fontWeight: '900', textDecorationThickness: '2px' }}>
                    Explore Image Generation →
                  </Link>
                </div>

                <div style={{ border: '3px solid #000', padding: '20px', background: '#fff' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>🎬 Video & Audio AI</h3>
                  <p style={{ lineHeight: '1.6', marginBottom: '10px' }}>
                    Find AI video editing, generation, and image creation tools. From text-to-video platforms to AI-powered editing
                    suites and audio synthesis software.
                  </p>
                  <Link to="/category/video-ai" style={{ color: '#000', textDecoration: 'underline', fontWeight: '900', textDecorationThickness: '2px' }}>
                    Explore Video AI →
                  </Link>
                </div>

                <div style={{ border: '3px solid #000', padding: '20px', background: '#fff' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>📊 Analytics & BI</h3>
                  <p style={{ lineHeight: '1.6', marginBottom: '10px' }}>
                    Discover AI-powered analytics and business intelligence tools for data analysis, visualization, and automated insights
                    that drive better decisions.
                  </p>
                  <Link to="/category/analytics-bi" style={{ color: '#000', textDecoration: 'underline', fontWeight: '900', textDecorationThickness: '2px' }}>
                    Explore Analytics →
                  </Link>
                </div>
              </div>

              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <Link to="/" style={{
                  display: 'inline-block',
                  padding: '14px 28px',
                  background: '#000',
                  color: '#fff',
                  textDecoration: 'none',
                  fontFamily: "'Courier New', monospace",
                  fontWeight: '900',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  border: '4px solid #000'
                }}>
                  View All Categories →
                </Link>
              </div>
            </section>

            <section>
              <h2>For Platform Owners</h2>
              <p>
                Are you building an AI tool? We'd love to feature your platform in our directory.
                <Link to="/submit" style={{ marginLeft: '0.5rem', color: '#000000', textDecoration: 'underline', textDecorationThickness: '2px', fontWeight: '900' }}>
                  Submit your AI platform →
                </Link>
              </p>
              <p>Benefits of listing your platform:</p>
              <ul>
                <li>Reach thousands of potential users actively searching for AI tools</li>
                <li>Increase your platform's visibility and SEO</li>
                <li>Get featured in relevant comparisons and guides</li>
                <li>Build credibility with verified badges</li>
              </ul>
            </section>

            <section>
              <h2>Our Commitment</h2>
              <p>
                We are committed to maintaining the most accurate, comprehensive, and user-friendly AI directory on the web. We don't accept payment for listings or reviews, ensuring our directory remains unbiased and trustworthy.
              </p>
              <p>
                <strong>Transparency:</strong> Featured listings are clearly marked and help support the operation of this directory while maintaining editorial independence.
              </p>
            </section>

            <section>
              <h2>Contact Us</h2>
              <p>
                Have questions, suggestions, or want to report an issue? We'd love to hear from you.
              </p>
              <p>
                <strong>Email:</strong> <a href="mailto:info@aiplatformslist.com" style={{ color: '#000000', textDecoration: 'underline', textDecorationThickness: '2px' }}>info@aiplatformslist.com</a>
              </p>
              <p>
                <strong>Submit a Platform:</strong> <Link to="/submit" style={{ color: '#000000', textDecoration: 'underline', textDecorationThickness: '2px' }}>Use our submission form</Link>
              </p>
            </section>

            <section>
              <h2>Stay Updated</h2>
              <p>
                The AI landscape changes rapidly. We continuously update our directory with new platforms, features, and guides to keep you informed about the latest developments in AI technology.
              </p>
              <p>
                Bookmark us and check back regularly to discover new AI tools and stay ahead of the curve.
              </p>
            </section>

            <div style={{
              marginTop: '3rem',
              padding: '2rem',
              background: '#f5f5f5',
              border: '4px solid #000000'
            }}>
              <h3 style={{ marginTop: 0, fontFamily: "'Courier New', monospace", textTransform: 'uppercase', letterSpacing: '2px' }}>AI Platforms List by the Numbers</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: '900', color: '#000000', fontFamily: "'Courier New', monospace" }}>743+</div>
                  <div style={{ color: '#666', fontSize: '0.9rem', fontFamily: "'Courier New', monospace", textTransform: 'uppercase' }}>AI Platforms</div>
                </div>
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: '900', color: '#000000', fontFamily: "'Courier New', monospace" }}>17+</div>
                  <div style={{ color: '#666', fontSize: '0.9rem', fontFamily: "'Courier New', monospace", textTransform: 'uppercase' }}>Categories</div>
                </div>
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: '900', color: '#000000', fontFamily: "'Courier New', monospace" }}>100+</div>
                  <div style={{ color: '#666', fontSize: '0.9rem', fontFamily: "'Courier New', monospace", textTransform: 'uppercase' }}>Comparisons</div>
                </div>
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: '900', color: '#000000', fontFamily: "'Courier New', monospace" }}>Daily</div>
                  <div style={{ color: '#666', fontSize: '0.9rem', fontFamily: "'Courier New', monospace", textTransform: 'uppercase' }}>Updates</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center', padding: '2rem 0', borderTop: '4px solid #000000' }}>
              <p style={{ fontSize: '0.9rem', color: '#666', fontFamily: "'Courier New', monospace" }}>
                Operated by <strong style={{ background: '#FFFF00', padding: '2px 8px' }}>BADLY CREATIVE LLC</strong>
              </p>
              <div style={{ marginTop: '1rem' }}>
                <Link to="/privacy" style={{ margin: '0 1rem', color: '#000000', textDecoration: 'underline', textDecorationThickness: '2px', fontFamily: "'Courier New', monospace" }}>Privacy Policy</Link>
                <Link to="/terms" style={{ margin: '0 1rem', color: '#000000', textDecoration: 'underline', textDecorationThickness: '2px', fontFamily: "'Courier New', monospace" }}>Terms of Service</Link>
                <Link to="/disclaimer" style={{ margin: '0 1rem', color: '#000000', textDecoration: 'underline', textDecorationThickness: '2px', fontFamily: "'Courier New', monospace" }}>Disclaimer</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
