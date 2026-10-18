# Luxe by Icce - Complete Setup Guide

This guide will help you set up and run the complete production-ready e-commerce application for Luxe by Icce.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18 or higher installed
- **npm** 9 or higher installed
- **PostgreSQL** 14 or higher installed
- A code editor (VS Code recommended)
- Basic knowledge of command line

## 🚀 Quick Start (5 minutes)

### 1. Set Up the Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database URL
# Example: DATABASE_URL="postgresql://postgres:password@localhost:5432/luxebyicce"
```

**Important**: Edit the `.env` file and set:
- `DATABASE_URL` - Your PostgreSQL connection string
- `SESSION_SECRET` - A random secret string (use a password generator)
- Keep other defaults or adjust as needed

### 2. Set Up the Database

```bash
# Still in backend directory

# Create database (if not exists)
createdb luxebyicce

# Run migrations
npm run prisma:migrate

# Seed with sample data
npm run prisma:seed

# Generate Prisma client
npm run prisma:generate
```

### 3. Start the Backend Server

```bash
# Development mode with hot reload
npm run dev
```

The backend API will be available at `http://localhost:3001`

### 4. Open the Frontend

**Option A**: Open `index.html` directly in your browser

**Option B**: Use a local server:
```bash
# From the project root
npx serve .
# or
python -m http.server 8000
```

The frontend will be available at the configured port (default 3000 or 8000)

### 5. Access the Admin Dashboard

1. Open `admin.html` in your browser
2. Login with:
   - **Username**: `admin@luxebyicce.com` or `+233247559387`
   - **Password**: `admin123`

**IMPORTANT**: Change the admin password after first login!

## 📁 Project Structure

```
luxebyicce/
├── backend/                      # Node.js/TypeScript API
│   ├── src/
│   │   ├── routes/              # API endpoints
│   │   ├── middleware/          # Auth & validation
│   │   ├── schemas/             # Zod validation schemas
│   │   ├── utils/               # Helper functions
│   │   └── server.ts            # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   └── seed.ts              # Sample data
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── css/
│   ├── styles.css               # Main website styles
│   └── admin.css               # Admin dashboard styles
├── js/
│   ├── api.js                  # API client
│   ├── main-new.js             # Main website logic (API version)
│   ├── cart.js                 # Shopping cart
│   ├── checkout.js             # Checkout logic
│   ├── tracking.js             # Order tracking
│   └── admin.js                # Admin dashboard logic
├── index.html                  # Homepage
├── catalogue.html              # Product catalogue
├── cart.html                   # Shopping cart
├── checkout.html               # Checkout page
├── tracking.html               # Order tracking
├── admin.html                  # Admin dashboard
└── assets/
    ├── images/                 # Product images
    └── videos/                 # Product videos
```

## 🔧 Detailed Configuration

### Backend Environment Variables

Edit `backend/.env`:

```env
# Database (REQUIRED)
DATABASE_URL="postgresql://username:password@localhost:5432/luxebyicce?schema=public"

# Server
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"

# Session Secret (REQUIRED - change in production)
SESSION_SECRET="your-random-secret-here"

# Cloudinary (optional - for image uploads)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Paystack (optional - for payments)
PAYSTACK_SECRET_KEY=""
PAYSTACK_PUBLIC_KEY=""
```

### Frontend API Configuration

Edit `js/api.js` if your backend runs on a different port:

```javascript
const API_BASE_URL = 'http://localhost:3001/api';
```

## 🎯 Key Features

### Customer-Facing
- ✅ Product browsing with search and filters
- ✅ Product details with images and variants
- ✅ Shopping cart with localStorage persistence
- ✅ Checkout with form validation
- ✅ Order tracking with status timeline
- ✅ WhatsApp integration for enquiries
- ✅ Product sharing via WhatsApp
- ✅ Responsive design (mobile, tablet, desktop)

### Admin Dashboard
- ✅ Secure login with session management
- ✅ Dashboard statistics (orders, revenue, low stock)
- ✅ Product management (create, edit, delete)
- ✅ Order management (view, update status, archive)
- ✅ Category management (create, edit, delete)
- ✅ Store settings (business info, WhatsApp, announcements)

### Backend API
- ✅ RESTful architecture
- ✅ PostgreSQL database with Prisma ORM
- ✅ Authentication with bcrypt and HttpOnly cookies
- ✅ Rate limiting for security
- ✅ Input validation with Zod
- ✅ Transaction-safe inventory management
- ✅ Promotional pricing system
- ✅ Order status history tracking

