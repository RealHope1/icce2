@echo off
echo ========================================
echo Luxe by Icce - Git Setup Script
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed on your system.
    echo.
    echo Please install Git first:
    echo 1. Download from: https://git-scm.com/download/win
    echo 2. Run the installer with default settings
    echo 3. Restart this command prompt
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
)

echo Git is installed. Version:
git --version
echo.

REM Initialize git repository
echo [1/5] Initializing git repository...
git init
if %errorlevel% neq 0 (
    echo ERROR: Failed to initialize git repository
    pause
    exit /b 1
)
echo Done.
echo.

REM Add all files
echo [2/5] Adding files to git...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)
echo Done.
echo.

REM Create commit
echo [3/5] Creating initial commit...
git commit -m "Initial commit: Production-ready e-commerce platform for Luxe by Icce

- Complete backend API with Node.js/TypeScript and PostgreSQL
- Customer-facing frontend with shopping cart and checkout
- Admin dashboard with full CRUD operations
- WhatsApp integration for enquiries and orders
- Order tracking system with status timeline
- Comprehensive documentation and setup guides"
if %errorlevel% neq 0 (
    echo ERROR: Failed to create commit
    pause
    exit /b 1
)
echo Done.
echo.

REM Add remote repository
echo [4/5] Adding remote repository...
git remote add origin https://github.com/RealHope1/icce2.git
if %errorlevel% neq 0 (
    echo WARNING: Remote repository already exists or failed to add
    echo Continuing anyway...
)
echo Done.
echo.

REM Push to GitHub
echo [5/5] Pushing to GitHub...
git branch -M main
git push -u origin main
if %errorlevel% neq 0 (
    echo ERROR: Failed to push to GitHub
    echo.
    echo Possible issues:
    echo 1. Authentication required - GitHub may ask for your credentials
    echo 2. Repository does not exist - Create it at https://github.com/RealHope1/icce2
    echo 3. Network issues - Check your internet connection
    echo.
    pause
    exit /b 1
)
echo Done.
echo.

echo ========================================
echo SUCCESS! Code pushed to GitHub
echo ========================================
echo.
echo Repository: https://github.com/RealHope1/icce2
echo.
pause
