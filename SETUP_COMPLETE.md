# 🚀 Setup Lengkap E-Commerce Store

## 📋 Prerequisites

### 1. Supabase Project
- ✅ Buat project di [supabase.com](https://supabase.com)
- ✅ Dapatkan URL dan API keys dari Settings > API
- ✅ Enable Row Level Security (RLS)

### 2. Environment Variables
Buat file `.env.local` di root project:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database URLs (Optional)
POSTGRES_URL=postgres://postgres:[password]@db.[project-id].supabase.co:5432/postgres
POSTGRES_USER=postgres
POSTGRES_HOST=db.[project-id].supabase.co
POSTGRES_PASSWORD=your-database-password
POSTGRES_DATABASE=postgres
POSTGRES_URL_NON_POOLING=postgres://postgres:[password]@db.[project-id].supabase.co:5432/postgres
POSTGRES_PRISMA_URL=postgres://postgres:[password]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
```

## 🗄️ Database Setup

### 1. Jalankan Schema di Supabase SQL Editor

Copy dan paste `schema-production.sql` ke Supabase SQL Editor, lalu klik "Run".

### 2. Verifikasi Setup

Setelah menjalankan schema, verifikasi:

```sql
-- Check tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check categories
SELECT * FROM categories;

-- Check products
SELECT * FROM products LIMIT 5;

-- Check admin user
SELECT * FROM user_profiles WHERE role = 'admin';
```

## 🔧 Application Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Pastikan file `.env.local` sudah benar:

```bash
# Check environment variables
npm run dev
```

### 3. Test Database Connection

Buat file `test-connection.js`:

```javascript
// test-connection.js
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .limit(1)
    
    if (catError) {
      console.error('Categories error:', catError)
    } else {
      console.log('✅ Categories connection successful')
    }
    
    // Test products
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('*')
      .limit(1)
    
    if (prodError) {
      console.error('Products error:', prodError)
    } else {
      console.log('✅ Products connection successful')
    }
    
    console.log('🎉 Database connection test completed!')
    
  } catch (error) {
    console.error('❌ Connection failed:', error)
  }
}

testConnection()
```

Jalankan test:

```bash
node test-connection.js
```

## 🚀 Development

### 1. Start Development Server

```bash
npm run dev
```

### 2. Test Application

1. **Homepage** - `http://localhost:3000`
   - ✅ Categories should load
   - ✅ Featured products should display
   - ✅ No error messages

2. **Products Page** - `http://localhost:3000/products`
   - ✅ All products should load
   - ✅ Filtering should work
   - ✅ Search should work

3. **Categories Page** - `http://localhost:3000/categories`
   - ✅ All categories should display
   - ✅ Category links should work

4. **Admin Dashboard** - `http://localhost:3000/admin`
   - ✅ Login with admin credentials
   - ✅ Dashboard should load
   - ✅ Product management should work

## 🔐 Admin Setup

### 1. Create Admin User

Jika belum ada admin user, jalankan SQL ini:

```sql
-- Insert admin user profile
INSERT INTO user_profiles (id, full_name, role, is_active)
VALUES ('d6345ce2-bbb6-4cdc-94b6-3857c845e095', 'Admin User', 'admin', true)
ON CONFLICT (id) DO UPDATE SET 
  role = 'admin',
  is_active = true;
```

### 2. Admin Credentials

- **Email**: `admin@jonsstore.com`
- **Password**: `admin123456`
- **Role**: `admin`

## 🐛 Troubleshooting

### 1. "Failed to fetch categories" Error

**Penyebab**: Database belum di-setup atau connection error

**Solusi**:
```bash
# 1. Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# 2. Run schema in Supabase SQL Editor
# 3. Check Supabase project settings
# 4. Verify RLS policies are enabled
```

### 2. Build Errors

**Penyebab**: TypeScript errors atau missing dependencies

**Solusi**:
```bash
# Install dependencies
npm install

# Check for TypeScript errors
npm run build

# Fix any type errors
npm run dev
```

### 3. Database Connection Issues

**Penyebab**: Wrong credentials atau network issues

**Solusi**:
```bash
# 1. Verify Supabase project is active
# 2. Check API keys in Supabase dashboard
# 3. Ensure RLS is enabled
# 4. Test connection with test-connection.js
```

## 📊 Database Schema

### Tables Created:
- ✅ `categories` - Product categories
- ✅ `products` - Product catalog
- ✅ `cart_items` - Shopping cart
- ✅ `orders` - Order management
- ✅ `order_items` - Order details
- ✅ `user_profiles` - User information
- ✅ `user_addresses` - User addresses
- ✅ `coupons` - Discount codes
- ✅ `wishlist` - User wishlist
- ✅ `product_reviews` - Product reviews
- ✅ `notifications` - User notifications
- ✅ `site_settings` - Site configuration

### Sample Data:
- ✅ **6 Categories** - Electronics, Fashion, Home & Living, Sports & Fitness, Books & Media, Beauty & Health
- ✅ **14 Products** - iPhone, MacBook, Nike shoes, etc.
- ✅ **3 Coupons** - Welcome discount, Save 50K, Free shipping
- ✅ **Site Settings** - Configuration for production

## 🚀 Production Deployment

### 1. Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard
```

### 2. Environment Variables in Production

Set these in Vercel dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 3. Domain Configuration

Update Supabase settings:
- Go to Authentication > URL Configuration
- Add your production domain to allowed origins
- Update redirect URLs

## ✅ Verification Checklist

### Database Setup:
- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Schema executed successfully
- [ ] Tables created (12 tables)
- [ ] Sample data inserted
- [ ] RLS policies enabled
- [ ] Admin user created

### Application Setup:
- [ ] Dependencies installed
- [ ] Environment variables loaded
- [ ] Database connection working
- [ ] Categories loading
- [ ] Products loading
- [ ] Admin dashboard accessible
- [ ] Build successful

### Production Ready:
- [ ] All pages working
- [ ] Database queries optimized
- [ ] Error handling implemented
- [ ] Fallback data available
- [ ] TypeScript errors resolved
- [ ] Build successful
- [ ] Ready for deployment

## 🎯 Next Steps

1. **Run schema** di Supabase SQL Editor
2. **Test connection** dengan test-connection.js
3. **Start development** dengan `npm run dev`
4. **Test all pages** untuk memastikan functionality
5. **Deploy to production** dengan Vercel
6. **Monitor performance** dan optimize

## 📞 Support

Jika masih ada masalah:

1. **Check Supabase logs** di dashboard
2. **Verify environment variables** di .env.local
3. **Test database connection** dengan test-connection.js
4. **Check browser console** untuk error messages
5. **Verify RLS policies** di Supabase dashboard

**Setup lengkap siap untuk production deployment! 🚀**
