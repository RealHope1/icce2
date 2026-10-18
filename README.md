# Luxe by Icce - Production-Ready E-Commerce Platform

A complete, production-ready full-stack e-commerce application for Luxe by Icce, a women's fashion store based in Kumasi, Ghana.

## 🚀 Quick Start

### For Setup Instructions
👉 **Read [SETUP-GUIDE.md](SETUP-GUIDE.md)** for complete step-by-step setup instructions

### For Production Deployment
👉 **Read [README-PRODUCTION.md](README-PRODUCTION.md)** for deployment guide

### For Backend API Documentation
👉 **Read [README-BACKEND.md](README-BACKEND.md)** for API documentation

### For Project Overview
👉 **Read [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md)** for implementation details

### For Video Demo
👉 **Read [VIDEO-DEMO-SCRIPT.md](VIDEO-DEMO-SCRIPT.md)** for recording a demo video

## 📋 Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 14+
- Git (for version control)

## 🎯 Features

### Customer-Facing
- ✅ Product browsing with search and filters
- ✅ Product details with images and variants
- ✅ Shopping cart with localStorage persistence
- ✅ Checkout with form validation
- ✅ Order tracking with visual status timeline
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

## 🔐 Default Credentials

### Admin Dashboard
- **Username**: `admin@luxebyicce.com` or `+233247559387`
- **Password**: `admin123`

**⚠️ IMPORTANT**: Change the admin password after first login!

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: bcrypt + HttpOnly cookies
- **Validation**: Zod
- **Security**: Helmet, CORS, rate limiting

### Frontend
- **HTML5**: Semantic structure
- **CSS3**: Styling, animations, responsive layouts
- **JavaScript**: Vanilla ES6+ with Fetch API
- **No frameworks**: Lightweight and fast

## 📞 Contact

- **WhatsApp**: 024 755 9387
- **International**: +233 247 559 387

## 📄 License

Proprietary - Luxe by Icce. All rights reserved.

---

**For detailed setup instructions, please refer to [SETUP-GUIDE.md](SETUP-GUIDE.md)**
