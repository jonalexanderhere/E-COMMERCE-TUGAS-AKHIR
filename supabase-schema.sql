-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category VARCHAR(100) NOT NULL,
  stock INTEGER DEFAULT 0,
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

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

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

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
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
