import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Platform } from '../types';
import { BreadcrumbSchema, VisualBreadcrumb } from '../components/BreadcrumbSchema';
import { SocialMetaTags } from '../components/SocialMetaTags';

function BestOfPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [bestOfData, setBestOfData] = useState<any>(null);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/best-of/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setBestOfData(data);

        // Fetch all platforms in the list
        const platformData = await Promise.all(
          data.platforms.slice(0, 15).map(async (platform: any) => {
            const platformResponse = await fetch(`/api/platforms/${platform.slug}`);
            if (platformResponse.ok) {
              return platformResponse.json();
            }
            return null;
          })
        );

        setPlatforms(platformData.filter(Boolean));
      }
    } catch (error) {
      console.error('Failed to fetch best-of:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="loading">Loading list...</div>
      </div>
    );
  }

  if (!bestOfData) {
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
    { name: 'Best Of Lists', url: 'https://aiplatformslist.com/best' },
    { name: bestOfData.title, url: `https://aiplatformslist.com/best/${slug}` },
  ];

  return (
    <div className="bestof-page">
      {/* Social Meta Tags for sharing */}
      <SocialMetaTags
        title={bestOfData.title}
        description={bestOfData.description || `Discover the best AI tools in ${bestOfData.category || 'this category'} for 2026. Compare features, pricing, and reviews of top platforms.`}
        url={`https://aiplatformslist.com/best/${slug}`}
        type="article"
      />

      <BreadcrumbSchema items={breadcrumbItems} />

      {/* Hero Section */}
      <div className="bestof-hero" style={{
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

          <h1 className="bestof-title" style={{
            fontSize: '48px',
            fontWeight: '700',
            marginTop: '20px',
            lineHeight: '1.2'
          }}>
            {bestOfData.title}
          </h1>

          <p className="bestof-meta" style={{
            fontSize: '18px',
            marginTop: '20px',
            opacity: 0.9
          }}>
            {bestOfData.metaDescription}
          </p>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginTop: '30px'
          }}>
            <div style={{ border: '3px solid #fff', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: '700' }}>{bestOfData.totalPlatforms}</div>
              <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '5px' }}>TOOLS REVIEWED</div>
            </div>
            <div style={{ border: '3px solid #fff', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: '700' }}>{bestOfData.category?.toUpperCase() || 'AI TOOLS'}</div>
              <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '5px' }}>CATEGORY</div>
            </div>
            <div style={{ border: '3px solid #fff', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: '700' }}>2026</div>
              <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '5px' }}>UPDATED</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Introduction */}
        <div className="bestof-intro" style={{ marginBottom: '50px' }}>
          <p style={{ fontSize: '20px', lineHeight: '1.8', fontWeight: '500' }}>
            {bestOfData.introduction}
          </p>
        </div>

        {/* Selection Criteria */}
        {bestOfData.selectionCriteria && bestOfData.selectionCriteria.length > 0 && (
          <div className="selection-criteria" style={{
            border: '3px solid #000',
            padding: '40px',
            background: '#f5f5f5',
            marginBottom: '50px'
          }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>
              Our Selection Criteria
            </h2>
            <ul style={{ fontSize: '18px', lineHeight: '1.8', paddingLeft: '20px' }}>
              {bestOfData.selectionCriteria.map((criterion: string, index: number) => (
                <li key={index} style={{ marginBottom: '10px' }}>{criterion}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Platforms List */}
        <div className="platforms-list" style={{ marginBottom: '50px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '30px' }}>
            Top {bestOfData.platforms.length} Picks
          </h2>

          <div style={{ display: 'grid', gap: '30px' }}>
            {bestOfData.platforms.map((platformData: any, index: number) => {
              const fullPlatform = platforms.find(p => p?.slug === platformData.slug || p?.id === platformData.slug);
              const isTopPick = index < 3;

              return (
                <div key={index} style={{
                  border: isTopPick ? '5px solid #000' : '3px solid #000',
                  padding: '30px',
                  background: index === 0 ? '#000' : '#fff',
                  color: index === 0 ? '#fff' : '#000',
                  position: 'relative'
                }}>
                  {isTopPick && (
                    <div style={{
                      position: 'absolute',
                      top: '-15px',
                      left: '30px',
                      background: index === 0 ? '#fff' : '#000',
                      color: index === 0 ? '#000' : '#fff',
                      padding: '5px 20px',
                      fontSize: '14px',
                      fontWeight: '700',
                      border: `3px solid ${index === 0 ? '#fff' : '#000'}`
                    }}>
                      {index === 0 ? '🏆 TOP PICK' : index === 1 ? '🥈 RUNNER-UP' : '🥉 POPULAR CHOICE'}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '28px', fontWeight: '700' }}>
                      #{platformData.rank}. {platformData.name}
                    </h3>
                    {platformData.verified && (
                      <span style={{ fontSize: '24px' }}>✓</span>
                    )}
                  </div>

                  <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
                    {platformData.description}
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '15px',
                    marginBottom: '20px'
                  }}>
                    <div>
                      <strong>Best For:</strong><br />
                      {platformData.bestFor}
                    </div>
                    <div>
                      <strong>Pricing:</strong><br />
                      {platformData.pricing}
                    </div>
                    {platformData.rating && (
                      <div>
                        <strong>Rating:</strong><br />
                        ⭐ {platformData.rating}/5
                      </div>
                    )}
                  </div>

                  {platformData.keyFeatures && platformData.keyFeatures.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <strong>Key Features:</strong>
                      <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                        {platformData.keyFeatures.map((feature: string, fIndex: number) => (
                          <li key={fIndex} style={{ marginBottom: '5px' }}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {platformData.pros && platformData.pros.length > 0 && (
                    <div style={{ marginBottom: '15px' }}>
                      <strong>Pros:</strong>
                      <ul style={{ marginTop: '10px', paddingLeft: '20px', color: index === 0 ? '#4ade80' : '#22c55e' }}>
                        {platformData.pros.map((pro: string, pIndex: number) => (
                          <li key={pIndex} style={{ marginBottom: '5px' }}>{pro}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {platformData.cons && platformData.cons.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <strong>Cons:</strong>
                      <ul style={{ marginTop: '10px', paddingLeft: '20px', color: index === 0 ? '#fca5a5' : '#ef4444' }}>
                        {platformData.cons.map((con: string, cIndex: number) => (
                          <li key={cIndex} style={{ marginBottom: '5px' }}>{con}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {fullPlatform && (
                    <button
                      onClick={() => navigate(`/platform/${fullPlatform.slug || fullPlatform.id}`)}
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
                      VIEW {platformData.name.toUpperCase()} →
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* How to Choose */}
        {bestOfData.howToChoose && bestOfData.howToChoose.length > 0 && (
          <div className="how-to-choose" style={{
            border: '3px solid #000',
            padding: '40px',
            background: '#f5f5f5',
            marginBottom: '50px'
          }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>
              How to Choose the Right Tool
            </h2>
            <ol style={{ fontSize: '18px', lineHeight: '1.8', paddingLeft: '20px' }}>
              {bestOfData.howToChoose.map((step: string, index: number) => (
                <li key={index} style={{ marginBottom: '15px' }}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Verdict */}
        {bestOfData.verdict && (
          <div className="bestof-verdict" style={{
            border: '5px solid #000',
            padding: '40px',
            background: '#000',
            color: '#fff',
            marginTop: '60px'
          }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '20px' }}>
              Final Verdict
            </h2>
            <p style={{ fontSize: '20px', lineHeight: '1.8' }}>
              {bestOfData.verdict}
            </p>
          </div>
        )}

        {/* CTA to Browse Category */}
        <div className="bestof-cta" style={{
          border: '5px solid #000',
          padding: '40px',
          textAlign: 'center',
          marginTop: '50px'
        }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>
            Explore More {bestOfData.category?.replace(/-/g, ' ').toUpperCase() || 'AI'} Tools
          </h2>
          <button
            onClick={() => navigate(bestOfData.category ? `/category/${bestOfData.category}` : '/')}
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
            BROWSE ALL {bestOfData.category?.replace(/-/g, ' ').toUpperCase() || 'AI'} TOOLS →
          </button>
        </div>

      </div>
    </div>
  );
}

export default BestOfPage;
