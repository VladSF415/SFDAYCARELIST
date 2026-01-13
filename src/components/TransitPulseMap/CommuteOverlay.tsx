// ==============================================================================
// COMMUTE OVERLAY - Work Address Input for Commute-Friendly Search
// ==============================================================================

import { useState } from 'react';
import type { CommuteOverlayProps } from './types';

// Common SF cross-streets and landmarks for autocomplete
const SF_LOCATIONS = [
  'Market & Castro',
  'Valencia & 24th',
  'Mission & 16th',
  'Market & Powell',
  'Montgomery & California',
  'Embarcadero Center',
  'Ferry Building',
  'Union Square',
  'Civic Center',
  'Hayes Valley',
  'Noe Valley Town Square',
  'Castro & 18th',
  'Divisadero & Haight',
  'Fillmore & Sacramento',
];

export default function CommuteOverlay({
  workAddress,
  onWorkAddressChange,
  onActivate,
  onDeactivate,
  isActive,
}: CommuteOverlayProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const handleInputChange = (value: string) => {
    onWorkAddressChange(value);

    // Filter suggestions
    if (value.length > 0) {
      const filtered = SF_LOCATIONS.filter(location =>
        location.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onWorkAddressChange(suggestion);
    setShowSuggestions(false);
    onActivate();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (workAddress.trim()) {
      onActivate();
      setShowSuggestions(false);
    }
  };

  return (
    <div className={`commute-overlay ${isActive ? 'active' : ''}`}>
      <div className="commute-overlay-header">
        <h3 className="commute-overlay-title">Find Commute-Friendly Daycares</h3>
        {isActive && (
          <button
            className="commute-overlay-close"
            onClick={onDeactivate}
            aria-label="Close commute overlay"
          >
            ×
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="commute-overlay-form">
        <div className="commute-overlay-input-wrapper">
          <input
            type="text"
            className="commute-overlay-input"
            placeholder="Enter work address or cross-street..."
            value={workAddress}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              if (workAddress && filteredSuggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            aria-label="Work address"
          />

          {/* Autocomplete Suggestions */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="commute-overlay-suggestions">
              {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className="commute-overlay-suggestion"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="suggestion-icon">📍</span>
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="commute-overlay-btn"
          disabled={!workAddress.trim()}
        >
          {isActive ? 'Update Search' : 'Find Daycares'}
        </button>
      </form>

      {isActive && (
        <div className="commute-overlay-info">
          <p>
            <span className="info-icon">✓</span>
            Showing daycares within a 5-minute walk of your commute route
          </p>
        </div>
      )}
    </div>
  );
}
