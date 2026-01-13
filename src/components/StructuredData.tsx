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
    numberOfItems: platforms.length,
    itemListElement: platforms.slice(0, 50).map((platform, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: platform.name,
        url: `https://aiplatformslist.com/platform/${platform.slug || platform.id}`,
        description: platform.description,
        aggregateRating: platform.rating
          ? {
              '@type': 'AggregateRating',
              ratingValue: platform.rating,
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
    name: 'AI Platforms List',
    alternateName: 'AI Platforms Directory',
    url: 'https://aiplatformslist.com',
    description:
      'The most comprehensive directory of AI platforms, tools, and software. Compare features, pricing, and reviews across 900+ AI tools.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate:
          'https://aiplatformslist.com/?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function createOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AI Platforms List',
    url: 'https://aiplatformslist.com',
    logo: 'https://aiplatformslist.com/logo.png',
    description:
      'Comprehensive AI platforms directory helping businesses and individuals discover the best AI tools and software for their needs.',
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

export function createDatasetSchema(totalPlatforms: number) {
  const today = new Date().toISOString().split('T')[0];
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'AI Platforms Directory Dataset',
    description: `Comprehensive dataset of ${totalPlatforms}+ AI platforms, tools, and software with features, pricing, and reviews. Updated daily.`,
    url: 'https://aiplatformslist.com',
    keywords: ['AI platforms', 'artificial intelligence', 'machine learning', 'AI tools', 'software directory'],
    license: 'https://aiplatformslist.com/terms',
    isAccessibleForFree: true,
    creator: {
      '@type': 'Organization',
      name: 'AI Platforms List',
      url: 'https://aiplatformslist.com',
    },
    datePublished: '2024-01-01',
    dateModified: today,
    temporalCoverage: '2024/..',
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: 'https://aiplatformslist.com/api/platforms',
    },
  };
}

export default StructuredData;
