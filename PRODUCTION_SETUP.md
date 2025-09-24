# 🚀 Production Setup - Complete E-Commerce Store

## 📋 Prerequisites

### 1. **Supabase Project**
- ✅ Create project at [supabase.com](https://supabase.com)
- ✅ Get API keys from Settings > API
- ✅ Enable Row Level Security (RLS)

### 2. **Environment Variables**
Create `.env.local` file:

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
```

## 🗄️ Database Setup

### 1. **Run Production Schema**
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy `schema-production-final.sql` content
4. Paste and click "Run"

### 2. **Verify Setup**
After running schema, verify:

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

## 🔐 Admin User Setup

### **Admin Credentials**
- **Email**: `admin@jonsstore.com`
- **Password**: `admin123456`
- **Role**: `admin`

### **Admin Features**
- ✅ Complete dashboard
- ✅ Product management
- ✅ Order tracking
- ✅ User management
- ✅ Analytics

## 🚀 Application Setup

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Test Database Connection**
```bash
npm run test:connection
```

### 3. **Start Development**
```bash
npm run dev
```

### 4. **Test All Routes**
- **Homepage**: `http://localhost:3000`
- **Products**: `http://localhost:3000/products`
- **Categories**: `http://localhost:3000/categories`
- **Admin**: `http://localhost:3000/admin`

## 📊 Database Contents

### **Categories (6)**
- Electronics
- Fashion
- Home & Living
- Sports & Fitness
- Books & Media
- Beauty & Health

### **Products (14)**
- iPhone 15 Pro (Electronics)
- MacBook Air M2 (Electronics)
- Sony WH-1000XM5 (Electronics)
- Nike Air Max 270 (Fashion)
- Levi's 501 Jeans (Fashion)
- Adidas Originals T-Shirt (Fashion)
- IKEA Billy Bookcase (Home & Living)
- Philips Hue Smart Bulb (Home & Living)
- KitchenAid Stand Mixer (Home & Living)
- Yoga Mat Premium (Sports & Fitness)
- Dumbbell Set 20kg (Sports & Fitness)
- Resistance Bands Set (Sports & Fitness)
- The Psychology of Money (Books & Media)
- Kindle Paperwhite (Books & Media)

### **Coupons (3)**
- WELCOME10 (10% off, min 100K)
- SAVE50K (50K off, min 500K)
- FREESHIP (Free shipping)

### **Site Settings (7)**
- Site name, description, currency, contact info

## 🔧 Features

### **Customer Features**
- ✅ Product browsing
- ✅ Category filtering
- ✅ Search functionality
- ✅ Shopping cart
- ✅ User accounts
- ✅ Order tracking
- ✅ Wishlist
- ✅ Product reviews

### **Admin Features**
- ✅ Dashboard analytics
- ✅ Product management
- ✅ Order management
- ✅ User management
- ✅ Category management
- ✅ Coupon management
- ✅ Site settings

## 🚀 Production Deployment

### 1. **Vercel Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard
```

### 2. **Environment Variables in Production**
Set these in Vercel dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 3. **Domain Configuration**
Update Supabase settings:
- Go to Authentication > URL Configuration
- Add your production domain to allowed origins
- Update redirect URLs

## 🔒 Security Features

### **Row Level Security (RLS)**
- Users can only see their own data
- Admins have full access
- Secure data isolation
- No data leaks

### **Authentication**
- Secure login system
- Session management
- Role-based permissions
- Password protection

### **Data Protection**
- Encrypted connections
- Secure API endpoints
- Input validation
- SQL injection protection

## 📱 Mobile Responsive

### **Admin Dashboard**
- Mobile-friendly interface
- Touch-optimized controls
- Responsive design
- Works on all devices

### **Customer Site**
- Mobile-first design
- Touch-friendly navigation
- Fast loading
- Offline support

## 🎯 Testing Checklist

### **Database Setup**
- [ ] All tables created
- [ ] Sample data inserted
- [ ] Admin user configured
- [ ] RLS policies active

### **Application Testing**
- [ ] Homepage loads correctly
- [ ] Categories display
- [ ] Products load
- [ ] Search works
- [ ] Filtering works
- [ ] Admin login works
- [ ] Admin dashboard loads

### **Production Ready**
- [ ] All routes work
- [ ] Database integration complete
- [ ] Error handling robust
- [ ] Mobile responsive
- [ ] Security measures active

## 🎉 Success Indicators

After setup, you should see:

### ✅ **Homepage**
- Categories display correctly
- Featured products show
- No error messages
- Fast loading

### ✅ **Products Page**
- All products load
- Filtering works
- Search functions
- Pagination works

### ✅ **Admin Panel**
- Login successful
- Dashboard loads
- All features work
- Data displays correctly

### ✅ **Database**
- All tables created
- Sample data inserted
- Admin user configured
- RLS policies active

## 🚀 Ready for Production!

Your e-commerce application is now:
- ✅ **Fully functional** with database integration
- ✅ **Admin ready** with proper credentials
- ✅ **Production safe** with security measures
- ✅ **Mobile responsive** for all devices
- ✅ **Scalable** for future growth

## 📞 Support

If you encounter any issues:

1. **Check Supabase logs** in dashboard
2. **Verify environment variables** in .env.local
3. **Test database connection** with test-connection.js
4. **Check browser console** for error messages
5. **Verify RLS policies** in Supabase dashboard

**Admin Login**: `admin@jonsstore.com` / `admin123456`

**Repository**: https://github.com/jonalexanderhere/E-COMMERCE-TUGAS-AKHIR.git
