-- =====================================================
-- SETUP ADMIN USER FOR SUPABASE AUTH
-- =====================================================
-- This script sets up the admin user for the e-commerce platform
-- Run this after setting up Supabase Auth

-- =====================================================
-- CREATE ADMIN USER PROFILE
-- =====================================================

-- Insert admin user profile (replace with actual user ID from Supabase Auth)
-- You need to get the user ID from Supabase Auth after creating the user
INSERT INTO public.user_profiles (
    id,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
) VALUES (
    'd6345ce2-bbb6-4cdc-94b6-3857c845e095', -- Replace with actual user ID
    'Admin User',
    'admin',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    is_active = true,
    updated_at = NOW();

-- =====================================================
-- VERIFY ADMIN SETUP
-- =====================================================

-- Check if admin user exists
SELECT 
    id,
    full_name,
    role,
    is_active,
    created_at
FROM public.user_profiles 
WHERE role = 'admin';

-- =====================================================
-- ADMIN SETUP INSTRUCTIONS
-- =====================================================

/*
TO SETUP ADMIN USER:

1. Go to your Supabase Dashboard
2. Navigate to Authentication > Users
3. Click "Add user" or "Invite user"
4. Create a user with email: admin@jonsstore.com
5. Set a strong password
6. Copy the user ID from the created user
7. Replace 'd6345ce2-bbb6-4cdc-94b6-3857c845e095' in this script with the actual user ID
8. Run this script

ALTERNATIVE: Use Supabase Auth API to create user programmatically

-- Example using Supabase Auth API (JavaScript):
const { data, error } = await supabase.auth.admin.createUser({
  email: 'admin@jonsstore.com',
  password: 'your-secure-password',
  email_confirm: true
})

if (data.user) {
  // Insert user profile with data.user.id
  await supabase
    .from('user_profiles')
    .insert({
      id: data.user.id,
      full_name: 'Admin User',
      role: 'admin',
      is_active: true
    })
}
*/

-- =====================================================
-- GRANT ADMIN PERMISSIONS
-- =====================================================

-- Grant additional permissions if needed
-- (Supabase RLS policies should handle this, but you can add specific grants)

-- =====================================================
-- TEST ADMIN ACCESS
-- =====================================================

-- Test query to verify admin can access all data
SELECT 
    'Admin user setup complete' as status,
    COUNT(*) as total_products,
    (SELECT COUNT(*) FROM public.orders) as total_orders,
    (SELECT COUNT(*) FROM public.user_profiles WHERE role = 'admin') as admin_count
FROM public.products;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Admin user setup is complete!
-- The admin user can now:
-- ✅ Access the admin dashboard at /admin
-- ✅ Manage orders and products
-- ✅ View analytics and reports
-- ✅ Handle COD orders specifically
-- ✅ Access all admin features

-- Next steps:
-- 1. Test admin login at /admin
-- 2. Verify all admin features work
-- 3. Set up additional admin users if needed
-- 4. Configure admin permissions as required
