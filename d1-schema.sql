-- D1 SQLite Schema for JonsStore E-commerce
-- Compatible with Cloudflare D1 Database

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL, -- Price in cents (e.g., 15999000 = $159,990.00)
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    user_id TEXT NOT NULL,
    total_amount INTEGER NOT NULL, -- Total in cents
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_purchase INTEGER NOT NULL, -- Price in cents at time of purchase
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

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
('Google Pixel 8 Pro', 'AI-powered smartphone with advanced camera', 11999000, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', 'Electronics', 45),
('OnePlus 12', 'Flagship Android phone with fast charging', 9999000, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', 'Electronics', 35),
('LG OLED C3', '65-inch OLED 4K Smart TV with AI ThinQ', 12999000, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop', 'Electronics', 12),
('Bose QuietComfort 45', 'Premium noise-canceling headphones', 3999000, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop', 'Electronics', 40),
('Steam Deck', 'Handheld gaming PC with Steam OS', 5999000, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop', 'Electronics', 30),

-- Fashion
('Nike Air Max 270', 'Comfortable running shoes with Air Max technology', 1999000, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', 'Fashion', 100),
('Adidas Ultraboost 22', 'High-performance running shoes with Boost technology', 2199000, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', 'Fashion', 80),
('Levi''s 501 Original Jeans', 'Classic straight-fit jeans in blue denim', 1299000, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop', 'Fashion', 150),
('Uniqlo Heattech T-Shirt', 'Thermal base layer for cold weather', 299000, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 'Fashion', 200),
('Zara Blazer', 'Classic navy blazer for professional wear', 899000, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop', 'Fashion', 60),
('H&M Summer Dress', 'Lightweight floral dress for summer', 499000, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop', 'Fashion', 90),
('Converse Chuck Taylor', 'Classic canvas sneakers in white', 899000, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', 'Fashion', 120),
('Vans Old Skool', 'Iconic skateboarding shoes in black and white', 799000, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', 'Fashion', 110),
('Puma Suede Classic', 'Retro sneakers with suede upper', 699000, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', 'Fashion', 95),
('New Balance 990v5', 'Premium running shoes made in USA', 1899000, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', 'Fashion', 70),
('Champion Hoodie', 'Comfortable cotton hoodie with logo', 599000, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop', 'Fashion', 85),
('Tommy Hilfiger Polo', 'Classic polo shirt in navy blue', 799000, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 'Fashion', 75),
('Calvin Klein Underwear Set', 'Cotton boxer briefs 3-pack', 399000, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop', 'Fashion', 180),
('Ralph Lauren Oxford Shirt', 'Classic button-down shirt in white', 999000, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 'Fashion', 65),
('Gucci Belt', 'Leather belt with double G buckle', 3999000, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop', 'Fashion', 25),
('Louis Vuitton Wallet', 'Monogram canvas bi-fold wallet', 5999000, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', 'Fashion', 20),
('Hermes Scarf', 'Silk twill scarf with classic pattern', 8999000, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop', 'Fashion', 15),
('Rolex Submariner', 'Luxury diving watch in stainless steel', 99999000, 'https://images.unsplash.com/photo-1523170335258-f5c6a6f1e0f1?w=400&h=400&fit=crop', 'Fashion', 5),
('Omega Speedmaster', 'Professional chronograph watch', 49999000, 'https://images.unsplash.com/photo-1523170335258-f5c6a6f1e0f1?w=400&h=400&fit=crop', 'Fashion', 8),
('Cartier Santos', 'Elegant square watch with leather strap', 79999000, 'https://images.unsplash.com/photo-1523170335258-f5c6a6f1e0f1?w=400&h=400&fit=crop', 'Fashion', 6),

-- Home & Living
('IKEA Billy Bookcase', 'White bookcase with 5 shelves', 899000, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', 'Home & Living', 50),
('West Elm Sofa', 'Modern 3-seater sofa in gray fabric', 3999000, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', 'Home & Living', 20),
('Crate & Barrel Dining Table', 'Solid wood dining table for 6', 2999000, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', 'Home & Living', 15),
('Pottery Barn Bed Frame', 'Upholstered queen bed frame in navy', 2499000, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', 'Home & Living', 25),
('Anthropologie Throw Pillow', 'Decorative velvet throw pillow', 199000, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', 'Home & Living', 100),
('Williams Sonoma Cookware Set', 'Stainless steel 10-piece cookware set', 1999000, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', 'Home & Living', 30),
('KitchenAid Stand Mixer', 'Professional 5-quart stand mixer in red', 3999000, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', 'Home & Living', 18),
('Dyson V15 Vacuum', 'Cordless stick vacuum with laser dust detection', 6999000, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 'Home & Living', 22),
('Shark Robot Vacuum', 'Self-emptying robot vacuum with mapping', 4999000, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 'Home & Living', 35),
('Philips Hue Smart Bulbs', 'Color-changing smart LED bulbs 4-pack', 999000, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 'Home & Living', 80),
('Nest Thermostat', 'Smart learning thermostat 3rd gen', 2499000, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 'Home & Living', 40),
('Ring Video Doorbell', 'Wi-Fi enabled video doorbell', 1999000, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 'Home & Living', 55),
('Echo Dot 5th Gen', 'Smart speaker with Alexa', 499000, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 'Home & Living', 120),
('Google Nest Hub', 'Smart display with Google Assistant', 999000, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 'Home & Living', 75),
('Sonos One Speaker', 'Smart speaker with voice control', 1999000, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 'Home & Living', 45),
('Instant Pot Duo', '7-in-1 electric pressure cooker', 1299000, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', 'Home & Living', 60),
('Vitamix A3500 Blender', 'Professional-grade blender with presets', 5999000, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', 'Home & Living', 25),
('Breville Espresso Machine', 'Barista Express espresso machine', 6999000, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', 'Home & Living', 20),
('Le Creuset Dutch Oven', 'Enameled cast iron 5.5-quart dutch oven', 2999000, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', 'Home & Living', 30),
('All-Clad Cookware Set', 'Stainless steel tri-ply cookware set', 3999000, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', 'Home & Living', 15),

-- Sports & Fitness
('Peloton Bike', 'Connected fitness bike with live classes', 14990000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 12),
('Bowflex Adjustable Dumbbells', '552 dumbbells with 15 weight settings', 7999000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 25),
('NordicTrack Treadmill', 'Commercial 1750 treadmill with iFit', 19990000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 8),
('Concept2 Rower', 'Model D indoor rowing machine', 9999000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 15),
('TRX Suspension Trainer', 'Complete bodyweight training system', 1999000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 40),
('Yoga Mat Premium', 'Non-slip yoga mat with carrying strap', 299000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 150),
('Resistance Bands Set', '11-piece resistance band set with handles', 199000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 200),
('Kettlebell 20kg', 'Cast iron kettlebell for strength training', 399000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 80),
('Battle Rope 50ft', 'Heavy-duty battle rope for HIIT training', 499000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 60),
('Pull-up Bar', 'Doorway pull-up bar with multiple grips', 299000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 90),
('Foam Roller', 'High-density foam roller for recovery', 199000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 120),
('Jump Rope', 'Speed jump rope with ball bearings', 99000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 180),
('Medicine Ball 10kg', 'Rubber medicine ball for functional training', 299000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 70),
('Ab Wheel', 'Abdominal wheel for core strengthening', 149000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 100),
('Gymnastic Rings', 'Wooden gymnastic rings with straps', 399000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 50),
('Weighted Vest', 'Adjustable weighted vest up to 20kg', 799000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 35),
('Balance Board', 'Wooden balance board for stability training', 249000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 65),
('Punching Bag', 'Heavy bag with chains and mounting hardware', 999000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 20),
('Boxing Gloves', 'Professional boxing gloves 16oz', 399000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 45),
('Tennis Racket', 'Professional tennis racket with strings', 1999000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', 'Sports & Fitness', 30),

-- Books & Media
('The Great Gatsby', 'Classic American novel by F. Scott Fitzgerald', 99000, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', 'Books & Media', 200),
('1984 by George Orwell', 'Dystopian novel about totalitarian control', 129000, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', 'Books & Media', 180),
('Harry Potter Complete Set', 'All 7 books in the Harry Potter series', 999000, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', 'Books & Media', 50),
('The Lord of the Rings Trilogy', 'Epic fantasy trilogy by J.R.R. Tolkien', 799000, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', 'Books & Media', 40),
('Dune by Frank Herbert', 'Science fiction masterpiece', 149000, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', 'Books & Media', 120),
('Atomic Habits', 'Self-help book on building good habits', 199000, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', 'Books & Media', 150),
('Sapiens by Yuval Harari', 'Brief history of humankind', 249000, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', 'Books & Media', 100),
('The Psychology of Money', 'Financial psychology and investment wisdom', 179000, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', 'Books & Media', 130),
('Educated by Tara Westover', 'Memoir about education and family', 199000, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', 'Books & Media', 90),
('Becoming by Michelle Obama', 'Memoir by former First Lady', 229000, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', 'Books & Media', 110),
('The Subtle Art of Not Giving a F*ck', 'Self-help book on personal values', 179000, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', 'Books & Media', 140),
('Thinking, Fast and Slow', 'Psychology book on decision making', 249000, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', 'Books & Media', 80),
('The Lean Startup', 'Business book on startup methodology', 199000, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', 'Books & Media', 95),
('Good to Great', 'Business book on company transformation', 179000, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', 'Books & Media', 85),
('The 7 Habits of Highly Effective People', 'Personal development classic', 199000, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', 'Books & Media', 120),
('Blink by Malcolm Gladwell', 'Book on rapid cognition and decision making', 179000, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', 'Books & Media', 100),
('Outliers by Malcolm Gladwell', 'Book on success and opportunity', 179000, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', 'Books & Media', 90),
('The Tipping Point', 'Book on how little things can make a big difference', 179000, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', 'Books & Media', 85),
('Freakonomics', 'Economic analysis of everyday life', 199000, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', 'Books & Media', 75),
('The Black Swan', 'Book on the impact of highly improbable events', 229000, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', 'Books & Media', 60),

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
('Pantene Shampoo Pro-V', 'Daily moisture renewal shampoo', 129000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 170),
('Aveeno Daily Moisturizer Lotion', 'Fragrance-free daily moisturizing lotion', 199000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 140),
('CoverGirl Foundation', 'Long-lasting liquid foundation', 179000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 110),
('Dove Body Wash Nourishing', 'Nourishing body wash with moisturizer', 99000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 250),
('Clinique Eye Cream', 'Anti-aging eye cream for dark circles', 399000, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', 'Beauty & Health', 80);

-- Create admin user profile (you'll need to create the auth user first)
-- INSERT INTO user_profiles (id, full_name, role) VALUES ('admin-user-id', 'Admin User', 'admin');

-- Instructions for creating admin user:
-- 1. Create a user in your authentication system with email: admin@jonsstore.com and password: admin123456
-- 2. Get the user ID from your auth system
-- 3. Run: INSERT INTO user_profiles (id, full_name, role) VALUES ('your-admin-user-id', 'Admin User', 'admin');
