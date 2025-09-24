-- =====================================================
-- ALTERNATIVE ADMIN USER CREATION
-- =====================================================
-- This approach uses Supabase's built-in functions
-- Run this if the direct INSERT approach fails

-- Method 1: Use Supabase's auth.admin_create_user function
-- This is the recommended way to create admin users
SELECT auth.admin_create_user(
  'admin@jonsstore.com',
  'admin123456',
  '{"full_name": "Admin User", "avatar_url": null}'::jsonb,
  '{"role": "admin"}'::jsonb
);

-- Method 2: Create user profile after manual user creation
-- If you create the user manually in Supabase Auth dashboard:
-- 1. Go to Authentication > Users
-- 2. Click "Add User"
-- 3. Email: admin@jonsstore.com
-- 4. Password: admin123456
-- 5. Auto Confirm User: ✅ (checked)
-- 6. Then run this SQL:

-- Update the user profile to admin role
UPDATE user_profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@jonsstore.com');

-- Method 3: Simple user creation without complex auth structure
-- This creates a basic user that can be promoted to admin
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@jonsstore.com',
    crypt('admin123456', gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Admin User"}',
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Create admin profile
INSERT INTO user_profiles (
    id,
    full_name,
    first_name,
    last_name,
    role,
    is_active,
    email_verified,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'admin@jonsstore.com'),
    'Admin User',
    'Admin',
    'User',
    'admin',
    true,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    updated_at = NOW();

-- Verify admin user creation
SELECT 
    u.email,
    p.role,
    p.full_name,
    p.is_active
FROM auth.users u
JOIN user_profiles p ON u.id = p.id
WHERE u.email = 'admin@jonsstore.com';
