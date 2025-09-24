-- =====================================================
-- COMPLETE E-COMMERCE SCHEMA - PRODUCTION READY
-- =====================================================
-- File ini siap dijalankan di Supabase SQL Editor
-- Semua error sudah diperbaiki dan data lengkap

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- CREATE TABLES
-- =====================================================

-- Create categories table
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

-- Create products table
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
  dimensions JSONB,
  image_url TEXT,
  gallery JSONB,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  category VARCHAR(100) NOT NULL,
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
  order_number VARCHAR(50) UNIQUE,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address TEXT NOT NULL,
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
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

-- Create user_profiles table
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

-- Create user_addresses table
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

-- Create coupons table
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

-- Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create product_reviews table
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

-- Create notifications table
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

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  type VARCHAR(20) DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'json')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

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

-- =====================================================
-- CREATE SECURITY POLICIES
-- =====================================================

-- Products policies
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Cart items policies
CREATE POLICY "Users can view their own cart items" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

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

-- Order items policies
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

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all user profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.role = 'admin'
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

-- =====================================================
-- CREATE FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to handle user profile creation
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

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 10, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for order number generation
CREATE OR REPLACE TRIGGER generate_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Insert categories
INSERT INTO categories (name, description, image_url, sort_order) VALUES
('Electronics', 'Electronic devices and gadgets', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop', 1),
('Fashion', 'Clothing and accessories', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop', 2),
('Home & Living', 'Home improvement and living essentials', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', 3),
('Sports & Fitness', 'Sports equipment and fitness gear', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 4),
('Books & Media', 'Books, magazines, and digital media', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 5),
('Beauty & Health', 'Beauty products and health supplements', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 6);

-- Insert sample products (FIXED - no extra values)
INSERT INTO products (name, description, short_description, price, compare_price, cost_price, sku, barcode, weight, dimensions, image_url, gallery, category, stock, min_stock, max_stock, is_active, is_featured, is_digital, tags, meta_title, meta_description) VALUES

-- Electronics
('iPhone 16 Pro Max 256GB', 'Latest iPhone with titanium design, A18 Pro chip, and advanced camera system with 5x optical zoom', 'Premium iPhone with titanium build and advanced camera', 19999000, 21999000, 15000000, 'IPH16PM256', '1234567890123', 0.221, '{"length": 16.3, "width": 7.7, "height": 0.83}', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop"]', 'Electronics', 50, 5, 100, true, true, false, '{"smartphone", "apple", "premium", "camera"}', 'iPhone 16 Pro Max - Premium Smartphone', 'Latest iPhone with titanium design and advanced camera system'),

('Samsung Galaxy S24 Ultra 512GB', 'Premium Android smartphone with S Pen, 200MP camera, and AI-powered features', 'Ultimate Android smartphone with S Pen', 17999000, 19999000, 12000000, 'SGS24U512', '1234567890124', 0.232, '{"length": 16.2, "width": 7.9, "height": 0.88}', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop", "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop"]', 'Electronics', 40, 5, 80, true, true, false, '{"smartphone", "samsung", "premium", "s-pen"}', 'Samsung Galaxy S24 Ultra - Premium Android', 'Premium Android smartphone with S Pen and 200MP camera'),

('MacBook Pro 16" M3 Max', 'Professional laptop with M3 Max chip, Liquid Retina XDR display, and all-day battery life', 'Professional MacBook with M3 Max chip', 34999000, 37999000, 25000000, 'MBP16M3MAX', '1234567890126', 2.16, '{"length": 35.6, "width": 24.8, "height": 1.68}', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop"]', 'Electronics', 20, 2, 50, true, true, false, '{"laptop", "apple", "professional", "m3-max"}', 'MacBook Pro 16" M3 Max - Professional Laptop', 'Professional laptop with M3 Max chip and Liquid Retina XDR display'),

('Sony WH-1000XM5', 'Industry-leading noise canceling headphones with 30-hour battery life', 'Premium noise canceling headphones', 4999000, 5499000, 3000000, 'SWH1000XM5', '1234567890131', 0.25, '{"length": 20.5, "width": 17.5, "height": 7.5}', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop"]', 'Electronics', 40, 5, 80, true, true, false, '{"headphones", "sony", "noise-canceling", "wireless"}', 'Sony WH-1000XM5 - Noise Canceling Headphones', 'Industry-leading noise canceling headphones with 30-hour battery life'),

('PlayStation 5', 'Next-gen gaming console with ultra-high speed SSD and 3D audio', 'Next-generation gaming console', 6999000, 7999000, 4500000, 'PS5', '1234567890134', 4.5, '{"length": 39.0, "width": 26.0, "height": 9.6}', 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=600&fit=crop"]', 'Electronics', 25, 3, 50, true, true, false, '{"gaming", "playstation", "console", "4k"}', 'PlayStation 5 - Next-Gen Gaming Console', 'Next-gen gaming console with ultra-high speed SSD and 3D audio'),

-- Fashion
('Nike Air Jordan 1 Retro High', 'Classic basketball sneakers in original colorway with premium leather construction', 'Classic basketball sneakers in original colorway', 2999000, 3299000, 1500000, 'NAJ1RH', '1234567890201', 0.8, '{"length": 32.0, "width": 12.0, "height": 10.0}', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop"]', 'Fashion', 50, 5, 100, true, true, false, '{"sneakers", "nike", "jordan", "basketball"}', 'Nike Air Jordan 1 Retro High - Classic Basketball Sneakers', 'Classic basketball sneakers in original colorway with premium leather construction'),

('Adidas Yeezy Boost 350 V2', 'Comfortable lifestyle sneakers with Boost technology and Primeknit upper', 'Comfortable lifestyle sneakers with Boost technology', 3999000, 4499000, 2000000, 'AYB350V2', '1234567890202', 0.7, '{"length": 32.0, "width": 12.0, "height": 8.0}', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop"]', 'Fashion', 40, 5, 80, true, true, false, '{"sneakers", "adidas", "yeezy", "boost"}', 'Adidas Yeezy Boost 350 V2 - Lifestyle Sneakers', 'Comfortable lifestyle sneakers with Boost technology and Primeknit upper'),

('Supreme Box Logo Hoodie', 'Limited edition hoodie with iconic box logo and premium cotton construction', 'Limited edition hoodie with iconic box logo', 8999000, 9999000, 4000000, 'SBH', '1234567890209', 0.8, '{"length": 70.0, "width": 50.0, "height": 2.0}', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop"]', 'Fashion', 10, 1, 20, true, true, false, '{"hoodie", "supreme", "limited-edition", "streetwear"}', 'Supreme Box Logo Hoodie - Limited Edition Streetwear', 'Limited edition hoodie with iconic box logo and premium cotton construction'),

-- Home & Living
('Dyson V15 Detect Absolute', 'Cordless vacuum with laser dust detection and HEPA filtration', 'Cordless vacuum with laser dust detection and HEPA filtration', 9999000, 10999000, 6000000, 'DV15DA', '1234567890301', 3.0, '{"length": 25.0, "width": 10.0, "height": 8.0}', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop"]', 'Home & Living', 12, 2, 25, true, true, false, '{"vacuum", "dyson", "cordless", "hepa"}', 'Dyson V15 Detect Absolute - Cordless Vacuum', 'Cordless vacuum with laser dust detection and HEPA filtration'),

('KitchenAid Artisan Stand Mixer', 'Professional stand mixer in signature colors with 5-quart bowl', 'Professional stand mixer in signature colors', 4999000, 5499000, 3000000, 'KASM', '1234567890302', 12.0, '{"length": 40.0, "width": 30.0, "height": 35.0}', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop"]', 'Home & Living', 8, 1, 15, true, true, false, '{"mixer", "kitchenaid", "stand-mixer", "professional"}', 'KitchenAid Artisan Stand Mixer - Professional Kitchen', 'Professional stand mixer in signature colors with 5-quart bowl'),

-- Sports & Fitness
('Peloton Bike', 'Indoor cycling bike with live classes and on-demand workouts', 'Indoor cycling bike with live classes', 19999000, 21999000, 12000000, 'PB', '1234567890401', 50.0, '{"length": 60.0, "width": 30.0, "height": 120.0}', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop"]', 'Sports & Fitness', 8, 1, 15, true, true, false, '{"bike", "peloton", "indoor-cycling", "live-classes"}', 'Peloton Bike - Indoor Cycling', 'Indoor cycling bike with live classes and on-demand workouts'),

('Nike Air Max 270', 'Comfortable running shoes with Max Air cushioning and breathable mesh upper', 'Comfortable running shoes with Max Air cushioning', 1899000, 2199000, 1000000, 'NAM270', '1234567890203', 0.6, '{"length": 32.0, "width": 12.0, "height": 10.0}', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop"]', 'Sports & Fitness', 100, 10, 200, true, false, false, '{"sneakers", "nike", "running", "air-max"}', 'Nike Air Max 270 - Running Shoes', 'Comfortable running shoes with Max Air cushioning and breathable mesh upper'),

-- Books & Media
('Atomic Habits', 'An Easy & Proven Way to Build Good Habits & Break Bad Ones', 'An Easy & Proven Way to Build Good Habits & Break Bad Ones', 299000, 399000, 150000, 'AH', '1234567890502', 0.4, '{"length": 23.0, "width": 15.0, "height": 2.5}', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop"]', 'Books & Media', 150, 15, 300, true, true, false, '{"book", "self-help", "habits", "productivity"}', 'Atomic Habits - Build Good Habits', 'An Easy & Proven Way to Build Good Habits & Break Bad Ones'),

('The Great Gatsby', 'Classic American novel by F. Scott Fitzgerald about the Jazz Age', 'Classic American novel by F. Scott Fitzgerald', 150000, 200000, 75000, 'TGG', '1234567890501', 0.3, '{"length": 20.0, "width": 13.0, "height": 2.0}', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop"]', 'Books & Media', 200, 20, 400, true, false, false, '{"book", "classic", "fitzgerald", "jazz-age"}', 'The Great Gatsby - Classic American Novel', 'Classic American novel by F. Scott Fitzgerald about the Jazz Age'),

-- Beauty & Health
('Olay Regenerist Moisturizer', 'Anti-aging daily moisturizer with SPF 30 and niacinamide', 'Anti-aging daily moisturizer with SPF 30', 299000, 399000, 150000, 'ORM', '1234567890601', 0.2, '{"length": 8.0, "width": 5.0, "height": 3.0}', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop"]', 'Beauty & Health', 120, 12, 240, true, false, false, '{"skincare", "olay", "anti-aging", "spf-30"}', 'Olay Regenerist Moisturizer - Anti-Aging Skincare', 'Anti-aging daily moisturizer with SPF 30 and niacinamide'),

('MAC Lipstick', 'Classic matte lipstick in various shades', 'Classic matte lipstick in various shades', 249000, 299000, 125000, 'ML', '1234567890614', 0.05, '{"length": 8.0, "width": 1.0, "height": 1.0}', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop"]', 'Beauty & Health', 120, 12, 240, true, false, false, '{"makeup", "mac", "lipstick", "matte"}', 'MAC Lipstick - Classic Matte Shades', 'Classic matte lipstick in various shades');

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
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);

-- =====================================================
-- ADMIN USER SETUP INSTRUCTIONS
-- =====================================================

-- IMPORTANT: Admin user must be created manually in Supabase Auth dashboard
-- 1. Go to your Supabase dashboard
-- 2. Navigate to Authentication > Users
-- 3. Click "Add User"
-- 4. Fill in the details:
--    - Email: admin@jonsstore.com
--    - Password: admin123456
--    - Auto Confirm User: ✅ (checked)
-- 5. After creating the user, run this SQL to set admin role:

-- UPDATE user_profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@jonsstore.com');

-- =====================================================
-- SETUP COMPLETE MESSAGE
-- =====================================================

-- ✅ Enhanced schema setup complete!
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

-- Admin User Setup:
-- 1. Create user manually in Supabase Auth dashboard
-- 2. Set admin role using the provided SQL
-- 3. Test the application functionality

-- Next steps:
-- 1. Run this schema in your Supabase SQL Editor
-- 2. Create admin user in Supabase Auth dashboard
-- 3. Set admin role using the provided SQL
-- 4. Test the application functionality
-- 5. Access admin dashboard at /admin
