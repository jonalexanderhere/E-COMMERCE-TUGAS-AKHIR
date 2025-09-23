# 🚀 Deployment Guide - JonsStore E-commerce

This guide will help you deploy JonsStore to Vercel and set up the complete environment.

## 📋 Prerequisites

- GitHub account
- Vercel account
- Supabase account

## 🛠️ Step-by-Step Deployment

### 1. **Setup Supabase Database**

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (usually 2-3 minutes)
3. Go to **SQL Editor** in your Supabase dashboard
4. Copy the entire contents of `supabase-schema.sql` and paste it
5. Click **Run** to execute the script
6. Go to **Settings > API** and copy your credentials:
   - Project URL
   - anon public key
   - service_role key

### 2. **Create Admin User**

1. Go to **Authentication > Users** in Supabase
2. Click **Add user**
3. Create user with:
   - **Email**: `admin@jonsstore.com`
   - **Password**: `admin123456`
4. Go back to **SQL Editor** and run:
   ```sql
   UPDATE user_profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@jonsstore.com');
   ```

### 3. **Deploy to Vercel**

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - JonsStore E-commerce"
   git branch -M main
   git remote add origin https://github.com/jonalexanderhere/E-COMMERCE-TUGAS-AKHIR.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click **New Project**
   - Import your GitHub repository
   - Click **Deploy**

3. **Add Environment Variables**:
   - In Vercel dashboard, go to **Settings > Environment Variables**
   - Add these variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
     ```

4. **Redeploy**:
   - Go to **Deployments** tab
   - Click **Redeploy** on the latest deployment

### 4. **Configure Supabase for Production**

1. **Update Site URL**:
   - Go to **Authentication > URL Configuration**
   - Add your Vercel URL to **Site URL**
   - Add `https://your-app.vercel.app/auth/callback` to **Redirect URLs**

2. **Enable Email Confirmation** (Optional):
   - Go to **Authentication > Settings**
   - Enable **Enable email confirmations**

## 🎯 Testing Your Deployment

### **Test User Features**:
1. Visit your deployed site
2. Register a new account
3. Browse products
4. Add items to cart
5. Complete checkout process

### **Test Admin Features**:
1. Login with admin credentials:
   - Email: `admin@jonsstore.com`
   - Password: `admin123456`
2. Go to `/admin` to access dashboard
3. Test product management
4. Test order management

## 🔧 Troubleshooting

### **Common Issues**:

1. **"supabaseUrl is required" Error**:
   - Check environment variables in Vercel
   - Make sure all variables are set correctly

2. **Authentication Not Working**:
   - Verify Site URL in Supabase settings
   - Check redirect URLs configuration

3. **Database Connection Issues**:
   - Verify Supabase project is active
   - Check if database schema was created successfully

4. **Build Failures**:
   - Check Vercel build logs
   - Ensure all dependencies are in package.json

## 📊 Performance Optimization

### **Vercel Settings**:
- Enable **Automatic HTTPS**
- Set up **Custom Domain** (optional)
- Configure **Edge Functions** for better performance

### **Supabase Settings**:
- Enable **Connection Pooling**
- Set up **Database Backups**
- Configure **Rate Limiting**

## 🔒 Security Checklist

- [ ] Environment variables are set correctly
- [ ] Supabase RLS policies are enabled
- [ ] Admin user is created and configured
- [ ] Site URL is configured in Supabase
- [ ] HTTPS is enabled
- [ ] Database backups are configured

## 📈 Monitoring

### **Vercel Analytics**:
- Enable Vercel Analytics for performance monitoring
- Set up error tracking

### **Supabase Monitoring**:
- Monitor database performance
- Set up alerts for errors
- Track API usage

## 🎉 Success!

Your JonsStore e-commerce platform is now live! 

**Features Available**:
- ✅ 100+ sample products
- ✅ User authentication
- ✅ Shopping cart
- ✅ Checkout process
- ✅ Admin dashboard
- ✅ Order management
- ✅ Responsive design
- ✅ Modern UI/UX

**Admin Access**:
- URL: `https://your-app.vercel.app/admin`
- Email: `admin@jonsstore.com`
- Password: `admin123456`

---

**Need Help?** Check the [Issues](https://github.com/jonalexanderhere/E-COMMERCE-TUGAS-AKHIR/issues) page or create a new issue.
