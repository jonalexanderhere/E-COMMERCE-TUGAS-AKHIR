# 🛍️ Jon's Store - Modern E-Commerce Platform

A comprehensive, full-stack e-commerce platform built with Next.js 14, Supabase, and modern web technologies. Features include Cash on Delivery (COD), multiple payment methods, admin dashboard, and real-time analytics.

![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)

## ✨ Features

### 🛒 Customer Features
- **Modern Product Catalog** - Browse products with advanced filtering and search
- **Cash on Delivery (COD)** - Pay when your order arrives
- **Multiple Payment Methods** - Credit Card, Bank Transfer, E-Wallet, QRIS
- **Smart Shopping Cart** - Add to cart with real-time updates
- **Order Tracking** - Track your orders from placement to delivery
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Fast Performance** - Optimized for speed and user experience

### 👨‍💼 Admin Features
- **Comprehensive Dashboard** - Real-time analytics and insights
- **Order Management** - Handle orders with COD-specific workflows
- **Product Management** - Add, edit, and manage your product catalog
- **Analytics & Reports** - Detailed sales and performance metrics
- **User Management** - Manage customer accounts and permissions
- **Role-Based Access** - Secure admin authentication

### 💳 Payment & Shipping
- **Cash on Delivery** - No upfront payment required
- **Online Payments** - Secure payment processing
- **Multiple Shipping Options** - Regular, Express, Same Day delivery
- **Free Shipping Thresholds** - Automatic free shipping on qualifying orders
- **Order Status Tracking** - Real-time order status updates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jonalexanderhere/E-COMMERCE-TUGAS-AKHIR.git
   cd E-COMMERCE-TUGAS-AKHIR
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run the `schema-no-rls-clean.sql` script
   - This will create all tables, insert sample data, and set up the admin user

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Customer site: `http://localhost:3000`
   - Admin dashboard: `http://localhost:3000/admin`
   - Admin credentials: `admin@jonsstore.com` / `[Your Supabase Auth Password]`

## 🏗️ Project Structure

```
├── app/                    # Next.js 14 App Router
│   ├── admin/             # Admin dashboard pages
│   ├── checkout/          # Checkout process
│   ├── orders/            # Order management
│   └── products/          # Product pages
├── components/            # Reusable UI components
│   ├── admin-*           # Admin-specific components
│   ├── product-*         # Product-related components
│   └── ui/                # Base UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configurations
├── schema-no-rls-clean.sql # Complete database schema
└── setup-admin-user.sql   # Admin user setup script
```

## 🗄️ Database Schema

The application uses a comprehensive PostgreSQL schema with the following main entities:

- **Products** - Product catalog with detailed information
- **Categories** - Product categorization
- **Orders** - Customer orders with COD support
- **Order Items** - Individual items in orders
- **Users** - Customer and admin accounts
- **Payment Methods** - Available payment options
- **Shipping Methods** - Delivery options
- **Coupons** - Discount and promotion system

### Key Features:
- **Row Level Security (RLS)** - Disabled for development, can be enabled for production
- **Automatic Timestamps** - Created/updated timestamps for all records
- **Order Number Generation** - Automatic order number creation
- **Admin User Setup** - Pre-configured admin user

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the `schema-no-rls-clean.sql` script in SQL Editor
3. Enable Authentication in Supabase dashboard
4. Create admin user with email: `admin@jonsstore.com`
5. Update the user ID in the schema if different

### Environment Variables
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For production
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📱 Admin Dashboard

Access the admin dashboard at `/admin` with the following features:

### Dashboard Overview
- Real-time sales metrics
- Order statistics
- Revenue analytics
- COD vs Online payment breakdown
- Top-selling products

### Order Management
- View all orders with filtering
- Update order status
- Handle COD orders specifically
- Track order history
- Export order data

### Product Management
- Add/edit products
- Manage product categories
- Set featured products
- Inventory management
- Bulk operations

### Analytics
- Sales performance metrics
- Payment method analysis
- Customer insights
- Revenue trends
- Export capabilities

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Configure your hosting platform

## 🧪 Testing

### Development Testing
```bash
# Run development server
npm run dev

# Test admin features
# 1. Go to /admin
# 2. Login with admin credentials
# 3. Test all admin features

# Test customer features
# 1. Browse products
# 2. Add to cart
# 3. Test checkout with COD
# 4. Test different payment methods
```

### Production Testing
1. Deploy to staging environment
2. Test all features thoroughly
3. Verify admin dashboard functionality
4. Test COD workflow end-to-end
5. Verify payment processing

## 🔒 Security

- **Authentication** - Supabase Auth with role-based access
- **Data Protection** - Row Level Security (RLS) ready
- **Input Validation** - Client and server-side validation
- **Secure Payments** - PCI-compliant payment processing
- **Admin Access** - Protected admin routes

## 📊 Performance

- **Next.js 14** - Latest framework with App Router
- **Image Optimization** - Automatic image optimization
- **Code Splitting** - Automatic code splitting
- **Caching** - Intelligent caching strategies
- **Database Optimization** - Indexed queries and efficient schema

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

**Build Errors**
- Ensure all dependencies are installed: `npm install`
- Check TypeScript errors: `npm run build`
- Verify environment variables are set

**Database Issues**
- Run the complete schema script
- Check Supabase connection
- Verify RLS policies if enabled

**Admin Access Issues**
- Verify admin user exists in Supabase Auth
- Check user role in user_profiles table
- Ensure correct user ID in schema

### Getting Help
- Check the [Issues](https://github.com/jonalexanderhere/E-COMMERCE-TUGAS-AKHIR/issues) page
- Create a new issue with detailed description
- Include error messages and steps to reproduce

## 🎯 Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Advanced inventory management
- [ ] Customer reviews and ratings
- [ ] Social media integration
- [ ] Advanced coupon system
- [ ] API documentation

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing framework
- **Supabase Team** - For the powerful backend platform
- **Vercel Team** - For seamless deployment
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide Icons** - For beautiful icons

---

**Built with ❤️ by Jon Alexander**

*Ready for production deployment and presentation!*