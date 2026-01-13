# Download Official Daycare Data (CSV) - No Scraping Needed!

Based on your research, here are the **official sources** where you can download CSV files directly. No web scraping or browser automation required!

---

## 🏆 Best Option: CDSS Data Portal (Official CA Government Data)

### Step 1: Download from CDSS Transparency Portal

**URL:** https://www.cdss.ca.gov/inforesources/data-portal

**What to do:**
1. Visit the CDSS Data Portal
2. Look for "Community Care Licensing" or "Child Care Facilities"
3. Filter by:
   - County: **San Francisco**
   - Facility Type: **Child Care Center** and **Family Child Care Home**
   - Status: **Licensed**
4. Click "Export" or "Download CSV"
5. Save as: `src/data/daycares.csv`

**Alternative CDSS URLs:**
- Main licensing search: https://www.cdss.ca.gov/inforesources/community-care-licensing/facility-search-welcome
- Data downloads: https://www.cdss.ca.gov/inforesources/data-portal

---

## 📊 Alternative: DataSF (San Francisco Open Data)

### Step 2: Download from DataSF Portal

**URL:** https://data.sfgov.org

**Search terms to try:**
- "child care"
- "daycare"
- "early childhood"
- "preschool"

**Direct dataset URLs (if available):**
- Child Care Centers: https://data.sfgov.org/api/views/y8fp-fbf5/rows.csv?accessType=DOWNLOAD
- Early Learning Programs: Search for "SF Department of Early Childhood"

**What to do:**
1. Visit DataSF
2. Search for child care datasets
3. Download as CSV
4. Save as: `src/data/daycares.csv`

---

## 📞 Contact for Data Export

If CSV downloads aren't available directly, contact these organizations for bulk data:

### Children's Council of San Francisco
- **Website:** https://www.childrenscouncil.org
- **Email:** Contact via their website form
- **Request:** "CSV export of licensed SF daycare providers for directory website"

### SF Department of Early Childhood
- **Website:** https://sfdec.org/contact-us/
- **Request:** List of licensed facilities participating in city programs

### Wu Yee Children's Services
- **Website:** https://wuyee.org
- **Note:** They maintain a searchable database - may provide bulk export

---

## 🚀 After You Download the CSV

### Run the Import Script

Once you have `src/data/daycares.csv`, run:

```bash
npm run import:csv
```

**This script will:**
1. ✅ Parse the CSV (auto-detects CDSS, DataSF, or Children's Council format)
2. ✅ Transform to your JSON schema
3. ✅ Merge with your existing 5 daycares
4. ✅ Remove duplicates
5. ✅ Enrich EVERYTHING with Google Places (reviews, ratings, photos, hours)
6. ✅ Save final dataset to `src/data/daycares-imported.json`

### Expected Output

```
📊 Import Daycare Data from CSV

📂 Loading existing daycares...
✅ Loaded 5 existing daycares

📥 Parsing CSV file...
✅ Found 247 rows in CSV

🔍 Detected format: CDSS

🔄 Transforming CSV to JSON...
  ✅ Added: ABC Learning Center
  ✅ Added: Bright Horizons
  ...

📊 Import Results:
   Total CSV rows: 247
   Valid daycares: 242
   Duplicates skipped: 5
   Final count: 247

📍 GOOGLE PLACES ENRICHMENT
🔍 Enriching 247 daycares...
  ✅ ABC Learning Center - Rating: 4.8★ (23 reviews)
  ...

✨ Import complete!

📊 FINAL SUMMARY
Total daycares: 247
With licensing data: 242
With Google data: 234
With reviews: 234
With photos: 189
```

### Deploy to Production

```bash
# 1. Review the imported data
cat src/data/daycares-imported.json

# 2. If looks good, copy to production
cp src/data/daycares-imported.json src/data/daycares.json

# 3. Commit and deploy
git add -A
git commit -m "Add complete SF daycare dataset (250+ facilities)"
railway up --detach
```

---

## 📋 CSV Format Examples

The import script handles multiple formats. Here's what it expects:

### CDSS Format
```csv
Facility Name,Facility Address,Facility City,Facility Zip,Facility Telephone Number,Facility Number,Facility Type,Facility Status,Facility Capacity
Little Stars Preschool,123 Market St,San Francisco,94102,(415) 555-1234,123456789,Child Care Center,Licensed,50
```

### DataSF Format
```csv
site_name,site_address,city,zip_code,phone_number
Sunshine Academy,456 Valencia St,San Francisco,94110,(415) 555-5678
```

### Children's Council Format
```csv
Provider Name,Address,Phone Number,Languages Spoken,Ages Served,Description
Rainbow Kids,789 Mission St,(415) 555-9012,"English, Spanish",Infants - Preschool,Nurturing environment...
```

**The script auto-detects the format!** Just save any CSV as `src/data/daycares.csv` and run the import.

---

## 🎯 Recommended Workflow

**For the most complete dataset:**

1. **Start with CDSS** (official licensing data)
   - Download CSV from CDSS Data Portal
   - Save as `src/data/daycares.csv`
   - Run: `npm run import:csv`

2. **Add DataSF** (city programs)
   - Download additional CSV from DataSF
   - Append to existing CSV OR save separately and run import again
   - Script will remove duplicates automatically

3. **Enrich with Google** (automatic)
   - Import script automatically enriches with Google Places
   - Adds reviews, ratings, photos, hours

4. **Review and Deploy**
   - Check `daycares-imported.json`
   - Copy to `daycares.json`
   - Deploy to Railway

---

## 💡 Pro Tips

1. **Combine multiple sources:** Download CSVs from multiple sources, combine them (just copy/paste rows), and run the import once. The script handles duplicates.

2. **Regular updates:** Run this monthly to get fresh data:
   ```bash
   # Download fresh CSV from CDSS
   npm run import:csv
   cp src/data/daycares-imported.json src/data/daycares.json
   git add -A && git commit -m "Monthly data update" && railway up --detach
   ```

3. **Verify before deploying:** Always review `daycares-imported.json` before copying to production

4. **Google API limits:** Free tier = 28,000 requests/month. With 250 daycares × 2 API calls each = 500 requests. You're well within limits!

---

## 🔍 Finding the Download Links

If you can't find the direct CSV download:

1. **CDSS:** Call (916) 651-9384 (Community Care Licensing Division) and ask for "bulk facility data export for San Francisco child care centers"

2. **DataSF:** Email datasf@sfgov.org with your request

3. **Use the Catalog:** Visit https://catalog.data.gov and search "California child care"

---

## ✅ Next Steps

1. Visit CDSS Data Portal or DataSF
2. Download CSV file
3. Save as `src/data/daycares.csv`
4. Run `npm run import:csv`
5. Review output
6. Deploy!

You'll have a complete, official, Google-enriched dataset of every licensed daycare in San Francisco! 🎉
