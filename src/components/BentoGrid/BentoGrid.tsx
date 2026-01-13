// ==============================================================================
// BENTO GRID - Story-First Grid Layout for Daycare Discovery
// ==============================================================================

import { motion, useReducedMotion } from 'framer-motion';
import type { Daycare } from '../../types/components';
import VibeTile from './VibeTile';
import ParentPulseTile from './ParentPulseTile';
import SafetySnapshotTile from './SafetySnapshotTile';
import './BentoGrid.css';

interface BentoGridProps {
  daycares: Daycare[];
}

export default function BentoGrid({ daycares }: BentoGridProps) {
  const shouldReduceMotion = useReducedMotion();

  // Container animation variants
  const containerVariants = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      };

  // Tile animation variants
  const tileVariants = shouldReduceMotion
    ? undefined
    : {
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: { duration: 0.4 },
        },
      };

  // Fallback message if no daycares
  if (daycares.length === 0) {
    return (
      <div className="bento-grid-empty">
        <p>No daycares match your filters. Try adjusting your search criteria.</p>
      </div>
    );
  }

  // Render tiles for each daycare
  // Pattern: Vibe (large) -> Parent Pulse (medium) -> Safety (small) -> repeat
  const renderTiles = () => {
    const tiles: React.ReactNode[] = [];

    daycares.forEach((daycare, index) => {
      const pattern = index % 3;

      if (pattern === 0) {
        // Vibe Tile (Large - 2x2)
        tiles.push(
          <motion.div key={`vibe-${daycare.id}`} variants={tileVariants}>
            <VibeTile daycare={daycare} />
          </motion.div>
        );
      } else if (pattern === 1) {
        // Parent Pulse Tile (Medium - 1x2)
        tiles.push(
          <motion.div key={`pulse-${daycare.id}`} variants={tileVariants}>
            <ParentPulseTile daycare={daycare} />
          </motion.div>
        );
      } else {
        // Safety Snapshot Tile (Small - 1x1)
        tiles.push(
          <motion.div key={`safety-${daycare.id}`} variants={tileVariants}>
            <SafetySnapshotTile daycare={daycare} />
          </motion.div>
        );
      }
    });

    return tiles;
  };

  return (
    <div className="bento-grid-wrapper">
      <motion.div
        className="bento-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {renderTiles()}
      </motion.div>

      {/* Show hint if user has many results */}
      {daycares.length > 12 && (
        <div className="bento-grid-hint">
          <p>
            Showing {daycares.length} daycares. Use filters to refine your search.
          </p>
        </div>
      )}
    </div>
  );
}
