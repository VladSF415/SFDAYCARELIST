/**
 * Image Generation System for SF Daycare List
 *
 * This module provides utilities for generating dynamic images using satori + sharp.
 * Claude can use these templates to create OG images, social cards, and more.
 */

import satori from 'satori';
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load fonts
let interFont;
try {
  interFont = readFileSync(join(__dirname, '../node_modules/@fontsource/inter/files/inter-latin-700-normal.woff'));
} catch (error) {
  console.warn('[Image Generator] Could not load Inter font, using fallback');
  interFont = null;
}

/**
 * Base template configuration
 */
const DEFAULT_CONFIG = {
  width: 1200,
  height: 630,
  fonts: interFont ? [{
    name: 'Inter',
    data: interFont,
    weight: 700,
    style: 'normal',
  }] : [],
};

/**
 * Generate a daycare card image
 *
 * @param {Object} options
 * @param {string} options.name - Daycare name
 * @param {string} options.neighborhood - SF neighborhood
 * @param {number} options.rating - Rating out of 5
 * @param {number} options.reviewCount - Number of reviews
 * @param {string} options.ageRange - e.g., "Infants - Preschool"
 * @param {number} options.monthlyPrice - Monthly cost
 * @returns {Promise<Buffer>} PNG image buffer
 */
export async function generateDaycareCard({
  name,
  neighborhood,
  rating = 0,
  reviewCount = 0,
  ageRange = '',
  monthlyPrice = 0,
}) {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '60px',
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Header
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '40px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '32px',
                      fontWeight: '700',
                      color: 'white',
                    },
                    children: 'SF Daycare List',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '999px',
                      padding: '12px 24px',
                      fontSize: '20px',
                      color: 'white',
                    },
                    children: neighborhood,
                  },
                },
              ],
            },
          },

          // Main card
          {
            type: 'div',
            props: {
              style: {
                background: 'white',
                borderRadius: '24px',
                padding: '50px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              },
              children: [
                // Daycare name
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: '56px',
                      fontWeight: '900',
                      color: '#1a1a1a',
                      margin: 0,
                      lineHeight: 1.2,
                    },
                    children: name,
                  },
                },

                // Stats row
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      gap: '40px',
                      marginTop: '30px',
                    },
                    children: [
                      // Rating
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                          },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  fontSize: '48px',
                                  fontWeight: '900',
                                  color: '#667eea',
                                },
                                children: `⭐ ${rating.toFixed(1)}`,
                              },
                            },
                            {
                              type: 'div',
                              props: {
                                style: {
                                  fontSize: '18px',
                                  color: '#666',
                                },
                                children: `${reviewCount} reviews`,
                              },
                            },
                          ],
                        },
                      },

                      // Age range
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                          },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  fontSize: '24px',
                                  color: '#666',
                                },
                                children: '👶 Ages',
                              },
                            },
                            {
                              type: 'div',
                              props: {
                                style: {
                                  fontSize: '28px',
                                  fontWeight: '700',
                                  color: '#1a1a1a',
                                },
                                children: ageRange,
                              },
                            },
                          ],
                        },
                      },

                      // Price
                      monthlyPrice > 0 ? {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                          },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  fontSize: '24px',
                                  color: '#666',
                                },
                                children: '💰 Monthly',
                              },
                            },
                            {
                              type: 'div',
                              props: {
                                style: {
                                  fontSize: '28px',
                                  fontWeight: '700',
                                  color: '#1a1a1a',
                                },
                                children: `$${monthlyPrice.toLocaleString()}`,
                              },
                            },
                          ],
                        },
                      } : null,
                    ].filter(Boolean),
                  },
                },
              ],
            },
          },
        ],
      },
    },
    DEFAULT_CONFIG
  );

  const png = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  return png;
}

/**
 * Generate a comparison image for 2 daycares
 *
 * @param {Object} options
 * @param {Object} options.daycare1 - First daycare data
 * @param {Object} options.daycare2 - Second daycare data
 * @returns {Promise<Buffer>} PNG image buffer
 */
