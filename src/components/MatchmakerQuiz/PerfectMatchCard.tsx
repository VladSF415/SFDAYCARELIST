// ==============================================================================
// PERFECT MATCH CARD - Display Top Matched Daycares
// ==============================================================================

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { DaycareMatch } from '../../types/components';

interface PerfectMatchCardProps {
  matches: DaycareMatch[];
  onClose: () => void;
}

export default function PerfectMatchCard({ matches, onClose }: PerfectMatchCardProps) {
  const navigate = useNavigate();

  const handleViewDetails = (slug: string) => {
    navigate(`/daycare/${slug}`);
    onClose();
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Quiz results link copied to clipboard!');
  };

  // Helper to get friendly neighborhood name
  const getFriendlyNeighborhoodName = (slug: string): string => {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <motion.div
      className="perfect-match-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="perfect-match-header">
        <div className="perfect-match-icon">🎯</div>
        <h2 className="perfect-match-title">Your Perfect Matches!</h2>
        <p className="perfect-match-subtitle">
          We found {matches.length} great daycare{matches.length > 1 ? 's' : ''} that match your needs
        </p>
      </div>

      <div className="perfect-match-results">
        {matches.map((match, index) => (
          <motion.div
            key={match.daycare.id}
            className="match-result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            {/* Match Badge */}
            <div className="match-badge">
              <span className="match-rank">#{index + 1}</span>
              <div className="match-score-wrapper">
                <div className="match-score-bar">
                  <motion.div
                    className="match-score-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${match.score}%` }}
                    transition={{ delay: index * 0.15 + 0.2, duration: 0.8 }}
                  />
                </div>
                <span className="match-score-label">{match.score}% Match</span>
              </div>
            </div>

            {/* Daycare Info */}
            <div className="match-info">
              <h3 className="match-name">{match.daycare.name}</h3>
              <p className="match-neighborhood">
                {getFriendlyNeighborhoodName(match.daycare.location.neighborhood)}
              </p>

              <div className="match-rating">
                <span className="match-stars">
                  {'⭐'.repeat(Math.round(match.daycare.ratings.overall))}
                </span>
                <span className="match-rating-text">
                  {match.daycare.ratings.overall} ({match.daycare.ratings.review_count} reviews)
                </span>
              </div>

              {/* Why This Matches */}
              <div className="match-reasons">
                <h4 className="match-reasons-title">Why this matches:</h4>
                <ul className="match-reasons-list">
                  {match.reasons.slice(0, 4).map((reason, i) => (
                    <li key={i} className="match-reason">{reason}</li>
                  ))}
                </ul>
              </div>

              {/* Availability */}
              {match.daycare.availability.accepting_enrollment && (
                <div className="match-availability">
                  <span className="availability-icon">✅</span>
                  Currently accepting enrollment
                </div>
              )}

              {/* Action Button */}
              <button
                className="match-btn"
                onClick={() => handleViewDetails(match.daycare.slug)}
              >
                View Full Details →
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="perfect-match-footer">
        <button className="quiz-btn quiz-btn-secondary" onClick={handleCopyLink}>
          📋 Share Results
        </button>
        <button className="quiz-btn quiz-btn-primary" onClick={onClose}>
          Browse All Daycares
        </button>
      </div>
    </motion.div>
  );
}
