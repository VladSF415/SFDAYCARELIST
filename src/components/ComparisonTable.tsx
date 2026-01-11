interface ComparisonPlatform {
  name: string;
  features: Record<string, string | boolean>;
  pricing: string;
  bestFor: string;
}

interface ComparisonTableProps {
  title: string;
  description?: string;
  platforms: ComparisonPlatform[];
  features: string[];
}

export function ComparisonTable({ title, description, platforms, features }: ComparisonTableProps) {
  const renderFeatureValue = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? '✓' : '✗';
    }
    return value;
  };

  return (
    <div style={{ marginTop: '60px', marginBottom: '40px' }}>
      <h2 style={{
        fontSize: '32px',
        fontWeight: '900',
        marginBottom: '15px',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        {title}
      </h2>

      {description && (
        <p style={{
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '30px',
          opacity: 0.8
        }}>
          {description}
        </p>
      )}

      {/* Desktop Table View */}
      <div style={{
        display: 'none',
        overflowX: 'auto',
        border: '4px solid #000',
        marginBottom: '20px'
      }}
      className="comparison-table-desktop"
      >
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: '#fff',
          minWidth: '800px'
        }}>
          <thead>
            <tr style={{ background: '#000', color: '#fff' }}>
              <th style={{
                padding: '20px',
                textAlign: 'left',
                fontWeight: '900',
                fontSize: '14px',
                letterSpacing: '0.5px',
                borderRight: '2px solid #333'
              }}>
                FEATURE
              </th>
              {platforms.map((platform, index) => (
                <th key={index} style={{
                  padding: '20px',
                  textAlign: 'center',
                  fontWeight: '900',
                  fontSize: '14px',
                  letterSpacing: '0.5px',
                  borderRight: index < platforms.length - 1 ? '2px solid #333' : 'none'
                }}>
                  {platform.name.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, featureIndex) => (
              <tr key={featureIndex} style={{
                background: featureIndex % 2 === 0 ? '#fff' : '#f5f5f5',
                borderTop: '2px solid #000'
              }}>
                <td style={{
                  padding: '15px 20px',
                  fontWeight: '700',
                  fontSize: '14px',
                  borderRight: '2px solid #000'
                }}>
                  {feature}
                </td>
                {platforms.map((platform, platformIndex) => (
                  <td key={platformIndex} style={{
                    padding: '15px 20px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontFamily: '"Courier New", monospace',
                    fontWeight: '600',
                    borderRight: platformIndex < platforms.length - 1 ? '2px solid #ddd' : 'none'
                  }}>
                    {renderFeatureValue(platform.features[feature] || '—')}
                  </td>
                ))}
              </tr>
            ))}

            {/* Pricing Row */}
            <tr style={{ background: '#FFFF00', borderTop: '3px solid #000' }}>
              <td style={{
                padding: '15px 20px',
                fontWeight: '900',
                fontSize: '14px',
                borderRight: '2px solid #000'
              }}>
                PRICING
              </td>
              {platforms.map((platform, platformIndex) => (
                <td key={platformIndex} style={{
                  padding: '15px 20px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: '700',
                  borderRight: platformIndex < platforms.length - 1 ? '2px solid #ccc' : 'none'
                }}>
                  {platform.pricing}
                </td>
              ))}
            </tr>

            {/* Best For Row */}
            <tr style={{ background: '#000', color: '#fff', borderTop: '2px solid #000' }}>
              <td style={{
                padding: '15px 20px',
                fontWeight: '900',
                fontSize: '14px',
                borderRight: '2px solid #333'
              }}>
                BEST FOR
              </td>
              {platforms.map((platform, platformIndex) => (
                <td key={platformIndex} style={{
                  padding: '15px 20px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: '600',
                  lineHeight: '1.4',
                  borderRight: platformIndex < platforms.length - 1 ? '2px solid #333' : 'none'
                }}>
                  {platform.bestFor}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="comparison-table-mobile" style={{
        display: 'block'
      }}>
        {platforms.map((platform, index) => (
          <div key={index} style={{
            border: '4px solid #000',
            marginBottom: '20px',
            background: '#fff'
          }}>
            <div style={{
              background: '#000',
              color: '#fff',
              padding: '20px',
              fontWeight: '900',
              fontSize: '18px',
              letterSpacing: '0.5px'
            }}>
              {platform.name.toUpperCase()}
            </div>

            <div style={{ padding: '20px' }}>
              {features.map((feature, featureIndex) => (
                <div key={featureIndex} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: featureIndex < features.length - 1 ? '2px solid #eee' : 'none'
                }}>
                  <span style={{ fontWeight: '700', fontSize: '14px' }}>{feature}</span>
                  <span style={{
                    fontFamily: '"Courier New", monospace',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    {renderFeatureValue(platform.features[feature] || '—')}
                  </span>
                </div>
              ))}

              <div style={{
                background: '#FFFF00',
                padding: '15px',
                marginTop: '15px',
                border: '2px solid #000',
                fontWeight: '700',
                fontSize: '14px'
              }}>
                <div style={{ marginBottom: '8px' }}>💰 {platform.pricing}</div>
              </div>

              <div style={{
                background: '#000',
                color: '#fff',
                padding: '15px',
                marginTop: '10px',
                border: '2px solid #000',
                fontSize: '13px',
                lineHeight: '1.4'
              }}>
                <div style={{ fontWeight: '700', marginBottom: '5px' }}>BEST FOR:</div>
                {platform.bestFor}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CSS for responsive behavior */}
      <style>{`
        @media (min-width: 1024px) {
          .comparison-table-desktop {
            display: block !important;
          }
          .comparison-table-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
