/**
 * OG Image URL Generator Utility
 *
 * Helper functions to generate dynamic Open Graph image URLs
 * for different page types across the site.
 */

const BASE_URL = 'https://aiplatformslist.com';
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
export function getHomeOgImage(platformCount: number): string {
  return generateOgImageUrl(
    'AI Platforms List',
    `Discover ${platformCount}+ AI Tools & Software`
  );
}

/**
 * Generate OG image for category pages
 */
export function getCategoryOgImage(categoryName: string, count: number): string {
  return generateOgImageUrl(
    `Best ${categoryName} AI Tools`,
    `Explore ${count}+ platforms in this category`
  );
}

/**
 * Generate OG image for platform detail pages
 */
export function getPlatformOgImage(platformName: string, description?: string): string {
  const subtitle = description
    ? description.substring(0, 80) + (description.length > 80 ? '...' : '')
    : 'Discover this AI platform';

  return generateOgImageUrl(platformName, subtitle);
}

/**
 * Generate OG image for comparison pages
 */
export function getComparisonOgImage(platform1: string, platform2: string): string {
  return generateOgImageUrl(
    `${platform1} vs ${platform2}`,
    'Complete Side-by-Side Comparison'
  );
}

/**
 * Generate OG image for alternatives pages
 */
export function getAlternativesOgImage(platformName: string, count?: number): string {
  const subtitle = count
    ? `${count}+ Alternative AI Tools & Software`
    : 'Discover Alternative AI Tools';

  return generateOgImageUrl(
    `${platformName} Alternatives`,
    subtitle
  );
}

/**
 * Generate OG image for best-of pages
 */
export function getBestOfOgImage(title: string, category?: string): string {
  const subtitle = category
    ? `Best ${category} AI Tools - Expert Curated`
    : 'Top AI Platforms - Expert Curated';

  return generateOgImageUrl(title, subtitle);
}

/**
 * Generate OG image for pillar/guide pages
 */
export function getGuideOgImage(title: string, description?: string): string {
  const subtitle = description || 'Complete Guide & Best Practices';
  return generateOgImageUrl(title, subtitle);
}

/**
 * Get default OG image (for fallback)
 */
export function getDefaultOgImage(): string {
  return `${BASE_URL}${OG_IMAGE_ENDPOINT}`;
}
