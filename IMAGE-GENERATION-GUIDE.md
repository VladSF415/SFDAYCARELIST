# Image Generation System - SF Daycare List

This project has a complete image generation system that Claude can use to create dynamic images for social sharing, OG tags, and more.

## System Overview

**Dependencies:**
- `satori` - Converts React-like JSX to SVG
- `sharp` - Converts SVG to PNG with high performance

**Location:**
- Utilities: `lib/image-generator.js`
- API Routes: `server.js` (lines ~1850+)

## Available Image Types

### 1. Daycare Card (1200x630)

Professional daycare listing card with rating, neighborhood, age range, and pricing.

**Endpoint:** `GET /api/image/daycare-card`

**Query Parameters:**
- `name` (string) - Daycare name
- `neighborhood` (string) - SF neighborhood
- `rating` (number) - Rating out of 5 (e.g., 4.8)
- `reviewCount` (number) - Number of reviews
- `ageRange` (string) - e.g., "Infants - Preschool"
- `monthlyPrice` (number) - Monthly cost in dollars

**Example:**
```bash
GET http://localhost:3000/api/image/daycare-card?name=Little%20Sprouts&neighborhood=Mission&rating=4.8&reviewCount=42&ageRange=Infants-Preschool&monthlyPrice=2500
```

**Use Case:**
- OG images for daycare detail pages
- Social sharing cards
- Email marketing

---

### 2. Comparison Card (1200x630)

Side-by-side comparison of two daycares.

**Endpoint:** `POST /api/image/comparison-card`

**Request Body:**
```json
{
  "daycare1": {
    "name": "Little Sprouts",
    "neighborhood": "Mission",
    "rating": 4.8,
    "monthlyPrice": 2500
  },
  "daycare2": {
    "name": "Happy Kids Academy",
    "neighborhood": "SOMA",
    "rating": 4.6,
    "monthlyPrice": 2800
  }
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/image/comparison-card \
  -H "Content-Type: application/json" \
  -d '{"daycare1": {...}, "daycare2": {...}}'
```

**Use Case:**
- Comparison page OG images
- Blog post images
- Social media comparison posts

---

### 3. Generic OG Image (1200x630)

Customizable branded OG image for any page.

**Endpoint:** `GET /api/image/og`

**Query Parameters:**
- `title` (string) - Main title text
- `subtitle` (string) - Subtitle text (optional)
- `badge` (string) - Badge text in top corner (optional)

**Example:**
```bash
GET http://localhost:3000/api/image/og?title=Find%20the%20Best%20Daycares%20in%20SF&subtitle=Verified%20reviews%20from%20real%20parents&badge=2025%20Guide
```

**Use Case:**
- Homepage OG image
- Category pages
- Blog post headers
- Guide pages

---

### 4. Share Card (1080x1080)

Square Instagram-optimized share card.

**Endpoint:** `GET /api/image/share-card`

**Query Parameters:**
- `name` (string) - Daycare name
- `rating` (number) - Rating out of 5
- `neighborhood` (string) - SF neighborhood

**Example:**
```bash
GET http://localhost:3000/api/image/share-card?name=Little%20Sprouts&rating=4.8&neighborhood=Mission
```

**Use Case:**
- Instagram posts
- Square social cards
- Email signatures

---

## How Claude Can Use This

### Example 1: Generate OG image for a blog post

```javascript
// When creating a new blog post about "Top 10 Daycares in Mission District"
const ogImageUrl = `https://sfdaycarelist.com/api/image/og?title=Top%2010%20Daycares%20in%20Mission%20District&subtitle=Parent-reviewed%20and%20verified&badge=2025`;

// Add to HTML meta tags
<meta property="og:image" content={ogImageUrl} />
```

### Example 2: Generate daycare card for a specific listing

```javascript
// For daycare "Little Sprouts"
const cardUrl = `https://sfdaycarelist.com/api/image/daycare-card?name=Little%20Sprouts&neighborhood=Mission&rating=4.8&reviewCount=42&ageRange=Infants-Preschool&monthlyPrice=2500`;

// Use as OG image or social share image
<meta property="og:image" content={cardUrl} />
```

### Example 3: Generate comparison image for blog post

```javascript
// Create comparison card via API call
const response = await fetch('https://sfdaycarelist.com/api/image/comparison-card', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    daycare1: {
      name: "Little Sprouts",
      neighborhood: "Mission",
      rating: 4.8,
      monthlyPrice: 2500
    },
    daycare2: {
      name: "Happy Kids Academy",
      neighborhood: "SOMA",
      rating: 4.6,
      monthlyPrice: 2800
    }
  })
});

// Response is PNG buffer
const imageBlob = await response.blob();
```

---

## Customization

### Adding New Templates

Edit `lib/image-generator.js` to add new image templates:

```javascript
export async function generateNewTemplate({ ...options }) {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: { /* your styles */ },
        children: [ /* your JSX */ ]
      }
    },
    DEFAULT_CONFIG
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return png;
}
```

Then add a route in `server.js`:

```javascript
fastify.get('/api/image/new-template', async (request, reply) => {
  const png = await generateNewTemplate(request.query);
  reply.type('image/png').send(png);
});
```

---

## Performance

- Images are cached for 1 hour (daycare cards, share cards)
- Generic OG images are cached for 24 hours
- All images are generated on-demand (no pre-generation needed)
- Sharp is extremely fast (~50ms per image)

---

## Testing

Test all endpoints locally:

```bash
# Start server
npm start

# Test daycare card
curl "http://localhost:3000/api/image/daycare-card?name=Test&neighborhood=Mission&rating=4.5&reviewCount=10&ageRange=All%20Ages&monthlyPrice=2000" --output test-card.png

# Test OG image
curl "http://localhost:3000/api/image/og?title=Test%20Title&subtitle=Test%20Subtitle" --output test-og.png

# Test share card
curl "http://localhost:3000/api/image/share-card?name=Test&rating=5.0&neighborhood=SF" --output test-share.png
```

---

## Error Handling

All routes return proper errors:

- **400** - Missing required parameters
- **500** - Image generation failed (check logs)

Example error response:
```json
{
  "error": "Failed to generate daycare card"
}
```

---

## Pro Tips for Claude

1. **URL Encoding**: Always URL-encode query parameters
   - Use `encodeURIComponent()` in JavaScript
   - Or use `%20` for spaces, `%26` for &, etc.

2. **Dynamic Data**: Pull data from the database for real-time images
   ```javascript
   const daycare = await db.getDaycareById(id);
   const imageUrl = `/api/image/daycare-card?name=${encodeURIComponent(daycare.name)}...`;
   ```

3. **Batch Generation**: Generate multiple images by mapping over data
   ```javascript
   const images = await Promise.all(
     daycares.map(d => generateDaycareCard(d))
   );
   ```

4. **Caching**: Images are automatically cached by the CDN/browser based on Cache-Control headers

---

## Future Enhancements

Potential additions:
- [ ] Video thumbnail generator
- [ ] Animated GIF cards
- [ ] QR code generator for daycare pages
- [ ] Certificate/badge images
- [ ] Email header images
- [ ] Instagram story templates (1080x1920)

---

Built with ❤️ for SF Daycare List
