// ==============================================================================
// QUIZ LOGIC - Matching Algorithm for Daycare Recommendations
// ==============================================================================

import type { Daycare, QuizAnswer, DaycareMatch } from '../../types/components';

/**
 * Calculate match score between a daycare and quiz answers
 */
export function calculateMatchScore(daycare: Daycare, answers: QuizAnswer): number {
  let score = 0;
  const reasons: string[] = [];

  // Location matching (40 points max)
  if (answers.crossStreet) {
    const distance = mockDistanceCalculation(daycare, answers.crossStreet);
    if (distance < 1) {
      score += 40;
      reasons.push('Very close to your location');
    } else if (distance < 2) {
      score += 25;
      reasons.push('Within walking distance');
    } else if (distance < 5) {
      score += 10;
      reasons.push('Near your area');
    }
  }

  // Age group matching (30 points max)
  if (answers.childAge && daycare.program.age_groups.includes(answers.childAge)) {
    score += 30;
    reasons.push(`Accepts ${answers.childAge}s`);
  }

  // Must-have features matching (30 points max)
  if (answers.mustHave && answers.mustHave.length > 0) {
    let featureScore = 0;
    const matchedFeatures: string[] = [];

    answers.mustHave.forEach(feature => {
      if (feature === 'transit') {
        if (daycare.location.public_transit && daycare.location.public_transit.length > 0) {
          featureScore += 15;
          matchedFeatures.push('Near public transit');
        }
      } else if (feature === 'bilingual') {
        if (daycare.program.languages.length > 1) {
          featureScore += 15;
          matchedFeatures.push(`Bilingual (${daycare.program.languages.join(', ')})`);
        }
      } else if (feature === 'outdoor') {
        if (daycare.features.some(f => f.toLowerCase().includes('outdoor'))) {
          featureScore += 15;
          matchedFeatures.push('Outdoor play area');
        }
      } else if (feature === 'organic') {
        if (daycare.features.some(f => f.toLowerCase().includes('organic'))) {
          featureScore += 15;
          matchedFeatures.push('Organic meals');
        }
      }
    });

    score += featureScore;
    reasons.push(...matchedFeatures);
  }

  // Bonus points for high ratings (10 points max)
  if (daycare.ratings.overall >= 4.5) {
    score += 10;
    reasons.push(`Highly rated (${daycare.ratings.overall}★)`);
  } else if (daycare.ratings.overall >= 4.0) {
    score += 5;
  }

  // Bonus for availability (5 points)
  if (daycare.availability.accepting_enrollment) {
    const totalSpots =
      daycare.availability.infant_spots +
      daycare.availability.toddler_spots +
      daycare.availability.preschool_spots;
    if (totalSpots > 0) {
      score += 5;
      reasons.push('Currently accepting enrollment');
    }
  }

  // Bonus for verified status (5 points)
  if (daycare.verified) {
    score += 5;
    reasons.push('Verified listing');
  }

  return Math.min(score, 100); // Cap at 100
}

/**
 * Mock distance calculation based on cross-street
 * In production, use a real geocoding API
 */
function mockDistanceCalculation(daycare: Daycare, crossStreet: string): number {
  // Very basic mock - check if daycare neighborhood matches cross-street area
  const daycareNeighborhood = daycare.location.neighborhood.toLowerCase();
  const crossStreetLower = crossStreet.toLowerCase();

  // Exact neighborhood match
  if (crossStreetLower.includes(daycareNeighborhood.replace(/-/g, ' '))) {
    return 0.5; // Very close
  }

  // Major landmarks/areas matching
  const landmarks: Record<string, string[]> = {
    'mission': ['mission', 'valencia', '16th', '24th', 'dolores'],
    'castro': ['castro', 'market', '18th'],
    'noe-valley': ['noe', '24th', 'church'],
    'marina': ['marina', 'chestnut', 'lombard'],
    'financial-district': ['financial', 'montgomery', 'market', 'embarcadero'],
    'soma': ['soma', '2nd', '3rd', 'folsom', 'harrison'],
  };

  for (const [neighborhood, keywords] of Object.entries(landmarks)) {
    if (daycareNeighborhood.includes(neighborhood)) {
      for (const keyword of keywords) {
        if (crossStreetLower.includes(keyword)) {
          return 1.5; // Walking distance
        }
      }
    }
  }

  // Default: random distance between 2-8km
  return 2 + Math.random() * 6;
}

/**
 * Get top matches from daycares based on quiz answers
 */
export function getTopMatches(daycares: Daycare[], answers: QuizAnswer, topN: number = 3): DaycareMatch[] {
  const matches: DaycareMatch[] = daycares.map(daycare => {
    const score = calculateMatchScore(daycare, answers);
    const reasons = getMatchReasons(daycare, answers);

    return {
      daycare,
      score,
      reasons,
    };
  });

  // Sort by score descending
  matches.sort((a, b) => b.score - a.score);

  // Return top N matches
  return matches.slice(0, topN);
}

/**
 * Get human-readable reasons why a daycare matches
 */
function getMatchReasons(daycare: Daycare, answers: QuizAnswer): string[] {
  const reasons: string[] = [];

  // Location
  if (answers.crossStreet) {
    const distance = mockDistanceCalculation(daycare, answers.crossStreet);
    if (distance < 1) {
      reasons.push('🎯 Very close to your location');
    } else if (distance < 2) {
      reasons.push('🚶 Within walking distance');
    }
  }

  // Age group
  if (answers.childAge && daycare.program.age_groups.includes(answers.childAge)) {
    const ageLabel = answers.childAge.charAt(0).toUpperCase() + answers.childAge.slice(1);
    reasons.push(`👶 Accepts ${ageLabel}s`);
  }

  // Features
  if (answers.mustHave) {
    answers.mustHave.forEach(feature => {
      if (feature === 'transit' && daycare.location.public_transit?.length) {
        reasons.push(`🚇 Near transit: ${daycare.location.public_transit[0]}`);
      } else if (feature === 'bilingual' && daycare.program.languages.length > 1) {
        reasons.push(`🌎 ${daycare.program.languages.join(' & ')} program`);
      } else if (feature === 'outdoor' && daycare.features.some(f => f.toLowerCase().includes('outdoor'))) {
        reasons.push('🌳 Outdoor play area');
      } else if (feature === 'organic' && daycare.features.some(f => f.toLowerCase().includes('organic'))) {
        reasons.push('🥗 Organic meals included');
      }
    });
  }

  // High rating
  if (daycare.ratings.overall >= 4.5) {
    reasons.push(`⭐ Highly rated (${daycare.ratings.overall}/5.0)`);
  }

  // Availability
  const totalSpots =
    daycare.availability.infant_spots +
    daycare.availability.toddler_spots +
    daycare.availability.preschool_spots;
  if (totalSpots > 0) {
    reasons.push(`✅ ${totalSpots} spot${totalSpots > 1 ? 's' : ''} available`);
  }

  return reasons;
}
