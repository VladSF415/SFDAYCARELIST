import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { SubmitToolForm } from '../types';
import { analytics } from '../utils/analytics';

function SubmitTool() {
  const [totalPlatforms, setTotalPlatforms] = useState(0);

  useEffect(() => {
    analytics.startSubmission();
    fetch('/api/platforms?limit=0')
      .then(res => res.json())
      .then(data => setTotalPlatforms(data.total))
      .catch(err => console.error('Failed to fetch total count:', err));
  }, []);

  const [form, setForm] = useState<SubmitToolForm>({
    name: '',
    description: '',
    website: '',
    category: 'ml-frameworks',
    pricing: '',
    contactEmail: '',
    wantsFeatured: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const SUBMISSION_FEE = 49;
  const FEATURED_PRICING = {
    basic: 99,
    premium: 199,
    enterprise: 299,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let totalPrice = SUBMISSION_FEE;
      if (form.wantsFeatured && form.featuredTier) {
        totalPrice += FEATURED_PRICING[form.featuredTier];
      }

      const response = await fetch('/api/submit-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, totalPrice }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        analytics.completeSubmission(form.name, form.wantsFeatured);
        window.location.href = data.checkoutUrl;
      } else {
        analytics.completeSubmission(form.name, form.wantsFeatured);
        setSuccess(true);
      }
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit. Please try again.');
    }

    setSubmitting(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    border: '4px solid #000000',
    background: '#ffffff',
    fontFamily: "'Courier New', monospace",
    fontSize: '14px',
    fontWeight: 700,
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontFamily: "'Courier New', monospace",
    fontSize: '12px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  };

  if (success) {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{
          padding: '60px 40px',
          border: '6px solid #000000',
          background: '#ffffff'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#000000',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '40px',
            fontWeight: 900
          }}>✓</div>
          <h1 style={{
            fontFamily: "'Courier New', monospace",
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginBottom: '16px'
          }}>Submission Received</h1>
          <p style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '16px',
            color: '#666',
            marginBottom: '30px'
          }}>
            Your AI tool will be reviewed and published within 24-48 hours.
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              padding: '16px 32px',
              background: '#000000',
              color: '#ffffff',
              textDecoration: 'none',
              fontFamily: "'Courier New', monospace",
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              border: '4px solid #000000'
            }}
          >
            ← Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            marginBottom: '20px',
            color: '#000000',
            textDecoration: 'none',
            fontFamily: "'Courier New', monospace",
            fontWeight: 900,
            textTransform: 'uppercase',
            fontSize: '13px',
            padding: '10px 20px',
            border: '3px solid #000000'
          }}
        >
          ← Back to Directory
        </Link>
        <h1 style={{
          fontFamily: "'Courier New', monospace",
          fontSize: '36px',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '3px',
          marginBottom: '12px'
        }}>
          Submit Your AI Tool
        </h1>
        <p style={{
          fontFamily: "'Courier New', monospace",
          fontSize: '16px',
          color: '#666'
        }}>
          Get listed in our directory of {totalPlatforms}+ curated daycares
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div style={{
          padding: '32px',
          border: '4px solid #000000',
          background: '#ffffff',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '18px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '24px',
            paddingBottom: '12px',
            borderBottom: '4px solid #000000'
          }}>
            Basic Information
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Tool Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
              placeholder="E.G., CHATGPT, MIDJOURNEY"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Description *</label>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
              placeholder="BRIEF DESCRIPTION OF YOUR AI TOOL (50-200 CHARACTERS)"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Website URL *</label>
            <input
              type="url"
              required
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              style={inputStyle}
              placeholder="HTTPS://YOUR-AI-TOOL.COM"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Category *</label>
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="ml-frameworks">ML FRAMEWORKS</option>
                <option value="generative-ai">GENERATIVE AI</option>
                <option value="computer-vision">COMPUTER VISION</option>
                <option value="nlp">NLP</option>
                <option value="llms">LLMS</option>
                <option value="analytics-bi">ANALYTICS & BI</option>
                <option value="code-ai">CODE AI</option>
                <option value="image-generation">IMAGE GENERATION</option>
                <option value="video-ai">VIDEO AI</option>
                <option value="agent-platforms">AGENT PLATFORMS</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Pricing Model *</label>
              <input
                type="text"
                required
                value={form.pricing}
                onChange={(e) => setForm({ ...form, pricing: e.target.value })}
                style={inputStyle}
                placeholder="FREE, FREEMIUM, $10/MONTH"
              />
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <label style={labelStyle}>Contact Email *</label>
            <input
              type="email"
              required
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              style={inputStyle}
              placeholder="YOUR@EMAIL.COM"
            />
          </div>
        </div>

        {/* Featured Listing Option */}
        <div style={{
          padding: '32px',
          border: '4px solid #000000',
          background: '#f5f5f5',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '18px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '24px',
            paddingBottom: '12px',
            borderBottom: '4px solid #000000'
          }}>
            Featured Listing (Optional)
          </h2>

          <label style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '24px',
            cursor: 'pointer',
            fontFamily: "'Courier New', monospace",
            fontWeight: 700,
            textTransform: 'uppercase'
          }}>
            <input
              type="checkbox"
              checked={form.wantsFeatured}
              onChange={(e) => setForm({ ...form, wantsFeatured: e.target.checked })}
              style={{ marginRight: '12px', width: '24px', height: '24px', cursor: 'pointer', accentColor: '#000000' }}
            />
            Upgrade to Featured Listing for More Visibility
          </label>

          {form.wantsFeatured && (
            <div style={{ display: 'grid', gap: '16px' }}>
              {[
                { tier: 'basic', name: 'Basic Featured', price: FEATURED_PRICING.basic, desc: 'Featured badge, higher placement' },
                { tier: 'premium', name: 'Premium Featured', price: FEATURED_PRICING.premium, desc: 'Top 3 placement, custom description, priority support' },
                { tier: 'enterprise', name: 'Enterprise Featured', price: FEATURED_PRICING.enterprise, desc: '#1 placement, custom branding, dedicated account manager' },
              ].map(({ tier, name, price, desc }) => (
                <label
                  key={tier}
                  style={{
                    padding: '20px',
                    border: form.featuredTier === tier ? '4px solid #000000' : '3px solid #cccccc',
                    background: form.featuredTier === tier ? '#FFFF00' : '#ffffff',
                    cursor: 'pointer',
                    display: 'block'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <input
                      type="radio"
                      name="featuredTier"
                      value={tier}
                      checked={form.featuredTier === tier}
                      onChange={(e) => setForm({ ...form, featuredTier: e.target.value as any })}
                      style={{ marginRight: '12px', width: '20px', height: '20px', accentColor: '#000000' }}
                    />
                    <span style={{
                      fontFamily: "'Courier New', monospace",
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      fontSize: '14px'
                    }}>
                      {name}
                    </span>
                    <span style={{
                      marginLeft: 'auto',
                      fontFamily: "'Courier New', monospace",
                      fontWeight: 900,
                      fontSize: '16px'
                    }}>
                      ${price}/mo
                    </span>
                  </div>
                  <div style={{
                    marginLeft: '32px',
                    fontFamily: "'Courier New', monospace",
                    fontSize: '12px',
                    color: '#666'
                  }}>
                    {desc}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Pricing Summary */}
        <div style={{
          padding: '24px 32px',
          border: '4px solid #000000',
          background: '#000000',
          color: '#ffffff',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '12px',
            fontFamily: "'Courier New', monospace",
            fontSize: '14px'
          }}>
            <span>SUBMISSION FEE:</span>
            <span style={{ fontWeight: 900 }}>${SUBMISSION_FEE}</span>
          </div>
          {form.wantsFeatured && form.featuredTier && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px',
              fontFamily: "'Courier New', monospace",
              fontSize: '14px'
            }}>
              <span>FEATURED LISTING:</span>
              <span style={{ fontWeight: 900 }}>${FEATURED_PRICING[form.featuredTier]}</span>
            </div>
          )}
          <div style={{
            borderTop: '2px solid #ffffff',
            paddingTop: '12px',
            marginTop: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: "'Courier New', monospace",
            fontSize: '20px',
            fontWeight: 900
          }}>
            <span>TOTAL:</span>
            <span style={{ background: '#FFFF00', color: '#000000', padding: '4px 12px' }}>
              ${SUBMISSION_FEE + (form.wantsFeatured && form.featuredTier ? FEATURED_PRICING[form.featuredTier] : 0)}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            padding: '20px',
            background: submitting ? '#666666' : '#000000',
            color: '#ffffff',
            border: '4px solid #000000',
            fontFamily: "'Courier New', monospace",
            fontSize: '16px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '3px',
            cursor: submitting ? 'wait' : 'pointer'
          }}
        >
          {submitting ? 'Processing...' : 'Continue to Payment →'}
        </button>

        <p style={{
          marginTop: '20px',
          fontFamily: "'Courier New', monospace",
          fontSize: '12px',
          color: '#666',
          textAlign: 'center',
          textTransform: 'uppercase'
        }}>
          Secure payment powered by Stripe. Reviewed within 24-48 hours.
        </p>
      </form>
    </div>
  );
}

export default SubmitTool;
