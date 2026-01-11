import React from 'react';

interface Daycare {
  id: string;
  name: string;
  slug: string;
  description: string;
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  location: {
    address: string;
    city: string;
    state: string;
    zip: string;
    neighborhood: string;
    latitude: number;
    longitude: number;
  };
  licensing: {
    license_number: string;
    status: string;
  };
  program: {
    ages_min_months: number;
    ages_max_years: number;
  };
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  pricing: {
    infant_monthly?: number;
    toddler_monthly?: number;
    preschool_monthly?: number;
  };
  ratings: {
    overall: number;
    review_count: number;
  };
}

interface LocalBusinessSchemaProps {
  daycare: Daycare;
}

/**
 * Generates LocalBusiness + ChildCare structured data for daycare listings
 * https://schema.org/LocalBusiness
 * https://schema.org/ChildCare
 */
export function LocalBusinessSchema({ daycare }: LocalBusinessSchemaProps) {
  // Calculate price range
  const getPriceRange = () => {
    const prices = [
      daycare.pricing.infant_monthly,
      daycare.pricing.toddler_monthly,
      daycare.pricing.preschool_monthly
    ].filter((p): p is number => p !== undefined && p > 0);

    if (prices.length === 0) return null;

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    if (min === max) {
      return `$${min}`;
    }
    return `$${min}-$${max}`;
  };

  // Convert hours to schema.org format
  const formatHours = () => {
    const daysMap: Record<string, string> = {
      monday: 'Mo',
      tuesday: 'Tu',
      wednesday: 'We',
      thursday: 'Th',
      friday: 'Fr',
      saturday: 'Sa',
      sunday: 'Su'
    };

    return Object.entries(daycare.hours)
      .filter(([_, hours]) => hours !== 'Closed')
      .map(([day, hours]) => {
        // Convert "7:00 AM - 6:00 PM" to "07:00-18:00"
        const match = hours.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (!match) return null;

        const [_, startHour, startMin, startPeriod, endHour, endMin, endPeriod] = match;

        const convertTo24Hour = (hour: string, min: string, period: string) => {
          let h = parseInt(hour);
          if (period.toUpperCase() === 'PM' && h !== 12) h += 12;
          if (period.toUpperCase() === 'AM' && h === 12) h = 0;
          return `${h.toString().padStart(2, '0')}:${min}`;
        };

        const startTime = convertTo24Hour(startHour, startMin, startPeriod);
        const endTime = convertTo24Hour(endHour, endMin, endPeriod);

        return `${daysMap[day]} ${startTime}-${endTime}`;
      })
      .filter((h): h is string => h !== null);
  };

  const priceRange = getPriceRange();
  const openingHours = formatHours();

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ChildCare'],
    '@id': `https://sfdaycarelist.com/daycare/${daycare.slug}#business`,
    name: daycare.name,
    description: daycare.description,
    url: `https://sfdaycarelist.com/daycare/${daycare.slug}`,
    telephone: daycare.contact.phone,
    email: daycare.contact.email,
    ...(daycare.contact.website && { sameAs: [daycare.contact.website] }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: daycare.location.address,
      addressLocality: daycare.location.city,
      addressRegion: daycare.location.state,
      postalCode: daycare.location.zip,
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: daycare.location.latitude,
      longitude: daycare.location.longitude
    },
    ...(priceRange && { priceRange }),
    ...(openingHours.length > 0 && { openingHoursSpecification: openingHours }),
    ...(daycare.ratings.overall && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: daycare.ratings.overall,
        bestRating: 5,
        worstRating: 1,
        ratingCount: daycare.ratings.review_count
      }
    }),
    // ChildCare specific properties
    serviceType: 'Child Daycare',
    audience: {
      '@type': 'PeopleAudience',
      suggestedMinAge: daycare.program.ages_min_months / 12,
      suggestedMaxAge: daycare.program.ages_max_years
    },
    areaServed: {
      '@type': 'City',
      name: 'San Francisco',
      '@id': 'https://www.wikidata.org/wiki/Q62'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

/**
 * Generates BreadcrumbList structured data for daycare pages
 */
interface BreadcrumbSchemaProps {
  daycare: Daycare;
}

export function DaycareBreadcrumbSchema({ daycare }: BreadcrumbSchemaProps) {
  const neighborhoodName = daycare.location.neighborhood
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://sfdaycarelist.com/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: neighborhoodName,
        item: `https://sfdaycarelist.com/?neighborhood=${daycare.location.neighborhood}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: daycare.name,
        item: `https://sfdaycarelist.com/daycare/${daycare.slug}`
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

/**
 * Combined schema component for daycare pages
 */
export function DaycareStructuredData({ daycare }: { daycare: Daycare }) {
  return (
    <>
      <LocalBusinessSchema daycare={daycare} />
      <DaycareBreadcrumbSchema daycare={daycare} />
    </>
  );
}

export default DaycareStructuredData;
