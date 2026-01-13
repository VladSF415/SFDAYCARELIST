// ==============================================================================
// DISTRICT LOOKBOOK - Neighborhood Tips and Local Information
// ==============================================================================

import type { Neighborhood, NeighborhoodTip } from '../../types/components';
import { neighborhoodThemes, defaultTheme } from './neighborhoodThemes';
import './DistrictLookbook.css';

interface DistrictLookbookProps {
  neighborhood: Neighborhood;
}

export default function DistrictLookbook({ neighborhood }: DistrictLookbookProps) {
  const theme = neighborhoodThemes[neighborhood.slug] || defaultTheme;

  // Generate tips from neighborhood data
  const tips: NeighborhoodTip[] = [];

  // Parks tip
  if (neighborhood.parks && neighborhood.parks.length > 0) {
    tips.push({
      category: 'parks',
      icon: '🌳',
      title: 'Best Parks & Playgrounds',
      items: neighborhood.parks.slice(0, 3),
    });
  }

  // Transit tip
  if (neighborhood.bart_stations && neighborhood.bart_stations.length > 0) {
    tips.push({
      category: 'transit',
      icon: '🚇',
      title: 'Public Transit Access',
      items: neighborhood.bart_stations,
    });
  }

  // Local favorites (if available)
  if (neighborhood.local_favorites && neighborhood.local_favorites.length > 0) {
    tips.push({
      category: 'cafes',
      icon: '☕',
      title: 'Family-Friendly Spots',
      items: neighborhood.local_favorites.slice(0, 3),
    });
  }

  // Community tips (if available)
  if (neighborhood.community_tips && neighborhood.community_tips.length > 0) {
    tips.push({
      category: 'community',
      icon: '💡',
      title: 'Local Parent Tips',
      items: neighborhood.community_tips.slice(0, 3),
    });
  }

  // Fallback tips if none available
  if (tips.length === 0) {
    tips.push({
      category: 'community',
      icon: '📍',
      title: 'Neighborhood Highlights',
      items: [
        `Explore ${neighborhood.name} with your family`,
        'Discover local daycare options',
        'Connect with other parents in the area',
      ],
    });
  }

  // Best for tags
  const bestForTags = neighborhood.best_for || [
    'Family-friendly',
    'Great schools',
    'Safe neighborhood',
  ];

  return (
    <div className="district-lookbook">
      <div className="lookbook-header">
        <div className="lookbook-icon" style={{ color: theme.primary }}>
          {theme.icon}
        </div>
        <h2 className="lookbook-title">
          Explore {neighborhood.name}
        </h2>
        <p className="lookbook-subtitle">
          Local insights for parents considering daycare in this neighborhood
        </p>
      </div>

      {/* Best For Tags */}
      <div className="lookbook-tags">
        <span className="lookbook-tags-label">Best for:</span>
        {bestForTags.map((tag, index) => (
          <span
            key={index}
            className="lookbook-tag"
            style={{
              borderColor: theme.primary,
              color: theme.primary,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Tips Grid */}
      <div className="lookbook-tips-grid">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="lookbook-tip-card"
            style={{
              borderTopColor: theme.primary,
            }}
          >
            <div className="lookbook-tip-header">
              <span className="lookbook-tip-icon">{tip.icon}</span>
              <h3 className="lookbook-tip-title">{tip.title}</h3>
            </div>
            <ul className="lookbook-tip-list">
              {tip.items.map((item, itemIndex) => (
                <li key={itemIndex} className="lookbook-tip-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div
        className="lookbook-cta"
        style={{
          background: theme.gradient,
        }}
      >
        <div className="lookbook-cta-content">
          <h3 className="lookbook-cta-title">
            Ready to explore daycares in {neighborhood.name}?
          </h3>
          <p className="lookbook-cta-text">
            Browse {neighborhood.daycare_count} daycare{neighborhood.daycare_count > 1 ? 's' : ''} in this neighborhood
          </p>
        </div>
        <button
          className="lookbook-cta-btn"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          View All Daycares
        </button>
      </div>
    </div>
  );
}
