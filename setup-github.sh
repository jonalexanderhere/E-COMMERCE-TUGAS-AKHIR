#!/bin/bash

# JonsStore E-commerce - GitHub Setup Script
echo "🚀 Setting up JonsStore E-commerce on GitHub..."

# Initialize git repository
echo "📁 Initializing git repository..."
git init

# Add all files
echo "📝 Adding files to git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit - JonsStore E-commerce platform

✨ Features:
- Modern e-commerce platform with Next.js 14
- 100+ sample products across 6 categories
- User authentication with Supabase
- Shopping cart and checkout process
- Admin dashboard for store management
- Responsive design with Tailwind CSS
- TypeScript for type safety

🛠️ Tech Stack:
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Supabase (Database & Auth)
- Radix UI Components
- Zustand State Management

👤 Admin Access:
- Email: admin@jonsstore.com
- Password: admin123456

🚀 Ready for deployment to Vercel!"

# Set main branch
echo "🌿 Setting main branch..."
git branch -M main

# Add remote origin
echo "🔗 Adding remote origin..."
git remote add origin https://github.com/jonalexanderhere/E-COMMERCE-TUGAS-AKHIR.git

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push -u origin main

echo "✅ Successfully pushed to GitHub!"
echo ""
echo "🎉 Your JonsStore e-commerce platform is now on GitHub!"
echo ""
echo "📋 Next Steps:"
echo "1. Set up Supabase database (see DEPLOYMENT.md)"
echo "2. Deploy to Vercel (see DEPLOYMENT.md)"
echo "3. Configure environment variables"
echo "4. Test your deployment"
echo ""
echo "🔗 Repository: https://github.com/jonalexanderhere/E-COMMERCE-TUGAS-AKHIR"
echo "📖 Documentation: See README.md and DEPLOYMENT.md"
echo ""
echo "Happy coding! 🚀"
