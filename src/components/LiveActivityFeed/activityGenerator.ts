// ==============================================================================
// ACTIVITY GENERATOR - Mock Real-Time Activity Data
// ==============================================================================

import type { Activity, ActivityTemplate, Daycare } from '../../types/components';

// Activity templates for different event types
const activityTemplates: ActivityTemplate[] = [
  {
    type: 'new_opening',
    icon: '🎉',
    templates: [
      'New opening in {neighborhood}!',
      '{daycare} now accepting {ageGroup} enrollments',
      '{daycare} just posted {spots} new openings',
      'Spots available at {daycare} in {neighborhood}',
    ]
  },
  {
    type: 'tour_activity',
    icon: '👀',
    templates: [
      '3 parents toured {daycare} today',
      '{daycare} has 5 tour requests this week',
      'Parents are viewing {daycare} right now',
      '2 families scheduled tours at {daycare}',
    ]
  },
  {
    type: 'enrollment',
    icon: '⚡',
    templates: [
      '2 spots left at {daycare}!',
      '{daycare} just filled {ageGroup} spots',
      'Only {spots} spots remaining at {daycare}',
      '{daycare} in {neighborhood} filling up fast',
    ]
  },
  {
    type: 'review',
    icon: '⭐',
    templates: [
      'New 5★ review for {daycare}',
      '{parent} left a review for {daycare}',
      '{daycare} received a 5-star rating',
      'Parents love {daycare} in {neighborhood}',
    ]
  }
];

// Helper to get random item from array
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to get random parent name
function getRandomParentName(): string {
  const firstNames = ['Sarah', 'Michael', 'Emma', 'David', 'Sofia', 'James', 'Olivia', 'Daniel', 'Ava', 'Ethan'];
  const neighborhoods = ['Mission', 'Castro', 'Noe Valley', 'Marina', 'Presidio', 'Richmond'];
  return `${randomChoice(firstNames)}, ${randomChoice(neighborhoods)}`;
}

// Helper to get friendly neighborhood name
function getFriendlyNeighborhoodName(slug: string): string {
  const neighborhoodMap: Record<string, string> = {
    'mission-district': 'the Mission',
    'castro': 'the Castro',
    'noe-valley': 'Noe Valley',
    'marina': 'the Marina',
    'presidio': 'the Presidio',
    'pacific-heights': 'Pacific Heights',
    'russian-hill': 'Russian Hill',
    'north-beach': 'North Beach',
    'financial-district': 'FiDi',
    'soma': 'SoMa',
    'haight-ashbury': 'the Haight',
    'sunset-inner': 'the Sunset',
    'richmond': 'the Richmond',
    'potrero-hill': 'Potrero Hill',
    'chinatown': 'Chinatown',
  };
  return neighborhoodMap[slug] || slug.replace(/-/g, ' ');
}

// Helper to get age group label
function getAgeGroupLabel(ageGroup: string): string {
  const labels: Record<string, string> = {
    'infant': 'infant',
    'toddler': 'toddler',
    'preschool': 'preschool',
  };
  return labels[ageGroup] || 'all ages';
}

// Generate a unique ID for activities
function generateId(): string {
  return `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a random activity based on daycare data
 */
export function generateRandomActivity(daycares: Daycare[]): Activity {
  // Filter to only daycares with available data
  const validDaycares = daycares.filter(d => d.location && d.availability);

  if (validDaycares.length === 0) {
    // Fallback activity if no valid daycares
    return {
      id: generateId(),
      type: 'tour_activity',
      message: 'Parents are exploring SF daycares right now',
      icon: '👀',
      timestamp: new Date(),
    };
  }

  // Choose random daycare and template
  const daycare = randomChoice(validDaycares);
  const templateGroup = randomChoice(activityTemplates);
  const template = randomChoice(templateGroup.templates);

  // Replace placeholders in template
  let message = template
    .replace('{daycare}', daycare.name)
    .replace('{neighborhood}', getFriendlyNeighborhoodName(daycare.location.neighborhood));

  // Add specific replacements based on activity type
  if (templateGroup.type === 'enrollment' || templateGroup.type === 'new_opening') {
    const totalSpots = daycare.availability.infant_spots +
                      daycare.availability.toddler_spots +
                      daycare.availability.preschool_spots;
    message = message
      .replace('{spots}', totalSpots.toString())
      .replace('{ageGroup}', getAgeGroupLabel(randomChoice(daycare.program.age_groups)));
  }

  if (templateGroup.type === 'review') {
    message = message.replace('{parent}', getRandomParentName());
  }

  return {
    id: generateId(),
    type: templateGroup.type,
    message,
    icon: templateGroup.icon,
    timestamp: new Date(),
    daycareSlug: daycare.slug,
    daycareName: daycare.name,
    neighborhood: daycare.location.neighborhood,
  };
}

/**
 * Get random interval for next activity (15-30 seconds)
 */
export function getRandomInterval(): number {
  const min = 15000; // 15 seconds
  const max = 30000; // 30 seconds
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
