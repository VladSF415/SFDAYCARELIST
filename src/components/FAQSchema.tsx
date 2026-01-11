import { useEffect } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

/**
 * FAQ Schema Component
 * Generates JSON-LD structured data for FAQ pages
 *
 * Schema Type: https://schema.org/FAQPage
 * Benefits: FAQ display in Google SERPs, expandable accordions in search results
 */
export function FAQSchema({ faqs }: FAQSchemaProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'faq-schema';

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };

    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('faq-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [faqs]);

  return null;
}

/**
 * Visual FAQ Component (Accordion UI)
 */
interface VisualFAQProps {
  faqs: FAQItem[];
}

export function VisualFAQ({ faqs }: VisualFAQProps) {
  return (
    <div className="faq-section">
      {faqs.map((faq, index) => (
        <details key={index} className="faq-item" style={{
          border: '3px solid #000',
          marginBottom: '15px',
          padding: '20px'
        }}>
          <summary style={{
            fontWeight: '700',
            fontSize: '18px',
            cursor: 'pointer',
            userSelect: 'none'
          }}>
            {faq.question}
          </summary>
          <div style={{ marginTop: '15px', lineHeight: '1.6' }}>
            {faq.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
