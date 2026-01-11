import { useEffect } from 'react';

interface HowToStep {
  name: string;
  text: string;
  url?: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
}

/**
 * HowTo Schema Component
 * Generates JSON-LD structured data for step-by-step guides
 *
 * Schema Type: https://schema.org/HowTo
 * Benefits: Step-by-step display in Google SERPs, featured snippets for "how to" queries
 */
export function HowToSchema({ name, description, steps, totalTime }: HowToSchemaProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'howto-schema';

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: name,
      description: description,
      totalTime: totalTime || 'PT10M',
      step: steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        itemListElement: {
          '@type': 'HowToDirection',
          text: step.text,
        },
        url: step.url,
      })),
    };

    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('howto-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [name, description, steps, totalTime]);

  return null;
}

/**
 * Visual HowTo Component (Step-by-Step UI)
 */
interface VisualHowToProps {
  steps: HowToStep[];
  title?: string;
}

export function VisualHowTo({ steps, title }: VisualHowToProps) {
  return (
    <div className="howto-section" style={{ marginTop: '30px' }}>
      {title && (
        <h3 style={{ fontWeight: '700', fontSize: '24px', marginBottom: '20px' }}>
          {title}
        </h3>
      )}
      <div className="howto-steps">
        {steps.map((step, index) => (
          <div
            key={index}
            className="howto-step"
            style={{
              border: '3px solid #000',
              padding: '20px',
              marginBottom: '15px',
              position: 'relative',
            }}
          >
            <div
              style={{
                fontWeight: '700',
                fontSize: '18px',
                marginBottom: '10px',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '30px',
                  height: '30px',
                  border: '3px solid #000',
                  textAlign: 'center',
                  lineHeight: '24px',
                  marginRight: '10px',
                  fontWeight: '700',
                }}
              >
                {index + 1}
              </span>
              {step.name}
            </div>
            <div style={{ marginLeft: '40px', lineHeight: '1.6' }}>
              {step.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
