import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Platform } from '../types';
import { BreadcrumbSchema, VisualBreadcrumb } from '../components/BreadcrumbSchema';
import { SocialMetaTags } from '../components/SocialMetaTags';

function AlternativesPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [alternativesData, setAlternativesData] = useState<any>(null);
  const [mainPlatform, setMainPlatform] = useState<Platform | null>(null);
  const [alternativePlatforms, setAlternativePlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/alternatives/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setAlternativesData(data);

        // Fetch main platform
        const mainPlatformResponse = await fetch(`/api/platforms/${data.platformSlug}`);
        if (mainPlatformResponse.ok) {
          setMainPlatform(await mainPlatformResponse.json());
        }

        // Fetch alternative platforms
        const altPlatforms = await Promise.all(
          data.alternatives.slice(0, 10).map(async (alt: any) => {
            const platformResponse = await fetch(`/api/platforms/${alt.slug}`);
            if (platformResponse.ok) {
              return platformResponse.json();
            }
            return null;
          })
        );

        setAlternativePlatforms(altPlatforms.filter(Boolean));
      }
    } catch (error) {
      console.error('Failed to fetch alternatives:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="loading">Loading alternatives...</div>
      </div>
    );
  }

  if (!alternativesData) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h1>Alternatives Not Found</h1>
        <button onClick={() => navigate('/')} className="back-link-btn">
          ← BACK TO HOMEPAGE
        </button>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: 'Home', url: 'https://aiplatformslist.com/' },
    { name: 'Alternatives', url: 'https://aiplatformslist.com/alternatives' },
    { name: alternativesData.title, url: `https://aiplatformslist.com/alternatives/${slug}` },
  ];

  return (
    <div className="alternatives-page">
      {/* Social Meta Tags for sharing */}
      <SocialMetaTags
        title={alternativesData.title}
        description={`Discover the best ${mainPlatform?.name || 'AI tool'} alternatives in 2026. Compare features, pricing, and reviews of top competing platforms.`}
        url={`https://aiplatformslist.com/alternatives/${slug}`}
        type="article"
      />

      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Hero Section */}
      <div className="alternatives-hero" style={{
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

          <h1 className="alternatives-title" style={{
            fontSize: '48px',
            fontWeight: '700',
            marginTop: '20px',
            lineHeight: '1.2'
          }}>
            {alternativesData.title}
          </h1>

          <p className="alternatives-meta" style={{
            fontSize: '18px',
            marginTop: '20px',
            opacity: 0.9
          }}>
            {alternativesData.metaDescription}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Introduction */}
        <div className="alternatives-intro" style={{ marginBottom: '50px' }}>
          <p style={{ fontSize: '20px', lineHeight: '1.8', fontWeight: '500' }}>
            {alternativesData.introduction}
          </p>
        </div>

        {/* Main Platform Overview */}
        {alternativesData.mainPlatform && mainPlatform && (
          <div className="main-platform" style={{
            border: '5px solid #000',
            padding: '40px',
            background: '#f5f5f5',
            marginBottom: '50px'
          }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>
              About {alternativesData.mainPlatform.name}
            </h2>
            <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '20px' }}>
              {alternativesData.mainPlatform.description || mainPlatform.description}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
              <div>
                <strong>Pricing:</strong> {alternativesData.mainPlatform.pricing || mainPlatform.pricing || 'See website'}
              </div>
              {mainPlatform.rating && (
                <div>
                  <strong>Rating:</strong> ⭐ {mainPlatform.rating}/5
                </div>
              )}
              {mainPlatform.verified && (
                <div>
                  <strong>Status:</strong> ✓ Verified
                </div>
              )}
            </div>
          </div>
        )}

        {/* Alternatives Grid */}
        <div className="alternatives-grid" style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '30px' }}>
            Top {alternativesData.alternatives.length} Alternatives
          </h2>

          <div style={{ display: 'grid', gap: '30px' }}>
            {alternativesData.alternatives.map((alt: any, index: number) => {
              const platform = alternativePlatforms.find(p => p?.slug === alt.slug || p?.id === alt.slug);

              return (
                <div key={index} style={{
                  border: '3px solid #000',
                  padding: '30px',
                  background: index === 0 ? '#000' : '#fff',
                  color: index === 0 ? '#fff' : '#000'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '28px', fontWeight: '700' }}>
                      {index + 1}. {alt.name}
                    </h3>
                    {alt.highlight && (
                      <span style={{
                        background: index === 0 ? '#fff' : '#000',
                        color: index === 0 ? '#000' : '#fff',
                        padding: '5px 15px',
                        fontSize: '12px',
                        fontWeight: '700',
                        border: `2px solid ${index === 0 ? '#fff' : '#000'}`
                      }}>
                        {alt.highlight}
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
                    {alt.description}
                  </p>

                  <div style={{ marginBottom: '20px' }}>
                    <strong>Best For:</strong> {alt.bestFor}
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <strong>Pricing:</strong> {alt.pricing}
                  </div>

                  {alt.rating && (
                    <div style={{ marginBottom: '20px' }}>
                      <strong>Rating:</strong> ⭐ {alt.rating}/5
                    </div>
                  )}

                  {alt.keyFeatures && alt.keyFeatures.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <strong>Key Features:</strong>
                      <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                        {alt.keyFeatures.map((feature: string, fIndex: number) => (
                          <li key={fIndex} style={{ marginBottom: '5px' }}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {platform && (
                    <button
                      onClick={() => navigate(`/platform/${platform.slug || platform.id}`)}
                      style={{
                        border: `3px solid ${index === 0 ? '#fff' : '#000'}`,
                        background: index === 0 ? '#fff' : '#000',
                        color: index === 0 ? '#000' : '#fff',
                        padding: '12px 25px',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      VIEW {alt.name.toUpperCase()} →
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Verdict */}
        {alternativesData.verdict && (
          <div className="alternatives-verdict" style={{
            border: '5px solid #000',
            padding: '40px',
            background: '#f5f5f5',
            marginTop: '60px'
          }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '20px' }}>
              Verdict: Choosing the Right Alternative
            </h2>
            <p style={{ fontSize: '20px', lineHeight: '1.8' }}>
              {alternativesData.verdict}
            </p>
          </div>
        )}

        {/* CTA to Browse All */}
        <div className="alternatives-cta" style={{
          border: '5px solid #000',
          padding: '40px',
          background: '#000',
          color: '#fff',
          textAlign: 'center',
          marginTop: '50px'
        }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>
            Explore More AI Tools
          </h2>
          <button
            onClick={() => navigate('/')}
            style={{
              border: '3px solid #fff',
              background: '#fff',
              color: '#000',
              padding: '15px 40px',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            BROWSE ALL 721 AI PLATFORMS →
          </button>
        </div>

      </div>
    </div>
  );
}

export default AlternativesPage;
