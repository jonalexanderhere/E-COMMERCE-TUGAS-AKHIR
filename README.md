# Jon's Store - E-commerce Platform

A modern, full-featured e-commerce platform built with Next.js 14, TypeScript, and Supabase. Features a complete shopping experience with Cash on Delivery (COD) support, multiple payment methods, and comprehensive order management.

## 🚀 Features

### Core E-commerce Features
- **Product Catalog**: Browse products with categories, search, and filtering
- **Shopping Cart**: Add/remove items with real-time updates
- **User Authentication**: Secure login/register system
- **Order Management**: Complete order lifecycle tracking

### Payment & Shipping
- **Cash on Delivery (COD)**: Pay when your order arrives
- **Multiple Payment Methods**: 
  - Bank Transfer
  - Credit Card
  - E-Wallet (OVO, GoPay, DANA, LinkAja)
  - QRIS
- **Flexible Shipping Options**:
  - Regular Shipping (3-5 days)
  - Express Shipping (1-2 days)
  - Same Day Delivery
  - Next Day Delivery
- **Free Shipping**: Automatic free shipping for orders above threshold

### Order Management
- **Order Tracking**: Real-time order status updates
- **COD Support**: Special handling for cash on delivery orders
- **Order History**: Complete order history for customers
- **Admin Dashboard**: Manage orders, products, and customers

### Technical Features
- **Responsive Design**: Mobile-first approach
- **Database Integration**: Supabase for data management
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Beautiful interface with Tailwind CSS
- **Performance**: Optimized for speed and SEO

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/jonsstore-ecommerce.git
   cd jonsstore-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the SQL schema from `schema-no-rls-clean.sql`
   - This will create all necessary tables and sample data

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

The application uses a comprehensive database schema with the following main tables:

- **Products**: Product catalog with images, pricing, inventory
- **Categories**: Product categorization
- **Orders**: Order management with COD support
- **Order Items**: Individual items in orders
- **Payment Methods**: Available payment options
- **Shipping Methods**: Delivery options
- **User Profiles**: Customer information
- **Cart Items**: Shopping cart functionality

## 💳 Payment Methods

### Cash on Delivery (COD)
- Pay when your order arrives
- No additional fees
- Available for most shipping methods
- Special order tracking for COD orders

### Online Payments
- **Bank Transfer**: Direct bank account transfer
- **Credit Card**: Visa, Mastercard, JCB support
- **E-Wallet**: OVO, GoPay, DANA, LinkAja integration
- **QRIS**: QR code payment system

## 🚚 Shipping Options

- **Regular Shipping**: 3-5 business days (Rp 15,000)
- **Express Shipping**: 1-2 business days (Rp 25,000)
- **Same Day Delivery**: Same day delivery (Rp 50,000)
- **Next Day Delivery**: Next business day (Rp 35,000)

Free shipping available for orders above Rp 500,000.

## 📱 Key Pages

- **Home**: Featured products and categories
- **Products**: Product catalog with filtering
- **Product Detail**: Individual product pages
- **Cart**: Shopping cart management
- **Checkout**: Order placement with payment/shipping selection
- **Orders**: Order history and tracking
- **Order Detail**: Detailed order information with COD status

## 🔧 Development

### Project Structure
```
├── app/                    # Next.js 14 app directory
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configurations
├── schema-no-rls-clean.sql # Database schema
└── README.md             # This file
```

### Key Components
- `CheckoutFormEnhanced`: Complete checkout with COD support
- `PaymentMethods`: Payment method selection
- `ShippingMethods`: Shipping option selection
- `OrderStatusCOD`: Order tracking with COD status
- `ProductCard`: Product display component

### Database Hooks
- `useProducts`: Product data management
- `useOrders`: Order management
- `usePaymentMethods`: Payment options
- `useShippingMethods`: Shipping options
- `useCreateOrder`: Order creation

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📊 Admin Features

- **Order Management**: View and update order status
- **Product Management**: Add/edit products and categories
- **Customer Management**: View customer information
- **COD Tracking**: Special handling for cash on delivery orders
- **Analytics**: Order and sales reporting

## 🔒 Security

- Row Level Security (RLS) disabled for development
- Secure authentication with Supabase
- Input validation with Zod schemas
- CSRF protection
- SQL injection prevention

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email admin@jonsstore.com or create an issue in the GitHub repository.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Supabase](https://supabase.com/) for the backend services
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Lucide](https://lucide.dev/) for beautiful icons

---

**Built with ❤️ by Jon's Store Team**