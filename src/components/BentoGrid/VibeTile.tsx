// ==============================================================================
// VIBE TILE - Video/GIF Placeholder with Call-to-Action
// ==============================================================================

import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Daycare } from '../../types/components';

interface VibeTileProps {
  daycare: Daycare;
}

// Helper to get friendly neighborhood name
function getFriendlyNeighborhoodName(slug: string): string {
  const neighborhoodMap: Record<string, string> = {
    'mission-district': 'Mission',
    'castro': 'Castro',
    'noe-valley': 'Noe Valley',
    'marina': 'Marina',
    'presidio': 'Presidio',
    'pacific-heights': 'Pacific Heights',
    'russian-hill': 'Russian Hill',
    'north-beach': 'North Beach',
    'financial-district': 'FiDi',
    'soma': 'SoMa',
    'haight-ashbury': 'Haight',
    'sunset-inner': 'Sunset',
    'richmond': 'Richmond',
    'potrero-hill': 'Potrero Hill',
    'chinatown': 'Chinatown',
  };
  return neighborhoodMap[slug] || slug.replace(/-/g, ' ');
}

// Helper to get poster image (placeholder gradient based on daycare name)
function getPosterGradient(daycareName: string): string {
  // Generate a consistent gradient based on daycare name
  const colors = [
    ['#FF6B35', '#FBBF24'], // Orange to Yellow
    ['#60A5FA', '#93C5FD'], // Blue
    ['#A7C957', '#52C41A'], // Green
    ['#B8A9E5', '#FF8B7B'], // Purple to Peach
    ['#FF8C42', '#FFD166'], // Sunset
  ];

  const index = daycareName.length % colors.length;
  const [color1, color2] = colors[index];
  return `linear-gradient(135deg, ${color1}, ${color2})`;
}

export default function VibeTile({ daycare }: VibeTileProps) {
  const [isHovered, setIsHovered] = useState(false);
  const neighborhood = getFriendlyNeighborhoodName(daycare.location.neighborhood);
  const posterGradient = getPosterGradient(daycare.name);

  // In production, check if daycare has actual video
  const hasVideo = daycare.photos && daycare.photos.length > 0;

  return (
    <motion.div
      className="bento-tile bento-tile-large vibe-tile"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Video/Poster Background */}
      <div
        className="vibe-tile-background"
        style={{
          background: posterGradient,
        }}
      >
        {/* Placeholder for actual video/GIF */}
        {hasVideo ? (
          <div className="vibe-tile-media-placeholder">
            {/* In production, replace with actual <video> or <img> */}
            <div className="vibe-tile-play-icon">▶</div>
          </div>
        ) : (
          <div className="vibe-tile-no-media">
            <div className="vibe-tile-icon">🏫</div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="vibe-tile-overlay"></div>
      </div>

      {/* Content */}
      <div className="vibe-tile-content">
        <div className="vibe-tile-labels">
          <span className="vibe-tile-label vibe-tile-label-primary">
            Featured Tour
          </span>
          {daycare.verified && (
            <span className="vibe-tile-label vibe-tile-label-verified">
              ✓ Verified
            </span>
          )}
        </div>

        <h3 className="vibe-tile-name">{daycare.name}</h3>
        <p className="vibe-tile-neighborhood">{neighborhood}</p>

        {/* Call to Action */}
        <motion.button
          className="vibe-tile-cta"
          animate={{
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <span className="vibe-tile-cta-icon">▶</span>
          Watch Classroom Tour
        </motion.button>
      </div>

      {/* Age Groups Badge */}
      <div className="vibe-tile-badges">
        {daycare.program.age_groups.map((ageGroup, index) => (
          <span key={index} className="vibe-tile-badge">
            {ageGroup === 'infant' && '👶'}
            {ageGroup === 'toddler' && '🧒'}
            {ageGroup === 'preschool' && '👧'}
            {' '}
            {ageGroup.charAt(0).toUpperCase() + ageGroup.slice(1)}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
