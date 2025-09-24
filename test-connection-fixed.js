// test-connection-fixed.js
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase Connection...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NOT SET')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!')
  console.error('Please check your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('\n📊 Testing database connection...')
    
    let categories = []
    let products = []
    let profiles = []
    let settings = []
    let coupons = []
    
    // Test 1: Categories
    console.log('\n1. Testing categories...')
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .limit(3)
      
      if (error) {
        console.error('❌ Categories error:', error.message)
        console.log('🔄 Using fallback categories data')
      } else {
        categories = data || []
        console.log('✅ Categories loaded:', categories.length, 'items')
        if (categories.length > 0) {
          console.log('   Sample:', categories[0].name)
        }
      }
    } catch (err) {
      console.error('❌ Categories connection failed:', err.message)
      console.log('🔄 Using fallback categories data')
    }
    
    // Test 2: Products
    console.log('\n2. Testing products...')
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(3)
      
      if (error) {
        console.error('❌ Products error:', error.message)
      } else {
        products = data || []
        console.log('✅ Products loaded:', products.length, 'items')
        if (products.length > 0) {
          console.log('   Sample:', products[0].name)
        }
      }
    } catch (err) {
      console.error('❌ Products connection failed:', err.message)
    }
    
    // Test 3: User Profiles
    console.log('\n3. Testing user profiles...')
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(3)
      
      if (error) {
        console.error('❌ User profiles error:', error.message)
      } else {
        profiles = data || []
        console.log('✅ User profiles loaded:', profiles.length, 'items')
        if (profiles.length > 0) {
          console.log('   Sample:', profiles[0].role)
        }
      }
    } catch (err) {
      console.error('❌ User profiles connection failed:', err.message)
    }
    
    // Test 4: Site Settings
    console.log('\n4. Testing site settings...')
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(3)
      
      if (error) {
        console.error('❌ Site settings error:', error.message)
      } else {
        settings = data || []
        console.log('✅ Site settings loaded:', settings.length, 'items')
        if (settings.length > 0) {
          console.log('   Sample:', settings[0].key, '=', settings[0].value)
        }
      }
    } catch (err) {
      console.error('❌ Site settings connection failed:', err.message)
    }
    
    // Test 5: Coupons
    console.log('\n5. Testing coupons...')
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .limit(3)
      
      if (error) {
        console.error('❌ Coupons error:', error.message)
      } else {
        coupons = data || []
        console.log('✅ Coupons loaded:', coupons.length, 'items')
        if (coupons.length > 0) {
          console.log('   Sample:', coupons[0].code)
        }
      }
    } catch (err) {
      console.error('❌ Coupons connection failed:', err.message)
    }
    
    console.log('\n🎉 Database connection test completed!')
    console.log('\n📋 Summary:')
    console.log(`   Categories: ${categories.length}`)
    console.log(`   Products: ${products.length}`)
    console.log(`   User Profiles: ${profiles.length}`)
    console.log(`   Site Settings: ${settings.length}`)
    console.log(`   Coupons: ${coupons.length}`)
    
    if (categories.length > 0 && products.length > 0) {
      console.log('\n✅ Database setup is complete and working!')
      console.log('🚀 You can now run: npm run dev')
    } else {
      console.log('\n⚠️  Database setup incomplete.')
      console.log('📝 Please run the schema-fixed-final.sql in Supabase SQL Editor')
      console.log('🔧 This will fix all database issues and provide sample data')
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Check your .env.local file')
    console.log('2. Verify Supabase project is active')
    console.log('3. Run schema-fixed-final.sql in Supabase SQL Editor')
    console.log('4. Check Supabase dashboard for errors')
    console.log('5. Ensure RLS is disabled for testing')
  }
}

testConnection()
