-- =====================================================
-- DEMO PRODUCTS SCHEMA - READY FOR PRESENTATION
-- =====================================================
-- Complete schema with comprehensive demo data
-- Ready for immediate presentation and testing

-- =====================================================
-- DROP AND RECREATE FOR CLEAN START
-- =====================================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.order_status_history CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.product_reviews CASCADE;
DROP TABLE IF EXISTS public.wishlist CASCADE;
DROP TABLE IF EXISTS public.user_addresses CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.payment_methods CASCADE;
DROP TABLE IF EXISTS public.shipping_methods CASCADE;
DROP TABLE IF EXISTS public.coupons CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;

-- =====================================================
-- CREATE TABLES
-- =====================================================

-- Categories table
CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    description text,
    image_url text,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT categories_pkey PRIMARY KEY (id),
    CONSTRAINT categories_slug_key UNIQUE (slug)
);

-- Products table
CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255),
    description text,
    short_description text,
    price numeric(10,2) NOT NULL,
    compare_price numeric(10,2),
    cost_price numeric(10,2),
    sku character varying(100),
    barcode character varying(100),
    weight numeric(8,3),
    dimensions jsonb,
    image_url text,
    gallery jsonb,
    category_id uuid,
    category character varying(255),
    stock integer DEFAULT 0 NOT NULL,
    min_stock integer DEFAULT 0 NOT NULL,
    max_stock integer,
    is_active boolean DEFAULT true NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    is_digital boolean DEFAULT false NOT NULL,
    tags text[],
    meta_title character varying(255),
    meta_description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT products_pkey PRIMARY KEY (id),
    CONSTRAINT products_sku_key UNIQUE (sku)
);

-- User profiles table
CREATE TABLE public.user_profiles (
    id uuid NOT NULL,
    full_name character varying(255),
    avatar_url text,
    phone character varying(20),
    role character varying(50) DEFAULT 'customer' NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_profiles_pkey PRIMARY KEY (id)
);

-- Cart items table
CREATE TABLE public.cart_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    product_id uuid NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT cart_items_pkey PRIMARY KEY (id),
    CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    order_number character varying(50) NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    tax_amount numeric(10,2) DEFAULT 0 NOT NULL,
    shipping_cost numeric(10,2) DEFAULT 0 NOT NULL,
    discount_amount numeric(10,2) DEFAULT 0 NOT NULL,
    status character varying(50) DEFAULT 'pending' NOT NULL,
    payment_status character varying(50) DEFAULT 'pending' NOT NULL,
    payment_method character varying(50) DEFAULT 'cod' NOT NULL,
    payment_reference text,
    shipping_address text,
    billing_address text,
    shipping_method character varying(100),
    tracking_number text,
    estimated_delivery date,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (id),
    CONSTRAINT orders_order_number_key UNIQUE (order_number)
);

-- Order items table
CREATE TABLE public.order_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    product_id uuid NOT NULL,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT order_items_pkey PRIMARY KEY (id),
    CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE,
    CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

-- Payment methods table
CREATE TABLE public.payment_methods (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    code character varying(50) NOT NULL,
    description text,
    icon_url text,
    is_active boolean DEFAULT true NOT NULL,
    is_cod boolean DEFAULT false NOT NULL,
    processing_fee numeric(10,2) DEFAULT 0 NOT NULL,
    min_amount numeric(10,2),
    max_amount numeric(10,2),
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT payment_methods_pkey PRIMARY KEY (id),
    CONSTRAINT payment_methods_code_key UNIQUE (code)
);

-- Shipping methods table
CREATE TABLE public.shipping_methods (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    code character varying(50) NOT NULL,
    description text,
    base_cost numeric(10,2) NOT NULL,
    cost_per_kg numeric(10,2) DEFAULT 0 NOT NULL,
    free_shipping_threshold numeric(10,2),
    estimated_days_min integer DEFAULT 1 NOT NULL,
    estimated_days_max integer DEFAULT 3 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    is_cod_available boolean DEFAULT true NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT shipping_methods_pkey PRIMARY KEY (id),
    CONSTRAINT shipping_methods_code_key UNIQUE (code)
);

-- Coupons table
CREATE TABLE public.coupons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(50) NOT NULL,
    description text,
    discount_type character varying(20) DEFAULT 'percentage' NOT NULL,
    discount_value numeric(10,2) NOT NULL,
    minimum_amount numeric(10,2),
    maximum_discount numeric(10,2),
    usage_limit integer,
    used_count integer DEFAULT 0 NOT NULL,
    valid_from timestamp with time zone DEFAULT now() NOT NULL,
    valid_until timestamp with time zone,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT coupons_pkey PRIMARY KEY (id),
    CONSTRAINT coupons_code_key UNIQUE (code)
);