## 🧪 Testing the Application

### 1. Test Customer Flow

1. Open `index.html` in your browser
2. Browse products on the homepage
3. Click "Shop Products" to view catalogue
4. Add products to cart
5. Go to cart and review items
6. Proceed to checkout
7. Fill in delivery information
8. Place order
9. Note the order reference
10. Go to tracking page and track your order

### 2. Test Admin Dashboard

1. Open `admin.html` in your browser
2. Login with admin credentials
3. View dashboard statistics
4. Go to Orders tab
5. View order details
6. Update order status
7. Go to Products tab
8. Add a new product
9. Edit an existing product
10. Go to Categories tab
11. Add/edit categories
12. Go to Settings tab
13. Update store settings

### 3. Test WhatsApp Integration

1. On any product page, click "Enquire on WhatsApp"
2. Verify WhatsApp opens with pre-filled message
3. Click "Share" on a product
4. Verify sharing message is correct
5. After checkout, click "Confirm Order on WhatsApp"
6. Verify order reference is included

## 🔐 Security Checklist

Before going to production:

- [ ] Change default admin password
- [ ] Set strong SESSION_SECRET in .env
- [ ] Use HTTPS in production
- [ ] Set up database backups
- [ ] Configure CORS for production domain
- [ ] Enable helmet security headers
- [ ] Keep dependencies updated
- [ ] Review rate limiting settings
- [ ] Set up monitoring and logging
- [ ] Configure error tracking

## 📊 Database Schema Overview

### Key Tables

- **users** - Admin and customer accounts
- **categories** - Product categories
- **products** - Products with pricing and inventory
- **product_images** - Product images
- **product_variants** - Size, color, etc.
- **orders** - Customer orders
- **order_items** - Order line items (price snapshots)
- **order_status_history** - Order status timeline
- **inventory_movements** - Stock tracking
- **promotions** - Discount campaigns
- **store_settings** - Store configuration
- **audit_logs** - Admin action logs

## 🚢 Deployment Guide

### Backend Deployment

1. **Choose a hosting provider**:
   - Railway (recommended)
   - Render
   - Heroku
   - DigitalOcean

2. **Push code to Git**

3. **Connect repository to hosting provider**

4. **Set environment variables** in production dashboard

5. **Run database migrations** (automatically on most platforms)

6. **Deploy**

### Frontend Deployment

1. **Choose a static hosting provider**:
   - Vercel (recommended)
   - Netlify
   - GitHub Pages

2. **Push code to Git**

3. **Connect repository to hosting provider**

4. **Configure build settings** (if needed)

5. **Update API_BASE_URL** in `js/api.js` to production URL

6. **Deploy**

### Database Deployment

Use a managed PostgreSQL provider:
- Supabase (recommended - free tier available)
- Neon
- Railway PostgreSQL
- AWS RDS

## 🛠️ Troubleshooting

### Backend won't start

**Problem**: Port 3001 already in use
```bash
# Kill process using port 3001 (Windows)
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or change PORT in .env
```

**Problem**: Database connection error
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check database exists

### Frontend can't connect to API

**Problem**: CORS error
- Verify FRONTEND_URL in backend/.env matches your frontend URL
- Check API_BASE_URL in js/api.js matches backend URL

**Problem**: 404 errors
- Ensure backend is running
- Check API endpoint URLs

### Admin login fails

**Problem**: Invalid credentials
- Use `admin@luxebyicce.com` or `+233247559387`
- Password is `admin123`
- Check database was seeded properly

### Products not loading

**Problem**: API error
- Check browser console for errors
- Verify backend is running
- Check database has products (run seed if needed)

## 📝 Default Credentials

### Admin Dashboard
- **Username**: `admin@luxebyicce.com` or `+233247559387`
- **Password**: `admin123`

### Database
- **Name**: luxebyicce
- **User**: postgres (default) or your configured user
- **No default password** - set during PostgreSQL installation

## 📞 Support

For issues or questions:
- Check the documentation in README-BACKEND.md
- Review the API documentation
- Check browser console for errors
- Check backend terminal for errors

## 🎉 You're Ready!

Once you've completed the setup:

1. Backend running on `http://localhost:3001`
2. Frontend accessible via browser
3. Admin dashboard at `admin.html`
4. Database seeded with sample data
5. Ready to test and customize!

---

**Next Steps**:
- Customize products and categories
- Add your own product images
- Configure WhatsApp number
- Update store settings
- Test the complete user flow
- Deploy to production when ready
