# JonsStore E-commerce - GitHub Setup Script (PowerShell)
Write-Host "🚀 Setting up JonsStore E-commerce on GitHub..." -ForegroundColor Green

# Initialize git repository
Write-Host "📁 Initializing git repository..." -ForegroundColor Yellow
git init

# Add all files
Write-Host "📝 Adding files to git..." -ForegroundColor Yellow
git add .

# Create initial commit
Write-Host "💾 Creating initial commit..." -ForegroundColor Yellow
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
Write-Host "🌿 Setting main branch..." -ForegroundColor Yellow
git branch -M main

# Add remote origin
Write-Host "🔗 Adding remote origin..." -ForegroundColor Yellow
git remote add origin https://github.com/jonalexanderhere/E-COMMERCE-TUGAS-AKHIR.git

# Push to GitHub
Write-Host "⬆️ Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Your JonsStore e-commerce platform is now on GitHub!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Set up Supabase database (see DEPLOYMENT.md)" -ForegroundColor White
Write-Host "2. Deploy to Vercel (see DEPLOYMENT.md)" -ForegroundColor White
Write-Host "3. Configure environment variables" -ForegroundColor White
Write-Host "4. Test your deployment" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Repository: https://github.com/jonalexanderhere/E-COMMERCE-TUGAS-AKHIR" -ForegroundColor Blue
Write-Host "📖 Documentation: See README.md and DEPLOYMENT.md" -ForegroundColor Blue
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green
