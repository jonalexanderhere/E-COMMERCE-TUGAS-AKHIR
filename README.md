<div align="center">

# 🛍️ JonsStore - Professional E-commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

**A production-ready, full-stack e-commerce platform built with modern technologies**

[🚀 Live Demo](https://jonsstore.vercel.app) • [📖 Documentation](#-documentation) • [🐛 Report Bug](https://github.com/jonalexanderhere/E-COMMERCE-TUGAS-AKHIR/issues) • [✨ Request Feature](https://github.com/jonalexanderhere/E-COMMERCE-TUGAS-AKHIR/issues)

</div>

---

## 🎯 **Project Overview**

JonsStore is a comprehensive e-commerce platform designed for academic projects and real-world applications. Built with industry-standard technologies, it provides a complete shopping experience with advanced features like real-time authentication, secure admin management, and scalable architecture.

### **🎓 Perfect for Academic Projects**
- **Final Year Projects**: Complete e-commerce solution
- **Portfolio Showcase**: Professional-grade application
- **Learning Platform**: Modern web development practices
- **Real-world Skills**: Industry-standard technologies

---

## ✨ **Key Features**

### 🔐 **Enterprise-Grade Security**
- **Role-based Access Control**: Secure admin and user roles
- **Supabase Authentication**: Industry-standard user management
- **Row Level Security**: Database-level data protection
- **Session Management**: Secure, persistent user sessions
- **Admin Guard**: Protected admin routes with permission checks

### 🛒 **Complete E-commerce Solution**
- **100+ Products**: Comprehensive product catalog across 6 categories
- **Advanced Search**: Real-time search with multiple filters
- **Shopping Cart**: Persistent cart with state management
- **Checkout Process**: Complete order flow with validation
- **Order Management**: Track orders with status updates
- **User Profiles**: Comprehensive user account management

### 👨‍💼 **Professional Admin Dashboard**
- **Secure Access**: Admin-only features with role verification
- **Product Management**: Add, edit, and manage products
- **Order Tracking**: Monitor and update order status
- **User Management**: View and manage user accounts
- **Analytics**: Sales and performance statistics
- **Settings**: Store configuration and preferences

### 🎨 **Modern User Experience**
- **Responsive Design**: Mobile-first, works on all devices
- **Professional UI**: Clean, modern interface with Tailwind CSS
- **Smooth Animations**: Framer Motion powered interactions
- **Fast Performance**: Optimized for speed and SEO
- **Accessibility**: WCAG compliant design patterns

---

## 🚀 **Quick Start Guide**

### **Prerequisites**
- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher
- **Supabase Account**: Free tier available
- **Git**: For version control

### **1. Clone & Install**
```bash
# Clone the repository
git clone https://github.com/jonalexanderhere/E-COMMERCE-TUGAS-AKHIR.git
cd E-COMMERCE-TUGAS-AKHIR

# Install dependencies
npm install
```

### **2. Supabase Setup**
1. **Create Project**: Go to [supabase.com](https://supabase.com) and create a new project
2. **Get Credentials**: Navigate to Settings → API and copy your keys
3. **Environment Setup**: Create `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **3. Database Setup**
1. **Open SQL Editor**: In your Supabase dashboard
2. **Run Schema**: Copy and paste contents of `supabase-schema.sql`
3. **Execute**: Click "Run" to create tables and sample data

### **4. Admin User Setup**
1. **Create User**: Go to Authentication → Users in Supabase
2. **Add Admin**: 
   - Email: `admin@jonsstore.com`
   - Password: `admin123456`
   - Auto Confirm: ✅ (checked)
3. **Set Role**: Run this SQL command:
```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@jonsstore.com');
```

### **5. Start Development**
```bash
npm run dev
```

**🎉 Success!** Visit [http://localhost:3000](http://localhost:3000) to see your application.

---

## 🔐 **Admin Access & Security**

### **Default Admin Credentials**
```
Email:    admin@jonsstore.com
Password: admin123456
```

### **Security Features**
- ✅ **Role-based Access**: Admin and User roles with proper permissions
- ✅ **Protected Routes**: Admin dashboard requires authentication
- ✅ **Session Security**: Secure session management with auto-refresh
- ✅ **Data Protection**: Row Level Security (RLS) for data isolation
- ✅ **Input Validation**: Comprehensive form validation and sanitization
- ✅ **Error Handling**: Secure error messages without information leakage

### **Admin Capabilities**
- 🛍️ **Product Management**: Add, edit, view, and manage products
- 📦 **Order Management**: Track orders and update status
- 👥 **User Management**: View user accounts and manage roles
- 📊 **Analytics**: View sales statistics and performance metrics
- ⚙️ **Settings**: Configure store settings and preferences
- 🔒 **Security**: Monitor user activity and manage access

---

## 🚀 **Deployment Options**

### **Vercel (Recommended)**
```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Connect to Vercel
# - Go to vercel.com
# - Import your GitHub repository
# - Add environment variables
# - Deploy automatically
```

### **Environment Variables for Production**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

## 📄 **License & Legal**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### **Academic Use**
- ✅ **Educational Projects**: Perfect for academic assignments
- ✅ **Portfolio**: Showcase your development skills
- ✅ **Learning**: Study modern web development practices
- ✅ **Modification**: Customize for your specific needs

### **Commercial Use**
- ✅ **Business Applications**: Use in commercial projects
- ✅ **Startup MVPs**: Quick e-commerce solution
- ✅ **Client Projects**: Professional development work
- ✅ **Enterprise**: Scalable for large organizations

---

<div align="center">

## ⭐ **Star this Repository**

**If you found this project helpful, please give it a star!**

---

**Made with ❤️ by [JonsStore Team](https://github.com/jonalexanderhere)**

**🚀 Ready to build something amazing? Start with JonsStore!**

</div>
