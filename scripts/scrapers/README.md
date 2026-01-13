# SF Daycare Data Scrapers

Comprehensive web scraping system to collect daycare data from multiple sources.

## 📊 Data Sources

1. **CA Childcare Licensing Database** - Official state licensing, inspections, violations
2. **Google Places API** - Reviews, ratings, photos, hours, contact info
3. **Yelp Fusion API** - Additional reviews, ratings, business info
4. **Individual Websites** - Programs, pricing, availability (coming soon)

## 🚀 Quick Start

### 1. Setup API Keys

Create a `.env` file in the project root:

```bash
# Google Places API
GOOGLE_PLACES_API_KEY=your_google_api_key_here

# Yelp Fusion API
YELP_API_KEY=your_yelp_api_key_here
```

### 2. Get API Keys

#### Google Places API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **"Places API"** and **"Maps JavaScript API"**
4. Go to **Credentials** → **Create API Key**
5. Restrict key to your domain (optional but recommended)
6. Copy key to `.env` file

**Cost**: Free tier includes 28,000 requests/month

#### Yelp Fusion API

1. Go to [Yelp Developers](https://www.yelp.com/developers)
2. Sign in with your Yelp account
3. Click **"Create App"**
4. Fill in app details (name, industry, etc.)
5. Copy **API Key** to `.env` file

**Cost**: Free (5000 requests/day)

### 3. Run Scrapers

```bash
# Run all scrapers (recommended)
npm run scrape:all

# Run individual scrapers
npm run scrape:ca        # CA licensing only
npm run scrape:google    # Google Places only
npm run scrape:yelp      # Yelp only

# Skip specific sources
node scripts/scrapers/master-scraper.mjs --skip-google
node scripts/scrapers/master-scraper.mjs --skip-yelp
```

## 📁 Output Files

Scrapers create files in `data/scraped/`:

- `ca-licensing-facilities.json` - CA licensing data
- `google-places-data.json` - Google Places data
- `yelp-data.json` - Yelp data

**Merged output**: `src/data/daycares-merged.json`

## 🔄 Data Flow

```
┌─────────────────┐
│ CA Licensing DB │ ── Official facility data (foundation)
└────────┬────────┘
         ↓
┌─────────────────┐
│  Google Places  │ ── Reviews, ratings, photos, hours
└────────┬────────┘
         ↓
┌─────────────────┐
│      Yelp       │ ── Additional reviews, pricing hints
└────────┬────────┘
         ↓
┌─────────────────┐
│  Master Merger  │ ── Merge all sources intelligently
└────────┬────────┘
         ↓
┌─────────────────┐
│ daycares-merged │ ── Final enriched data
└─────────────────┘
```

## 🎯 Data Fields Collected

### From CA Licensing:
- ✅ License number, status, expiration
- ✅ Facility capacity
- ✅ Inspection scores
- ✅ Violations history
- ✅ Address, coordinates

### From Google Places:
- ✅ Reviews (text, rating, author)
- ✅ Overall rating
- ✅ Photos
- ✅ Operating hours
- ✅ Phone number
- ✅ Website

### From Yelp:
- ✅ Reviews
- ✅ Overall rating
- ✅ Price level ($-$$$$)
- ✅ Photos
- ✅ Operating hours

## 🤖 How It Works

### 1. CA Licensing Scraper

```javascript
// Searches CA CDSS database
searchFacilities()
  → Returns all licensed childcare centers in SF

// For each facility:
getFacilityDetails(licenseNumber)
  → Name, address, capacity, license dates

getInspectionHistory(licenseNumber)
  → Inspection scores, violations
```

### 2. Google Places Scraper

```javascript
// For each daycare from CA licensing:
searchPlace(name, address)
  → Find place_id on Google Maps

getPlaceDetails(place_id)
  → Reviews, ratings, photos, hours, contact
```

### 3. Yelp Scraper

```javascript
// For each daycare:
searchYelpBusiness(name, address)
  → Find business_id on Yelp

getYelpBusinessDetails(business_id)
  → Reviews, ratings, hours

getYelpReviews(business_id)
  → Up to 50 reviews
```

### 4. Master Merger

```javascript
// Merge strategy:
1. Use CA licensing as foundation (most authoritative)
2. Match Google/Yelp data by name + address fuzzy matching
3. Combine reviews from all sources
4. Calculate weighted average rating
5. Deduplicate photos
6. Prefer most recent operating hours
7. Preserve manually added data
```

## ⚙️ Configuration

### Rate Limiting

Built-in delays between requests:
- CA Licensing: 1000ms (1 second)
- Google Places: 200ms
- Yelp: 500ms

### Fuzzy Matching

Daycares are matched across sources using:
- Name similarity (removing punctuation, case-insensitive)
- Address matching (street number + street name)
- Geographic proximity (if coordinates available)

## 🛡️ Ethical Scraping

✅ **Respects robots.txt**
✅ **Rate limiting** to avoid server overload
✅ **User-Agent headers** identify our bot
✅ **Only public data** (nothing behind auth walls)
✅ **Caching** to minimize repeat requests
✅ **API-first approach** (official APIs when available)

## 🐛 Troubleshooting

### "API key not found"
- Check `.env` file exists in project root
- Ensure key names match exactly: `GOOGLE_PLACES_API_KEY`, `YELP_API_KEY`
- Try `console.log(process.env.GOOGLE_PLACES_API_KEY)` to verify

### "No facilities found"
- CA licensing API might be down
- Check if search URL changed: https://secure.dss.ca.gov/CareFacilitySearch/
- Use manual export option (see console output)

### "HTTP 403 Forbidden"
- API key might be invalid
- Check API quotas in Google Cloud Console
- Ensure APIs are enabled

### "Too many matches/No matches"
- Fuzzy matching might need tuning
- Check `findMatchingId()` function in master-scraper.mjs
- Manually review `data/scraped/` files

## 📝 Manual Data Entry

If scrapers can't find a daycare:

1. Add to `src/data/daycares.json` manually
2. Run `npm run scrape:all` to enrich with API data
3. Merger will preserve your manual data

## 🔄 Update Schedule

Recommended update frequency:
- **CA Licensing**: Monthly (licenses don't change often)
- **Google/Yelp**: Weekly (reviews update frequently)
- **Full rescrape**: Quarterly

## 📊 Expected Results

For San Francisco, you should get:
- **~200-300** licensed childcare centers from CA database
- **~60-80%** matched on Google Places
- **~40-60%** matched on Yelp
- **Total**: 200-300 enriched daycare listings

## 🚨 Rate Limits

### Google Places API
- **Free tier**: 28,000 requests/month
- **Our usage**: ~3 requests per daycare (search + details + reviews)
- **Can scrape**: ~9,000 daycares/month

### Yelp Fusion API
- **Free tier**: 5,000 requests/day
- **Our usage**: ~3 requests per daycare
- **Can scrape**: ~1,600 daycares/day

## 🎨 Next Steps

After scraping:

1. Review merged data: `src/data/daycares-merged.json`
2. Copy to main data file: `cp src/data/daycares-merged.json src/data/daycares.json`
3. Restart dev server to see updated data
4. Manually add missing fields (pricing, availability, descriptions)
5. Deploy updated data: `npm run deploy:railway`

## 💡 Tips

- **Start small**: Test with 5-10 daycares first
- **Check output**: Review scraped data before merging
- **Backup existing**: `cp src/data/daycares.json src/data/daycares.backup.json`
- **Monitor logs**: Watch for errors during scraping
- **Manual enrichment**: Some data (pricing, availability) may need manual research

## 📖 Further Reading

- [Google Places API Docs](https://developers.google.com/maps/documentation/places/web-service)
- [Yelp Fusion API Docs](https://www.yelp.com/developers/documentation/v3)
- [CA CDSS Facility Search](https://secure.dss.ca.gov/CareFacilitySearch/)

---

**Questions?** Check the console output - scrapers provide helpful error messages and manual fallback instructions.
