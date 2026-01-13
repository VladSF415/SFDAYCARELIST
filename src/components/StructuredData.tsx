import { useEffect } from 'react';

interface StructuredDataProps {
  data: Record<string, any>;
}

/**
 * StructuredData component for adding JSON-LD schema markup
 * Improves SEO and rich snippets in search results
 */
export function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    // Create or update script tag with JSON-LD
    const scriptId = 'structured-data-' + JSON.stringify(data['@type']);
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(data);

    // Cleanup on unmount
    return () => {
      script?.remove();
    };
  }, [data]);

  return null;
}

// Helper functions to generate common schema types

export function createSoftwareApplicationSchema(platform: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: platform.name,
    description: platform.description,
    url: platform.url || platform.website,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, Windows, macOS, Linux',
    offers: {
      '@type': 'Offer',
      price: platform.monthly_pricing || platform.pricing,
      priceCurrency: 'USD',
    },
    aggregateRating: platform.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: platform.rating,
          ratingCount: platform.clicks || 100,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
    featureList: platform.features?.join(', '),
  };
}

export function createItemListSchema(daycares: any[], neighborhood?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: neighborhood
      ? `Best Daycares in ${neighborhood}`
      : 'SF Daycare List - Licensed Daycares Directory',
    description: neighborhood
      ? `Licensed daycares in ${neighborhood}, San Francisco`
      : 'Comprehensive directory of licensed daycares in San Francisco',
    numberOfItems: daycares.length,
    itemListElement: daycares.slice(0, 50).map((daycare: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'ChildCare',
        name: daycare.name,
        url: `https://sfdaycarelist.com/daycare/${daycare.slug || daycare.id}`,
        description: daycare.description,
        aggregateRating: daycare.ratings?.overall
          ? {
              '@type': 'AggregateRating',
              ratingValue: daycare.ratings.overall,
              bestRating: 5,
            }
          : undefined,
      },
    })),
  };
}

export function createWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SF Daycare List',
    alternateName: 'San Francisco Daycare Directory',
    url: 'https://sfdaycarelist.com',
    description:
      'The most comprehensive directory of licensed daycares in San Francisco. Find licensed daycare centers with ratings, availability, and pricing information.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate:
          'https://sfdaycarelist.com/?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function createOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SF Daycare List',
    url: 'https://sfdaycarelist.com',
    logo: 'https://sfdaycarelist.com/logo.png',
    description:
      'Comprehensive San Francisco daycare directory helping parents discover licensed, quality childcare centers in their neighborhood.',
    sameAs: [
      // Add social media profiles here when available
    ],
  };
}

export function createBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function createDatasetSchema(totalDaycares: number) {
  const today = new Date().toISOString().split('T')[0];
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'SF Daycare Directory Dataset',
    description: `Comprehensive dataset of ${totalDaycares}+ licensed daycares in San Francisco with ratings, licensing information, and availability. Updated regularly.`,
    url: 'https://sfdaycarelist.com',
    keywords: ['San Francisco daycare', 'childcare', 'licensed daycare', 'preschool', 'daycare directory'],
    license: 'https://sfdaycarelist.com/terms',
    isAccessibleForFree: true,
    creator: {
      '@type': 'Organization',
      name: 'SF Daycare List',
      url: 'https://sfdaycarelist.com',
    },
    datePublished: '2024-01-01',
    dateModified: today,
    temporalCoverage: '2024/..',
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: 'https://sfdaycarelist.com/api/daycares',
    },
  };
}

export default StructuredData;
