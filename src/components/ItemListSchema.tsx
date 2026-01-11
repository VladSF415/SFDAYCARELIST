import { useEffect } from 'react';
import type { Platform } from '../types';

interface ItemListSchemaProps {
  platforms: Platform[];
  category: string;
  categoryName: string;
}

/**
 * ItemList Schema Component
 * Generates JSON-LD structured data for category/collection pages
 *
 * Schema Type: https://schema.org/ItemList
 * Benefits: Rich snippets showing list of items in SERPs
 */
export function ItemListSchema({ platforms, category, categoryName }: ItemListSchemaProps) {
  useEffect(() => {
    // Create schema script tag
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `itemlist-schema-${category}`;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Best ${categoryName} AI Tools 2026`,
      description: `Comprehensive list of ${platforms.length} ${categoryName.toLowerCase()} AI tools and platforms`,
      numberOfItems: platforms.length,
      url: `https://aiplatformslist.com/category/${category}`,
      itemListElement: platforms.slice(0, 50).map((platform, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: platform.name,
          description: platform.description,
          url: platform.website || platform.url || `https://aiplatformslist.com/platform/${platform.slug || platform.id}`,
          ...(platform.rating && {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: platform.rating,
              bestRating: 5,
              worstRating: 1,
              ratingCount: Math.max(1, Math.floor((platform.clicks || 0) / 10)),
            },
          }),
          ...(platform.pricing && {
            offers: {
              '@type': 'Offer',
              price: extractPrice(platform.pricing),
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
            },
          }),
        },
      })),
    };

    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const existingScript = document.getElementById(`itemlist-schema-${category}`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [platforms, category, categoryName]);

  return null; // This component doesn't render anything visible
}

/**
 * Extract numeric price from pricing string
 */
function extractPrice(pricing: string): string {
  if (!pricing) return '0';
  if (/free/i.test(pricing)) return '0';
  const match = pricing.match(/\d+/);
  return match ? match[0] : '0';
}
