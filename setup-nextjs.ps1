# Next.js Migration Setup Script
# Run this script to complete the migration setup

Write-Host "🚀 Starting Next.js 15 Migration Setup..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Backup current package.json
Write-Host "📦 Step 1: Backing up current package.json..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Copy-Item "package.json" "package.json.vite.backup"
    Write-Host "✅ Backed up to package.json.vite.backup" -ForegroundColor Green
}

# Step 2: Replace package.json
Write-Host ""
Write-Host "📦 Step 2: Installing Next.js package.json..." -ForegroundColor Yellow
if (Test-Path "package.json.nextjs") {
    Move-Item "package.json.nextjs" "package.json" -Force
    Write-Host "✅ package.json updated" -ForegroundColor Green
} else {
    Write-Host "❌ package.json.nextjs not found!" -ForegroundColor Red
    exit 1
}

# Step 3: Clean old dependencies
Write-Host ""
Write-Host "🧹 Step 3: Cleaning old dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item "node_modules" -Recurse -Force
    Write-Host "✅ Removed node_modules" -ForegroundColor Green
}
if (Test-Path "bun.lockb") {
    Remove-Item "bun.lockb" -Force
    Write-Host "✅ Removed bun.lockb" -ForegroundColor Green
}
if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json" -Force
    Write-Host "✅ Removed package-lock.json" -ForegroundColor Green
}

# Step 4: Install dependencies
Write-Host ""
Write-Host "📥 Step 4: Installing Next.js dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Step 5: Setup environment variables
Write-Host ""
Write-Host "🔐 Step 5: Setting up environment variables..." -ForegroundColor Yellow
if (-not (Test-Path ".env.local")) {
    Copy-Item ".env.local.example" ".env.local"
    Write-Host "✅ Created .env.local from template" -ForegroundColor Green
    Write-Host "⚠️  IMPORTANT: Edit .env.local with your Supabase credentials!" -ForegroundColor Red
} else {
    Write-Host "ℹ️  .env.local already exists, skipping..." -ForegroundColor Gray
}

# Step 6: Summary
Write-Host ""
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "🎉 MIGRATION SETUP COMPLETE!" -ForegroundColor Green
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Edit .env.local with your Supabase credentials" -ForegroundColor White
Write-Host "2. Run: npm run dev" -ForegroundColor White
Write-Host "3. Visit: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   - DOC/SETUP-COMPLETE.md     - This setup summary" -ForegroundColor White
Write-Host "   - DOC/MIGRATION-GUIDE.md    - Detailed migration guide" -ForegroundColor White
Write-Host "   - DOC/README-NEXTJS.md      - Quick start guide" -ForegroundColor White
Write-Host "   - DOC/COMPONENT-MIGRATION.md - Component checklist" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Ready to start? Run: npm run dev" -ForegroundColor Cyan
Write-Host ""
