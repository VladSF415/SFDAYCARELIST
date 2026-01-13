import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SocialMetaTags } from '../components/SocialMetaTags';
import './legal/LegalPage.css';

interface PillarContent {
  slug: string;
  category: string;
  title: string;
  metaDescription?: string;
}

interface ComparisonContent {
  slug: string;
  title: string;
  platform1: string;
  platform2: string;
}

interface AlternativeContent {
  slug: string;
  title: string;
  platformName: string;
}

interface BestOfContent {
  slug: string;
  title: string;
  category: string;
}

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedDate: string;
  featured: boolean;
  keywords: string[];
}

export default function Blog() {
  const [activeTab, setActiveTab] = useState<'blogposts' | 'guides' | 'comparisons' | 'alternatives' | 'bestof'>('blogposts');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [pillarContent, setPillarContent] = useState<PillarContent[]>([]);
  const [comparisons, setComparisons] = useState<ComparisonContent[]>([]);
  const [alternatives, setAlternatives] = useState<AlternativeContent[]>([]);
  const [bestOf, setBestOf] = useState<BestOfContent[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [comparisonsLimit, setComparisonsLimit] = useState(50);
  const [alternativesLimit, setAlternativesLimit] = useState(50);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [blogRes, pillarRes, compRes, altRes, bestRes] = await Promise.all([
          fetch('/api/blog').then(r => r.json()).catch(() => []),
          fetch('/api/pillar').then(r => r.json()).catch(() => []),
          fetch('/api/comparisons').then(r => r.json()).catch(() => []),
          fetch('/api/alternatives').then(r => r.json()).catch(() => []),
          fetch('/api/bestof').then(r => r.json()).catch(() => [])
        ]);

        setBlogPosts(blogRes);
        setPillarContent(pillarRes);
        setComparisons(compRes);
        setAlternatives(altRes);
        setBestOf(bestRes);
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const tabs = [
    { id: 'blogposts' as const, label: 'Blog Posts', count: blogPosts.length },
    { id: 'guides' as const, label: 'Guides', count: pillarContent.length },
    { id: 'comparisons' as const, label: 'Comparisons', count: comparisons.length },
    { id: 'alternatives' as const, label: 'Alternatives', count: alternatives.length },
    { id: 'bestof' as const, label: 'Best Of', count: bestOf.length }
  ];

  const totalContent = blogPosts.length + pillarContent.length + comparisons.length + alternatives.length + bestOf.length;

  return (
    <>
      <SocialMetaTags
        title="Blog - SF Daycare List | Guides, Comparisons & Reviews"
        description="Explore our comprehensive AI guides, tool comparisons, alternatives, and best-of lists. Stay informed about the latest daycares and make better decisions."
        url="https://aiplatformslist.com/blog"
      />

      <div className="legal-page">
        <div className="legal-container">
          <div className="legal-header">
            <Link to="/" className="back-link">← Back to Home</Link>
            <h1>AI Insights & Guides</h1>
            <p className="last-updated">Expert guides, comparisons, and recommendations for AI tools</p>
          </div>

          <div className="legal-content">
            {/* Stats Banner */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
              padding: '1.5rem',
              background: '#000000',
              color: '#ffffff',
              border: '4px solid #000000'
            }}>
              {tabs.map(tab => (
                <div key={tab.id} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '1.8rem',
                    fontWeight: '900',
                    fontFamily: "'Courier New', monospace"
                  }}>
                    {loading ? '...' : tab.count}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontFamily: "'Courier New', monospace"
                  }}>
                    {tab.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              gap: '0',
              marginBottom: '2rem',
              borderBottom: '4px solid #000000',
              flexWrap: 'wrap'
            }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '1rem 1.5rem',
                    background: activeTab === tab.id ? '#000000' : 'transparent',
                    color: activeTab === tab.id ? '#ffffff' : '#000000',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'Courier New', monospace",
                    fontWeight: '900',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.label} ({loading ? '...' : tab.count})
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                fontFamily: "'Courier New', monospace",
                fontSize: '1.2rem'
              }}>
                Loading content...
              </div>
            ) : totalContent === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                background: '#f5f5f5',
                border: '4px solid #000000'
              }}>
                <h3 style={{
                  fontFamily: "'Courier New', monospace",
                  textTransform: 'uppercase',
                  marginBottom: '1rem'
                }}>
                  Content Coming Soon
                </h3>
                <p style={{ fontFamily: "'Courier New', monospace", color: '#666' }}>
                  We're actively generating comprehensive guides and comparisons. Check back soon!
                </p>
              </div>
            ) : (
              <>
                {/* Blog Posts Tab */}
                {activeTab === 'blogposts' && (
                  <div>
                    <h2 style={{
                      fontFamily: "'Courier New', monospace",
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      marginBottom: '1.5rem',
                      borderBottom: '4px solid #000000',
                      paddingBottom: '0.5rem'
                    }}>
                      Latest Articles
                    </h2>
                    {blogPosts.length === 0 ? (
                      <p style={{ fontFamily: "'Courier New', monospace", color: '#666' }}>
                        No blog posts available yet. Check back soon!
                      </p>
                    ) : (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '1.5rem'
                      }}>
                        {blogPosts.slice(0, 50).map(post => {
                          const publishDate = new Date(post.publishedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          });

                          return (
                            <Link
                              key={post.slug}
                              to={`/blog/${post.slug}`}
                              style={{
                                display: 'block',
                                padding: '1.5rem',
                                background: '#ffffff',
                                border: '4px solid #000000',
                                textDecoration: 'none',
                                color: '#000000',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#000000';
                                e.currentTarget.style.color = '#ffffff';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#ffffff';
                                e.currentTarget.style.color = '#000000';
                              }}
                            >
                              <div style={{
                                fontSize: '0.7rem',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                marginBottom: '0.75rem',
                                fontFamily: "'Courier New', monospace",
                                background: '#FFFF00',
                                color: '#000000',
                                display: 'inline-block',
                                padding: '2px 8px'
                              }}>
                                {post.category}
                              </div>
                              <h3 style={{
                                fontFamily: "'Courier New', monospace",
                                fontWeight: '900',
                                margin: '0.5rem 0',
                                fontSize: '1.1rem',
                                lineHeight: '1.4'
                              }}>
                                {post.title}
                              </h3>
                              <p style={{
                                fontSize: '0.85rem',
                                color: 'inherit',
                                opacity: 0.8,
                                marginBottom: '1rem',
                                fontFamily: "'Courier New', monospace",
                                lineHeight: '1.6'
                              }}>
                                {post.excerpt}
                              </p>
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.75rem',
                                fontFamily: "'Courier New', monospace",
                                opacity: 0.7
                              }}>
                                <span>{publishDate}</span>
                                <span>{post.readTime}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                    {blogPosts.length > 50 && (
                      <p style={{
                        marginTop: '1.5rem',
                        fontFamily: "'Courier New', monospace",
                        textAlign: 'center',
                        color: '#666'
                      }}>
                        Showing 50 of {blogPosts.length} blog posts
                      </p>
                    )}
                  </div>
                )}

                {/* Guides Tab */}
                {activeTab === 'guides' && (
                  <div>
                    <h2 style={{
                      fontFamily: "'Courier New', monospace",
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      marginBottom: '1.5rem',
                      borderBottom: '4px solid #000000',
                      paddingBottom: '0.5rem'
                    }}>
                      Category Guides
                    </h2>
                    {pillarContent.length === 0 ? (
                      <p style={{ fontFamily: "'Courier New', monospace", color: '#666' }}>
                        No guides available yet. Check back soon!
                      </p>
                    ) : (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1rem'
                      }}>
                        {pillarContent.map(item => (
                          <Link
                            key={item.slug}
                            to={`/guide/${item.slug}`}
                            style={{
                              display: 'block',
                              padding: '1.5rem',
                              background: '#ffffff',
                              border: '4px solid #000000',
                              textDecoration: 'none',
                              color: '#000000',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#000000';
                              e.currentTarget.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#ffffff';
                              e.currentTarget.style.color = '#000000';
                            }}
                          >
                            <div style={{
                              fontSize: '0.7rem',
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                              marginBottom: '0.5rem',
                              fontFamily: "'Courier New', monospace",
                              background: '#FFFF00',
                              color: '#000000',
                              display: 'inline-block',
                              padding: '2px 8px'
                            }}>
                              {item.category}
                            </div>
                            <h3 style={{
                              fontFamily: "'Courier New', monospace",
                              fontWeight: '900',
                              margin: '0.5rem 0',
                              fontSize: '1rem'
                            }}>
                              {item.title}
                            </h3>
                            <p style={{
                              fontSize: '0.85rem',
                              color: 'inherit',
                              opacity: 0.8,
                              margin: '0.75rem 0 0 0',
                              fontFamily: "'Courier New', monospace",
                              lineHeight: '1.5'
                            }}>
                              {item.metaDescription || `Comprehensive guide to ${item.category} resources and information.`}
                            </p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Comparisons Tab */}
                {activeTab === 'comparisons' && (
                  <div>
                    <h2 style={{
                      fontFamily: "'Courier New', monospace",
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      marginBottom: '1.5rem',
                      borderBottom: '4px solid #000000',
                      paddingBottom: '0.5rem'
                    }}>
                      Tool Comparisons
                    </h2>
                    {comparisons.length === 0 ? (
                      <p style={{ fontFamily: "'Courier New', monospace", color: '#666' }}>
                        No comparisons available yet. Check back soon!
                      </p>
                    ) : (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '1rem'
                      }}>
                        {comparisons.slice(0, comparisonsLimit).map(item => {
                          // Extract platform names from title (format: "Platform1 vs Platform2: ...")
                          const titleMatch = item.title.match(/^(.+?)\s+vs\s+(.+?):/);
                          const platform1 = titleMatch ? titleMatch[1] : item.platform1 || 'Platform A';
                          const platform2 = titleMatch ? titleMatch[2] : item.platform2 || 'Platform B';

                          return (
                            <Link
                              key={item.slug}
                              to={`/compare/${item.slug}`}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem 1.5rem',
                                background: '#ffffff',
                                border: '4px solid #000000',
                                textDecoration: 'none',
                                color: '#000000',
                                transition: 'all 0.2s',
                                fontFamily: "'Courier New', monospace",
                                fontWeight: '900',
                                fontSize: '0.85rem'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#000000';
                                e.currentTarget.style.color = '#ffffff';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#ffffff';
                                e.currentTarget.style.color = '#000000';
                              }}
                            >
                              <span style={{ flex: '1', textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {platform1}
                              </span>
                              <span style={{
                                background: '#FFFF00',
                                color: '#000000',
                                padding: '4px 10px',
                                fontSize: '0.7rem',
                                margin: '0 8px',
                                flexShrink: 0
                              }}>VS</span>
                              <span style={{ flex: '1', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {platform2}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                    {comparisons.length > comparisonsLimit && (
                      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <button
                          onClick={() => setComparisonsLimit(prev => prev + 50)}
                          style={{
                            padding: '1rem 2rem',
                            background: '#000',
                            color: '#fff',
                            border: '4px solid #000',
                            fontFamily: "'Courier New', monospace",
                            fontWeight: '900',
                            fontSize: '1rem',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#FFFF00';
                            e.currentTarget.style.color = '#000';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#000';
                            e.currentTarget.style.color = '#fff';
                          }}
                        >
                          Show More ({comparisons.length - comparisonsLimit} remaining)
                        </button>
                        <p style={{
                          marginTop: '1rem',
                          fontFamily: "'Courier New', monospace",
                          textAlign: 'center',
                          color: '#666',
                          fontSize: '0.9rem'
                        }}>
                          Showing {comparisonsLimit} of {comparisons.length} comparisons
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Alternatives Tab */}
                {activeTab === 'alternatives' && (
                  <div>
                    <h2 style={{
                      fontFamily: "'Courier New', monospace",
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      marginBottom: '1.5rem',
                      borderBottom: '4px solid #000000',
                      paddingBottom: '0.5rem'
                    }}>
                      Alternative Tools
                    </h2>
                    {alternatives.length === 0 ? (
                      <p style={{ fontFamily: "'Courier New', monospace", color: '#666' }}>
                        No alternatives available yet. Check back soon!
                      </p>
                    ) : (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: '1rem'
                      }}>
                        {alternatives.slice(0, alternativesLimit).map(item => {
                          // Extract platform name from title (format: "Best [Platform] Alternatives in 2025: ...")
                          const titleMatch = item.title.match(/^Best\s+(.+?)\s+Alternatives/);
                          const platformName = titleMatch ? titleMatch[1] : item.platformName || 'Platform';

                          return (
                            <Link
                              key={item.slug}
                              to={`/alternatives/${item.slug}`}
                              style={{
                                display: 'block',
                                padding: '1rem 1.5rem',
                                background: '#ffffff',
                                border: '4px solid #000000',
                                textDecoration: 'none',
                                color: '#000000',
                                transition: 'all 0.2s',
                                fontFamily: "'Courier New', monospace",
                                fontWeight: '900',
                                fontSize: '0.9rem'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#000000';
                                e.currentTarget.style.color = '#ffffff';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#ffffff';
                                e.currentTarget.style.color = '#000000';
                              }}
                            >
                              Best {platformName} Alternatives
                            </Link>
                          );
                        })}
                      </div>
                    )}
                    {alternatives.length > alternativesLimit && (
                      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <button
                          onClick={() => setAlternativesLimit(prev => prev + 50)}
                          style={{
                            padding: '1rem 2rem',
                            background: '#000',
                            color: '#fff',
                            border: '4px solid #000',
                            fontFamily: "'Courier New', monospace",
                            fontWeight: '900',
                            fontSize: '1rem',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#FFFF00';
                            e.currentTarget.style.color = '#000';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#000';
                            e.currentTarget.style.color = '#fff';
                          }}
                        >
                          Show More ({alternatives.length - alternativesLimit} remaining)
                        </button>
                        <p style={{
                          marginTop: '1rem',
                          fontFamily: "'Courier New', monospace",
                          textAlign: 'center',
                          color: '#666',
                          fontSize: '0.9rem'
                        }}>
                          Showing {alternativesLimit} of {alternatives.length} alternatives
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Best Of Tab */}
                {activeTab === 'bestof' && (
                  <div>
                    <h2 style={{
                      fontFamily: "'Courier New', monospace",
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      marginBottom: '1.5rem',
                      borderBottom: '4px solid #000000',
                      paddingBottom: '0.5rem'
                    }}>
                      Best Of Lists
                    </h2>
                    {bestOf.length === 0 ? (
                      <p style={{ fontFamily: "'Courier New', monospace", color: '#666' }}>
                        No best-of lists available yet. Check back soon!
                      </p>
                    ) : (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '1rem'
                      }}>
                        {bestOf.slice(0, 50).map(item => (
                          <Link
                            key={item.slug}
                            to={`/best/${item.slug}`}
                            style={{
                              display: 'block',
                              padding: '1rem 1.5rem',
                              background: '#ffffff',
                              border: '4px solid #000000',
                              textDecoration: 'none',
                              color: '#000000',
                              transition: 'all 0.2s',
                              fontFamily: "'Courier New', monospace",
                              fontWeight: '900'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#000000';
                              e.currentTarget.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#ffffff';
                              e.currentTarget.style.color = '#000000';
                            }}
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    )}
                    {bestOf.length > 50 && (
                      <p style={{
                        marginTop: '1.5rem',
                        fontFamily: "'Courier New', monospace",
                        textAlign: 'center',
                        color: '#666'
                      }}>
                        Showing 50 of {bestOf.length} lists
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            {/* CTA Section */}
            <div style={{
              marginTop: '3rem',
              padding: '2rem',
              background: '#FFFF00',
              border: '4px solid #000000',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontFamily: "'Courier New', monospace",
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginTop: 0
              }}>
                Want Your Tool Featured?
              </h3>
              <p style={{ fontFamily: "'Courier New', monospace", marginBottom: '1.5rem' }}>
                Submit your daycares to be included in our guides and comparisons.
              </p>
              <Link
                to="/submit"
                style={{
                  display: 'inline-block',
                  padding: '1rem 2rem',
                  background: '#000000',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontFamily: "'Courier New', monospace",
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  border: '4px solid #000000'
                }}
              >
                Submit Your Tool
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
