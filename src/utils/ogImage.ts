/**
 * OG Image URL Generator Utility
 *
 * Helper functions to generate dynamic Open Graph image URLs
 * for different page types across the site.
 */

const BASE_URL = 'https://sfdaycarelist.com';
const OG_IMAGE_ENDPOINT = '/og-image.png';

/**
 * Generate a dynamic OG image URL with custom title and subtitle
 */
export function generateOgImageUrl(title: string, subtitle?: string): string {
  const baseUrl = `${BASE_URL}${OG_IMAGE_ENDPOINT}`;

  // If no subtitle, return default image
  if (!subtitle) {
    return baseUrl;
  }

  // Build query parameters
  const params = new URLSearchParams({
    title: title,
    subtitle: subtitle
  });

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Generate OG image for homepage
 */
export function getHomeOgImage(daycareCount: number): string {
  return generateOgImageUrl(
    'SF Daycare List',
    `Find ${daycareCount}+ Licensed Daycares in San Francisco`
  );
}

/**
 * Generate OG image for neighborhood pages
 */
export function getNeighborhoodOgImage(neighborhoodName: string, count: number): string {
  return generateOgImageUrl(
    `${neighborhoodName} Daycares`,
    `Find ${count}+ licensed daycares in this neighborhood`
  );
}

/**
 * Generate OG image for daycare detail pages
 */
export function getDaycareOgImage(daycareName: string, description?: string): string {
  const subtitle = description
    ? description.substring(0, 80) + (description.length > 80 ? '...' : '')
    : 'Licensed daycare in San Francisco';

  return generateOgImageUrl(daycareName, subtitle);
}

/**
 * Generate OG image for comparison pages
 */
export function getComparisonOgImage(daycare1: string, daycare2: string): string {
  return generateOgImageUrl(
    `${daycare1} vs ${daycare2}`,
    'Compare San Francisco Daycares'
  );
}

/**
 * Generate OG image for guide pages
 */
export function getGuideOgImage(title: string, description?: string): string {
  const subtitle = description || 'San Francisco Daycare Guide';
  return generateOgImageUrl(title, subtitle);
}

/**
 * Get default OG image (for fallback)
 */
export function getDefaultOgImage(): string {
  return `${BASE_URL}${OG_IMAGE_ENDPOINT}`;
}
