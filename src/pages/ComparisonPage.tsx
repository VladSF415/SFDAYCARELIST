import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Platform } from '../types';
import { BreadcrumbSchema, VisualBreadcrumb } from '../components/BreadcrumbSchema';
import { SocialMetaTags } from '../components/SocialMetaTags';

function ComparisonPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [platform1, setPlatform1] = useState<Platform | null>(null);
  const [platform2, setPlatform2] = useState<Platform | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/comparisons/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setComparisonData(data);

        // Fetch both platforms
        const [p1, p2] = await Promise.all([
          fetch(`/api/platforms/${data.platform1Slug}`).then(r => r.json()),
          fetch(`/api/platforms/${data.platform2Slug}`).then(r => r.json())
        ]);

        setPlatform1(p1);
        setPlatform2(p2);
      }
    } catch (error) {
      console.error('Failed to fetch comparison:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="loading">Loading comparison...</div>
      </div>
    );
  }

  if (!comparisonData || !platform1 || !platform2) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h1>Comparison Not Found</h1>
        <button onClick={() => navigate('/')} className="back-link-btn">
          ← BACK TO HOMEPAGE
        </button>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: 'Home', url: 'https://aiplatformslist.com/' },
    { name: 'Comparisons', url: 'https://aiplatformslist.com/comparisons' },
    { name: comparisonData.title, url: `https://aiplatformslist.com/compare/${slug}` },
  ];

  return (
    <div className="comparison-page">
      {/* Social Meta Tags for sharing */}
      <SocialMetaTags
        title={comparisonData.title}
        description={`Compare ${platform1?.name || 'Platform 1'} vs ${platform2?.name || 'Platform 2'}: features, pricing, pros and cons. Find the best AI tool for your needs in 2026.`}
        url={`https://aiplatformslist.com/compare/${slug}`}
        type="article"
      />

      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Hero Section */}
      <div className="comparison-hero" style={{
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

          <h1 className="comparison-title" style={{
            fontSize: '48px',
            fontWeight: '700',
            marginTop: '20px',
            lineHeight: '1.2'
          }}>
            {comparisonData.title}
          </h1>

          <p className="comparison-meta" style={{
            fontSize: '18px',
            marginTop: '20px',
            opacity: 0.9
          }}>
            {comparisonData.metaDescription}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Introduction */}
        <div className="comparison-intro" style={{ marginBottom: '50px' }}>
          <p style={{ fontSize: '20px', lineHeight: '1.8', fontWeight: '500' }}>
            {comparisonData.introduction}
          </p>
        </div>

        {/* Quick Comparison Table */}
        <div className="quick-comparison" style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '20px' }}>
            Quick Comparison: {platform1.name} vs {platform2.name}
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              border: '3px solid #000',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ background: '#000', color: '#fff' }}>
                  <th style={{ padding: '15px', textAlign: 'left', borderRight: '3px solid #fff' }}>Feature</th>
                  <th style={{ padding: '15px', textAlign: 'left', borderRight: '3px solid #fff' }}>{platform1.name}</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>{platform2.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '3px solid #000' }}>
                  <td style={{ padding: '15px', borderRight: '3px solid #000', fontWeight: '700' }}>Pricing</td>
                  <td style={{ padding: '15px', borderRight: '3px solid #000' }}>{platform1.pricing || 'N/A'}</td>
                  <td style={{ padding: '15px' }}>{platform2.pricing || 'N/A'}</td>
                </tr>
                <tr style={{ borderBottom: '3px solid #000' }}>
                  <td style={{ padding: '15px', borderRight: '3px solid #000', fontWeight: '700' }}>Rating</td>
                  <td style={{ padding: '15px', borderRight: '3px solid #000' }}>{platform1.rating ? `⭐ ${platform1.rating}/5` : 'N/A'}</td>
                  <td style={{ padding: '15px' }}>{platform2.rating ? `⭐ ${platform2.rating}/5` : 'N/A'}</td>
                </tr>
                <tr style={{ borderBottom: '3px solid #000' }}>
                  <td style={{ padding: '15px', borderRight: '3px solid #000', fontWeight: '700' }}>Category</td>
                  <td style={{ padding: '15px', borderRight: '3px solid #000' }}>{platform1.category}</td>
                  <td style={{ padding: '15px' }}>{platform2.category}</td>
                </tr>
                <tr style={{ borderBottom: '3px solid #000' }}>
                  <td style={{ padding: '15px', borderRight: '3px solid #000', fontWeight: '700' }}>Best For</td>
                  <td style={{ padding: '15px', borderRight: '3px solid #000' }}>{platform1.tags?.[0] || 'General use'}</td>
                  <td style={{ padding: '15px' }}>{platform2.tags?.[0] || 'General use'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '15px', borderRight: '3px solid #000', fontWeight: '700' }}>Verified</td>
                  <td style={{ padding: '15px', borderRight: '3px solid #000' }}>{platform1.verified ? '✓ Yes' : '✗ No'}</td>
                  <td style={{ padding: '15px' }}>{platform2.verified ? '✓ Yes' : '✗ No'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Sections */}
        {comparisonData.sections && comparisonData.sections.map((section: any, index: number) => (
          <div key={index} className="comparison-section" style={{ marginBottom: '50px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>
              {section.title}
            </h2>
            {section.paragraphs.map((paragraph: string, pIndex: number) => (
              <p key={pIndex} style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '15px' }}>
                {paragraph}
              </p>
            ))}
          </div>
        ))}

        {/* Verdict */}
        {comparisonData.verdict && (
          <div className="comparison-verdict" style={{
            border: '5px solid #000',
            padding: '40px',
            background: '#f5f5f5',
            marginTop: '60px'
          }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '20px' }}>
              Final Verdict: {platform1.name} vs {platform2.name}
            </h2>
            <p style={{ fontSize: '20px', lineHeight: '1.8', marginBottom: '20px' }}>
              {comparisonData.verdict}
            </p>
          </div>
        )}

        {/* CTAs */}
        <div className="comparison-ctas" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginTop: '40px'
        }}>
          <div style={{ border: '3px solid #000', padding: '30px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '15px' }}>
              Try {platform1.name}
            </h3>
            <button
              onClick={() => navigate(`/platform/${platform1.slug || platform1.id}`)}
              style={{
                border: '3px solid #000',
                background: '#000',
                color: '#fff',
                padding: '15px 30px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              VIEW {platform1.name.toUpperCase()} →
            </button>
          </div>

          <div style={{ border: '3px solid #000', padding: '30px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '15px' }}>
              Try {platform2.name}
            </h3>
            <button
              onClick={() => navigate(`/platform/${platform2.slug || platform2.id}`)}
              style={{
                border: '3px solid #000',
                background: '#000',
                color: '#fff',
                padding: '15px 30px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              VIEW {platform2.name.toUpperCase()} →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ComparisonPage;
