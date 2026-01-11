import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Platform } from '../types';
import { analytics } from '../utils/analytics';
import { SoftwareApplicationSchema } from '../components/SoftwareApplicationSchema';
import { BreadcrumbSchema, VisualBreadcrumb } from '../components/BreadcrumbSchema';
import { SocialMetaTags } from '../components/SocialMetaTags';

function PlatformDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedGuide, setRelatedGuide] = useState<any>(null);

  useEffect(() => {
    fetchPlatform();
  }, [slug]);

  useEffect(() => {
    if (platform?.category) {
      fetchRelatedGuide(platform.category);
    }
  }, [platform]);

  // Track platform view when loaded
  useEffect(() => {
    if (platform) {
      analytics.viewPlatform(platform.name, platform.id);
    }
  }, [platform]);

  const fetchPlatform = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/platforms/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setPlatform(data);
      } else {
        setPlatform(null);
      }
    } catch (error) {
      console.error('Failed to fetch platform:', error);
      setPlatform(null);
    }
    setLoading(false);
  };

  const getCategoryPillarSlug = (category: string): string | null => {
    const mapping: Record<string, string> = {
      'computer-vision': 'computer-vision',
      'ml-frameworks': 'ml-frameworks',
      'code-ai': 'code-ai',
      'llms': 'llms',
      'generative-ai': 'generative-ai',
      'nlp': 'nlp',
      'image-generation': 'image-generation',
      'analytics-bi': 'analytics-bi',
      'video-ai': 'video-ai',
      'video-generation': 'video-generation',
      'agent-platforms': 'agent-platforms',
    };
    return mapping[category] || null;
  };

  const fetchRelatedGuide = async (category: string) => {
    const pillarSlug = getCategoryPillarSlug(category);
    if (!pillarSlug) return;

    try {
      const response = await fetch(`/api/pillar/${pillarSlug}`);
      if (response.ok) {
        const data = await response.json();
        setRelatedGuide(data);
      }
    } catch (error) {
      console.error('Failed to fetch related guide:', error);
    }
  };

  const handleVisit = () => {
    if (!platform) return;

    const url = platform.affiliate_url || platform.website || platform.url || '';

    // Track click in backend
    fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platformId: platform.id, type: 'click' }),
    }).catch(() => {});

    // Track click in Google Analytics
    analytics.clickPlatform(platform.name, platform.id, url);

    window.open(url, '_blank');
  };

  const getCategoryName = (category: string): string => {
    const categoryMap: Record<string, string> = {
      'computer-vision': 'Computer Vision',
      'ml-frameworks': 'ML Frameworks',
      'code-ai': 'Code AI',
      'llms': 'Large Language Models',
      'generative-ai': 'Generative AI',
      'nlp': 'Natural Language Processing',
      'image-generation': 'Image Generation',
      'analytics-bi': 'Analytics & BI',
      'video-ai': 'Video AI',
      'video-generation': 'Video Generation',
      'search-ai': 'Search AI',
      'agent-platforms': 'Agent Platforms',
    };
    return categoryMap[category] || category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="loading">Loading platform details...</div>
      </div>
    );
  }

  if (!platform) {
    return (
      <div className="platform-detail-not-found">
        <h1>PLATFORM NOT FOUND</h1>
        <p>The platform you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/')} className="back-to-directory-btn">
          ← BACK TO DIRECTORY
        </button>
      </div>
    );
  }

  // Generate breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', url: 'https://aiplatformslist.com/' },
    {
      name: getCategoryName(platform.category),
      url: `https://aiplatformslist.com/category/${platform.category}`,
    },
    {
      name: platform.name,
      url: `https://aiplatformslist.com/platform/${platform.slug || platform.id}`,
    },
  ];

  return (
    <div className="platform-detail">
      {/* Social Meta Tags for sharing */}
      <SocialMetaTags
        title={`${platform.name} - AI Platform Review & Details (2026)`}
        description={platform.description || `Explore ${platform.name}, an AI platform in the ${getCategoryName(platform.category)} category. Compare features, pricing, and reviews.`}
        url={`https://aiplatformslist.com/platform/${platform.slug || platform.id}`}
        type="article"
      />

      {/* Schema Markup for SEO */}
      <SoftwareApplicationSchema platform={platform} />
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Header */}
      <div className="platform-detail-header">
        <div className="platform-detail-container">
          <button onClick={() => navigate('/')} className="back-link-btn">
            ← BACK TO DIRECTORY
          </button>

          <VisualBreadcrumb items={breadcrumbItems} />

          <div className="platform-detail-title-section">
            <div>
              <h1 className="platform-detail-title">{platform.name}</h1>

              <div className="platform-detail-badges">
                {platform.featured && <span className="badge featured">⭐ FEATURED</span>}
                {platform.verified && <span className="badge verified">✓ VERIFIED</span>}
                {platform.pricing && <span className="badge pricing">💰 {platform.pricing}</span>}
              </div>

              <p className="platform-detail-description">{platform.description}</p>
            </div>
          </div>

          <button onClick={handleVisit} className="platform-detail-visit-btn">
            VISIT {platform.name} →
          </button>
        </div>
      </div>

      {/* Details Section */}
      <div className="platform-detail-content">
        <div className="platform-detail-grid">
          {/* Rating */}
          {platform.rating && (
            <div className="platform-detail-section">
              <h2>RATING</h2>
              <div className="platform-detail-rating">
                <div className="platform-detail-stars">
                  {'★'.repeat(Math.round(platform.rating))}{'☆'.repeat(5 - Math.round(platform.rating))}
                </div>
                <span className="platform-detail-rating-number">{platform.rating.toFixed(1)}</span>
                <span className="platform-detail-rating-max">/ 5.0</span>
              </div>
            </div>
          )}

          {/* Features */}
          {platform.features && platform.features.length > 0 && (
            <div className="platform-detail-section">
              <h2>KEY FEATURES</h2>
              <div className="platform-detail-features">
                {platform.features.map((feature, i) => (
                  <div key={i} className="platform-detail-feature">
                    ✓ {feature}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {platform.tags && platform.tags.length > 0 && (
            <div className="platform-detail-section">
              <h2>TAGS</h2>
              <div className="platform-detail-tags">
                {platform.tags.map((tag, i) => (
                  <span key={i} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Category */}
          <div className="platform-detail-section">
            <h2>CATEGORY</h2>
            <div className="platform-detail-category">
              {platform.category?.replace(/-/g, ' ').toUpperCase()}
            </div>
          </div>

          {/* Visit CTA */}
          <div className="platform-detail-cta">
            <h3>READY TO TRY {platform.name}?</h3>
            <button onClick={handleVisit} className="platform-detail-cta-btn">
              VISIT OFFICIAL WEBSITE →
            </button>
          </div>

          {/* Related Guide Widget */}
          {relatedGuide && (
            <div className="platform-detail-section" style={{
              gridColumn: '1 / -1',
              border: '4px solid #000',
              padding: '30px',
              background: '#f5f5f5',
              marginTop: '20px'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '700',
                marginBottom: '15px',
                opacity: 0.7
              }}>
                📚 RELATED GUIDE
              </div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '900',
                marginBottom: '12px',
                lineHeight: '1.3'
              }}>
                {relatedGuide.title}
              </h2>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                opacity: 0.8,
                marginBottom: '20px'
              }}>
                {relatedGuide.metaDescription}
              </p>
              <button
                onClick={() => navigate(`/guide/${getCategoryPillarSlug(platform.category)}`)}
                style={{
                  border: '3px solid #000',
                  background: '#000',
                  color: '#fff',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.color = '#000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#000';
                  e.currentTarget.style.color = '#fff';
                }}
              >
                Read Full Guide →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlatformDetail;
