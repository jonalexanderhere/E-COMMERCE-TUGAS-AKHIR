# JonsStore Setup Guide

This guide will help you set up the JonsStore e-commerce platform on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** - [Download here](https://git-scm.com/)
- **Supabase account** - [Sign up here](https://supabase.com/)

## Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd jonsstore-ecommerce
```

## Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

## Step 3: Set Up Supabase

### 3.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `jonsstore-ecommerce`
   - **Database Password**: Choose a strong password
   - **Region**: Choose the closest region to your users
5. Click "Create new project"

### 3.2 Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL**
   - **anon public** key
   - **service_role** key (keep this secret!)

### 3.3 Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp env.example .env.local
   ```

2. Open `.env.local` and update the values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### 3.4 Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the script

This will create:
- All necessary tables (products, orders, cart_items, etc.)
- Row Level Security policies
- Sample product data
- Database functions and triggers

## Step 4: Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Step 5: Test the Application

### 5.1 Create a User Account

1. Go to [http://localhost:3000/auth/register](http://localhost:3000/auth/register)
2. Fill in the registration form
3. Check your email for verification (if email confirmation is enabled)

### 5.2 Browse Products

1. Visit [http://localhost:3000/products](http://localhost:3000/products)
2. Try the search and filter functionality
3. Add products to your cart

### 5.3 Test the Shopping Cart

1. Add some products to your cart
2. Go to [http://localhost:3000/cart](http://localhost:3000/cart)
3. Modify quantities and remove items

### 5.4 Complete a Test Order

1. Go to checkout
2. Fill in the shipping information
3. Complete the order (this is a demo, no real payment is processed)

## Troubleshooting

### Common Issues

#### 1. "Invalid API key" Error
- Make sure your Supabase credentials are correct in `.env.local`
- Verify that you're using the correct project URL and keys

#### 2. Database Connection Issues
- Check if your Supabase project is active
- Verify that the database schema was created successfully
- Check the Supabase dashboard for any error messages

#### 3. Authentication Not Working
- Make sure Row Level Security policies are enabled
- Check if the user registration trigger was created
- Verify that email confirmation settings are correct

#### 4. Products Not Loading
- Check if the sample data was inserted correctly
- Verify that the products table exists and has data
- Check the browser console for any error messages

### Getting Help

If you encounter issues:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Review the Supabase documentation
3. Check the Next.js documentation
4. Create a new issue with detailed information

## Next Steps

Once you have the application running locally:

1. **Customize the Design**: Modify the Tailwind CSS classes to match your brand
2. **Add More Products**: Use the Supabase dashboard to add more products
3. **Configure Email**: Set up email templates for order confirmations
4. **Add Payment Integration**: Integrate with Stripe or PayPal for real payments
5. **Deploy**: Deploy to Vercel, Netlify, or your preferred platform

## Production Deployment

### Environment Variables for Production

Make sure to set these environment variables in your production environment:

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Security Considerations

1. **Never commit** `.env.local` or any files containing secrets
2. **Use environment variables** for all sensitive configuration
3. **Enable Row Level Security** in Supabase
4. **Set up proper CORS** policies
5. **Use HTTPS** in production

## Support

For additional support:

- **Documentation**: Check the README.md file
- **Issues**: Create an issue on GitHub
- **Community**: Join our Discord server (if available)

---

**Happy coding! 🚀**
