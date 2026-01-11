import { useEffect } from 'react';
import type { Platform } from '../types';

interface SoftwareApplicationSchemaProps {
  platform: Platform;
}

/**
 * SoftwareApplication Schema Component
 * Generates JSON-LD structured data for Google Rich Snippets
 *
 * Schema Type: https://schema.org/SoftwareApplication
 * Benefits: Star ratings, pricing, app name in SERPs
 */
export function SoftwareApplicationSchema({ platform }: SoftwareApplicationSchemaProps) {
  useEffect(() => {
    // Create schema script tag
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `schema-${platform.id}`;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: platform.name,
      description: platform.description,
      url: platform.website || platform.url || `https://aiplatformslist.com/platform/${platform.slug || platform.id}`,
      applicationCategory: getCategoryName(platform.category),

      // Pricing information
      ...(platform.pricing && {
        offers: {
          '@type': 'Offer',
          price: extractPrice(platform.pricing),
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
          description: platform.pricing,
        },
      }),

      // Features list
      ...(platform.features && platform.features.length > 0 && {
        featureList: platform.features,
      }),

      // Aggregate rating (stub for future reviews)
      ...(platform.rating && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: platform.rating,
          bestRating: 5,
          worstRating: 1,
          ratingCount: Math.max(1, Math.floor((platform.clicks || 0) / 10)), // Estimate based on clicks
        },
      }),

      // Operating system (assume web-based)
      operatingSystem: 'Web Browser, Windows, macOS, Linux',

      // Software version
      softwareVersion: '1.0',

      // Additional metadata
      ...(platform.tags && platform.tags.length > 0 && {
        keywords: platform.tags.join(', '),
      }),

      // Publisher/Creator
      author: {
        '@type': 'Organization',
        name: platform.name,
        url: platform.website || platform.url,
      },

      // Date published (use current date as placeholder)
      datePublished: new Date().toISOString().split('T')[0],

      // Same as links for cross-referencing
      ...(platform.website && {
        sameAs: [platform.website],
      }),
    };

    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const existingScript = document.getElementById(`schema-${platform.id}`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [platform]);

  return null; // This component doesn't render anything visible
}

/**
 * Convert category slug to human-readable name
 */
function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    'computer-vision': 'Computer Vision Software',
    'ml-frameworks': 'Machine Learning Framework',
    'code-ai': 'Development Tool',
    'llms': 'Language Model Software',
    'generative-ai': 'Generative AI Software',
    'nlp': 'Natural Language Processing Software',
    'image-generation': 'Image Generation Software',
    'analytics-bi': 'Business Intelligence Software',
    'video-ai': 'Video Editing Software',
    'video-generation': 'Video Generation Software',
    'search-ai': 'Search Engine Software',
    'agent-platforms': 'AI Agent Platform',
  };

  return categoryMap[category] || 'AI Software';
}

/**
 * Extract numeric price from pricing string
 * Examples: "$49/month" -> "49", "Free" -> "0", "$99-299" -> "99"
 */
function extractPrice(pricing: string): string {
  if (!pricing) return '0';

  // Check for "Free" or "free"
  if (/free/i.test(pricing)) return '0';

  // Extract first number found
  const match = pricing.match(/\d+/);
  return match ? match[0] : '0';
}
