# 🛒 E-Commerce Store

Modern e-commerce application built with Next.js, TypeScript, and Supabase.

## 🚀 Features

- **User Authentication** - Secure login/register with Supabase Auth
- **Product Catalog** - Browse products by category with search and filters
- **Shopping Cart** - Add/remove items with real-time updates
- **Order Management** - Complete checkout and order tracking
- **Admin Dashboard** - Manage products, orders, and users
- **Responsive Design** - Mobile-first design with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI Components**: Custom components with Radix UI
- **State Management**: React hooks and context
- **Deployment**: Vercel

## 📦 Installation

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
   
   Fill in your Supabase credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up database**
   - Go to your Supabase project
   - Open SQL Editor
   - Run the `schema-production.sql` file
   - Set admin role: `UPDATE user_profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');`

5. **Run the development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

The application uses a comprehensive PostgreSQL schema with:

- **Users & Authentication** - User profiles with role-based access
- **Products & Categories** - Product catalog with categories
- **Shopping Cart** - Cart items and wishlist
- **Orders** - Order management with status tracking
- **Coupons** - Discount and promotion system
- **Reviews** - Product reviews and ratings
- **Notifications** - User notifications system

## 🔐 Admin Setup

To set up an admin user:

1. Create a user account through the registration page
2. Run this SQL in Supabase SQL Editor:
   ```sql
   UPDATE user_profiles 
   SET role = 'admin' 
   WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
   ```
3. Access admin dashboard at `/admin`

## 🚀 Deployment

1. **Deploy to Vercel**
   ```bash
   npm run build
   vercel deploy
   ```

2. **Configure environment variables** in Vercel dashboard

3. **Update Supabase settings** for production domain

## 📱 Pages

- **Home** (`/`) - Featured products and categories
- **Products** (`/products`) - Product catalog with filters
- **Categories** (`/categories`) - Browse by category
- **Cart** (`/cart`) - Shopping cart
- **Checkout** (`/checkout`) - Order placement
- **Orders** (`/orders`) - Order history
- **Profile** (`/profile`) - User profile
- **Admin** (`/admin`) - Admin dashboard

## 🎨 Components

- **Database Hooks** - `hooks/use-database.ts` for data fetching
- **UI Components** - Reusable components in `components/ui/`
- **Page Components** - Feature-specific components
- **Admin Components** - Admin dashboard components

## 📊 Database Hooks

The application uses custom hooks for data management:

- `useCategories()` - Fetch categories
- `useProducts()` - Fetch products with filters
- `useFeaturedProducts()` - Fetch featured products
- `useProduct()` - Fetch single product
- `useProductsByCategory()` - Fetch products by category
- `useSearchProducts()` - Search products
- `useProductsByPriceRange()` - Filter by price range

## 🔧 Development

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Tailwind CSS** for styling
- **Supabase** for backend services

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support, email support@jonsstore.com or create an issue on GitHub.

---

**Built with ❤️ by Jon Alexander**