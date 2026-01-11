# SF Daycare List - Deployment Guide

## 🚀 Railway Deployment

### Prerequisites
- GitHub account
- Railway account (https://railway.app)
- Cloudflare DNS configured for sfdaycarelist.com

### Step 1: Create Railway Project

1. Go to https://railway.app and login
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account and select the SFDAYCARELIST repository
5. Railway will automatically detect the Node.js app

### Step 2: Add Postgres Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will create a database and provide `DATABASE_URL`
4. The `DATABASE_URL` is automatically added to your service's environment variables

### Step 3: Run Database Migration

Once deployed, you need to initialize the database:

```bash
# SSH into Railway service or use Railway CLI
railway run npm run db:setup
```

Or manually through Railway dashboard:
1. Go to your service
2. Click on "Deployments" → Select latest deployment
3. Click "View Logs"
4. In the service settings, add a one-time deployment command:
   - Build Command: `npm run build`
   - Start Command: `npm run db:setup && npm start` (first deploy only)
5. After first successful deployment, change back to:
   - Start Command: `npm start`

### Step 4: Set Environment Variables

In Railway project settings → Variables, add:

```env
# Required
NODE_ENV=production
DATABASE_URL=[automatically provided by Railway]
BASE_URL=https://sfdaycarelist.com

# Optional but recommended
STRIPE_SECRET_KEY=sk_live_...
TELEGRAM_BOT_TOKEN=...
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...

# Analytics (optional)
ENABLE_TELEGRAM_BOT=false
```

### Step 5: Configure Custom Domain

1. In Railway project → Settings → Networking
2. Click "Add Custom Domain"
3. Enter: `sfdaycarelist.com`
4. Railway will provide DNS records

5. Go to Cloudflare → DNS:
   ```
   Type: CNAME
   Name: @
   Target: [Railway provided domain].railway.app
   Proxy: Orange cloud (enabled)
   ```

6. Also add www subdomain:
   ```
   Type: CNAME
   Name: www
   Target: [Railway provided domain].railway.app
   Proxy: Orange cloud (enabled)
   ```

### Step 6: Verify Deployment

1. Check Railway logs for successful startup
2. Look for:
   ```
   ✅ Database connected
   ✅ Loaded 5 daycares (from database)
   🚀 SF Daycare List running on port 3001
   ```

3. Visit https://sfdaycarelist.com
4. Test API endpoints:
   - `https://sfdaycarelist.com/api/daycares`
   - `https://sfdaycarelist.com/api/neighborhoods`

## 🔄 Continuous Deployment

Railway automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update daycare data"
git push origin main
```

Railway will:
1. Pull latest code
2. Run `npm install`
3. Run `npm run build`
4. Restart server with `npm start`

## 📊 Database Management

### View Database

Use Railway's built-in PostgreSQL client:
1. Click on your Postgres service
2. Click "Query" tab
3. Run SQL queries directly

### Backup Database

```bash
# Using Railway CLI
railway run pg_dump $DATABASE_URL > backup.sql
```

### Update Data

To add/update daycares:

1. Update `data/daycares.json` or `data/neighborhoods.json`
2. Run seed script:
   ```bash
   railway run npm run db:seed
   ```

Or use SQL directly:
```sql
INSERT INTO daycares (...) VALUES (...);
```

### Reset Database (⚠️ Destructive)

```bash
# Drop all tables and recreate
railway run npm run db:migrate
railway run npm run db:seed
```

## 🐛 Troubleshooting

### Database Connection Errors

**Error**: "relation 'daycares' does not exist"

**Solution**: Run migrations
```bash
railway run npm run db:migrate
railway run npm run db:seed
```

### Build Failures

**Error**: "Module not found"

**Solution**: Clear build cache in Railway
1. Settings → Deployments
2. Click "Remove Build Cache"
3. Redeploy

### API Returns Empty Data

**Error**: API returns `{ daycares: [], total: 0 }`

**Solution**: Database not seeded
```bash
railway run npm run db:seed
```

## 📈 Monitoring

### Railway Metrics

Railway provides built-in monitoring:
- CPU usage
- Memory usage
- Request volume
- Response times

Access via: Project → Metrics tab

### Database Monitoring

Check database performance:
```sql
-- Active connections
SELECT count(*) FROM pg_stat_activity;

-- Database size
SELECT pg_size_pretty(pg_database_size('railway'));

-- Slow queries
SELECT query, calls, mean_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

## 🔐 Security

### Environment Variables

Never commit sensitive data:
- ✅ Use Railway environment variables
- ❌ Don't commit `.env` files
- ❌ Don't hardcode API keys

### Database

- Railway Postgres has SSL enabled by default
- Connection pooling is configured (max 20 connections)
- Prepared statements prevent SQL injection

### API Rate Limiting

Already configured in server.js:
- 100 requests per minute per IP
- Adjustable in code

## 💰 Costs

### Railway Pricing

**Hobby Plan** (Free):
- $5/month credit
- Good for testing

**Pro Plan** ($20/month):
- $20 credit included
- Pay for what you use
- Better performance

### Estimated Monthly Cost

For SF Daycare List (low traffic):
- Web service: ~$5-10/month
- Postgres database: ~$5/month
- **Total**: ~$10-15/month

## 📝 Next Steps

After deployment:

1. ✅ Test all pages load correctly
2. ✅ Verify database queries work
3. ✅ Test search and filters
4. ✅ Submit sitemap to Google Search Console
5. ✅ Set up monitoring/alerts
6. ✅ Add more daycares to database
7. ✅ Enable SSL certificate (automatic with Cloudflare)

## 🆘 Support

- Railway Docs: https://docs.railway.app
- Postgres Docs: https://www.postgresql.org/docs/
- Cloudflare Docs: https://developers.cloudflare.com/
