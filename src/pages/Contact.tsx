import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SocialMetaTags } from '../components/SocialMetaTags';
import './legal/LegalPage.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: 'general', message: '' });
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Failed to send message');
        setStatus('error');
      }
    } catch {
      setErrorMessage('Network error. Please try again.');
      setStatus('error');
    }
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
    marginBottom: '16px',
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

  return (
    <>
      <SocialMetaTags
        title="Contact Us - SF Daycare List"
        description="Get in touch with SF Daycare List. Ask questions, list your daycare, or provide feedback about our directory."
        url="https://sfdaycarelist.com/contact"
      />

      <div className="legal-page">
        <div className="legal-container">
          <div className="legal-header">
            <Link to="/" className="back-link">← Back to Home</Link>
            <h1>Contact Us</h1>
            <p className="last-updated">We'd love to hear from you</p>
          </div>

          <div className="legal-content">
            <section>
              <h2>Get In Touch</h2>
              <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#475569', marginBottom: '32px' }}>
                Whether you're a parent looking for childcare, a daycare provider wanting to list your facility,
                or just have questions about our directory, we're here to help!
              </p>

              {status === 'success' && (
                <div style={{ padding: '20px', background: '#d4edda', border: '2px solid #28a745', borderRadius: '12px', marginBottom: '24px', color: '#155724' }}>
                  <strong>✓ Message sent successfully!</strong> We'll get back to you within 24-48 hours.
                </div>
              )}

              {status === 'error' && (
                <div style={{ padding: '20px', background: '#f8d7da', border: '2px solid #dc3545', borderRadius: '12px', marginBottom: '24px', color: '#721c24' }}>
                  <strong>Error:</strong> {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div>
                  <label style={labelStyle}>Your Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={inputStyle}
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    style={inputStyle}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="list-daycare">List My Daycare</option>
                    <option value="parent-question">Parent Question</option>
                    <option value="update-info">Update Daycare Information</option>
                    <option value="report-issue">Report an Issue</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '150px' }}
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'linear-gradient(135deg, #ff6b35, #ee6c4d)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '24px',
                    fontFamily: 'Quicksand, sans-serif',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                    opacity: status === 'sending' ? 0.7 : 1,
                    transition: 'all 0.2s'
                  }}
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </section>

            <section style={{ marginTop: '48px', paddingTop: '48px', borderTop: '2px solid #e2e8f0' }}>
              <h2>Other Ways to Reach Us</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginTop: '24px' }}>
                <div style={{ padding: '24px', background: '#f9fafb', borderRadius: '12px', border: '2px solid #e2e8f0' }}>
                  <h3 style={{ color: '#1e3a8a', marginBottom: '12px', fontSize: '18px' }}>📧 Email</h3>
                  <a href="mailto:info@sfdaycarelist.com" style={{ color: '#ff6b35', fontWeight: '600', textDecoration: 'none' }}>
                    info@sfdaycarelist.com
                  </a>
                  <p style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>
                    We respond within 24-48 hours
                  </p>
                </div>

                <div style={{ padding: '24px', background: '#f9fafb', borderRadius: '12px', border: '2px solid #e2e8f0' }}>
                  <h3 style={{ color: '#1e3a8a', marginBottom: '12px', fontSize: '18px' }}>🏢 Business</h3>
                  <p style={{ fontWeight: '600', color: '#334155' }}>Badly Creative LLC</p>
                  <p style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>
                    Operator of SF Daycare List
                  </p>
                </div>

                <div style={{ padding: '24px', background: '#f9fafb', borderRadius: '12px', border: '2px solid #e2e8f0' }}>
                  <h3 style={{ color: '#1e3a8a', marginBottom: '12px', fontSize: '18px' }}>📍 Location</h3>
                  <p style={{ fontWeight: '600', color: '#334155' }}>San Francisco, CA</p>
                  <p style={{ fontSize: '14px', color: '#64748b', marginTop: '8px' }}>
                    Serving all SF neighborhoods
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
