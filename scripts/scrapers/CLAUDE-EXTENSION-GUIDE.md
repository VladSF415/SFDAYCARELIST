# Using Claude Browser Extension to Scrape Daycare Data

This guide shows how to use the Claude browser extension (with Haiku 4.5) to scrape all San Francisco daycares, then merge and enrich the data.

## Step 1: Scrape CA CDSS Database (Official Licensing Data)

### URL to Visit
https://secure.dss.ca.gov/CareFacilitySearch/

### Prompt for Claude Extension

```
Search for all licensed "Child Care Centers" in San Francisco, CA.

Paginate through ALL results and extract into a JSON array with this schema:

[
  {
    "name": "Facility Name",
    "address": "Full street address",
    "phone": "Phone number",
    "license_number": "License #",
    "license_type": "License Type",
    "license_status": "Licensed/Provisional/etc",
    "capacity": 50,
    "zip": "94102"
  }
]

Make sure to:
1. Search with these filters:
   - Facility Type: "Child Care Center"
   - City: "San Francisco"
   - County: "San Francisco"
   - Status: "Licensed"

2. Paginate through ALL pages of results

3. Download the results as a JSON file
```

### Where to Save
Save the JSON file to:
```
src/data/daycares-scraped.json
```

---

## Step 2: (Optional) Scrape Additional Sources

### Winnie - Parent Reviews & Photos
**URL:** https://winnie.com/search?location=San%20Francisco%2C%20CA

**Prompt:**
```
Extract all San Francisco daycares from this page.

For each, get:
- Name
- Address
- Description
- Rating
- Reviews (author, text, date)
- Photos

Save as JSON array.
```

### Care.com - Pricing & Availability
**URL:** https://www.care.com/day-care/san-francisco-ca

**Prompt:**
```
Extract all daycares with their:
- Name
- Address
- Pricing information
- Availability status

Save as JSON array.
```

### How to Merge Multiple Sources
If you scraped from multiple sites, merge them all into one file:
```json
[
  ...ca_cdss_results,
  ...winnie_results,
  ...care_com_results
]
```

Save as: `src/data/daycares-scraped.json`

---

## Step 3: Run Merge & Enrich Script

This script will:
1. Load your existing 5 daycares
2. Load the scraped data from Claude extension
3. Merge them (removing duplicates)
4. Enrich EVERYTHING with Google Places data (reviews, ratings, photos, hours)
5. Save the final dataset

### Run the script:

```bash
node scripts/scrapers/merge-and-enrich.mjs
```

### Expected Output:

```
🔄 Merge & Enrich Daycare Data

📂 Step 1: Loading existing daycares...
✅ Loaded 5 existing daycares

📥 Step 2: Loading scraped data from Claude extension...
✅ Loaded 247 scraped daycares

🔀 Step 3: Merging and deduplicating...
  ✅ Added: ABC Learning Center
  ✅ Added: Bright Horizons
  ⏭️  Skip duplicate: Little Stars Preschool
  ...

📊 Merge Results:
   Total: 250 daycares
   Added: 245 new
   Skipped: 2 duplicates

📍 Step 4: GOOGLE PLACES ENRICHMENT
🔍 Enriching 250 daycares with Google Places...
  ✅ ABC Learning Center - Rating: 4.8★ (23 reviews)
  ✅ Bright Horizons - Rating: 4.6★ (45 reviews)
  ...

✨ Merge & enrichment complete!

📊 FINAL SUMMARY
Total daycares: 250
With licensing data: 247
With Google data: 234
With reviews: 234
With photos: 189
Verified: 234
```

---

## Step 4: Review & Deploy

### Review the merged data:
```bash
# Check the output file
cat src/data/daycares-merged.json
```

### If it looks good, copy to production:
```bash
cp src/data/daycares-merged.json src/data/daycares.json
```

### Commit and deploy:
```bash
git add -A
git commit -m "Add complete SF daycare dataset (250+ daycares)"
git push
railway up --detach
```

---

## Expected JSON Schema from Claude Extension

The merge script is flexible and accepts various formats. Here are examples:

### Minimal Format (CA CDSS)
```json
[
  {
    "Facility Name": "Little Stars Preschool",
    "Address": "123 Market St",
    "Phone": "(415) 555-1234",
    "License Number": "123456789",
    "License Type": "Child Care Center",
    "Capacity": 50
  }
]
```

### Extended Format (with more details)
```json
[
  {
    "name": "Little Stars Preschool",
    "address": "123 Market St, San Francisco, CA 94102",
    "phone": "(415) 555-1234",
    "email": "info@littlestars.com",
    "website": "https://littlestars.com",
    "license_number": "123456789",
    "license_type": "Child Care Center",
    "license_status": "Licensed",
    "capacity": 50,
    "description": "A nurturing environment for children...",
    "age_groups": ["Infants", "Toddlers", "Preschool"],
    "curriculum": "Montessori-inspired",
    "rating": 4.5,
    "reviews": [
      {
        "author": "Parent Name",
        "text": "Great school!",
        "rating": 5,
        "date": "2024-01-15"
      }
    ]
  }
]
```

The script will automatically transform any format to match our schema.

---

## Troubleshooting

### "No scraped data found"
- Make sure you saved the JSON file to: `src/data/daycares-scraped.json`
- Check the file exists: `ls -la src/data/`

### "Skipped X duplicates"
- This is normal! The script removes duplicates by comparing names and addresses
- Existing daycares are preserved

### "No Google match"
- Some daycares might not be on Google Maps (home-based, new businesses)
- They'll still be included in the dataset, just without Google reviews

### Google API errors
- Check your API key is set in `.env`
- Verify API key has Places API enabled
- Check you haven't exceeded quota (28,000 requests/month free)

---

## Tips for Best Results

1. **Start with CA CDSS** - This is the most comprehensive official source
2. **Let Google enrich it** - Our script adds reviews, ratings, photos automatically
3. **Review before deploying** - Check `daycares-merged.json` first
4. **Update regularly** - Run monthly to get fresh reviews and new facilities

---

## Quick Reference

```bash
# Full workflow
1. Use Claude extension → scrape CA CDSS → save to src/data/daycares-scraped.json
2. node scripts/scrapers/merge-and-enrich.mjs
3. cp src/data/daycares-merged.json src/data/daycares.json
4. git add -A && git commit -m "Update dataset" && railway up --detach
```
