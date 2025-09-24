# 🚀 Complete Supabase Setup Guide

This guide will help you set up your e-commerce application with Supabase database, admin user, and sample data.

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase project created
- Environment variables configured

## 🔧 Environment Setup

Your environment variables are already configured in `env.local`:

```bash
# Supabase Configuration
POSTGRES_URL="postgres://postgres.tjwurzmwkrfaxozhdcfj:hHleYcO7k9hg2RPl@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"
SUPABASE_URL="https://tjwurzmwkrfaxozhdcfj.supabase.co"
NEXT_PUBLIC_SUPABASE_URL="https://tjwurzmwkrfaxozhdcfj.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqd3Vyem13a3JmYXhvemhkY2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NzQ0MzQsImV4cCI6MjA3NDI1MDQzNH0.Ujw604JqvYs1zRE384sa_jwopRf_IDppixMU7_lONYg"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqd3Vyem13a3JmYXhvemhkY2ZqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODY3NDQzNCwiZXhwIjoyMDc0MjUwNDM0fQ.OOl9lSHloDpCRW6IBQ9CR1lPFsO06zPRAlc66Y9UmAs"
```

## 🗄️ Database Setup

### Method 1: Automatic Setup (Recommended)

1. **Copy the environment file:**
   ```bash
   cp env.local .env.local
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the setup script:**
   ```bash
   node setup-supabase.js
   ```

### Method 2: Manual Setup

1. **Go to your Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project: `tjwurzmwkrfaxozhdcfj`

2. **Open SQL Editor:**
   - Navigate to SQL Editor in the left sidebar
   - Click "New Query"

3. **Execute the Schema:**
   - Copy the entire contents of `supabase-schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

4. **Verify Setup:**
   - Check that tables are created in the Table Editor
   - Verify products and categories are populated

## 👤 Admin User Setup

The admin user is automatically created with the following credentials:

- **Email:** `admin@jonsstore.com`
- **Password:** `admin123456`
- **Role:** `admin`

### Manual Admin Creation (if needed)

If the automatic creation fails, you can create the admin user manually:

1. **Go to Authentication > Users in Supabase Dashboard**
2. **Click "Add User"**
3. **Fill in the details:**
   - Email: `admin@jonsstore.com`
   - Password: `admin123456`
   - Auto Confirm User: ✅ (checked)

4. **Set Admin Role:**
   Run this SQL in the SQL Editor:
   ```sql
   UPDATE user_profiles 
   SET role = 'admin' 
   WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@jonsstore.com');
   ```

## 🚀 Start the Application

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - Visit: http://localhost:3000

## 🔐 Login as Admin

1. **Go to login page:**
   - Visit: http://localhost:3000/auth/login

2. **Enter admin credentials:**
   - Email: `admin@jonsstore.com`
   - Password: `admin123456`

3. **Access admin dashboard:**
   - Visit: http://localhost:3000/admin

## 📊 What's Included

### 🛍️ Products (100+ items)
- **Electronics:** iPhones, MacBooks, Samsung phones, headphones, gaming consoles
- **Fashion:** Nike, Adidas, Supreme, designer clothing and shoes
- **Home & Living:** Dyson vacuums, KitchenAid mixers, IKEA furniture
- **Sports & Fitness:** Peloton bikes, gym equipment, athletic wear
- **Books & Media:** Best-selling books and digital content
- **Beauty & Health:** Premium skincare and beauty products

### 🏷️ Categories
- Electronics
- Fashion
- Home & Living
- Sports & Fitness
- Books & Media
- Beauty & Health

### 🎯 Featured Products
- iPhone 16 Pro Max
- MacBook Pro M3
- Samsung Galaxy S24 Ultra
- Nike Air Jordan 1
- Adidas Yeezy Boost 350
- Supreme Box Logo Hoodie
- Dyson V15 Detect Absolute
- KitchenAid Artisan Stand Mixer
- IKEA PAX Wardrobe System

### 🎫 Coupons
- `WELCOME10` - 10% off for new customers
- `SAVE50K` - Fixed discount of 50,000 IDR
- `FREESHIP` - Free shipping on orders over 500K

### ⚙️ Site Settings
- Site name and description
- Currency (IDR)
- Tax rate (10%)
- Shipping rates
- Contact information
- Maintenance mode toggle

## 🔧 Admin Features

### 📦 Product Management
- Add, edit, delete products
- Manage categories
- Set featured products
- Track inventory
- Upload product images

### 📋 Order Management
- View all orders
- Update order status
- Track shipping
- Process refunds
- Generate reports

### 👥 User Management
- View user profiles
- Manage user roles
- Handle user addresses
- Monitor user activity

### ⚙️ Site Configuration
- Update site settings
- Manage coupons
- Configure shipping
- Set maintenance mode

## 🛠️ Troubleshooting

### Common Issues

1. **Environment variables not loading:**
   ```bash
   # Make sure the file is named .env.local (not env.local)
   cp env.local .env.local
   ```

2. **Database connection failed:**
   - Check your Supabase URL and keys
   - Verify your project is active
   - Check your internet connection

3. **Admin user not created:**
   - Run the manual admin creation steps
   - Check the SQL Editor for errors
   - Verify the service role key is correct

4. **Products not showing:**
   - Check if the schema was executed successfully
   - Verify RLS policies are set correctly
   - Check browser console for errors

### Getting Help

1. **Check Supabase Dashboard:**
   - Go to your project dashboard
   - Check the Logs section for errors
   - Verify tables are created correctly

2. **Test Database Connection:**
   ```bash
   # Test with a simple query
   node -e "
   const { createClient } = require('@supabase/supabase-js');
   const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
   supabase.from('products').select('count').then(console.log);
   "
   ```

3. **Check Application Logs:**
   - Open browser developer tools
   - Check Console tab for errors
   - Check Network tab for failed requests

## 🎉 Success!

Once everything is set up, you should have:

✅ **Complete e-commerce application**  
✅ **Admin dashboard with full functionality**  
✅ **100+ sample products across 6 categories**  
✅ **User authentication and authorization**  
✅ **Shopping cart and checkout system**  
✅ **Order management system**  
✅ **Coupon and discount system**  
✅ **Product reviews and ratings**  
✅ **Wishlist functionality**  
✅ **Notification system**  
✅ **Site settings management**  

Your e-commerce store is now ready for development and testing!

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the Supabase documentation
3. Check the application logs
4. Verify all environment variables are set correctly

Happy coding! 🚀
