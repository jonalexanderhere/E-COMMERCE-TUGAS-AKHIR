#!/bin/bash

# =====================================================
# GITHUB SETUP SCRIPT FOR JON'S STORE
# =====================================================

echo "🚀 Setting up GitHub repository for Jon's Store..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
fi

# Add all files to git
echo "📦 Adding files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "🚀 Initial commit: Complete e-commerce platform with 100+ products

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

🚀 Ready for deployment!"

# Set up remote repository (you'll need to create this on GitHub first)
echo "🔗 Setting up remote repository..."
echo "Please create a new repository on GitHub first, then run:"
echo "git remote add origin https://github.com/YOUR_USERNAME/jons-store.git"
echo "git branch -M main"
echo "git push -u origin main"

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore file..."
    cat > .gitignore << EOF
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
EOF
fi

echo "✅ Git setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Run the following commands:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/jons-store.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "🎉 Your e-commerce platform is ready for GitHub!"