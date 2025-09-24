// test-connection.js
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
    
    // Test 1: Categories
    console.log('\n1. Testing categories...')
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .limit(3)
    
    if (catError) {
      console.error('❌ Categories error:', catError.message)
    } else {
      console.log('✅ Categories loaded:', categories?.length || 0, 'items')
      if (categories && categories.length > 0) {
        console.log('   Sample:', categories[0].name)
      }
    }
    
    // Test 2: Products
    console.log('\n2. Testing products...')
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('*')
      .limit(3)
    
    if (prodError) {
      console.error('❌ Products error:', prodError.message)
    } else {
      console.log('✅ Products loaded:', products?.length || 0, 'items')
      if (products && products.length > 0) {
        console.log('   Sample:', products[0].name)
      }
    }
    
    // Test 3: User Profiles
    console.log('\n3. Testing user profiles...')
    const { data: profiles, error: profError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(3)
    
    if (profError) {
      console.error('❌ User profiles error:', profError.message)
    } else {
      console.log('✅ User profiles loaded:', profiles?.length || 0, 'items')
      if (profiles && profiles.length > 0) {
        console.log('   Sample:', profiles[0].role)
      }
    }
    
    // Test 4: Site Settings
    console.log('\n4. Testing site settings...')
    const { data: settings, error: setError } = await supabase
      .from('site_settings')
      .select('*')
      .limit(3)
    
    if (setError) {
      console.error('❌ Site settings error:', setError.message)
    } else {
      console.log('✅ Site settings loaded:', settings?.length || 0, 'items')
      if (settings && settings.length > 0) {
        console.log('   Sample:', settings[0].key, '=', settings[0].value)
      }
    }
    
    // Test 5: Coupons
    console.log('\n5. Testing coupons...')
    const { data: coupons, error: coupError } = await supabase
      .from('coupons')
      .select('*')
      .limit(3)
    
    if (coupError) {
      console.error('❌ Coupons error:', coupError.message)
    } else {
      console.log('✅ Coupons loaded:', coupons?.length || 0, 'items')
      if (coupons && coupons.length > 0) {
        console.log('   Sample:', coupons[0].code)
      }
    }
    
    console.log('\n🎉 Database connection test completed!')
    console.log('\n📋 Summary:')
    console.log(`   Categories: ${categories?.length || 0}`)
    console.log(`   Products: ${products?.length || 0}`)
    console.log(`   User Profiles: ${profiles?.length || 0}`)
    console.log(`   Site Settings: ${settings?.length || 0}`)
    console.log(`   Coupons: ${coupons?.length || 0}`)
    
    if (categories && categories.length > 0 && products && products.length > 0) {
      console.log('\n✅ Database setup is complete and working!')
      console.log('🚀 You can now run: npm run dev')
    } else {
      console.log('\n⚠️  Database setup incomplete.')
      console.log('📝 Please run the schema-production.sql in Supabase SQL Editor')
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Check your .env.local file')
    console.log('2. Verify Supabase project is active')
    console.log('3. Run schema-production.sql in Supabase SQL Editor')
    console.log('4. Check Supabase dashboard for errors')
  }
}

testConnection()