-- Site settings table
CREATE TABLE public.site_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key character varying(100) NOT NULL,
    value text,
    description text,
    type character varying(50) DEFAULT 'string' NOT NULL,
    is_public boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT site_settings_pkey PRIMARY KEY (id),
    CONSTRAINT site_settings_key_key UNIQUE (key)
);

-- =====================================================
-- INSERT DEMO DATA
-- =====================================================

-- Insert categories
INSERT INTO public.categories (name, slug, description, image_url, display_order) VALUES
('Electronics', 'electronics', 'Latest gadgets and electronic devices', 'https://images.unsplash.com/photo-1526170375885-4d8ccd82cdfd?w=400&h=400&fit=crop', 1),
('Fashion', 'fashion', 'Trendy clothing and accessories', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop', 2),
('Home & Living', 'home-living', 'Home improvement and living essentials', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', 3),
('Sports & Fitness', 'sports-fitness', 'Sports equipment and fitness gear', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 4),
('Books & Media', 'books-media', 'Books, magazines, and digital media', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 5),
('Beauty & Health', 'beauty-health', 'Beauty products and health supplements', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 6);

-- Insert payment methods
INSERT INTO public.payment_methods (name, code, description, icon_url, is_active, is_cod, processing_fee, min_amount, max_amount, display_order) VALUES
('Cash on Delivery', 'cod', 'Pay when your order arrives', 'https://cdn-icons-png.flaticon.com/512/157/157933.png', true, true, 0, 0, 10000000, 1),
('Bank Transfer', 'bank_transfer', 'Transfer to our bank account', 'https://cdn-icons-png.flaticon.com/512/157/157933.png', true, false, 0, 0, 10000000, 2),
('Credit Card', 'credit_card', 'Pay with Visa, Mastercard, or JCB', 'https://cdn-icons-png.flaticon.com/512/179/179457.png', true, false, 2500, 10000, 50000000, 3),
('E-Wallet', 'ewallet', 'Pay with OVO, GoPay, DANA, or LinkAja', 'https://cdn-icons-png.flaticon.com/512/179/179457.png', true, false, 0, 10000, 10000000, 4),
('QRIS', 'qris', 'Scan QR code to pay', 'https://cdn-icons-png.flaticon.com/512/179/179457.png', true, false, 0, 10000, 5000000, 5);

-- Insert shipping methods
INSERT INTO public.shipping_methods (name, code, description, base_cost, cost_per_kg, free_shipping_threshold, estimated_days_min, estimated_days_max, is_active, is_cod_available, display_order) VALUES
('Regular Shipping', 'regular', 'Standard delivery service', 15000, 5000, 500000, 3, 5, true, true, 1),
('Express Shipping', 'express', 'Fast delivery service', 25000, 8000, 1000000, 1, 2, true, true, 2),
('Same Day Delivery', 'same_day', 'Delivery on the same day', 50000, 10000, 2000000, 0, 1, true, false, 3),
('Next Day Delivery', 'next_day', 'Delivery the next day', 35000, 8000, 1500000, 1, 1, true, true, 4);

-- Insert coupons
INSERT INTO public.coupons (code, description, discount_type, discount_value, minimum_amount, usage_limit, valid_until) VALUES
('WELCOME10', 'Welcome discount for new customers', 'percentage', 10, 100000, 100, NOW() + INTERVAL '30 days'),
('SAVE50K', 'Save 50K on orders over 500K', 'fixed', 50000, 500000, 50, NOW() + INTERVAL '15 days'),
('FREESHIP', 'Free shipping on all orders', 'fixed', 25000, 0, 200, NOW() + INTERVAL '7 days');

-- Insert site settings
INSERT INTO public.site_settings (key, value, description, type, is_public) VALUES
('site_name', 'Jon''s Store', 'Website name', 'string', true),
('site_description', 'Premium e-commerce store with quality products', 'Website description', 'string', true),
('currency', 'IDR', 'Default currency', 'string', true),
('currency_symbol', 'Rp', 'Currency symbol', 'string', true),
('free_shipping_threshold', '500000', 'Minimum order for free shipping', 'number', true),
('contact_email', 'admin@jonsstore.com', 'Contact email', 'string', true),
('contact_phone', '+62 812 3456 7890', 'Contact phone', 'string', true);

-- Insert comprehensive demo products
INSERT INTO public.products (name, slug, description, short_description, price, compare_price, cost_price, sku, barcode, weight, dimensions, image_url, gallery, category, stock, min_stock, max_stock, is_active, is_featured, is_digital, tags, meta_title, meta_description) VALUES

-- Electronics (Premium Products)
('iPhone 15 Pro', 'iphone-15-pro', 'Latest iPhone with advanced camera system and A17 Pro chip. Features titanium build, A17 Pro chip, and advanced camera system with 5x optical zoom.', 'Premium iPhone with titanium build', 15999000, 17999000, 12000000, 'IPH15PRO', '1234567890001', 0.2, '{"length": 15.0, "width": 7.0, "height": 0.8}', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop"]', 'Electronics', 50, 5, 100, true, true, false, '{"smartphone", "apple", "premium", "camera"}', 'iPhone 15 Pro - Premium Smartphone', 'Latest iPhone with advanced camera system and A17 Pro chip'),

('MacBook Air M2', 'macbook-air-m2', 'Ultra-thin laptop with M2 chip and all-day battery life. Perfect for professionals and students with 13.6-inch Liquid Retina display.', 'Ultra-thin laptop with M2 chip', 18999000, 20999000, 14000000, 'MBAIRM2', '1234567890002', 1.2, '{"length": 30.0, "width": 21.0, "height": 1.1}', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop"]', 'Electronics', 25, 3, 50, true, true, false, '{"laptop", "apple", "m2", "professional"}', 'MacBook Air M2 - Ultra-thin Laptop', 'Ultra-thin laptop with M2 chip and all-day battery life'),

('Sony WH-1000XM5', 'sony-wh-1000xm5', 'Industry-leading noise canceling headphones with 30-hour battery life and premium sound quality.', 'Premium noise canceling headphones', 4999000, 5499000, 3000000, 'SWH1000XM5', '1234567890003', 0.25, '{"length": 20.0, "width": 17.0, "height": 7.0}', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop"]', 'Electronics', 30, 3, 60, true, false, false, '{"headphones", "sony", "noise-canceling", "premium"}', 'Sony WH-1000XM5 - Noise Canceling Headphones', 'Industry-leading noise canceling headphones'),

('Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'Premium Android smartphone with S Pen, 200MP camera, and AI features. The ultimate productivity device.', 'Premium Android smartphone with S Pen', 19999000, 21999000, 15000000, 'SGS24U', '1234567890004', 0.23, '{"length": 16.2, "width": 7.9, "height": 0.8}', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop"]', 'Electronics', 40, 5, 80, true, true, false, '{"smartphone", "samsung", "s-pen", "premium"}', 'Samsung Galaxy S24 Ultra - Premium Android', 'Premium Android smartphone with S Pen and 200MP camera'),

('iPad Pro 12.9"', 'ipad-pro-12-9', 'Professional tablet with M2 chip and Liquid Retina XDR display. Perfect for creative professionals.', 'Professional tablet with M2 chip', 12999000, 14999000, 9000000, 'IPADPRO12', '1234567890005', 0.68, '{"length": 28.0, "width": 21.5, "height": 0.6}', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop"]', 'Electronics', 35, 3, 70, true, true, false, '{"tablet", "apple", "m2", "professional"}', 'iPad Pro 12.9" - Professional Tablet', 'Professional tablet with M2 chip and Liquid Retina XDR display'),

-- Fashion (Trendy Products)
('Nike Air Max 270', 'nike-air-max-270', 'Comfortable running shoes with Max Air cushioning and modern design. Perfect for daily wear and workouts.', 'Premium running shoes', 2499000, 2799000, 1800000, 'NAM270', '1234567890006', 0.8, '{"length": 32.0, "width": 12.0, "height": 10.0}', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop"]', 'Fashion', 40, 5, 80, true, true, false, '{"shoes", "nike", "running", "sport"}', 'Nike Air Max 270 - Running Shoes', 'Comfortable running shoes with Max Air cushioning'),

('Levi''s 501 Original Jeans', 'levis-501-original-jeans', 'Classic straight-fit jeans in authentic denim. The original blue jean that started it all.', 'Classic straight-fit jeans', 899000, 999000, 600000, 'L501', '1234567890007', 0.6, '{"length": 42.0, "width": 16.0, "height": 1.0}', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop"]', 'Fashion', 60, 10, 120, true, false, false, '{"jeans", "levis", "denim", "classic"}', 'Levi''s 501 Original Jeans - Classic Denim', 'Classic straight-fit jeans in authentic denim'),

('Adidas Originals T-Shirt', 'adidas-originals-tshirt', 'Classic cotton t-shirt with Adidas branding. Comfortable and stylish for everyday wear.', 'Classic cotton t-shirt', 299000, 349000, 200000, 'AOTSHIRT', '1234567890008', 0.2, '{"length": 30.0, "width": 20.0, "height": 0.5}', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop"]', 'Fashion', 80, 10, 150, true, false, false, '{"tshirt", "adidas", "cotton", "casual"}', 'Adidas Originals T-Shirt - Classic Cotton', 'Classic cotton t-shirt with Adidas branding'),

-- Home & Living (Quality Products)
('IKEA Billy Bookcase', 'ikea-billy-bookcase', 'Classic white bookcase with adjustable shelves. Perfect for organizing books and displaying items.', 'Classic white bookcase', 1299000, 1499000, 800000, 'IBB', '1234567890009', 15.0, '{"length": 80.0, "width": 28.0, "height": 202.0}', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop"]', 'Home & Living', 20, 2, 40, true, true, false, '{"bookcase", "ikea", "furniture", "storage"}', 'IKEA Billy Bookcase - Classic Storage', 'Classic white bookcase with adjustable shelves'),

('Philips Hue Smart Bulb', 'philips-hue-smart-bulb', 'Smart LED bulb with 16 million colors and voice control. Create the perfect ambiance for any mood.', 'Smart LED bulb with colors', 599000, 699000, 400000, 'PHSB', '1234567890010', 0.1, '{"length": 6.0, "width": 6.0, "height": 10.0}', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop"]', 'Home & Living', 50, 5, 100, true, false, false, '{"smart", "led", "philips", "home-automation"}', 'Philips Hue Smart Bulb - Smart Lighting', 'Smart LED bulb with 16 million colors'),

('KitchenAid Stand Mixer', 'kitchenaid-stand-mixer', 'Professional stand mixer for baking and cooking. The ultimate kitchen companion for serious bakers.', 'Professional stand mixer', 8999000, 9999000, 6000000, 'KASM', '1234567890011', 12.0, '{"length": 35.0, "width": 25.0, "height": 30.0}', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop"]', 'Home & Living', 15, 2, 30, true, true, false, '{"mixer", "kitchenaid", "baking", "professional"}', 'KitchenAid Stand Mixer - Professional Baking', 'Professional stand mixer for baking and cooking'),

-- Sports & Fitness (Performance Products)
('Yoga Mat Premium', 'yoga-mat-premium', 'Non-slip yoga mat with carrying strap. Perfect for yoga, pilates, and home workouts.', 'Non-slip yoga mat', 299000, 349000, 200000, 'YMP', '1234567890012', 1.5, '{"length": 68.0, "width": 24.0, "height": 0.5}', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop"]', 'Sports & Fitness', 35, 5, 70, true, false, false, '{"yoga", "mat", "fitness", "exercise"}', 'Yoga Mat Premium - Non-slip Fitness', 'Non-slip yoga mat with carrying strap'),

('Dumbbell Set 20kg', 'dumbbell-set-20kg', 'Adjustable dumbbell set for home workouts. Build strength and muscle with this versatile equipment.', 'Adjustable dumbbell set', 1999000, 2299000, 1500000, 'DS20', '1234567890013', 20.0, '{"length": 50.0, "width": 15.0, "height": 8.0}', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop"]', 'Sports & Fitness', 25, 3, 50, true, true, false, '{"dumbbell", "weights", "fitness", "strength"}', 'Dumbbell Set 20kg - Home Workout', 'Adjustable dumbbell set for home workouts'),

('Resistance Bands Set', 'resistance-bands-set', 'Set of 5 resistance bands with handles. Portable fitness solution for home and travel workouts.', 'Set of 5 resistance bands', 199000, 249000, 120000, 'RBS', '1234567890014', 0.5, '{"length": 30.0, "width": 20.0, "height": 5.0}', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop"]', 'Sports & Fitness', 45, 5, 90, true, false, false, '{"resistance", "bands", "fitness", "portable"}', 'Resistance Bands Set - Portable Fitness', 'Set of 5 resistance bands with handles'),

-- Books & Media (Educational Products)
('The Psychology of Money', 'psychology-of-money', 'Bestselling book about money and investing. Learn timeless lessons on wealth, greed, and happiness.', 'Bestselling book about money', 199000, 249000, 120000, 'POM', '1234567890015', 0.3, '{"length": 20.0, "width": 13.0, "height": 2.0}', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop"]', 'Books & Media', 100, 10, 200, true, true, false, '{"book", "money", "psychology", "finance"}', 'The Psychology of Money - Financial Wisdom', 'Bestselling book about money and investing'),

('Kindle Paperwhite', 'kindle-paperwhite', 'E-reader with 6.8" display and waterproof design. Perfect for reading anywhere with weeks of battery life.', 'E-reader with 6.8" display', 2999000, 3299000, 2000000, 'KPW', '1234567890016', 0.2, '{"length": 15.0, "width": 10.0, "height": 0.8}', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop"]', 'Books & Media', 30, 3, 60, true, false, false, '{"kindle", "ereader", "amazon", "reading"}', 'Kindle Paperwhite - E-Reader', 'E-reader with 6.8" display and waterproof design'),

-- Beauty & Health (Wellness Products)
('Olay Regenerist Moisturizer', 'olay-regenerist-moisturizer', 'Anti-aging daily moisturizer with SPF 30. Advanced formula for younger-looking skin.', 'Anti-aging daily moisturizer', 299000, 349000, 200000, 'ORM', '1234567890017', 0.15, '{"length": 8.0, "width": 3.0, "height": 12.0}', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop"]', 'Beauty & Health', 120, 10, 200, true, false, false, '{"skincare", "moisturizer", "anti-aging", "olay"}', 'Olay Regenerist Moisturizer - Anti-Aging', 'Anti-aging daily moisturizer with SPF 30'),

('Neutrogena Face Wash', 'neutrogena-face-wash', 'Gentle daily facial cleanser for all skin types. Removes dirt and oil without over-drying.', 'Gentle daily facial cleanser', 149000, 179000, 100000, 'NFW', '1234567890018', 0.2, '{"length": 6.0, "width": 3.0, "height": 15.0}', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop"]', 'Beauty & Health', 200, 20, 300, true, false, false, '{"skincare", "face-wash", "cleanser", "neutrogena"}', 'Neutrogena Face Wash - Gentle Cleanser', 'Gentle daily facial cleanser for all skin types'),

('L''Oreal Hair Mask', 'loreal-hair-mask', 'Intensive repair hair mask for damaged hair. Restores shine and strength with keratin treatment.', 'Intensive repair hair mask', 199000, 249000, 120000, 'LHM', '1234567890019', 0.3, '{"length": 7.0, "width": 4.0, "height": 18.0}', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop"]', 'Beauty & Health', 150, 15, 250, true, false, false, '{"hair-care", "mask", "repair", "loreal"}', 'L''Oreal Hair Mask - Intensive Repair', 'Intensive repair hair mask for damaged hair'),

('Maybelline Mascara', 'maybelline-mascara', 'Volumizing mascara for dramatic lashes. Long-lasting formula that won''t clump or smudge.', 'Volumizing mascara', 129000, 149000, 80000, 'MM', '1234567890020', 0.05, '{"length": 2.0, "width": 1.0, "height": 12.0}', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop', '["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop"]', 'Beauty & Health', 180, 20, 300, true, false, false, '{"makeup", "mascara", "volumizing", "maybelline"}', 'Maybelline Mascara - Volumizing', 'Volumizing mascara for dramatic lashes');

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Products indexes
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_products_is_featured ON public.products(is_featured);
CREATE INDEX idx_products_price ON public.products(price);
CREATE INDEX idx_products_created_at ON public.products(created_at);

-- Categories indexes
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_is_active ON public.categories(is_active);
CREATE INDEX idx_categories_display_order ON public.categories(display_order);

-- Orders indexes
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);

-- Payment methods indexes
CREATE INDEX idx_payment_methods_code ON public.payment_methods(code);
CREATE INDEX idx_payment_methods_is_active ON public.payment_methods(is_active);

-- Shipping methods indexes
CREATE INDEX idx_shipping_methods_code ON public.shipping_methods(code);
CREATE INDEX idx_shipping_methods_is_active ON public.shipping_methods(is_active);

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Schema is now ready for presentation!
-- Features included:
-- ✅ 20+ comprehensive demo products across 6 categories
-- ✅ Complete payment methods including COD
-- ✅ Multiple shipping options with free shipping
-- ✅ Coupon system with discounts
-- ✅ Site settings and configuration
-- ✅ Optimized indexes for performance
-- ✅ Ready for immediate use and presentation
