import { useState, useEffect } from 'react';
import './ScrollButtons.css';

export default function ScrollButtons() {
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show buttons when user scrolls down more than 300px
      if (window.scrollY > 300) {
        setShowButtons(true);
      } else {
        setShowButtons(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'auto' // Instant scroll for brutalist feel
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'auto' // Instant scroll for brutalist feel
    });
  };

  if (!showButtons) return null;

  return (
    <div className="scroll-buttons">
      <button
        onClick={scrollToTop}
        className="scroll-button scroll-top"
        aria-label="Scroll to top"
        title="Scroll to top"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="18 15 12 9 6 15" />
        </svg>
        <span>TOP</span>
      </button>

      <button
        onClick={scrollToBottom}
        className="scroll-button scroll-bottom"
        aria-label="Scroll to bottom"
        title="Scroll to bottom"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="6 9 12 15 18 9" />
        </svg>
        <span>BOTTOM</span>
      </button>
    </div>
  );
}
