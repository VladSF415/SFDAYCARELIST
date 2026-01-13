import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SocialMetaTags } from '../components/SocialMetaTags';

interface DaycareSubmitForm {
  daycareName: string;
  address: string;
  neighborhood: string;
  phone: string;
  email: string;
  website: string;
  licenseNumber: string;
  agesServed: string[];
  programs: string[];
  hoursOfOperation: string;
  pricing: string;
  capacity: string;
  description: string;
  contactName: string;
  contactEmail: string;
}

function SubmitTool() {
  const [totalDaycares, setTotalDaycares] = useState(0);

  useEffect(() => {
    fetch('/api/daycares/count')
      .then(res => res.json())
      .then(data => setTotalDaycares(data.count))
      .catch(err => console.error('Failed to fetch total count:', err));
  }, []);

  const [form, setForm] = useState<DaycareSubmitForm>({
    daycareName: '',
    address: '',
    neighborhood: '',
    phone: '',
    email: '',
    website: '',
    licenseNumber: '',
    agesServed: [],
    programs: [],
    hoursOfOperation: '',
    pricing: '',
    capacity: '',
    description: '',
    contactName: '',
    contactEmail: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/submit-daycare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit. Please try again.');
    }

    setSubmitting(false);
  };

  const toggleArrayField = (field: 'agesServed' | 'programs', value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    background: '#ffffff',
    fontFamily: 'Inter, -apple-system, sans-serif',
    fontSize: '15px',
    fontWeight: 500,
    outline: 'none',
    transition: 'all 0.2s'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontFamily: 'Quicksand, sans-serif',
    fontSize: '15px',
    fontWeight: 700,
    color: '#1e3a8a'
  };

  if (success) {
    return (
      <>
        <SocialMetaTags
          title="Submission Received - SF Daycare List"
          description="Thank you for submitting your daycare to SF Daycare List"
          url="https://sfdaycarelist.com/submit"
        />
        <div style={{ maxWidth: '800px', margin: '60px auto', padding: '40px 20px', textAlign: 'center' }}>
          <div style={{
            padding: '60px 40px',
            border: '2px solid #e2e8f0',
            borderRadius: '24px',
            background: '#ffffff'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #ff6b35, #ee6c4d)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '40px',
              fontWeight: 900,
              borderRadius: '50%'
            }}>✓</div>
            <h1 style={{
              fontFamily: 'Quicksand, sans-serif',
              marginBottom: '16px',
              color: '#1e3a8a',
              fontSize: '32px'
            }}>Submission Received!</h1>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              color: '#64748b',
              marginBottom: '30px',
              lineHeight: '1.6'
            }}>
              Thank you for submitting your daycare! We'll review your information and add it to our directory within 24-48 hours. You'll receive a confirmation email once it's live.
            </p>
            <Link
              to="/"
              style={{
                display: 'inline-block',
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #ff6b35, #ee6c4d)',
                color: '#ffffff',
                textDecoration: 'none',
                fontFamily: 'Quicksand, sans-serif',
                fontWeight: 700,
                borderRadius: '24px',
                transition: 'all 0.3s'
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SocialMetaTags
        title="Submit Your Daycare - SF Daycare List"
        description="List your licensed San Francisco daycare on SF Daycare List to reach parents looking for quality childcare."
        url="https://sfdaycarelist.com/submit"
      />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              marginBottom: '20px',
              color: '#1e3a8a',
              textDecoration: 'none',
              fontFamily: 'Quicksand, sans-serif',
              fontWeight: 700,
              fontSize: '15px',
              padding: '10px 20px',
              border: '2px solid #1e3a8a',
              borderRadius: '12px',
              transition: 'all 0.2s'
            }}
          >
            ← Back to Home
          </Link>
          <h1 style={{
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '42px',
            fontWeight: 700,
            marginBottom: '12px',
            color: '#1e3a8a'
          }}>
            List Your Daycare
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '18px',
            color: '#64748b',
            lineHeight: '1.6'
          }}>
            Join {totalDaycares}+ licensed daycares on SF Daycare List and connect with San Francisco families looking for quality childcare.
          </p>
        </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div style={{
          padding: '32px',
          border: '2px solid #e2e8f0',
          borderRadius: '24px',
          background: '#ffffff',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '24px',
            fontWeight: 700,
            marginBottom: '24px',
            paddingBottom: '12px',
            borderBottom: '2px solid #e2e8f0',
            color: '#1e3a8a'
          }}>
            Daycare Information
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Daycare Name *</label>
            <input
              type="text"
              required
              value={form.daycareName}
              onChange={(e) => setForm({ ...form, daycareName: e.target.value })}
              style={inputStyle}
              placeholder="Happy Kids Daycare"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Street Address *</label>
            <input
              type="text"
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              style={inputStyle}
              placeholder="123 Main Street, San Francisco, CA 94102"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Neighborhood *</label>
              <select
                required
                value={form.neighborhood}
                onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="">Select Neighborhood</option>
                <option value="Mission">Mission District</option>
                <option value="Noe Valley">Noe Valley</option>
                <option value="Castro">Castro</option>
                <option value="Pacific Heights">Pacific Heights</option>
                <option value="Marina">Marina</option>
                <option value="Sunset">Sunset District</option>
                <option value="Richmond">Richmond District</option>
                <option value="SOMA">SOMA</option>
                <option value="Financial District">Financial District</option>
                <option value="Haight-Ashbury">Haight-Ashbury</option>
                <option value="Potrero Hill">Potrero Hill</option>
                <option value="Bernal Heights">Bernal Heights</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>License Number *</label>
              <input
                type="text"
                required
                value={form.licenseNumber}
                onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                style={inputStyle}
                placeholder="CA License #"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Phone Number *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                style={inputStyle}
                placeholder="(415) 555-1234"
              />
            </div>

            <div>
              <label style={labelStyle}>Email Address *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
                placeholder="info@yourdaycare.com"
              />
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <label style={labelStyle}>Website (Optional)</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              style={inputStyle}
              placeholder="https://yourdaycare.com"
            />
          </div>
        </div>

        {/* Programs & Ages */}
        <div style={{
          padding: '32px',
          border: '2px solid #e2e8f0',
          borderRadius: '24px',
          background: '#ffffff',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '24px',
            fontWeight: 700,
            marginBottom: '24px',
            paddingBottom: '12px',
            borderBottom: '2px solid #e2e8f0',
            color: '#1e3a8a'
          }}>
            Programs & Ages Served
          </h2>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Ages Served * (Select all that apply)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginTop: '12px' }}>
              {['Infants (0-12 months)', 'Toddlers (1-2 years)', 'Preschool (3-5 years)', 'School Age (6+ years)'].map((age) => (
                <label key={age} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  border: `2px solid ${form.agesServed.includes(age) ? '#ff6b35' : '#e2e8f0'}`,
                  borderRadius: '12px',
                  background: form.agesServed.includes(age) ? '#fff5f3' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                  <input
                    type="checkbox"
                    checked={form.agesServed.includes(age)}
                    onChange={() => toggleArrayField('agesServed', age)}
                    style={{ marginRight: '8px', accentColor: '#ff6b35' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e3a8a' }}>{age}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Programs Offered * (Select all that apply)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginTop: '12px' }}>
              {['Full-time care', 'Part-time care', 'Drop-in care', 'Before/After school', 'Summer programs', 'Bilingual education'].map((program) => (
                <label key={program} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  border: `2px solid ${form.programs.includes(program) ? '#ff6b35' : '#e2e8f0'}`,
                  borderRadius: '12px',
                  background: form.programs.includes(program) ? '#fff5f3' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                  <input
                    type="checkbox"
                    checked={form.programs.includes(program)}
                    onChange={() => toggleArrayField('programs', program)}
                    style={{ marginRight: '8px', accentColor: '#ff6b35' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e3a8a' }}>{program}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div style={{
          padding: '32px',
          border: '2px solid #e2e8f0',
          borderRadius: '24px',
          background: '#ffffff',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '24px',
            fontWeight: 700,
            marginBottom: '24px',
            paddingBottom: '12px',
            borderBottom: '2px solid #e2e8f0',
            color: '#1e3a8a'
          }}>
            Additional Details
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Hours of Operation *</label>
            <input
              type="text"
              required
              value={form.hoursOfOperation}
              onChange={(e) => setForm({ ...form, hoursOfOperation: e.target.value })}
              style={inputStyle}
              placeholder="Monday-Friday, 7:00 AM - 6:00 PM"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Pricing Information *</label>
              <input
                type="text"
                required
                value={form.pricing}
                onChange={(e) => setForm({ ...form, pricing: e.target.value })}
                style={inputStyle}
                placeholder="$1,500-$2,000/month"
              />
            </div>

            <div>
              <label style={labelStyle}>Capacity *</label>
              <input
                type="text"
                required
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                style={inputStyle}
                placeholder="20 children"
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Description *</label>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={5}
              style={{ ...inputStyle, minHeight: '150px', resize: 'vertical' }}
              placeholder="Tell parents about your daycare, curriculum, philosophy, facilities, and what makes your program special..."
            />
          </div>
        </div>

        {/* Contact Person */}
        <div style={{
          padding: '32px',
          border: '2px solid #e2e8f0',
          borderRadius: '24px',
          background: '#ffffff',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '24px',
            fontWeight: 700,
            marginBottom: '24px',
            paddingBottom: '12px',
            borderBottom: '2px solid #e2e8f0',
            color: '#1e3a8a'
          }}>
            Contact Person
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Your Name *</label>
              <input
                type="text"
                required
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                style={inputStyle}
                placeholder="Your name"
              />
            </div>

            <div>
              <label style={labelStyle}>Your Email *</label>
              <input
                type="email"
                required
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                style={inputStyle}
                placeholder="your.email@example.com"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || form.agesServed.length === 0 || form.programs.length === 0}
          style={{
            width: '100%',
            padding: '20px',
            background: (submitting || form.agesServed.length === 0 || form.programs.length === 0) ? '#cccccc' : 'linear-gradient(135deg, #ff6b35, #ee6c4d)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '24px',
            fontFamily: 'Quicksand, sans-serif',
            fontSize: '18px',
            fontWeight: 700,
            cursor: (submitting || form.agesServed.length === 0 || form.programs.length === 0) ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s'
          }}
        >
          {submitting ? 'Submitting...' : 'Submit Daycare Listing'}
        </button>

        <p style={{
          marginTop: '20px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: '#64748b',
          textAlign: 'center',
          lineHeight: '1.6'
        }}>
          Free to list. Your submission will be reviewed within 24-48 hours. We'll email you once your daycare is live on SF Daycare List.
        </p>
      </form>
    </div>
    </>
  );
}

export default SubmitTool;
