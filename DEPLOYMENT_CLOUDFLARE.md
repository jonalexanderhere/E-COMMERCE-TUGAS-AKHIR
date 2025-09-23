# JonsStore E-commerce - Cloudflare Deployment Guide

## 🚀 Deployment Options

JonsStore supports multiple deployment platforms:

1. **Vercel** (Recommended for Next.js)
2. **Cloudflare Pages** (With D1 Database)
3. **Netlify**
4. **Railway**

## 🌐 Cloudflare Pages + D1 Database Setup

### Prerequisites

- Cloudflare account
- Wrangler CLI installed
- Node.js 18+

### Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
wrangler login
```

### Step 2: Create D1 Database

```bash
# Create D1 database
wrangler d1 create jonsstore-db

# Note the database_id from the output and update wrangler.toml
```

### Step 3: Update Configuration

1. Update `wrangler.toml` with your database ID:
```toml
[[d1_databases]]
binding = "DB"
database_name = "jonsstore-db"
database_id = "your-actual-database-id"
```

2. Create environment variables in Cloudflare Dashboard:
   - `NEXT_PUBLIC_APP_URL`: Your domain URL
   - `NEXT_PUBLIC_DATABASE_TYPE`: "d1"

### Step 4: Deploy Database Schema

```bash
# Deploy schema to production
wrangler d1 execute jonsstore-db --file=./d1-schema.sql

# For local development
wrangler d1 execute jonsstore-db --local --file=./d1-schema.sql
```

### Step 5: Deploy to Cloudflare Pages

1. **Via Git Integration:**
   - Connect your GitHub repository to Cloudflare Pages
   - Set build command: `npm run build`
   - Set build output directory: `out`
   - Add environment variables in Pages settings

2. **Via Wrangler CLI:**
```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy out
```

### Step 6: Create Admin User

After deployment, create an admin user:

```bash
# Connect to your D1 database
wrangler d1 execute jonsstore-db --command="INSERT INTO user_profiles (id, full_name, role) VALUES ('admin-user-id', 'Admin User', 'admin');"
```

## 🔧 Environment Variables

### Required Variables

```env
# Database Configuration
NEXT_PUBLIC_DATABASE_TYPE=d1
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional: Supabase (if using hybrid setup)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Cloudflare Pages Environment Variables

In Cloudflare Pages Dashboard:
1. Go to Settings → Environment Variables
2. Add the following variables:
   - `NEXT_PUBLIC_DATABASE_TYPE`: `d1`
   - `NEXT_PUBLIC_APP_URL`: `https://your-domain.com`

## 📊 Database Management

### Backup Database

```bash
# Export database
wrangler d1 export jonsstore-db --output=backup.sql
```

### Query Database

```bash
# Run custom queries
wrangler d1 execute jonsstore-db --command="SELECT COUNT(*) FROM products;"
```

### Local Development

```bash
# Start local development server
wrangler pages dev

# Use local D1 database
wrangler d1 execute jonsstore-db --local --command="SELECT * FROM products LIMIT 5;"
```

## 🔐 Admin Access

### Create Admin User

1. **Via Database Query:**
```sql
INSERT INTO user_profiles (id, full_name, role) 
VALUES ('your-admin-user-id', 'Admin User', 'admin');
```

2. **Via Authentication System:**
   - Create user account with email: `admin@jonsstore.com`
   - Password: `admin123456`
   - Update user profile to admin role

### Admin Credentials

- **Email:** `admin@jonsstore.com`
- **Password:** `admin123456`
- **Access:** `/admin` dashboard

## 🚀 Performance Optimization

### Cloudflare Features

1. **Auto Minification:** Enabled by default
2. **Brotli Compression:** Automatic
3. **HTTP/3:** Enabled
4. **Global CDN:** Automatic
5. **DDoS Protection:** Built-in

### Database Optimization

1. **Indexes:** Already created in schema
2. **Connection Pooling:** Automatic with D1
3. **Caching:** Use Cloudflare KV for caching

## 📈 Monitoring

### Analytics

- Cloudflare Analytics (built-in)
- Real User Monitoring (RUM)
- Core Web Vitals tracking

### Error Tracking

- Cloudflare Error Pages
- Custom error handling in Workers

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: jonsstore-ecommerce
          directory: out
```

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Errors:**
   - Check database ID in wrangler.toml
   - Verify D1 database exists
   - Check binding name matches

2. **Build Failures:**
   - Ensure all dependencies are installed
   - Check Node.js version compatibility
   - Verify environment variables

3. **Admin Access Issues:**
   - Verify admin user exists in database
   - Check user role is set to 'admin'
   - Ensure authentication is working

### Support

- Cloudflare Documentation: https://developers.cloudflare.com/
- D1 Documentation: https://developers.cloudflare.com/d1/
- Pages Documentation: https://developers.cloudflare.com/pages/

## 📋 Checklist

- [ ] D1 database created
- [ ] Schema deployed
- [ ] Environment variables set
- [ ] Admin user created
- [ ] Domain configured (optional)
- [ ] SSL certificate active
- [ ] Analytics enabled
- [ ] Backup strategy implemented

## 🎯 Production Readiness

Your JonsStore is production-ready when:

- ✅ All 100+ products loaded
- ✅ Admin panel accessible
- ✅ User authentication working
- ✅ Cart functionality operational
- ✅ Order system functional
- ✅ Database optimized
- ✅ CDN configured
- ✅ Monitoring active
- ✅ Backup system in place
- ✅ Security measures implemented

**Congratulations! Your JonsStore is ready for production! 🎉**
