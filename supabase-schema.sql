-- =====================================================
-- ENHANCED SUPABASE SCHEMA FOR E-COMMERCE APPLICATION
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable Row Level Security (JWT secret is managed by Supabase)
-- Note: JWT secret is automatically configured by Supabase

-- Create categories table for better organization
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced products table with more fields
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  short_description VARCHAR(500),
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  sku VARCHAR(100) UNIQUE,
  barcode VARCHAR(100),
  weight DECIMAL(8,2),
  dimensions JSONB, -- {length, width, height}
  image_url TEXT,
  gallery JSONB, -- Array of image URLs
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  category VARCHAR(100) NOT NULL, -- Keep for backward compatibility
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  max_stock INTEGER,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_digital BOOLEAN DEFAULT false,
  tags TEXT[],
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced user profiles with more fields
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  phone VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User addresses table
CREATE TABLE IF NOT EXISTS user_addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(20) DEFAULT 'shipping' CHECK (type IN ('shipping', 'billing')),
  is_default BOOLEAN DEFAULT false,
  full_name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  address_line_1 VARCHAR(255) NOT NULL,
  address_line_2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupons and discounts
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value DECIMAL(10,2) NOT NULL,
  minimum_amount DECIMAL(10,2),
  maximum_discount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Product reviews and ratings
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  type VARCHAR(20) DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'json')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for products (public read access)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Create policies for cart_items
CREATE POLICY "Users can view their own cart items" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for order_items
CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admin policies (admin users can manage everything)
CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all user profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.role = 'admin'
    )
  );

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, avatar_url, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url', 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample products (100+ products)
INSERT INTO products (name, description, price, image_url, category, stock) VALUES
-- Electronics
('iPhone 15 Pro', 'Latest iPhone with advanced camera system and A17 Pro chip', 15999000, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop', 'Electronics', 50),
('MacBook Air M2', 'Ultra-thin laptop with M2 chip and all-day battery life', 18999000, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', 'Electronics', 25),
('Samsung Galaxy S24', 'Premium Android smartphone with AI features', 12999000, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', 'Electronics', 75),
('Sony WH-1000XM5', 'Industry-leading noise canceling headphones', 4999000, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop', 'Electronics', 30),
('Nintendo Switch OLED', 'Gaming console with vibrant OLED screen', 4999000, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop', 'Electronics', 40),
('iPad Pro 12.9"', 'Professional tablet with M2 chip and Liquid Retina XDR display', 12999000, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', 'Electronics', 35),
('Dell XPS 13', 'Premium ultrabook with InfinityEdge display', 15999000, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop', 'Electronics', 20),
('AirPods Pro 2', 'Active noise cancellation with spatial audio', 2999000, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop', 'Electronics', 100),
('Samsung 4K Smart TV', '55-inch 4K UHD Smart TV with HDR', 8999000, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop', 'Electronics', 15),
('PlayStation 5', 'Next-gen gaming console with ultra-high speed SSD', 6999000, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop', 'Electronics', 25),
('Xbox Series X', 'Most powerful Xbox console with 4K gaming', 6999000, 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=400&fit=crop', 'Electronics', 25),
('Canon EOS R5', 'Professional mirrorless camera with 45MP sensor', 29999000, 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop', 'Electronics', 10),
('DJI Mavic Air 2', 'Compact drone with 4K video and 34-minute flight time', 12999000, 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop', 'Electronics', 8),
('Apple Watch Series 9', 'Advanced smartwatch with health monitoring', 4999000, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop', 'Electronics', 60),
('Surface Laptop 5', 'Premium Windows laptop with touchscreen', 13999000, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop', 'Electronics', 18),
('Bose QuietComfort 45', 'Premium noise-canceling headphones', 3999000, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop', 'Electronics', 45),
('LG OLED C3', '65-inch 4K OLED Smart TV with AI ThinQ', 19999000, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop', 'Electronics', 12),
('Steam Deck', 'Handheld gaming PC with AMD APU', 5999000, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop', 'Electronics', 30),
('Meta Quest 3', 'Mixed reality VR headset with pancake lenses', 6999000, 'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=400&h=400&fit=crop', 'Electronics', 22),
('GoPro Hero 12', 'Action camera with 5.3K video and HyperSmooth 6.0', 4999000, 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop', 'Electronics', 35),

-- Fashion
('Nike Air Max 270', 'Comfortable running shoes with Max Air cushioning', 1899000, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', 'Fashion', 100),
('Adidas Ultraboost 22', 'High-performance running shoes with Boost technology', 2199000, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop', 'Fashion', 80),
('Levi''s 501 Original Jeans', 'Classic straight-fit jeans in authentic denim', 899000, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop', 'Fashion', 60),
('Nike Dri-FIT T-Shirt', 'Moisture-wicking athletic t-shirt', 299000, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 'Fashion', 150),
('Adidas Originals Hoodie', 'Classic three-stripe hoodie with kangaroo pocket', 799000, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop', 'Fashion', 75),
('Converse Chuck Taylor All Star', 'Iconic canvas sneakers in classic white', 599000, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', 'Fashion', 120),
('Vans Old Skool', 'Classic skateboarding shoes with side stripe', 699000, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', 'Fashion', 90),
('Uniqlo Heattech Long Sleeve', 'Thermal base layer for cold weather', 199000, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 'Fashion', 200),
('Zara Blazer', 'Modern tailored blazer in navy blue', 1299000, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop', 'Fashion', 40),
('H&M Denim Jacket', 'Classic denim jacket with vintage wash', 599000, 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop', 'Fashion', 55),
('Puma Suede Classic', 'Retro basketball sneakers in various colors', 699000, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', 'Fashion', 85),
('New Balance 990v5', 'Premium running shoes with ENCAP midsole', 2499000, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop', 'Fashion', 65),
('Champion Reverse Weave Hoodie', 'Heavyweight hoodie with reverse weave construction', 899000, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop', 'Fashion', 70),
('Tommy Hilfiger Polo Shirt', 'Classic polo shirt with embroidered logo', 699000, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 'Fashion', 95),
('Calvin Klein Underwear Set', 'Premium cotton underwear set', 399000, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop', 'Fashion', 180),
('Ralph Lauren Oxford Shirt', 'Classic button-down shirt in white', 999000, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 'Fashion', 50),
('Nike Tech Fleece Joggers', 'Comfortable joggers with tech fleece material', 899000, 'https://images.unsplash.com/photo-1506629905607-1b1b1b1b1b1b?w=400&h=400&fit=crop', 'Fashion', 80),
('Adidas Trefoil Hoodie', 'Classic hoodie with trefoil logo', 799000, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop', 'Fashion', 75),
('Vans Authentic', 'Classic slip-on sneakers in checkerboard', 599000, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', 'Fashion', 110),
('Levi''s Trucker Jacket', 'Classic denim trucker jacket', 1199000, 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=400&fit=crop', 'Fashion', 45),

-- Home & Living
('Dyson V15 Detect', 'Cordless vacuum with laser dust detection', 8999000, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 'Home & Living', 20),
('KitchenAid Stand Mixer', 'Professional-grade stand mixer for baking', 3999000, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', 'Home & Living', 15),
('IKEA MALM Bed Frame', 'Modern platform bed frame in white', 1999000, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', 'Home & Living', 30),
('Nespresso Vertuo', 'Premium coffee machine with capsule system', 2999000, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop', 'Home & Living', 25),
('Philips Hue Starter Kit', 'Smart lighting system with color control', 1999000, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 'Home & Living', 40),
('Roomba i7+', 'Self-emptying robot vacuum with smart mapping', 6999000, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 'Home & Living', 18),
('Instant Pot Duo', '7-in-1 electric pressure cooker', 1299000, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', 'Home & Living', 35),
('West Elm Sofa', 'Modern 3-seater sofa in gray fabric', 4999000, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', 'Home & Living', 12),
('Vitamix A3500', 'Professional blender with touchscreen controls', 3999000, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', 'Home & Living', 22),
('Casper Mattress', 'Memory foam mattress with cooling technology', 2999000, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', 'Home & Living', 28),
('Dyson Airwrap', 'Hair styling tool with multiple attachments', 5999000, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 'Home & Living', 15),
('Breville Barista Express', 'Espresso machine with built-in grinder', 3999000, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop', 'Home & Living', 20),
('IKEA KALLAX Shelf', 'Modular storage unit in white', 899000, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', 'Home & Living', 50),
('Shark Navigator', 'Upright vacuum with lift-away technology', 1999000, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 'Home & Living', 32),
('Ninja Foodi', 'Pressure cooker and air fryer combo', 1999000, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', 'Home & Living', 38),
('Casper Pillow', 'Memory foam pillow with cooling cover', 299000, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', 'Home & Living', 100),
('Ring Video Doorbell', 'Smart doorbell with HD video and motion detection', 1999000, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 'Home & Living', 45),
('IKEA HEMNES Dresser', '6-drawer dresser in white stain', 2499000, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', 'Home & Living', 25),
('Dyson Pure Cool', 'Air purifying fan with HEPA filtration', 3999000, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 'Home & Living', 30),
('KitchenAid Food Processor', '11-cup food processor with multiple blades', 1999000, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', 'Home & Living', 28),

-- Sports & Fitness
('Yoga Mat Premium', 'Non-slip yoga mat with carrying strap', 299000, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop', 'Sports & Fitness', 90),
('Peloton Bike', 'Indoor cycling bike with live classes', 19999000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 8),
('Bowflex Adjustable Dumbbells', 'Space-saving adjustable dumbbells 5-52.5 lbs', 8999000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 12),
('Nike Dri-FIT Training Shorts', 'Moisture-wicking training shorts', 399000, 'https://images.unsplash.com/photo-1506629905607-1b1b1b1b1b1b?w=400&h=400&fit=crop', 'Sports & Fitness', 120),
('Adidas Training Gloves', 'Weightlifting gloves with wrist support', 199000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 150),
('Under Armour Compression Shirt', 'Performance compression shirt', 499000, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 'Sports & Fitness', 100),
('Garmin Forerunner 945', 'GPS running watch with advanced metrics', 3999000, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop', 'Sports & Fitness', 35),
('Resistance Bands Set', 'Set of 5 resistance bands with door anchor', 199000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 200),
('Wilson Pro Staff Tennis Racket', 'Professional tennis racket', 1999000, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop', 'Sports & Fitness', 25),
('Nike Basketball', 'Official size 7 basketball', 299000, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop', 'Sports & Fitness', 80),
('Adidas Soccer Cleats', 'Professional soccer cleats with studs', 899000, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', 'Sports & Fitness', 60),
('Fitbit Charge 5', 'Advanced fitness tracker with GPS', 1999000, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop', 'Sports & Fitness', 75),
('TRX Suspension Trainer', 'Portable suspension training system', 1999000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 40),
('Nike Training Shoes', 'Versatile training shoes for gym and crossfit', 1299000, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', 'Sports & Fitness', 85),
('Protein Powder Whey', 'Premium whey protein powder 5lbs', 899000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 120),
('Jump Rope Speed', 'Professional speed jump rope', 99000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 180),
('Kettlebell 20kg', 'Cast iron kettlebell for strength training', 599000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 50),
('Yoga Block Set', 'Set of 2 cork yoga blocks', 199000, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop', 'Sports & Fitness', 100),
('Swimming Goggles', 'Anti-fog swimming goggles with UV protection', 199000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 150),
('Running Headband', 'Moisture-wicking running headband', 99000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 200),

-- Books & Media
('The Great Gatsby', 'Classic American novel by F. Scott Fitzgerald', 150000, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 'Books & Media', 200),
('Atomic Habits', 'An Easy & Proven Way to Build Good Habits', 299000, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 'Books & Media', 150),
('The Psychology of Money', 'Timeless lessons on wealth, greed, and happiness', 249000, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 'Books & Media', 120),
('Sapiens', 'A Brief History of Humankind', 399000, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 'Books & Media', 100),
('The Lean Startup', 'How Today''s Entrepreneurs Use Continuous Innovation', 349000, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 'Books & Media', 80),
('Thinking, Fast and Slow', 'The groundbreaking work on decision-making', 329000, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 'Books & Media', 90),
('The 7 Habits of Highly Effective People', 'Powerful lessons in personal change', 299000, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 'Books & Media', 110),
('Rich Dad Poor Dad', 'What the Rich Teach Their Kids About Money', 249000, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 'Books & Media', 130),
('The Power of Now', 'A Guide to Spiritual Enlightenment', 279000, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 'Books & Media', 95),
('Blink', 'The Power of Thinking Without Thinking', 229000, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 'Books & Media', 85),
('The Subtle Art of Not Giving a F*ck', 'A Counterintuitive Approach to Living a Good Life', 199000, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 'Books & Media', 140),
('Educated', 'A Memoir by Tara Westover', 329000, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 'Books & Media', 75),
('The Alchemist', 'A Fable About Following Your Dream', 179000, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 'Books & Media', 160),
('Becoming', 'A Memoir by Michelle Obama', 399000, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 'Books & Media', 70),
('The Midnight Library', 'A Novel by Matt Haig', 279000, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 'Books & Media', 90),
('Where the Crawdads Sing', 'A Novel by Delia Owens', 299000, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 'Books & Media', 80),
('The Silent Patient', 'A Novel by Alex Michaelides', 249000, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 'Books & Media', 100),
('Project Hail Mary', 'A Novel by Andy Weir', 349000, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 'Books & Media', 65),
('The Four Winds', 'A Novel by Kristin Hannah', 279000, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 'Books & Media', 85),
('Klara and the Sun', 'A Novel by Kazuo Ishiguro', 299000, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 'Books & Media', 75),

-- Beauty & Health
('Olay Regenerist Moisturizer', 'Anti-aging daily moisturizer with SPF 30', 299000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 120),
('Neutrogena Face Wash', 'Gentle daily facial cleanser', 149000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 200),
('L''Oreal Hair Mask', 'Intensive repair hair mask', 199000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 150),
('Maybelline Mascara', 'Volumizing mascara for dramatic lashes', 129000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 180),
('Cetaphil Body Lotion', 'Gentle moisturizing body lotion', 179000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 160),
('Revlon Lipstick Set', 'Set of 6 long-lasting lipsticks', 299000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 90),
('Garnier Micellar Water', 'Gentle makeup remover and cleanser', 119000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 220),
('Nivea Sunscreen SPF 50', 'Broad spectrum sun protection', 149000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 190),
('Pantene Shampoo', 'Smooth & silky hair care', 129000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 250),
('Dove Body Wash', 'Gentle cleansing body wash', 99000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 300),
('Aveeno Daily Moisturizer', 'Fragrance-free daily moisturizer', 199000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 180),
('Clinique Foundation', 'Long-wear foundation with SPF', 399000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 80),
('Estee Lauder Serum', 'Advanced night repair serum', 899000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 60),
('MAC Lipstick', 'Classic matte lipstick', 249000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 120),
('Urban Decay Eyeshadow', 'Naked eyeshadow palette', 599000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 70),
('Too Faced Mascara', 'Better than sex mascara', 299000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 100),
('Fenty Beauty Foundation', 'Pro filt''r soft matte foundation', 399000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 90),
('Glossier Cloud Paint', 'Sheer gel-cream blush', 199000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 110),
('The Ordinary Niacinamide', '10% niacinamide + 1% zinc', 149000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 200),
('Paula''s Choice BHA', '2% BHA liquid exfoliant', 299000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 150),
('Drunk Elephant Vitamin C', 'C-Firma vitamin C day serum', 699000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 80),
('Sunday Riley Good Genes', 'All-in-one lactic acid treatment', 899000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 70),
('Tatcha Water Cream', 'Pore-perfecting water cream', 699000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 60),
('La Mer Moisturizer', 'The moisturizing cream', 2999000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 30),
('SK-II Facial Treatment', 'Essence with pitera', 1999000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 40),
('Chanel No. 5 Perfume', 'Classic women''s fragrance', 1299000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 50),
('Tom Ford Black Orchid', 'Luxury unisex fragrance', 1499000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 45),
('Pantene Shampoo', 'Pro-V daily moisture renewal shampoo', 129000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 170),
('Aveeno Daily Moisturizer', 'Fragrance-free daily moisturizing lotion', 199000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 140),
('CoverGirl Foundation', 'Long-lasting liquid foundation', 179000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 110),
('Dove Body Wash', 'Nourishing body wash with moisturizer', 99000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 250),
('Clinique Eye Cream', 'Anti-aging eye cream for dark circles', 399000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 80),
('Herbal Essences Conditioner', 'Bio:renew argan oil conditioner', 119000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 160),
('Burt''s Bees Lip Balm', 'Natural moisturizing lip balm', 79000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 300),
('St. Ives Face Scrub', 'Gentle exfoliating apricot scrub', 99000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 180),
('Eucerin Hand Cream', 'Intensive repair hand cream', 149000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 130),
('L''Oreal Hair Oil', 'Nourishing hair oil for damaged hair', 199000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 120),
('Neutrogena Acne Treatment', 'Salicylic acid acne treatment gel', 179000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 100),
('Vaseline Petroleum Jelly', 'Original healing jelly for dry skin', 79000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 280);

-- Create admin user (you'll need to create this user manually in Supabase Auth)
-- Email: admin@jonsstore.com
-- Password: admin123456
-- After creating the user, run this to set admin role:
-- UPDATE user_profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@jonsstore.com');

-- Add role column to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Instructions for creating admin user:
-- 1. Create a user in Supabase Auth with email: admin@jonsstore.com and password: admin123456
-- 2. Run this SQL to make them admin:
-- UPDATE user_profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@jonsstore.com');

-- Alternative: Create admin user directly (if you have service role key)
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
-- VALUES (
--   gen_random_uuid(),
--   'admin@jonsstore.com',
--   crypt('admin123456', gen_salt('bf')),
--   now(),
--   now(),
--   now(),
--   '{"full_name": "Admin User"}'
-- );
-- 
-- Then update the user profile:
-- UPDATE user_profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@jonsstore.com');

-- =====================================================
-- ENHANCED POLICIES FOR NEW TABLES
-- =====================================================

-- Categories policies
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('admin', 'moderator')
    )
  );

-- User addresses policies
CREATE POLICY "Users can manage their own addresses" ON user_addresses
  FOR ALL USING (auth.uid() = user_id);

-- Coupons policies
CREATE POLICY "Coupons are viewable by everyone" ON coupons
  FOR SELECT USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));

CREATE POLICY "Admins can manage coupons" ON coupons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('admin', 'moderator')
    )
  );

-- Wishlist policies
CREATE POLICY "Users can manage their own wishlist" ON wishlist
  FOR ALL USING (auth.uid() = user_id);

-- Product reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON product_reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can manage their own reviews" ON product_reviews
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews" ON product_reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('admin', 'moderator')
    )
  );

-- Notifications policies
CREATE POLICY "Users can manage their own notifications" ON notifications
  FOR ALL USING (auth.uid() = user_id);

-- Site settings policies
CREATE POLICY "Site settings are viewable by everyone" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings" ON site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- =====================================================
-- ENHANCED FUNCTIONS
-- =====================================================

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  counter INTEGER;
BEGIN
  -- Get the next counter value
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 4) AS INTEGER)), 0) + 1
  INTO counter
  FROM orders
  WHERE order_number LIKE 'ORD%';
  
  -- Format as ORD000001, ORD000002, etc.
  new_number := 'ORD' || LPAD(counter::TEXT, 6, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to update product stock
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Decrease stock when order item is created
    UPDATE products 
    SET stock = stock - NEW.quantity,
        updated_at = NOW()
    WHERE id = NEW.product_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle quantity changes
    UPDATE products 
    SET stock = stock + OLD.quantity - NEW.quantity,
        updated_at = NOW()
    WHERE id = NEW.product_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Restore stock when order item is deleted
    UPDATE products 
    SET stock = stock + OLD.quantity,
        updated_at = NOW()
    WHERE id = OLD.product_id;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update stock when order items change
CREATE TRIGGER update_stock_on_order_items
  AFTER INSERT OR UPDATE OR DELETE ON order_items
  FOR EACH ROW EXECUTE FUNCTION update_product_stock();

-- =====================================================
-- ADDITIONAL INDEXES FOR PERFORMANCE
-- =====================================================

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

-- Enhanced products indexes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON user_profiles(is_active);

-- User addresses indexes
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addresses_type ON user_addresses(type);

-- Coupons indexes
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_valid_until ON coupons(valid_until);

-- Wishlist indexes
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product_id ON wishlist(product_id);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_product_reviews_is_approved ON product_reviews(is_approved);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Site settings indexes
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);

-- =====================================================
-- SAMPLE DATA FOR NEW TABLES
-- =====================================================

-- Insert categories
INSERT INTO categories (name, description, image_url, sort_order) VALUES
('Electronics', 'Electronic devices and gadgets', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop', 1),
('Fashion', 'Clothing and accessories', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop', 2),
('Home & Living', 'Home improvement and living essentials', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', 3),
('Sports & Fitness', 'Sports equipment and fitness gear', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 4),
('Books & Media', 'Books, magazines, and digital media', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 5),
('Beauty & Health', 'Beauty products and health supplements', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 6);

-- Insert sample coupons
INSERT INTO coupons (code, name, description, type, value, minimum_amount, usage_limit, valid_until) VALUES
('WELCOME10', 'Welcome Discount', '10% off for new customers', 'percentage', 10.00, 100000, 1000, NOW() + INTERVAL '1 year'),
('SAVE50K', 'Save 50K', 'Fixed discount of 50,000 IDR', 'fixed', 50000.00, 200000, 500, NOW() + INTERVAL '6 months'),
('FREESHIP', 'Free Shipping', 'Free shipping on orders over 500K', 'fixed', 25000.00, 500000, 2000, NOW() + INTERVAL '3 months');

-- Insert site settings
INSERT INTO site_settings (key, value, type, description) VALUES
('site_name', 'Jon''s Store', 'string', 'Website name'),
('site_description', 'Premium e-commerce store with quality products', 'string', 'Website description'),
('currency', 'IDR', 'string', 'Default currency'),
('tax_rate', '10', 'number', 'Default tax rate percentage'),
('shipping_rate', '25000', 'number', 'Default shipping cost'),
('free_shipping_threshold', '500000', 'number', 'Minimum order for free shipping'),
('contact_email', 'support@jonsstore.com', 'string', 'Contact email address'),
('contact_phone', '+62-21-1234-5678', 'string', 'Contact phone number'),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode');

-- =====================================================
-- ADMIN USER CREATION
-- =====================================================

-- Create admin user directly using service role
-- This will create the user in auth.users and set up the profile
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Insert admin user into auth.users
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        invited_at,
        confirmation_token,
        confirmation_sent_at,
        recovery_token,
        recovery_sent_at,
        email_change_token_new,
        email_change,
        email_change_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at,
        phone,
        phone_confirmed_at,
        phone_change,
        phone_change_token,
        phone_change_sent_at,
        confirmed_at,
        email_change_token_current,
        email_change_confirm_status,
        banned_until,
        reauthentication_token,
        reauthentication_sent_at,
        is_sso_user,
        deleted_at
    ) VALUES (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'admin@jonsstore.com',
        crypt('admin123456', gen_salt('bf')),
        NOW(),
        NULL,
        '',
        NULL,
        '',
        NULL,
        '',
        '',
        NULL,
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Admin User", "avatar_url": null}',
        false,
        NOW(),
        NOW(),
        NULL,
        NULL,
        '',
        '',
        NULL,
        NOW(),
        '',
        0,
        NULL,
        '',
        NULL,
        false,
        NULL
    ) RETURNING id INTO admin_user_id;

    -- Insert admin profile
    INSERT INTO public.user_profiles (
        id,
        full_name,
        first_name,
        last_name,
        avatar_url,
        phone,
        date_of_birth,
        gender,
        role,
        is_active,
        email_verified,
        phone_verified,
        preferences,
        created_at,
        updated_at
    ) VALUES (
        admin_user_id,
        'Admin User',
        'Admin',
        'User',
        NULL,
        NULL,
        NULL,
        NULL,
        'admin',
        true,
        true,
        false,
        '{}',
        NOW(),
        NOW()
    );

    RAISE NOTICE 'Admin user created successfully with ID: %', admin_user_id;
END $$;

-- =====================================================
-- ADDITIONAL SAMPLE DATA
-- =====================================================

-- Insert more sample products for better testing
INSERT INTO products (name, description, price, image_url, category, stock, is_featured) VALUES
-- Featured Electronics
('iPhone 16 Pro Max', 'Latest iPhone with titanium design and advanced camera system', 19999000, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop', 'Electronics', 30, true),
('MacBook Pro M3', 'Professional laptop with M3 chip and Liquid Retina XDR display', 24999000, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', 'Electronics', 15, true),
('Samsung Galaxy S24 Ultra', 'Premium Android smartphone with S Pen and 200MP camera', 17999000, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', 'Electronics', 25, true),

-- Featured Fashion
('Nike Air Jordan 1', 'Classic basketball sneakers in original colorway', 2999000, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', 'Fashion', 50, true),
('Adidas Yeezy Boost 350', 'Comfortable lifestyle sneakers with Boost technology', 3999000, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', 'Fashion', 40, true),
('Supreme Box Logo Hoodie', 'Limited edition hoodie with iconic box logo', 8999000, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop', 'Fashion', 10, true),

-- Featured Home & Living
('Dyson V15 Detect Absolute', 'Cordless vacuum with laser dust detection and HEPA filtration', 9999000, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 'Home & Living', 12, true),
('KitchenAid Artisan Stand Mixer', 'Professional stand mixer in signature colors', 4999000, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', 'Home & Living', 8, true),
('IKEA PAX Wardrobe System', 'Modular wardrobe system with sliding doors', 3999000, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', 'Home & Living', 20, true);

-- Insert more sample orders for testing
INSERT INTO orders (id, user_id, total_amount, status, shipping_address, created_at) VALUES
(gen_random_uuid(), (SELECT id FROM auth.users WHERE email = 'admin@jonsstore.com'), 15999000, 'delivered', 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10270', NOW() - INTERVAL '5 days'),
(gen_random_uuid(), (SELECT id FROM auth.users WHERE email = 'admin@jonsstore.com'), 8999000, 'processing', 'Jl. Thamrin No. 456, Jakarta Pusat, DKI Jakarta 10350', NOW() - INTERVAL '2 days');

-- =====================================================
-- SCHEMA COMPLETION MESSAGE
-- =====================================================

-- Enhanced schema setup complete!
-- This comprehensive schema now includes:
-- ✅ Enhanced product management with categories and better organization
-- ✅ Complete user management with profiles and addresses
-- ✅ Advanced order management with status tracking
-- ✅ Coupon and discount system
-- ✅ Wishlist functionality
-- ✅ Product reviews and ratings
-- ✅ Notification system
-- ✅ Site settings management
-- ✅ Comprehensive security policies
-- ✅ Performance indexes
-- ✅ Sample data for testing
-- ✅ Admin user automatically created
-- ✅ Featured products for homepage
-- ✅ Sample orders for testing

-- Admin User Details:
-- Email: admin@jonsstore.com
-- Password: admin123456
-- Role: admin (automatically set)

-- Next steps:
-- 1. Run this enhanced schema in your Supabase SQL Editor
-- 2. The admin user is automatically created
-- 3. Test the application functionality
-- 4. Access admin dashboard at /admin
