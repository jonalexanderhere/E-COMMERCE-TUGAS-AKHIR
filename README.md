<div align="center">

# 🛍️ JonsStore - Modern E-commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**A professional, full-stack e-commerce platform built for modern web development**

[🚀 Live Demo](https://jonsstore.vercel.app) • [📖 Documentation](#-documentation) • [🐛 Report Bug](https://github.com/jonalexanderhere/E-COMMERCE-TUGAS-AKHIR/issues) • [✨ Request Feature](https://github.com/jonalexanderhere/E-COMMERCE-TUGAS-AKHIR/issues)

</div>

---

## ✨ Features

### 🎨 **Modern Design**
- **Responsive UI**: Beautiful, mobile-first design with Tailwind CSS
- **Dark/Light Mode**: Automatic theme switching
- **Smooth Animations**: Framer Motion powered interactions
- **Professional Layout**: Clean, modern interface

### 🛒 **E-commerce Features**
- **Product Catalog**: 100+ sample products across 6 categories
- **Advanced Search**: Real-time search with filters
- **Shopping Cart**: Persistent cart with Zustand state management
- **Checkout Process**: Complete order flow with validation
- **Order Tracking**: Real-time order status updates

### 🔐 **Authentication & Security**
- **User Registration/Login**: Secure authentication with Supabase Auth
- **Admin Dashboard**: Complete admin panel for store management
- **Role-based Access**: User and admin role management
- **Row Level Security**: Database-level security policies

### 📱 **User Experience**
- **Mobile Responsive**: Optimized for all device sizes
- **Fast Loading**: Optimized images and code splitting
- **Real-time Updates**: Live data synchronization
- **Toast Notifications**: User feedback system

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="40" height="40"/>
<br/><b>Next.js 14</b>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="40" height="40"/>
<br/><b>TypeScript</b>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" width="40" height="40"/>
<br/><b>Tailwind CSS</b>
</td>
<td align="center" width="20%">
<img src="https://supabase.com/favicon.ico" width="40" height="40"/>
<br/><b>Supabase</b>
</td>
<td align="center" width="20%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40" height="40"/>
<br/><b>React 18</b>
</td>
</tr>
</table>

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **Framer Motion** - Smooth animations

### **Backend & Database**
- **Supabase** - Backend as a Service
- **PostgreSQL** - Relational database
- **Row Level Security** - Database security
- **Real-time subscriptions** - Live data updates

### **State Management & Forms**
- **Zustand** - Lightweight state management
- **React Hook Form** - Performant forms
- **Zod** - Schema validation

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Supabase account

### **1. Clone & Install**
```bash
git clone https://github.com/jonalexanderhere/E-COMMERCE-TUGAS-AKHIR.git
cd E-COMMERCE-TUGAS-AKHIR
npm install
```

### **2. Environment Setup**
```bash
cp env.example .env.local
```

Update `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **3. Database Setup**
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL script to create tables and sample data

### **4. Run Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 👤 Admin Access

**Default Admin Credentials:**
- **Email**: `admin@jonsstore.com`
- **Password**: `admin123456`

> **Note**: Create this user in Supabase Auth and set the role to 'admin' in the database.

---

## 📱 Screenshots

<div align="center">

### 🏠 Homepage
<img src="https://via.placeholder.com/800x400/1e40af/ffffff?text=Homepage+with+Hero+Section" alt="Homepage" width="400"/>

### 🛒 Product Catalog
<img src="https://via.placeholder.com/800x400/059669/ffffff?text=Product+Catalog+with+Search" alt="Product Catalog" width="400"/>

### 🛍️ Shopping Cart
<img src="https://via.placeholder.com/800x400/dc2626/ffffff?text=Shopping+Cart+Page" alt="Shopping Cart" width="400"/>

### 👨‍💼 Admin Dashboard
<img src="https://via.placeholder.com/800x400/7c3aed/ffffff?text=Admin+Dashboard" alt="Admin Dashboard" width="400"/>

</div>

---

## 📁 Project Structure

```
├── 📁 app/                    # Next.js 14 App Router
│   ├── 📁 auth/              # Authentication pages
│   ├── 📁 products/          # Product pages
│   ├── 📁 cart/              # Shopping cart
│   ├── 📁 admin/             # Admin dashboard
│   └── 📄 globals.css        # Global styles
├── 📁 components/            # React components
│   ├── 📁 ui/               # Reusable UI components
│   ├── 📄 header.tsx        # Navigation header
│   ├── 📄 footer.tsx        # Site footer
│   └── 📄 banner.tsx        # Promotional banner
├── 📁 hooks/                # Custom React hooks
├── 📁 lib/                  # Utility functions
│   ├── 📄 supabase.ts       # Supabase client
│   └── 📄 utils.ts          # Helper functions
├── 📄 supabase-schema.sql   # Database schema
└── 📄 README.md            # This file
```

---

## 🎯 Key Features Explained

### **🛒 Shopping Experience**
- **Product Discovery**: Browse 100+ products across 6 categories
- **Smart Search**: Real-time search with category and price filters
- **Cart Management**: Add/remove items with quantity controls
- **Checkout Flow**: Complete order process with form validation

### **👨‍💼 Admin Features**
- **Dashboard**: Overview of sales, orders, and products
- **Product Management**: Add, edit, and delete products
- **Order Management**: Update order status and track fulfillment
- **User Management**: View customer accounts and roles

### **🔐 Security & Performance**
- **Authentication**: Secure user registration and login
- **Authorization**: Role-based access control
- **Data Protection**: Row Level Security in database
- **Optimization**: Image optimization and code splitting

---

## 🚀 Deployment

### **Vercel (Recommended)**
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy! 🎉

### **Other Platforms**
- **Netlify**: Full-stack deployment
- **Railway**: Database + app hosting
- **DigitalOcean**: VPS deployment
- **AWS**: Enterprise deployment

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - The backend platform
- [Tailwind CSS](https://tailwindcss.com/) - The CSS framework
- [Radix UI](https://www.radix-ui.com/) - The UI primitives
- [Lucide](https://lucide.dev/) - The beautiful icons

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

**Built with ❤️ for modern e-commerce**

[![GitHub stars](https://img.shields.io/github/stars/jonalexanderhere/E-COMMERCE-TUGAS-AKHIR?style=social)](https://github.com/jonalexanderhere/E-COMMERCE-TUGAS-AKHIR/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/jonalexanderhere/E-COMMERCE-TUGAS-AKHIR?style=social)](https://github.com/jonalexanderhere/E-COMMERCE-TUGAS-AKHIR/network)

</div>

## 📁 Project Structure

```
├── app/                    # Next.js 14 app directory
│   ├── auth/              # Authentication pages
│   ├── products/          # Product pages
│   ├── cart/              # Shopping cart
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── header.tsx        # Navigation header
│   ├── footer.tsx        # Site footer
│   └── ...               # Other components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Helper functions
├── supabase-schema.sql   # Database schema
└── README.md            # This file
```

## 🎨 Key Components

### Authentication
- **Login/Register Forms**: Secure user authentication
- **Protected Routes**: Route protection with middleware
- **User Profiles**: User profile management

### Product Management
- **Product Catalog**: Grid view with filtering
- **Product Details**: Individual product pages
- **Search & Filter**: Advanced product search
- **Categories**: Organized product categories

### Shopping Experience
- **Shopping Cart**: Persistent cart with Zustand
- **Checkout Process**: Complete order flow
- **Order History**: User order tracking
- **Wishlist**: Save favorite products

### Admin Features
- **Product Management**: Add/edit/delete products
- **Order Management**: Process and track orders
- **User Management**: View user accounts
- **Analytics Dashboard**: Sales and performance metrics

## 🔧 Configuration

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `NEXT_PUBLIC_APP_URL` | Your application URL |

### Database Schema

The application uses the following main tables:

- **products**: Product catalog with images, prices, and inventory
- **cart_items**: User shopping cart items
- **orders**: Order information and status
- **order_items**: Individual items within orders
- **user_profiles**: Extended user information

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📱 Mobile Support

The application is fully responsive and optimized for mobile devices:

- Touch-friendly interface
- Mobile navigation menu
- Optimized product grid
- Mobile checkout flow

## 🔒 Security Features

- Row Level Security (RLS) in Supabase
- Secure authentication with JWT tokens
- Input validation and sanitization
- CSRF protection
- Secure API endpoints

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📈 Performance

- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Supabase query caching
- **Lazy Loading**: Component lazy loading
- **Bundle Analysis**: Optimized bundle size

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🎯 Future Enhancements

- [ ] Payment integration (Stripe, PayPal)
- [ ] Advanced search with filters
- [ ] Product reviews and ratings
- [ ] Email notifications
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] Inventory management
- [ ] Discount codes and promotions
- [ ] Social media integration

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Lucide](https://lucide.dev/) - Beautiful icons

---

**Built with ❤️ for modern e-commerce**
