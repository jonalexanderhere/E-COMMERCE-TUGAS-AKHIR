# =====================================================
# GITHUB SETUP SCRIPT FOR JON'S STORE (PowerShell)
# =====================================================

Write-Host "🚀 Setting up GitHub repository for Jon's Store..." -ForegroundColor Green

# Check if git is installed
try {
    git --version | Out-Null
    Write-Host "✅ Git is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    exit 1
}

# Initialize git repository if not already initialized
if (-not (Test-Path ".git")) {
    Write-Host "📁 Initializing Git repository..." -ForegroundColor Yellow
    git init
}

# Add all files to git
Write-Host "📦 Adding files to Git..." -ForegroundColor Yellow
git add .

# Create initial commit
Write-Host "💾 Creating initial commit..." -ForegroundColor Yellow
$commitMessage = @"
🚀 Initial commit: Complete e-commerce platform with 100+ products

✨ Features:
- Complete product catalog with 6 categories
- User authentication and profiles
- Shopping cart and checkout
- Admin dashboard
- Order management
- Product reviews and ratings
- Wishlist functionality
- Coupon system
- Responsive design
- Supabase integration

🛍️ Product Categories:
- Electronics (30+ products)
- Fashion (25+ products) 
- Home & Living (25+ products)
- Sports & Fitness (20+ products)
- Books & Media (20+ products)
- Beauty & Health (30+ products)

🔧 Tech Stack:
- Next.js 14 with TypeScript
- Supabase backend
- Tailwind CSS styling
- Framer Motion animations
- Radix UI components

👤 Admin Access:
- Email: admin@jonsstore.com
- Password: admin123456

🚀 Ready for deployment!
"@

git commit -m $commitMessage

# Create .gitignore if it doesn't exist
if (-not (Test-Path ".gitignore")) {
    Write-Host "📝 Creating .gitignore file..." -ForegroundColor Yellow
    @"
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Next.js
.next/
out/
build/
dist/

# Vercel
.vercel

# TypeScript
*.tsbuildinfo

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
}

Write-Host "✅ Git setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Create a new repository on GitHub" -ForegroundColor White
Write-Host "2. Run the following commands:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/jons-store.git" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 Your e-commerce platform is ready for GitHub!" -ForegroundColor Green