import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Platform } from '../types';
import { BreadcrumbSchema, VisualBreadcrumb } from './BreadcrumbSchema';
import { FAQSchema, VisualFAQ } from './FAQSchema';
import { SocialMetaTags } from './SocialMetaTags';
import { StructuredData, createItemListSchema } from './StructuredData';
import '../styles/LandingPage.css';

interface ContentSection {
  id: string;
  title: string;
  content: string[];
  subsections?: {
    title: string;
    content: string[];
  }[];
}

interface FAQ {
  question: string;
  answer: string;
}

interface RelatedResource {
  title: string;
  url: string;
}

export interface LandingPageContent {
  slug: string;
  pageType: 'landing';
  title: string;
  metaDescription: string;
  targetKeywords: string[];
  hero: {
    h1: string;
    subtitle: string;
    stats?: {
      label: string;
      value: string;
    }[];
    cta: {
      text: string;
      link: string;
    };
  };
  introduction: string;
  sections: ContentSection[];
  featuredPlatforms: string[]; // platform slugs
  faqs: FAQ[];
  relatedResources?: RelatedResource[];
  lastUpdated?: string;
}

interface LandingPageTemplateProps {
  content: LandingPageContent | null;
  platforms: Platform[];
  loading: boolean;
  interactiveComponent?: ReactNode;
  breadcrumbCategory?: string;
}

export function LandingPageTemplate({
  content,
  platforms,
  loading,
  interactiveComponent,
  breadcrumbCategory = 'Resources'
}: LandingPageTemplateProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h1>Page Not Found</h1>
        <button onClick={() => navigate('/')} className="back-link-btn">
          ← BACK TO HOMEPAGE
        </button>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: 'Home', url: 'https://aiplatformslist.com/' },
    { name: breadcrumbCategory, url: 'https://aiplatformslist.com/#resources' },
    { name: content.title, url: `https://aiplatformslist.com/${content.slug}` },
  ];

  return (
    <div className="landing-page">
      {/* SEO Meta Tags */}
      <SocialMetaTags
        title={content.title}
        description={content.metaDescription}
        url={`https://aiplatformslist.com/${content.slug}`}
        type="article"
      />

      {/* Schema Markup */}
      <BreadcrumbSchema items={breadcrumbItems} />
      <FAQSchema faqs={content.faqs} />
      {platforms.length > 0 && (
        <StructuredData
          data={createItemListSchema(platforms.slice(0, 50), content.hero.h1)}
        />
      )}

      {/* Visual Breadcrumb */}
      <div className="container">
        <VisualBreadcrumb items={breadcrumbItems} />
      </div>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="container">
          <h1 className="landing-hero-title">{content.hero.h1}</h1>
          <p className="landing-hero-subtitle">{content.hero.subtitle}</p>

          {content.hero.stats && content.hero.stats.length > 0 && (
            <div className="landing-hero-stats">
              {content.hero.stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          <a href={content.hero.cta.link} className="landing-hero-cta">
            {content.hero.cta.text}
          </a>
        </div>
      </section>

      {/* Introduction */}
      <section className="landing-introduction">
        <div className="container">
          {content.lastUpdated && (
            <div className="last-updated">
              Last updated: {content.lastUpdated}
            </div>
          )}
          <div className="introduction-content">
            {content.introduction.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Feature Section */}
      {interactiveComponent && (
        <section className="landing-interactive">
          <div className="container">
            {interactiveComponent}
          </div>
        </section>
      )}

      {/* Content Sections */}
      {content.sections.map((section) => (
        <section key={section.id} className="landing-section" id={section.id}>
          <div className="container">
            <h2>{section.title}</h2>
            {section.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            {section.subsections && section.subsections.map((subsection, subIndex) => (
              <div key={subIndex} className="subsection">
                <h3>{subsection.title}</h3>
                {subsection.content.map((paragraph, pIndex) => (
                  <p key={pIndex}>{paragraph}</p>
                ))}
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Featured Platforms Grid */}
      {platforms.length > 0 && (
        <section className="landing-platforms">
          <div className="container">
            <h2>Featured Platforms</h2>
            <div className="platforms-grid">
              {platforms.slice(0, 12).map((platform) => (
                <div
                  key={platform.id || platform.slug}
                  className="platform-card"
                  onClick={() => navigate(`/platform/${platform.slug}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {platform.featured && (
                    <span className="badge featured-badge">⭐ FEATURED</span>
                  )}
                  {platform.verified && (
                    <span className="badge verified-badge">✓ VERIFIED</span>
                  )}

                  <h3>{platform.name}</h3>
                  <p className="platform-description">{platform.description}</p>

                  {platform.rating && (
                    <div className="rating">
                      ⭐ {platform.rating.toFixed(1)}/5.0
                    </div>
                  )}

                  {platform.pricing && (
                    <div className="pricing">
                      💰 {platform.pricing}
                    </div>
                  )}

                  {platform.tags && platform.tags.length > 0 && (
                    <div className="tags">
                      {platform.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {content.featuredPlatforms.length > 12 && (
              <div className="view-more">
                <p>{content.featuredPlatforms.length - 12} more platforms available</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="landing-faq">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <VisualFAQ faqs={content.faqs} />
        </div>
      </section>

      {/* Related Resources */}
      {content.relatedResources && content.relatedResources.length > 0 && (
        <section className="landing-related">
          <div className="container">
            <h2>Related Resources</h2>
            <div className="related-resources-grid">
              {content.relatedResources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  className="resource-card"
                >
                  <h3>{resource.title}</h3>
                  <span className="arrow">→</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="landing-cta">
        <div className="container">
          <h2>Ready to Find Your Perfect AI Platform?</h2>
          <p>Explore our directory of {platforms.length}+ AI platforms and tools</p>
          <button onClick={() => navigate('/')} className="cta-button">
            Browse All Platforms
          </button>
        </div>
      </section>
    </div>
  );
}

export default LandingPageTemplate;