export async function generateComparisonCard({ daycare1, daycare2 }) {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#0f0f23',
          padding: '40px',
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Header
          {
            type: 'div',
            props: {
              style: {
                textAlign: 'center',
                marginBottom: '30px',
              },
              children: [
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: '48px',
                      fontWeight: '900',
                      color: 'white',
                      margin: 0,
                    },
                    children: 'Daycare Comparison',
                  },
                },
                {
                  type: 'p',
                  props: {
                    style: {
                      fontSize: '24px',
                      color: '#999',
                      margin: '10px 0 0 0',
                    },
                    children: 'SF Daycare List',
                  },
                },
              ],
            },
          },

          // Comparison cards
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                gap: '30px',
                flex: 1,
              },
              children: [daycare1, daycare2].map((daycare, idx) => ({
                type: 'div',
                props: {
                  style: {
                    flex: 1,
                    background: 'white',
                    borderRadius: '16px',
                    padding: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        children: [
                          {
                            type: 'h2',
                            props: {
                              style: {
                                fontSize: '36px',
                                fontWeight: '900',
                                color: '#1a1a1a',
                                margin: 0,
                                marginBottom: '20px',
                              },
                              children: daycare.name,
                            },
                          },
                          {
                            type: 'div',
                            props: {
                              style: {
                                fontSize: '20px',
                                color: '#666',
                                marginBottom: '10px',
                              },
                              children: `📍 ${daycare.neighborhood}`,
                            },
                          },
                          {
                            type: 'div',
                            props: {
                              style: {
                                fontSize: '32px',
                                fontWeight: '900',
                                color: '#667eea',
                                marginBottom: '10px',
                              },
                              children: `⭐ ${daycare.rating?.toFixed(1) || 'N/A'}`,
                            },
                          },
                        ],
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '24px',
                          fontWeight: '700',
                          color: '#1a1a1a',
                        },
                        children: daycare.monthlyPrice ? `$${daycare.monthlyPrice.toLocaleString()}/mo` : 'Price varies',
                      },
                    },
                  ],
                },
              })),
            },
          },
        ],
      },
    },
    DEFAULT_CONFIG
  );

  const png = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  return png;
}

/**
 * Generate a generic OG image
 *
 * @param {Object} options
 * @param {string} options.title - Main title
 * @param {string} options.subtitle - Subtitle text
 * @param {string} options.badge - Badge text (optional)
 * @returns {Promise<Buffer>} PNG image buffer
 */
export async function generateOGImage({ title, subtitle, badge }) {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '80px',
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Badge (if provided)
          badge ? {
            type: 'div',
            props: {
              style: {
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '999px',
                padding: '12px 28px',
                fontSize: '24px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '30px',
              },
              children: badge,
            },
          } : null,

          // Title
          {
            type: 'h1',
            props: {
              style: {
                fontSize: title.length > 40 ? '64px' : '84px',
                fontWeight: '900',
                color: 'white',
                margin: 0,
                lineHeight: 1.1,
                maxWidth: '1000px',
              },
              children: title,
            },
          },

          // Subtitle
          subtitle ? {
            type: 'p',
            props: {
              style: {
                fontSize: '36px',
                fontWeight: '400',
                color: 'rgba(255,255,255,0.9)',
                margin: '30px 0 0 0',
                maxWidth: '900px',
              },
              children: subtitle,
            },
          } : null,
        ].filter(Boolean),
      },
    },
    DEFAULT_CONFIG
  );

  const png = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  return png;
}

/**
 * Generate a square social share card (1080x1080 for Instagram)
 *
 * @param {Object} options
 * @param {string} options.name - Daycare name
 * @param {number} options.rating - Rating out of 5
 * @param {string} options.neighborhood - SF neighborhood
 * @returns {Promise<Buffer>} PNG image buffer
 */
export async function generateShareCard({ name, rating, neighborhood }) {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '60px',
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Rating circle
          {
            type: 'div',
            props: {
              style: {
                width: '280px',
                height: '280px',
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '120px',
                fontWeight: '900',
                color: '#667eea',
                marginBottom: '40px',
              },
              children: `${rating.toFixed(1)}`,
            },
          },

          // Stars
          {
            type: 'div',
            props: {
              style: {
                fontSize: '48px',
                marginBottom: '30px',
              },
              children: '⭐⭐⭐⭐⭐',
            },
          },

          // Name
          {
            type: 'div',
            props: {
              style: {
                fontSize: '48px',
                fontWeight: '900',
                color: 'white',
                textAlign: 'center',
                marginBottom: '20px',
              },
              children: name,
            },
          },

          // Neighborhood
          {
            type: 'div',
            props: {
              style: {
                fontSize: '32px',
                color: 'rgba(255,255,255,0.9)',
                textAlign: 'center',
                marginBottom: '40px',
              },
              children: `📍 ${neighborhood}`,
            },
          },

          // Footer
          {
            type: 'div',
            props: {
              style: {
                fontSize: '24px',
                fontWeight: '700',
                color: 'white',
              },
              children: 'SF Daycare List',
            },
          },
        ],
      },
    },
    {
      width: 1080,
      height: 1080,
      fonts: DEFAULT_CONFIG.fonts,
    }
  );

  const png = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  return png;
}
