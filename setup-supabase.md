# Supabase Setup Guide

## Environment Variables
The `.env.local` file has been created with your Supabase configuration. All necessary environment variables are now set up.

## Database Setup

### 1. Run the Supabase Schema
Execute the SQL commands in `supabase-schema.sql` in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Execute the script

### 2. Create Admin User
After running the schema, create an admin user:

1. Go to Authentication > Users in your Supabase dashboard
2. Click "Add user"
3. Set email: `admin@jonsstore.com`
4. Set password: `admin123456`
5. Confirm the user

### 3. Set Admin Role
Run this SQL in the SQL Editor to make the user an admin:

```sql
UPDATE user_profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@jonsstore.com');
```

## Package Updates
The following packages have been updated to fix deprecation warnings:
- ESLint: Updated to compatible version
- Next.js: Updated to 14.2.5
- All dependencies are now compatible

## Running the Application
1. Start the development server: `npm run dev`
2. Open http://localhost:3000
3. Test the authentication with the admin user

## Features Available
- User registration and login
- Product browsing and cart functionality
- Order management
- Admin dashboard for product management
- Responsive design with modern UI

## Troubleshooting
If you encounter any issues:
1. Check that all environment variables are set correctly
2. Verify the Supabase schema has been applied
3. Ensure the admin user has been created and assigned the admin role
4. Check the browser console for any errors

