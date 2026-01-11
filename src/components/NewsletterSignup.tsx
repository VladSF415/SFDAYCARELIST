import { useState } from 'react';

interface NewsletterSignupProps {
  variant?: 'inline' | 'popup' | 'sidebar';
  title?: string;
  description?: string;
}

export function NewsletterSignup({
  variant = 'inline',
  title = 'Stay Updated on AI Tools',
  description = 'Get weekly updates on new AI platforms, tool comparisons, and exclusive insights. Join 10,000+ AI enthusiasts.'
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    try {
      // For now, just log to console - you'll integrate with Mailchimp/ConvertKit/Buttondown later
      console.log('Newsletter signup:', email);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatus('success');
      setMessage('🎉 Success! Check your email to confirm subscription.');
      setEmail('');

      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  const containerStyles: React.CSSProperties = {
    padding: variant === 'inline' ? '40px' : '30px',
    background: variant === 'popup' ? '#FFFF00' : '#000',
    border: '4px solid #000',
    marginTop: variant === 'inline' ? '60px' : '0',
    color: variant === 'popup' ? '#000' : '#fff',
  };

  return (
    <div style={containerStyles}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h3 style={{
          fontSize: variant === 'popup' ? '28px' : '32px',
          fontWeight: '900',
          marginBottom: '15px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: variant === 'popup' ? '#000' : '#fff'
        }}>
          {title}
        </h3>

        <p style={{
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '25px',
          opacity: variant === 'popup' ? 1 : 0.9,
          color: variant === 'popup' ? '#000' : '#fff'
        }}>
          {description}
        </p>

        {status === 'success' ? (
          <div style={{
            padding: '20px',
            background: '#4CAF50',
            color: '#fff',
            border: '3px solid #000',
            fontSize: '16px',
            fontWeight: '700',
            textAlign: 'center'
          }}>
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={status === 'loading'}
              style={{
                flex: '1',
                minWidth: '250px',
                padding: '15px 20px',
                fontSize: '16px',
                border: '3px solid #000',
                background: '#fff',
                color: '#000',
                fontFamily: '"Courier New", monospace',
                fontWeight: '700'
              }}
            />

            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                padding: '15px 40px',
                background: variant === 'popup' ? '#000' : '#FFFF00',
                color: variant === 'popup' ? '#fff' : '#000',
                border: '3px solid #000',
                fontSize: '16px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                fontFamily: '"Courier New", monospace',
                opacity: status === 'loading' ? 0.6 : 1,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (status !== 'loading') {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '4px 4px 0 #000';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {status === 'loading' ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
            </button>
          </form>
        )}

        {status === 'error' && message && (
          <div style={{
            marginTop: '15px',
            padding: '12px',
            background: '#ff4444',
            color: '#fff',
            border: '2px solid #000',
            fontSize: '14px',
            fontWeight: '700'
          }}>
            {message}
          </div>
        )}

        <p style={{
          fontSize: '12px',
          marginTop: '15px',
          opacity: 0.7,
          color: variant === 'popup' ? '#000' : '#fff'
        }}>
          No spam. Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </div>
  );
}

// Exit Intent Popup Hook (for future use)
export function useExitIntent(callback: () => void) {
  useState(() => {
    let hasShown = false;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        hasShown = true;
        callback();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  });
}
