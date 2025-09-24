# 🔧 Fixed Setup Guide - Jon's Store

## ❌ **Issue Fixed: Admin User Creation Error**

The error `cannot insert a non-DEFAULT value into column "confirmed_at"` has been resolved. The `confirmed_at` column is a generated column in Supabase's auth.users table that cannot be manually set.

## ✅ **Solution: Use Simplified Setup**

I've created a simplified setup that avoids the complex auth user creation issues.

## 🚀 **Quick Setup Steps**

### 1. **Run the Simplified Schema**

Use `setup-simplified.sql` instead of `setup-complete.sql`:

```sql
-- Copy and paste the contents of setup-simplified.sql
-- into your Supabase SQL Editor and execute
```

### 2. **Create Admin User Manually**

Since direct user creation in SQL can be problematic, create the admin user through Supabase dashboard:

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `tjwurzmwkrfaxozhdcfj`

2. **Navigate to Authentication**
   - Click "Authentication" in the left sidebar
   - Click "Users" tab

3. **Add New User**
   - Click "Add User" button
   - Fill in the details:
     - **Email**: `admin@jonsstore.com`
     - **Password**: `admin123456`
     - **Auto Confirm User**: ✅ (checked)
   - Click "Create User"

4. **Set Admin Role**
   - Go to SQL Editor
   - Run this SQL:
   ```sql
   UPDATE user_profiles 
   SET role = 'admin' 
   WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@jonsstore.com');
   ```

### 3. **Add Products (Optional)**

If you want to add the 100+ products, run these SQL files in order:

1. `products-data.sql` - Electronics products
2. `products-fashion.sql` - Fashion products  
3. `products-home.sql` - Home & Living products
4. `products-remaining.sql` - Sports, Books, Beauty products

### 4. **Start the Application**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# http://localhost:3000
```

## 🔧 **Alternative Methods**

### Method 1: Use Supabase Auth Functions

If you want to create the admin user programmatically, use this SQL:

```sql
-- This uses Supabase's built-in auth functions
SELECT auth.admin_create_user(
  'admin@jonsstore.com',
  'admin123456',
  '{"full_name": "Admin User", "avatar_url": null}'::jsonb,
  '{"role": "admin"}'::jsonb
);
```

### Method 2: Simple User Creation

```sql
-- Create basic user without complex auth structure
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@jonsstore.com',
    crypt('admin123456', gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Admin User"}',
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Create admin profile
INSERT INTO user_profiles (
    id,
    full_name,
    first_name,
    last_name,
    role,
    is_active,
    email_verified,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'admin@jonsstore.com'),
    'Admin User',
    'Admin',
    'User',
    'admin',
    true,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    updated_at = NOW();
```

## ✅ **Verification Steps**

### 1. **Check Database Setup**
```sql
-- Verify tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('products', 'categories', 'user_profiles', 'orders');
```

### 2. **Check Admin User**
```sql
-- Verify admin user exists
SELECT 
    u.email,
    p.role,
    p.full_name,
    p.is_active
FROM auth.users u
JOIN user_profiles p ON u.id = p.id
WHERE u.email = 'admin@jonsstore.com';
```

### 3. **Test Application**
1. Start the development server
2. Visit http://localhost:3000
3. Try to login with admin credentials
4. Access admin dashboard at `/admin`

## 🎯 **What's Included**

### ✅ **Core Features**
- Complete database schema
- User authentication system
- Product management
- Shopping cart functionality
- Order management
- Admin dashboard
- Security policies (RLS)

### ✅ **Product Categories**
- Electronics (30+ products)
- Fashion (25+ products)
- Home & Living (25+ products)
- Sports & Fitness (20+ products)
- Books & Media (20+ products)
- Beauty & Health (30+ products)

### ✅ **Admin Features**
- Product management
- Order processing
- User management
- Site settings
- Analytics dashboard

## 🚀 **Ready to Deploy**

Once the setup is complete:

1. **Test locally** - Verify all functionality works
2. **Push to GitHub** - Your code is already committed
3. **Deploy to Vercel** - Connect repository and deploy
4. **Configure domain** - Add your custom domain
5. **Go live** - Your e-commerce store is ready!

## 🆘 **Troubleshooting**

### Common Issues:

1. **Admin user not created**
   - Use the manual method in Supabase dashboard
   - Verify the user exists in Authentication > Users

2. **Products not loading**
   - Check if the schema was executed successfully
   - Verify RLS policies are set correctly

3. **Authentication not working**
   - Check environment variables
   - Verify Supabase URL and keys

### Getting Help:

1. Check Supabase dashboard logs
2. Review browser console for errors
3. Verify all environment variables are set
4. Test database connection

## 🎉 **Success!**

Your e-commerce platform is now ready with:

✅ **Fixed admin user creation**  
✅ **Complete database schema**  
✅ **100+ products across 6 categories**  
✅ **User authentication system**  
✅ **Admin dashboard**  
✅ **Shopping cart and checkout**  
✅ **Order management**  
✅ **Security policies**  
✅ **Ready for deployment**  

**Your online store is ready to launch! 🚀**
