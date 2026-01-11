import { useEffect } from 'react';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

/**
 * BreadcrumbList Schema Component
 * Generates JSON-LD structured data for breadcrumb navigation
 *
 * Schema Type: https://schema.org/BreadcrumbList
 * Benefits: Breadcrumb display in Google SERPs, better site structure understanding
 */
export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  useEffect(() => {
    // Create schema script tag
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'breadcrumb-schema';

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };

    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const existingScript = document.getElementById('breadcrumb-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [items]);

  return null; // This component doesn't render anything visible
}

/**
 * Visual Breadcrumb Component (optional - for UI)
 */
interface VisualBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function VisualBreadcrumb({ items }: VisualBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb navigation"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '20px',
        fontFamily: "'Courier New', 'Courier', monospace",
        fontSize: '12px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}
    >
      {items.map((item, index) => (
        <span key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {index > 0 && (
            <span style={{ opacity: 0.5 }}>→</span>
          )}
          {index < items.length - 1 ? (
            <a
              href={item.url}
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                padding: '6px 12px',
                background: 'transparent',
                border: '2px solid rgba(255,255,255,0.3)',
                transition: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = '#000000';
                e.currentTarget.style.borderColor = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
            >
              {item.name}
            </a>
          ) : (
            <span style={{
              color: '#ffffff',
              opacity: 0.7,
              padding: '6px 0'
            }}>
              {item.name}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
