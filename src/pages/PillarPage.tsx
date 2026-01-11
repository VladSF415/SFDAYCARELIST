import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Platform } from '../types';
import { BreadcrumbSchema, VisualBreadcrumb } from '../components/BreadcrumbSchema';
import { HowToSchema, VisualHowTo } from '../components/HowToSchema';
import { FAQSchema, VisualFAQ } from '../components/FAQSchema';
import { SocialMetaTags } from '../components/SocialMetaTags';

interface PillarContent {
  slug: string;
  category: string;
  title: string;
  metaDescription: string;
  introduction: string;
  whatIsSection: {
    title: string;
    content: string[];
  };
  keyBenefits: string[];
  useCases: {
    title: string;
    description: string;
  }[];
  howToChoose: {
    title: string;
    steps: {
      name: string;
      text: string;
    }[];
  };
  comparisonCriteria: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

function PillarPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [pillarContent, setPillarContent] = useState<PillarContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch pillar content
      const contentResponse = await fetch(`/api/pillar/${slug}`);
      if (contentResponse.ok) {
        const content = await contentResponse.json();
        setPillarContent(content);

        // Fetch platforms for this category
        const platformsResponse = await fetch(`/api/platforms?category=${content.category}&limit=1000`);
        const platformsData = await platformsResponse.json();
        setPlatforms(platformsData.platforms || []);
      }
    } catch (error) {
      console.error('Failed to fetch pillar content:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="loading">Loading guide...</div>
      </div>
    );
  }

  if (!pillarContent) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h1>Guide Not Found</h1>
        <button onClick={() => navigate('/')} className="back-link-btn">
          ← BACK TO HOMEPAGE
        </button>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: 'Home', url: 'https://aiplatformslist.com/' },
    { name: 'Guides', url: 'https://aiplatformslist.com/guides' },
    { name: pillarContent.title, url: `https://aiplatformslist.com/guide/${slug}` },
  ];

  return (
    <div className="pillar-page">
      {/* Social Meta Tags for sharing */}
      <SocialMetaTags
        title={pillarContent.title}
        description={pillarContent.metaDescription}
        url={`https://aiplatformslist.com/guide/${slug}`}
        type="article"
      />

      {/* Schema Markup */}
      <BreadcrumbSchema items={breadcrumbItems} />
      <HowToSchema
        name={pillarContent.howToChoose.title}
        description={`Learn how to choose the best ${pillarContent.category} AI tool for your needs`}
        steps={pillarContent.howToChoose.steps}
      />
      <FAQSchema faqs={pillarContent.faqs} />

      {/* Hero Section */}
      <div className="pillar-hero" style={{
        background: '#000',
        color: '#fff',
        padding: '60px 20px',
        borderBottom: '5px solid #fff'
      }}>
        <div className="container">
          <button
            onClick={() => navigate('/')}
            className="back-link-btn"
            style={{ color: '#fff', borderColor: '#fff' }}
          >
            ← BACK TO DIRECTORY
          </button>

          <VisualBreadcrumb items={breadcrumbItems} />

          <h1 className="pillar-title" style={{
            fontSize: '48px',
            fontWeight: '700',
            marginTop: '20px',
            lineHeight: '1.2'
          }}>
            {pillarContent.title}
          </h1>

          <p className="pillar-meta" style={{
            fontSize: '18px',
            marginTop: '20px',
            opacity: 0.9
          }}>
            {pillarContent.metaDescription}
          </p>

          <div className="pillar-stats" style={{
            display: 'flex',
            gap: '30px',
            marginTop: '30px',
            flexWrap: 'wrap'
          }}>
            <div className="stat-item">
              <span style={{ fontSize: '36px', fontWeight: '700', display: 'block' }}>
                {platforms.length}
              </span>
              <span style={{ opacity: 0.8 }}>Tools Reviewed</span>
            </div>
            <div className="stat-item">
              <span style={{ fontSize: '36px', fontWeight: '700', display: 'block' }}>
                {platforms.filter(p => p.pricing?.toLowerCase().includes('free')).length}
              </span>
              <span style={{ opacity: 0.8 }}>Free Options</span>
            </div>
            <div className="stat-item">
              <span style={{ fontSize: '36px', fontWeight: '700', display: 'block' }}>
                {new Date().getFullYear()}
              </span>
              <span style={{ opacity: 0.8 }}>Updated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container" style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto' }}>

        {/* Introduction */}
        <div className="pillar-introduction" style={{ marginBottom: '50px' }}>
          <p style={{ fontSize: '20px', lineHeight: '1.8', fontWeight: '500' }}>
            {pillarContent.introduction}
          </p>
        </div>

        {/* What Is Section */}
        <div className="pillar-what-is" style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '20px' }}>
            {pillarContent.whatIsSection.title}
          </h2>
          {pillarContent.whatIsSection.content.map((paragraph, index) => (
            <p key={index} style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '15px' }}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Key Benefits */}
        <div className="pillar-benefits" style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '20px' }}>
            Key Benefits of {pillarContent.category} AI Tools
          </h2>
          <div style={{ display: 'grid', gap: '15px' }}>
            {pillarContent.keyBenefits.map((benefit, index) => (
              <div
                key={index}
                style={{
                  border: '3px solid #000',
                  padding: '20px',
                  fontSize: '18px',
                  lineHeight: '1.6'
                }}
              >
                ✓ {benefit}
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="pillar-use-cases" style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '20px' }}>
            Popular Use Cases
          </h2>
          <div style={{ display: 'grid', gap: '20px' }}>
            {pillarContent.useCases.map((useCase, index) => (
              <div
                key={index}
                style={{
                  border: '3px solid #000',
                  padding: '25px'
                }}
              >
                <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '10px' }}>
                  {useCase.title}
                </h3>
                <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How to Choose Guide */}
        <div className="pillar-how-to-choose" style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '20px' }}>
            {pillarContent.howToChoose.title}
          </h2>
          <VisualHowTo steps={pillarContent.howToChoose.steps} />
        </div>

        {/* Tools Comparison Table */}
        <div className="pillar-comparison" style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '20px' }}>
            Top {pillarContent.category} AI Tools Comparison
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              border: '3px solid #000',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ background: '#000', color: '#fff' }}>
                  <th style={{ padding: '15px', textAlign: 'left', borderRight: '3px solid #fff' }}>Tool</th>
                  <th style={{ padding: '15px', textAlign: 'left', borderRight: '3px solid #fff' }}>Pricing</th>
                  <th style={{ padding: '15px', textAlign: 'left', borderRight: '3px solid #fff' }}>Best For</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {platforms.slice(0, 10).map((platform, index) => (
                  <tr
                    key={platform.id}
                    style={{
                      borderBottom: index < 9 ? '3px solid #000' : 'none'
                    }}
                  >
                    <td style={{ padding: '15px', borderRight: '3px solid #000', fontWeight: '700' }}>
                      {platform.name}
                    </td>
                    <td style={{ padding: '15px', borderRight: '3px solid #000' }}>
                      {platform.pricing || 'N/A'}
                    </td>
                    <td style={{ padding: '15px', borderRight: '3px solid #000' }}>
                      {platform.tags?.[0] || 'General use'}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <button
                        onClick={() => navigate(`/platform/${platform.slug || platform.id}`)}
                        style={{
                          border: '2px solid #000',
                          background: '#fff',
                          padding: '8px 15px',
                          cursor: 'pointer',
                          fontWeight: '700'
                        }}
                      >
                        VIEW →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={() => navigate(`/category/${pillarContent.category}`)}
              style={{
                border: '3px solid #000',
                background: '#000',
                color: '#fff',
                padding: '15px 30px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              VIEW ALL {platforms.length} TOOLS →
            </button>
          </div>
        </div>

        {/* Comparison Criteria */}
        <div className="pillar-criteria" style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '20px' }}>
            How We Compare {pillarContent.category} AI Tools
          </h2>
          <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '20px' }}>
            Our comprehensive evaluation framework considers the following criteria:
          </p>
          <ul style={{
            fontSize: '18px',
            lineHeight: '2',
            listStyle: 'none',
            padding: 0
          }}>
            {pillarContent.comparisonCriteria.map((criteria, index) => (
              <li key={index} style={{
                padding: '10px 0',
                borderBottom: index < pillarContent.comparisonCriteria.length - 1 ? '2px solid #ddd' : 'none'
              }}>
                <strong>{index + 1}.</strong> {criteria}
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ Section */}
        <div className="pillar-faq" style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '20px' }}>
            Frequently Asked Questions
          </h2>
          <VisualFAQ faqs={pillarContent.faqs} />
        </div>

        {/* CTA Section */}
        <div className="pillar-cta" style={{
          border: '5px solid #000',
          padding: '40px',
          textAlign: 'center',
          background: '#f5f5f5',
          marginTop: '60px'
        }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '15px' }}>
            Ready to Find Your Perfect {pillarContent.category} AI Tool?
          </h2>
          <p style={{ fontSize: '18px', marginBottom: '25px' }}>
            Explore our complete directory of {platforms.length} verified {pillarContent.category.toLowerCase()} tools
          </p>
          <button
            onClick={() => navigate(`/category/${pillarContent.category}`)}
            style={{
              border: '3px solid #000',
              background: '#000',
              color: '#fff',
              padding: '15px 40px',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            BROWSE ALL TOOLS →
          </button>
        </div>

      </div>
    </div>
  );
}

export default PillarPage;
