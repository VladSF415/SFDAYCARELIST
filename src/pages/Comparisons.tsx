import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocialMetaTags } from '../components/SocialMetaTags';

interface Comparison {
  slug: string;
  platform1Slug: string;
  platform2Slug: string;
  title: string;
  metaDescription: string;
}

function Comparisons() {
  const navigate = useNavigate();
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchComparisons();
  }, []);

  const fetchComparisons = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/comparisons');
      if (response.ok) {
        const data = await response.json();
        setComparisons(data);
      }
    } catch (error) {
      console.error('Failed to fetch comparisons:', error);
    }
    setLoading(false);
  };

  const filteredComparisons = comparisons.filter(comp => {
    const matchesSearch = searchTerm === '' ||
      comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.platform1Slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.platform2Slug.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="comparisons-page">
      <SocialMetaTags
        title="AI Platform Comparisons - Compare 3,000+ Tool Combinations (2026)"
        description="Compare AI platforms side-by-side. Find detailed comparisons of features, pricing, pros & cons for 3,000+ platform combinations. Make informed decisions."
        url="https://aiplatformslist.com/comparisons"
        type="website"
      />

      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <h1 className="hero-title">
            AI PLATFORM COMPARISONS
          </h1>
          <p className="hero-subtitle">
            COMPARE 3,023+ AI TOOL COMBINATIONS SIDE-BY-SIDE. FEATURES, PRICING, PROS & CONS.
          </p>

          {/* Search Box */}
          <div style={{
            maxWidth: '600px',
            margin: '2rem auto 0',
            position: 'relative',
            zIndex: 1
          }}>
            <input
              type="text"
              placeholder="SEARCH COMPARISONS (e.g., 'ChatGPT vs Claude')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '1.25rem',
                fontSize: '1rem',
                fontFamily: 'IBM Plex Mono, monospace',
                fontWeight: '600',
                textTransform: 'uppercase',
                border: '4px solid var(--brutal-white)',
                background: 'var(--brutal-white)',
                color: 'var(--brutal-black)',
                outline: 'none',
                letterSpacing: '0.05em'
              }}
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container section">
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            fontSize: '1.2rem',
            fontWeight: '700'
          }}>
            LOADING COMPARISONS...
          </div>
        ) : (
          <>
            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem',
              textAlign: 'center'
            }}>
              <div style={{
                border: '4px solid var(--brutal-black)',
                padding: '2rem',
                background: 'var(--brutal-white)',
                boxShadow: '8px 8px 0 var(--brutal-black)'
              }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '700',
                  fontFamily: 'Space Grotesk, sans-serif',
                  lineHeight: 1
                }}>
                  {filteredComparisons.length}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  marginTop: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}>
                  COMPARISONS
                </div>
              </div>

              <div style={{
                border: '4px solid var(--brutal-black)',
                padding: '2rem',
                background: 'var(--brutal-yellow)',
                boxShadow: '8px 8px 0 var(--brutal-black)'
              }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '700',
                  fontFamily: 'Space Grotesk, sans-serif',
                  lineHeight: 1
                }}>
                  1,103
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  marginTop: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}>
                  PLATFORMS
                </div>
              </div>

              <div style={{
                border: '4px solid var(--brutal-black)',
                padding: '2rem',
                background: 'var(--brutal-white)',
                boxShadow: '8px 8px 0 var(--brutal-black)'
              }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '700',
                  fontFamily: 'Space Grotesk, sans-serif',
                  lineHeight: 1
                }}>
                  50+
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  marginTop: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}>
                  CATEGORIES
                </div>
              </div>
            </div>

            {/* Comparisons Grid */}
            {filteredComparisons.length === 0 ? (
              <div style={{
                border: '8px solid var(--brutal-black)',
                padding: '4rem',
                textAlign: 'center',
                background: 'var(--brutal-white)',
                boxShadow: '12px 12px 0 var(--brutal-black)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  marginBottom: '1rem',
                  textTransform: 'uppercase'
                }}>
                  NO COMPARISONS FOUND
                </h2>
                <p style={{ fontSize: '1.1rem', color: '#666' }}>
                  Try a different search term
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '2rem'
              }}>
                {filteredComparisons.slice(0, 100).map((comp) => (
                  <div
                    key={comp.slug}
                    onClick={() => navigate(`/compare/${comp.slug}`)}
                    style={{
                      border: '4px solid var(--brutal-black)',
                      padding: '1.5rem',
                      background: 'var(--brutal-white)',
                      cursor: 'pointer',
                      transition: 'all 0.1s',
                      boxShadow: '6px 6px 0 var(--brutal-black)',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translate(-3px, -3px)';
                      e.currentTarget.style.boxShadow = '12px 12px 0 var(--brutal-black)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translate(0, 0)';
                      e.currentTarget.style.boxShadow = '6px 6px 0 var(--brutal-black)';
                    }}
                  >
                    <h3 style={{
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      marginBottom: '1rem',
                      fontFamily: 'Space Grotesk, sans-serif',
                      lineHeight: '1.3',
                      textTransform: 'uppercase',
                      letterSpacing: '0.02em'
                    }}>
                      {comp.title.replace(': Which', ' →').replace('Tool is Better in 2026?', '').replace('ai Tool', '').replace('AI Tool', '')}
                    </h3>

                    <p style={{
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      marginBottom: '1rem',
                      color: '#333'
                    }}>
                      {comp.metaDescription.substring(0, 120)}...
                    </p>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--brutal-red)'
                    }}>
                      VIEW COMPARISON →
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredComparisons.length > 100 && (
              <div style={{
                marginTop: '3rem',
                textAlign: 'center',
                padding: '2rem',
                border: '4px solid var(--brutal-black)',
                background: 'var(--brutal-yellow)',
                fontWeight: '700',
                fontSize: '1.1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                📊 SHOWING FIRST 100 OF {filteredComparisons.length} COMPARISONS. USE SEARCH TO FIND SPECIFIC COMPARISONS.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Comparisons;
