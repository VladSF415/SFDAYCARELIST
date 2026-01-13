// ==============================================================================
// PARENT PULSE TILE - Quote Card from Parent Reviews
// ==============================================================================

import { motion } from 'framer-motion';
import type { Daycare, ParentReview } from '../../types/components';

interface ParentPulseTileProps {
  daycare: Daycare;
}

// Mock parent reviews (in production, these would come from the database)
const mockReviews: Record<string, ParentReview[]> = {
  default: [
    {
      quote: "The teachers truly care about each child's individual development. Our daughter has blossomed here!",
      author: "Mila's Dad",
      role: "Parent",
      rating: 5,
    },
    {
      quote: "Fantastic bilingual program. My son is now fluent in Spanish and English. Highly recommend!",
      author: "Sofia's Mom",
      role: "Parent",
      rating: 5,
    },
    {
      quote: "Clean, safe, and the staff is incredibly responsive. We feel so lucky to have found this place.",
      author: "Emma",
      role: "Parent of 2",
      rating: 5,
    },
    {
      quote: "The curriculum is engaging and the outdoor play area is amazing. My kids love going every day!",
      author: "David",
      role: "Parent",
      rating: 5,
    },
  ],
};

// Helper to get a review for the daycare
function getParentReview(daycare: Daycare): ParentReview {
  // If daycare has actual reviews, use the first one
  if (daycare.reviews && daycare.reviews.length > 0) {
    const review = daycare.reviews[0];
    return {
      quote: review.review_text || review.comment || '',
      author: review.reviewer_name || 'Anonymous Parent',
      role: 'Parent',
      rating: review.rating || daycare.ratings.overall,
    };
  }

  // Otherwise use a mock review
  const reviews = mockReviews.default;
  const randomReview = reviews[Math.floor(Math.random() * reviews.length)];

  return randomReview;
}

// Helper to get friendly neighborhood name
function getFriendlyNeighborhoodName(slug: string): string {
  const neighborhoodMap: Record<string, string> = {
    'mission-district': 'Mission District',
    'castro': 'Castro',
    'noe-valley': 'Noe Valley',
    'marina': 'Marina',
    'presidio': 'Presidio',
    'pacific-heights': 'Pacific Heights',
    'russian-hill': 'Russian Hill',
    'north-beach': 'North Beach',
    'financial-district': 'Financial District',
    'soma': 'SoMa',
    'haight-ashbury': 'Haight-Ashbury',
    'sunset-inner': 'Inner Sunset',
    'richmond': 'Richmond',
    'potrero-hill': 'Potrero Hill',
    'chinatown': 'Chinatown',
  };
  return neighborhoodMap[slug] || slug.replace(/-/g, ' ');
}

export default function ParentPulseTile({ daycare }: ParentPulseTileProps) {
  const review = getParentReview(daycare);
  const neighborhood = getFriendlyNeighborhoodName(daycare.location.neighborhood);

  // Render stars
  const renderStars = (rating: number) => {
    return (
      <div className="parent-pulse-stars">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < rating ? 'star-filled' : 'star-empty'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      className="bento-tile bento-tile-medium parent-pulse-tile"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="parent-pulse-header">
        <div className="quote-mark">"</div>
        <h4 className="bento-tile-title">Parent Pulse</h4>
      </div>

      <blockquote className="parent-pulse-quote">
        {review.quote}
      </blockquote>

      <div className="parent-pulse-footer">
        {renderStars(review.rating)}
        <div className="parent-pulse-author">
          <strong>{review.author}</strong>, {neighborhood}
        </div>
      </div>
    </motion.div>
  );
}
