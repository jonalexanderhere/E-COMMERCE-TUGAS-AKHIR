-- =====================================================
-- FIX ADMIN USER - UPDATE EXISTING USER ROLE
-- =====================================================
-- This script updates the existing user to admin role

-- Update existing user to admin role
UPDATE public.user_profiles 
SET role = 'admin', 
    full_name = 'Admin User',
    is_active = true
WHERE id = 'd6345ce2-bbb6-4cdc-94b6-3857c845e095';

-- Insert admin profile if not exists
INSERT INTO public.user_profiles (id, full_name, role, is_active)
VALUES ('d6345ce2-bbb6-4cdc-94b6-3857c845e095', 'Admin User', 'admin', true)
ON CONFLICT (id) DO UPDATE SET 
  role = 'admin',
  full_name = 'Admin User',
  is_active = true;

-- Verify admin user
SELECT id, full_name, role, is_active, created_at 
FROM public.user_profiles 
WHERE id = 'd6345ce2-bbb6-4cdc-94b6-3857c845e095';
