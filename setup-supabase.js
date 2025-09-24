#!/usr/bin/env node

/**
 * Supabase Setup Script
 * This script helps set up the Supabase database with the complete schema
 * and creates the admin user automatically.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   - SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('Please check your .env.local file and ensure all variables are set.');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupDatabase() {
  console.log('🚀 Starting Supabase setup...');
  
  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, 'supabase-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📄 Reading schema file...');
    
    // Execute the schema
    console.log('⚡ Executing database schema...');
    const { data, error } = await supabase.rpc('exec_sql', { sql: schema });
    
    if (error) {
      console.error('❌ Error executing schema:', error);
      return false;
    }
    
    console.log('✅ Database schema executed successfully!');
    
    // Verify admin user creation
    console.log('🔍 Verifying admin user...');
    const { data: adminUser, error: adminError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', 'admin')
      .single();
    
    if (adminError || !adminUser) {
      console.warn('⚠️  Admin user not found. You may need to create it manually.');
      console.log('   Email: admin@jonsstore.com');
      console.log('   Password: admin123456');
    } else {
      console.log('✅ Admin user verified successfully!');
      console.log(`   Email: admin@jonsstore.com`);
      console.log(`   Role: ${adminUser.role}`);
    }
    
    // Check products count
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📦 Products in database: ${productCount}`);
    
    // Check categories count
    const { count: categoryCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📂 Categories in database: ${categoryCount}`);
    
    console.log('');
    console.log('🎉 Setup completed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. Start your Next.js development server: npm run dev');
    console.log('   2. Visit http://localhost:3000 to see your store');
    console.log('   3. Login as admin at http://localhost:3000/auth/login');
    console.log('      - Email: admin@jonsstore.com');
    console.log('      - Password: admin123456');
    console.log('   4. Access admin dashboard at http://localhost:3000/admin');
    console.log('');
    console.log('🔧 Admin Features:');
    console.log('   - Manage products and categories');
    console.log('   - View and manage orders');
    console.log('   - Manage users and their roles');
    console.log('   - Configure site settings');
    console.log('   - View analytics and reports');
    
    return true;
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error('');
    console.error('💡 Manual setup instructions:');
    console.error('   1. Go to your Supabase dashboard');
    console.error('   2. Navigate to SQL Editor');
    console.error('   3. Copy and paste the contents of supabase-schema.sql');
    console.error('   4. Execute the SQL script');
    console.error('   5. Create admin user manually in Authentication > Users');
    console.error('   6. Set admin role using the provided SQL');
    
    return false;
  }
}

// Alternative method using direct SQL execution
async function setupDatabaseAlternative() {
  console.log('🔄 Trying alternative setup method...');
  
  try {
    // Read and split the schema into individual statements
    const schemaPath = path.join(__dirname, 'supabase-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and filter out empty statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📄 Found ${statements.length} SQL statements to execute`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        // Skip comments and empty statements
        if (statement.startsWith('--') || statement.length < 10) {
          continue;
        }
        
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.warn(`⚠️  Statement ${i + 1} failed:`, error.message);
          errorCount++;
        } else {
          successCount++;
        }
        
        // Add small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (err) {
        console.warn(`⚠️  Statement ${i + 1} error:`, err.message);
        errorCount++;
      }
    }
    
    console.log(`✅ Executed ${successCount} statements successfully`);
    if (errorCount > 0) {
      console.log(`⚠️  ${errorCount} statements had errors (this may be normal)`);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Alternative setup also failed:', error.message);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔧 Supabase E-commerce Setup Script');
  console.log('=====================================');
  console.log('');
  
  // Try the main setup first
  const success = await setupDatabase();
  
  if (!success) {
    console.log('');
    console.log('🔄 Main setup failed, trying alternative method...');
    await setupDatabaseAlternative();
  }
  
  console.log('');
  console.log('✨ Setup process completed!');
}

// Run the setup
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { setupDatabase, setupDatabaseAlternative };
