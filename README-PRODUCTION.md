# Luxe by Icce - Production-Ready E-Commerce Application

A complete, production-ready full-stack e-commerce platform for Luxe by Icce, a women's fashion store based in Kumasi, Ghana.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 14+
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd icce
```

2. **Set up the backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database and configuration
npm run prisma:migrate
npm run prisma:seed
npm run prisma:generate
npm run dev
```

The backend API will run on `http://localhost:3001`

3. **Set up the frontend**
```bash
# Open index.html in your browser
# Or serve with a local server
npx serve .
```

The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
luxebyicce/
├── frontend/                    # Frontend files
│   ├── index.html              # Homepage
│   ├── catalogue.html          # Product catalogue
│   ├── cart.html               # Shopping cart
│   ├── checkout.html           # Checkout page
│   ├── tracking.html           # Order tracking
│   ├── admin.html              # Admin dashboard
│   ├── css/
│   │   ├── styles.css          # Main stylesheet
│   │   └── admin.css           # Admin styles
│   ├── js/
│   │   ├── api.js              # API client
│   │   ├── main.js             # Main JavaScript
│   │   └── admin.js            # Admin JavaScript
│   └── assets/
│       ├── images/             # Product images
│       └── videos/             # Product videos
├── backend/                     # Backend API
│   ├── src/
│   │   ├── routes/             # API routes
│   │   ├── controllers/        # Route controllers
│   │   ├── services/           # Business logic
│   │   ├── middleware/         # Express middleware
│   │   ├── schemas/            # Validation schemas
│   │   ├── utils/              # Utility functions
│   │   └── server.ts           # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   ├── migrations/         # Database migrations
│   │   └── seed.ts             # Seed data
│   ├── tests/                  # Automated tests
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── README.md
```

## 🎨 Features

### Customer-Facing Features

- **Homepage** with hero carousel, featured collections, new arrivals
- **Product Catalogue** with search, filtering, and sorting
- **Product Details** with image gallery, variants, and pricing
- **Shopping Cart** with quantity management
- **Checkout** with order validation and creation
- **Order Tracking** with visual status timeline
- **WhatsApp Integration** for product enquiries and order inquiries
- **Product Sharing** via WhatsApp
- **Responsive Design** for mobile, tablet, and desktop

### Admin Dashboard Features

- **Dashboard Overview** with statistics and recent orders
- **Product Management** (create, edit, delete, publish/unpublish)
- **Order Management** (view, update status, archive, restore)
- **Category Management** (create, edit, delete)
- **Store Settings** (business info, WhatsApp, announcements)
- **Secure Authentication** with session management

### Technical Features

- **RESTful API** with proper HTTP methods and status codes
- **PostgreSQL Database** with Prisma ORM
- **TypeScript** for type safety
- **Server-side Validation** with Zod
- **Authentication** with bcrypt and HttpOnly cookies
- **Rate Limiting** for security
- **Inventory Management** with transaction safety
- **Promotional Pricing** system
- **Order Status History** tracking
- **Audit Logging** for admin actions

## 🔐 Security

- Password hashing with bcrypt (12 rounds)
- HttpOnly, SameSite cookies for sessions
- Rate limiting on all endpoints
- Stricter rate limiting on auth endpoints
- CORS configuration
- Helmet security headers
- SQL injection protection via Prisma
- Input validation with Zod
- Environment variables for secrets

## 💾 Database Schema

### Key Models

- **User** - Customers and admin users
- **Category** - Product categories (handbags, heels, shoes, etc.)
- **Product** - Products with pricing, inventory, and flags
- **ProductImage** - Product images
- **ProductVariant** - Product variants (size, color, etc.)
- **InventoryMovement** - Stock tracking
- **Promotion** - Discount campaigns
- **Order** - Customer orders with status tracking
- **OrderItem** - Order line items (price snapshots)
- **OrderStatusHistory** - Order status timeline
- **Payment** - Payment records
- **DeliveryZone** - Delivery zones and fees
- **StoreSettings** - Store configuration
- **AuditLog** - Admin action audit trail

## 📱 WhatsApp Integration

All WhatsApp links use the click-to-chat format:
- Product enquiries
- Order inquiries
- Product sharing
- Customer support

WhatsApp number: `+233247559387`

## 🧪 Testing

```bash
cd backend
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 🚢 Deployment

### Backend Deployment

1. **Choose a hosting provider** (Railway, Render, Heroku, or VPS)
2. **Set environment variables** in production
3. **Build the application**
4. **Run database migrations**
5. **Start the server**

### Frontend Deployment

1. **Choose a static hosting provider** (Vercel, Netlify, or GitHub Pages)
2. **Configure API URL** to point to production backend
3. **Deploy the static files**

### Database Deployment

Use a managed PostgreSQL provider:
- Supabase
- Neon
- Railway PostgreSQL
- AWS RDS

## 🔧 Configuration

### Environment Variables

Backend `.env`:
```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
PORT=3001
NODE_ENV=production
FRONTEND_URL="https://yourdomain.com"
SESSION_SECRET="strong-random-secret"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Admin Credentials

Default (from seed):
- **Username**: `admin@luxebyicce.com` or `+233247559387`
- **Password**: `admin123`

**IMPORTANT**: Change after first login!

## 📝 API Documentation

### Public Endpoints

#### Products
- `GET /api/products` - Get published products
- `GET /api/products/:slug` - Get single product

#### Orders
- `POST /api/orders` - Create order
- `POST /api/orders/track` - Track order
- `GET /api/orders/:reference` - Get order details

#### Settings
- `GET /api/settings` - Get store settings

### Admin Endpoints

#### Authentication
- `POST /api/auth/admin/login` - Login
- `POST /api/auth/admin/logout` - Logout
- `GET /api/auth/admin/check` - Check session

#### Dashboard
- `GET /api/admin/dashboard` - Statistics

#### Orders
- `GET /api/admin/orders` - List orders
- `GET /api/admin/orders/:id` - Get order
- `PATCH /api/admin/orders/:id/status` - Update status
- `POST /api/admin/orders/:id/archive` - Archive
- `POST /api/admin/orders/:id/restore` - Restore

#### Products
- `POST /api/products` - Create
- `PATCH /api/products/:id` - Update
- `DELETE /api/products/:id` - Delete

#### Categories
- `GET /api/admin/categories` - List
- `POST /api/admin/categories` - Create
- `PATCH /api/admin/categories/:id` - Update
- `DELETE /api/admin/categories/:id` - Delete

#### Settings
- `PATCH /api/settings` - Update settings

## 🎯 Production Checklist

Before going live:

- [ ] Change default admin password
- [ ] Set strong SESSION_SECRET
- [ ] Configure production DATABASE_URL
- [ ] Set up Cloudinary for images
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure error monitoring
- [ ] Test all payment flows
- [ ] Verify WhatsApp links work
- [ ] Test order tracking
- [ ] Verify email notifications (if configured)
- [ ] Set up monitoring and logging
- [ ] Configure CDN for static assets
- [ ] Test mobile responsiveness
- [ ] Verify accessibility (WCAG 2.1 AA)

## 🤝 Support

For support, contact:
- WhatsApp: 024 755 9387
- International: +233 247 559 387

## 📄 License

Proprietary - Luxe by Icce. All rights reserved.

## 🙏 Acknowledgments

Inspired by premium fashion e-commerce experiences from Charles & Keith, ALDO, and Steve Madden.
