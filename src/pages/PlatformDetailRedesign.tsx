import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Platform } from '../types';
import { analytics } from '../utils/analytics';
import { SoftwareApplicationSchema } from '../components/SoftwareApplicationSchema';
import { BreadcrumbSchema } from '../components/BreadcrumbSchema';
import { SocialMetaTags } from '../components/SocialMetaTags';
import './PlatformDetailRedesign.css';

function PlatformDetailRedesign() {
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

    fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platformId: platform.id, type: 'click' }),
    }).catch(() => {});

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
      'seo-tools': 'SEO Tools',
    };
    return categoryMap[category] || category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="brutalist-loading">
        <div className="loading-box">
          <div className="loading-bar"></div>
          <span className="loading-text">LOADING</span>
        </div>
      </div>
    );
  }

  if (!platform) {
    return (
      <div className="brutalist-not-found">
        <div className="error-box">
          <h1 className="error-title">404</h1>
          <p className="error-text">PLATFORM NOT FOUND</p>
          <button onClick={() => navigate('/')} className="brutal-btn">
            ← BACK TO DIRECTORY
          </button>
        </div>
      </div>
    );
  }

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
    <div className="brutalist-platform">
      <SocialMetaTags
        title={`${platform.name} - AI Platform Review & Details (2026)`}
        description={platform.description || `Explore ${platform.name}, an AI platform in the ${getCategoryName(platform.category)} category.`}
        url={`https://aiplatformslist.com/platform/${platform.slug || platform.id}`}
        type="article"
      />

      <SoftwareApplicationSchema platform={platform} />
      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Navigation */}
      <nav className="brutal-nav">
        <button onClick={() => navigate('/')} className="brutal-back">
          ← DIRECTORY
        </button>
        <div className="brutal-breadcrumb">
          <span onClick={() => navigate('/')} className="bc-link">HOME</span>
          <span className="bc-sep">/</span>
          <span onClick={() => navigate(`/category/${platform.category}`)} className="bc-link">
            {getCategoryName(platform.category).toUpperCase()}
          </span>
          <span className="bc-sep">/</span>
          <span className="bc-current">{platform.name.toUpperCase()}</span>
        </div>
      </nav>

      {/* Hero */}
      <header className="brutal-hero">
        <div className="hero-badges-brutal">
          {platform.verified && (
            <div className="badge-brutal verified">
              <span className="badge-icon">✓</span>
              <span>VERIFIED</span>
            </div>
          )}
          {platform.featured && (
            <div className="badge-brutal featured">
              <span className="badge-icon">★</span>
              <span>FEATURED</span>
            </div>
          )}
          <div className="badge-brutal category">
            {getCategoryName(platform.category).toUpperCase()}
          </div>
        </div>

        <h1 className="brutal-title">{platform.name}</h1>

        <div className="brutal-meta-row">
          {platform.rating && (
            <div className="rating-brutal">
              <span className="rating-num">{platform.rating.toFixed(1)}</span>
              <span className="rating-stars">
                {'★'.repeat(Math.round(platform.rating))}{'☆'.repeat(5 - Math.round(platform.rating))}
              </span>
            </div>
          )}
          {platform.pricing && (
            <div className="pricing-brutal">{platform.pricing}</div>
          )}
        </div>

        <p className="brutal-description">{platform.description}</p>

        <button onClick={handleVisit} className="brutal-cta">
          VISIT {platform.name.toUpperCase()} →
        </button>
      </header>

      {/* Main Grid */}
      <div className="brutal-grid">
        {/* Features */}
        {platform.features && platform.features.length > 0 && (
          <section className="brutal-section">
            <div className="section-header">
              <h2 className="section-title-brutal">KEY FEATURES</h2>
              <div className="section-line"></div>
            </div>
            <div className="features-brutal">
              {platform.features.map((feature, i) => (
                <div key={i} className="feature-brutal">
                  <span className="feature-check">■</span>
                  <span className="feature-text">{feature}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Use Cases */}
        {platform.use_cases && platform.use_cases.length > 0 && (
          <section className="brutal-section">
            <div className="section-header">
              <h2 className="section-title-brutal">USE CASES</h2>
              <div className="section-line"></div>
            </div>
            <div className="use-cases-brutal">
              {platform.use_cases.map((useCase, i) => (
                <div key={i} className="use-case-brutal">
                  <div className="use-case-num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="use-case-content">{useCase}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tags */}
        {platform.tags && platform.tags.length > 0 && (
          <section className="brutal-section tags-section-brutal">
            <div className="section-header">
              <h2 className="section-title-brutal">TOPICS</h2>
              <div className="section-line"></div>
            </div>
            <div className="tags-brutal">
              {platform.tags.map((tag, i) => (
                <span key={i} className="tag-brutal">{tag.toUpperCase()}</span>
              ))}
            </div>
          </section>
        )}

        {/* CTA Block */}
        <section className="brutal-section cta-section-brutal">
          <div className="cta-brutal-box">
            <h3 className="cta-brutal-title">READY TO START?</h3>
            <p className="cta-brutal-text">
              Explore {platform.name} and transform your workflow.
            </p>
            <button onClick={handleVisit} className="brutal-cta-secondary">
              VISIT OFFICIAL WEBSITE →
            </button>
          </div>
        </section>

        {/* Related Guide */}
        {relatedGuide && (
          <section className="brutal-section guide-section-brutal">
            <div className="guide-brutal-box">
              <div className="guide-label-brutal">RELATED GUIDE</div>
              <h3 className="guide-title-brutal">{relatedGuide.title}</h3>
              <p className="guide-desc-brutal">{relatedGuide.metaDescription}</p>
              <button
                onClick={() => navigate(`/guide/${getCategoryPillarSlug(platform.category)}`)}
                className="guide-btn-brutal"
              >
                READ FULL GUIDE →
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default PlatformDetailRedesign;
