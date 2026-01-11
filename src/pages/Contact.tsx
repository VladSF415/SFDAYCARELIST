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
    border: '4px solid #000000',
    background: '#ffffff',
    fontFamily: "'Courier New', monospace",
    fontSize: '14px',
    fontWeight: 700,
    outline: 'none',
    marginBottom: '16px'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontFamily: "'Courier New', monospace",
    fontSize: '12px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '1px'
  };

  return (
    <>
      <SocialMetaTags
        title="Contact Us - AI Platforms List"
        description="Get in touch with AI Platforms List. Ask questions, report issues, or suggest new AI tools for our directory."
        url="https://aiplatformslist.com/contact"
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
              <p>
                Have a question about an AI platform? Want to suggest a new tool for our directory?
                Found an issue or have feedback? Send us a message and we'll get back to you.
              </p>
            </section>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              marginTop: '2rem'
            }}>
              {/* Contact Form */}
              <div style={{
                padding: '2rem',
                border: '4px solid #000000',
                background: '#f5f5f5'
              }}>
                <h3 style={{
                  marginTop: 0,
                  fontFamily: "'Courier New', monospace",
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  marginBottom: '1.5rem'
                }}>
                  Send a Message
                </h3>

                {status === 'success' ? (
                  <div style={{
                    padding: '2rem',
                    background: '#000000',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontFamily: "'Courier New', monospace"
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✓</div>
                    <div style={{ fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Message Sent!
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.8 }}>
                      We'll get back to you soon via Telegram or email.
                    </div>
                    <button
                      onClick={() => setStatus('idle')}
                      style={{
                        marginTop: '1.5rem',
                        padding: '12px 24px',
                        background: '#ffffff',
                        color: '#000000',
                        border: 'none',
                        fontFamily: "'Courier New', monospace",
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        cursor: 'pointer'
                      }}
                    >
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div>
                      <label style={labelStyle}>Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={inputStyle}
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={inputStyle}
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Subject *</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        style={{ ...inputStyle, cursor: 'pointer' }}
                      >
                        <option value="general">General Question</option>
                        <option value="platform">Question About a Platform</option>
                        <option value="submit">Submit New Platform</option>
                        <option value="report">Report an Issue</option>
                        <option value="partnership">Partnership / Business</option>
                        <option value="feedback">Feedback / Suggestion</option>
                      </select>
                    </div>

                    <div>
                      <label style={labelStyle}>Message *</label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        style={{ ...inputStyle, minHeight: '150px', resize: 'vertical' }}
                        placeholder="Type your message here..."
                      />
                    </div>

                    {status === 'error' && (
                      <div style={{
                        padding: '12px',
                        background: '#ff0000',
                        color: '#ffffff',
                        fontFamily: "'Courier New', monospace",
                        fontWeight: 700,
                        marginBottom: '16px',
                        textTransform: 'uppercase',
                        fontSize: '12px'
                      }}>
                        {errorMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      style={{
                        width: '100%',
                        padding: '16px',
                        background: status === 'sending' ? '#666666' : '#000000',
                        color: '#ffffff',
                        border: '4px solid #000000',
                        fontFamily: "'Courier New', monospace",
                        fontSize: '14px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        cursor: status === 'sending' ? 'wait' : 'pointer'
                      }}
                    >
                      {status === 'sending' ? 'Sending...' : 'Send Message →'}
                    </button>
                  </form>
                )}
              </div>

              {/* Quick Contact Options */}
              <div>
                <div style={{
                  padding: '2rem',
                  border: '4px solid #000000',
                  background: '#000000',
                  color: '#ffffff',
                  marginBottom: '1.5rem'
                }}>
                  <h3 style={{
                    marginTop: 0,
                    fontFamily: "'Courier New', monospace",
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    marginBottom: '1rem'
                  }}>
                    Telegram Support
                  </h3>
                  <p style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '14px',
                    lineHeight: 1.6,
                    marginBottom: '1.5rem'
                  }}>
                    Get instant answers through our Telegram bot. Search platforms,
                    get recommendations, and ask questions directly.
                  </p>
                  <a
                    href="https://t.me/AIPlatformsListBot"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      padding: '12px 24px',
                      background: '#ffffff',
                      color: '#000000',
                      textDecoration: 'none',
                      fontFamily: "'Courier New', monospace",
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      fontSize: '13px'
                    }}
                  >
                    Open Telegram Bot →
                  </a>
                </div>

                <div style={{
                  padding: '2rem',
                  border: '4px solid #000000',
                  background: '#f5f5f5'
                }}>
                  <h3 style={{
                    marginTop: 0,
                    fontFamily: "'Courier New', monospace",
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    marginBottom: '1rem'
                  }}>
                    Email
                  </h3>
                  <a
                    href="mailto:info@aiplatformslist.com"
                    style={{
                      display: 'block',
                      color: '#000000',
                      textDecoration: 'none',
                      fontFamily: "'Courier New', monospace",
                      fontWeight: 700,
                      fontSize: '14px',
                      padding: '12px 16px',
                      background: '#ffffff',
                      border: '3px solid #000000',
                      marginBottom: '1rem'
                    }}
                  >
                    info@aiplatformslist.com
                  </a>
                  <p style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: '12px',
                    color: '#666',
                    margin: 0
                  }}>
                    We typically respond within 24-48 hours.
                  </p>
                </div>

                <div style={{
                  padding: '1.5rem',
                  border: '4px solid #000000',
                  background: '#FFFF00',
                  marginTop: '1.5rem'
                }}>
                  <h4 style={{
                    margin: 0,
                    fontFamily: "'Courier New', monospace",
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '0.5rem',
                    fontSize: '14px'
                  }}>
                    Want to Submit a Platform?
                  </h4>
                  <Link
                    to="/submit"
                    style={{
                      color: '#000000',
                      fontFamily: "'Courier New', monospace",
                      fontWeight: 700,
                      fontSize: '13px'
                    }}
                  >
                    Use our submission form →
                  </Link>
                </div>
              </div>
            </div>

            <section style={{ marginTop: '3rem' }}>
              <h2>Frequently Asked Questions</h2>

              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ fontFamily: "'Courier New', monospace", marginBottom: '0.5rem' }}>
                  How do I submit my AI platform?
                </h4>
                <p>
                  Use our <Link to="/submit" style={{ color: '#000', fontWeight: 700 }}>submission form</Link> to add your platform to our directory.
                  All submissions are reviewed before being published.
                </p>

                <h4 style={{ fontFamily: "'Courier New', monospace", marginBottom: '0.5rem', marginTop: '1.5rem' }}>
                  How long does it take to get a response?
                </h4>
                <p>
                  We aim to respond to all inquiries within 24-48 hours. For urgent matters,
                  contact us through Telegram for faster responses.
                </p>

                <h4 style={{ fontFamily: "'Courier New', monospace", marginBottom: '0.5rem', marginTop: '1.5rem' }}>
                  Can I request a platform to be added?
                </h4>
                <p>
                  Yes! Use the contact form above with the subject "Submit New Platform"
                  and provide the platform name and website URL.
                </p>

                <h4 style={{ fontFamily: "'Courier New', monospace", marginBottom: '0.5rem', marginTop: '1.5rem' }}>
                  How do I report incorrect information?
                </h4>
                <p>
                  Select "Report an Issue" in the contact form and describe the problem.
                  Include the platform name and what needs to be corrected.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
