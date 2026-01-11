import { useEffect } from 'react';

interface SocialMetaTagsProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * SocialMetaTags component for Open Graph and Twitter Card meta tags
 * Updates document head with social sharing metadata
 */
export function SocialMetaTags({
  title,
  description,
  url,
  image = 'https://aiplatformslist.com/og-image.png',
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
}: SocialMetaTagsProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to set or update meta tag
    const setMetaTag = (property: string, content: string, isName = false) => {
      const attribute = isName ? 'name' : 'property';
      let element = document.querySelector(`meta[${attribute}="${property}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    // Open Graph tags
    setMetaTag('og:title', title);
    setMetaTag('og:description', description);
    setMetaTag('og:url', url);
    setMetaTag('og:image', image);
    setMetaTag('og:type', type);
    setMetaTag('og:site_name', 'AI Platforms List');

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image', true);
    setMetaTag('twitter:title', title, true);
    setMetaTag('twitter:description', description, true);
    setMetaTag('twitter:image', image, true);

    // Standard meta tags
    setMetaTag('description', description, true);

    // Article-specific tags
    if (type === 'article') {
      setMetaTag('og:type', 'article');
      if (author) {
        setMetaTag('article:author', author);
      }
      if (publishedTime) {
        setMetaTag('article:published_time', publishedTime);
      }
      if (modifiedTime) {
        setMetaTag('article:modified_time', modifiedTime);
      }
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Cleanup function to reset on unmount (optional)
    return () => {
      // Meta tags persist across pages, which is fine for SPAs
      // We update them on each page change
    };
  }, [title, description, url, image, type, author, publishedTime, modifiedTime]);

  // This component doesn't render anything
  return null;
}

export default SocialMetaTags;
