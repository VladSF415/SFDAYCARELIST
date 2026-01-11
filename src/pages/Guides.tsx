import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SocialMetaTags } from '../components/SocialMetaTags';
import './guides-mobile.css';

export default function Guides() {
  const navigate = useNavigate();
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/pillar');
      const data = await response.json();
      setGuides(data);
    } catch (error) {
      console.error('Failed to fetch guides:', error);
    }
    setLoading(false);
  };

  // Extract unique categories from guides
  const categories = Array.from(new Set(guides.map(g => g.category).filter(Boolean)));

  const filteredGuides = selectedCategory === 'all'
    ? guides
    : guides.filter(g => g.category === selectedCategory);

  return (
    <>
      <SocialMetaTags
        title="AI Tools Guides & Resources - Expert Insights & Comparisons"
        description="Comprehensive guides, comparisons, and resources to help you choose the best AI tools. Expert insights on LLMs, generative AI, code assistants, and more."
        url="https://aiplatformslist.com/guides"
        type="website"
      />

      <div className="guides-page">
        <div className="guides-container">
          <div className="guides-header">
            <Link to="/" className="guides-back-link">← Back to Directory</Link>
            <h1>AI Tools Guides & Resources</h1>
            <p className="guides-subtitle">
              Expert insights to help you navigate the AI landscape
            </p>
          </div>

          {/* Introduction */}
          <section className="guides-intro">
            <h2>What You'll Find Here</h2>
            <p>
              Our comprehensive guides help you understand different AI tool categories, compare top platforms,
              and make informed decisions for your specific needs. Each guide includes:
            </p>
            <ul>
              <li><strong>Category Overviews:</strong> Understand what each AI category offers</li>
              <li><strong>Platform Comparisons:</strong> Side-by-side feature and pricing comparisons</li>
              <li><strong>Use Case Examples:</strong> Real-world applications and best practices</li>
              <li><strong>Selection Criteria:</strong> How to choose the right tool for your needs</li>
              <li><strong>Expert Recommendations:</strong> Top picks for different scenarios</li>
            </ul>
          </section>

          <div className="guides-content">

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="category-filter">
              <h3>Filter by Category</h3>
              <div className="category-buttons">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                  aria-pressed={selectedCategory === 'all'}
                >
                  All Guides ({guides.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat as string)}
                    className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                    aria-pressed={selectedCategory === cat}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

            {/* Guides Grid */}
            {loading ? (
              <div className="guides-loading">
                Loading guides...
              </div>
            ) : filteredGuides.length === 0 ? (
              <div className="guides-empty">
                <div className="guides-empty-icon">📚</div>
                <h3>No Guides Yet</h3>
                <p>Check back soon for comprehensive AI tool guides.</p>
              </div>
            ) : (
              <>
                <div className="guides-grid">
                  {filteredGuides.map((guide) => (
                    <article
                      key={guide.slug}
                      className="guide-card"
                      onClick={() => navigate(`/guide/${guide.slug}`)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate(`/guide/${guide.slug}`);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Read guide: ${guide.title}`}
                    >
                      {guide.category && (
                        <div className="guide-category-badge">
                          {guide.category}
                        </div>
                      )}

                      <h3>{guide.title}</h3>

                      <p className="guide-description">
                        {guide.metaDescription || guide.description}
                      </p>

                      <div className="guide-footer">
                        <div className="guide-cta">
                          Read Guide →
                        </div>
                        {guide.readingTime && (
                          <div className="guide-reading-time">
                            {guide.readingTime} min read
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>

                <div className="guides-results">
                  Showing {filteredGuides.length} {filteredGuides.length === 1 ? 'guide' : 'guides'}
                </div>
              </>
            )}

          </div>

          {/* How to Choose Section */}
          <section className="guides-how-to-choose">
            <h2>How to Choose the Right AI Tool</h2>

            <div className="how-to-choose-grid">
              <div className="how-to-choose-item">
                <h3>1. Define Your Use Case</h3>
                <p>
                  Start by clearly identifying what you need the AI tool to accomplish. Are you looking for
                  content creation, code assistance, data analysis, or automation?
                </p>
              </div>

              <div className="how-to-choose-item">
                <h3>2. Consider Your Budget</h3>
                <p>
                  AI platforms range from free tools to enterprise solutions. Compare pricing tiers, free trials,
                  and what features are included at each level.
                </p>
              </div>

              <div className="how-to-choose-item">
                <h3>3. Evaluate Integration</h3>
                <p>
                  Check if the AI tool integrates with your existing workflow, tech stack, and favorite applications.
                  API access and pre-built integrations save time.
                </p>
              </div>

              <div className="how-to-choose-item">
                <h3>4. Test Before Committing</h3>
                <p>
                  Test output quality, speed, accuracy, and reliability. Read user reviews, compare benchmarks,
                  and try free trials before committing to paid plans.
                </p>
              </div>
            </div>
          </section>

          {/* CTA to Directory */}
          <div className="guides-cta">
            <h3>Ready to Explore AI Tools?</h3>
            <p>
              Browse our comprehensive directory of 1100+ AI platforms across all major categories
            </p>
            <Link to="/" className="guides-cta-button">
              Browse AI Directory →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
