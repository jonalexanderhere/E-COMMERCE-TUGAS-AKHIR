// setup-database.js
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🚀 Setting up database...')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    console.log('📊 Checking database status...')
    
    // Check if tables exist
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
    
    if (tableError) {
      console.error('❌ Error checking tables:', tableError.message)
      return
    }
    
    const tableNames = tables?.map(t => t.table_name) || []
    console.log('📋 Existing tables:', tableNames)
    
    // Check if categories exist
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .limit(1)
    
    if (catError) {
      console.log('⚠️  Categories table not found or empty')
      console.log('📝 Please run schema-production.sql in Supabase SQL Editor')
      return
    }
    
    console.log('✅ Categories found:', categories?.length || 0)
    
    // Check if products exist
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('*')
      .limit(1)
    
    if (prodError) {
      console.log('⚠️  Products table not found or empty')
      console.log('📝 Please run schema-production.sql in Supabase SQL Editor')
      return
    }
    
    console.log('✅ Products found:', products?.length || 0)
    
    // Check if admin user exists
    const { data: admin, error: adminError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', 'admin')
      .limit(1)
    
    if (adminError) {
      console.log('⚠️  Admin user not found')
      console.log('📝 Please run schema-production.sql in Supabase SQL Editor')
      return
    }
    
    console.log('✅ Admin user found:', admin?.length || 0)
    
    if (categories && categories.length > 0 && products && products.length > 0 && admin && admin.length > 0) {
      console.log('\n🎉 Database setup is complete!')
      console.log('✅ Categories:', categories.length)
      console.log('✅ Products:', products.length)
      console.log('✅ Admin user:', admin.length)
      console.log('\n🚀 You can now run: npm run dev')
    } else {
      console.log('\n⚠️  Database setup incomplete.')
      console.log('📝 Please run the schema-production.sql in Supabase SQL Editor')
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Check your .env.local file')
    console.log('2. Verify Supabase project is active')
    console.log('3. Run schema-production.sql in Supabase SQL Editor')
    console.log('4. Check Supabase dashboard for errors')
  }
}

setupDatabase()
