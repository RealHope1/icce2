# Luxe by Icce - Production-Ready Backend

A complete, production-ready backend API for the Luxe by Icce e-commerce platform.

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: bcrypt + HttpOnly cookies
- **Validation**: Zod
- **Security**: Helmet, CORS, rate limiting

## Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 14+
- Cloudinary account (for image uploads)

## Installation

1. **Install dependencies**:
```bash
cd backend
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/luxebyicce?schema=public"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
SESSION_SECRET="your-secret-key-change-in-production"
```

3. **Set up PostgreSQL database**:
```bash
# Create database
createdb luxebyicce

# Run migrations
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed
```

4. **Generate Prisma client**:
```bash
npm run prisma:generate
```

## Running the Server

**Development mode** (with hot reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm run build
npm start
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Public Endpoints

#### Products
- `GET /api/products` - Get all published products
- `GET /api/products/:slug` - Get single product by slug

#### Orders
- `POST /api/orders` - Create new order
- `POST /api/orders/track` - Track order by reference and phone
- `GET /api/orders/:reference?phone=XXX` - Get order details

#### Settings
- `GET /api/settings` - Get public store settings

### Admin Endpoints (Protected)

#### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/admin/logout` - Admin logout
- `GET /api/auth/admin/check` - Check admin session

#### Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics

#### Orders
- `GET /api/admin/orders` - Get all orders (with filters)
- `GET /api/admin/orders/:id` - Get single order
- `PATCH /api/admin/orders/:id/status` - Update order status
- `POST /api/admin/orders/:id/archive` - Archive order
- `POST /api/admin/orders/:id/restore` - Restore archived order

#### Products
- `POST /api/products` - Create product
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

#### Categories
- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create category
- `PATCH /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category

#### Settings
- `PATCH /api/settings` - Update store settings (admin only)

## Database Schema

The database includes the following models:

- **User** - Customers and admin users
- **Category** - Product categories
- **Product** - Products with pricing, inventory, and flags
- **ProductImage** - Product images
- **ProductVariant** - Product variants (size, color, etc.)
- **InventoryMovement** - Stock tracking
- **Promotion** - Discount campaigns
- **Order** - Customer orders
- **OrderItem** - Order line items
- **OrderStatusHistory** - Order status tracking
- **Payment** - Payment records
- **DeliveryZone** - Delivery zones and fees
- **StoreSettings** - Store configuration
- **AuditLog** - Admin action audit trail

## Security Features

- Password hashing with bcrypt (12 rounds)
- HttpOnly, SameSite cookies for sessions
- Rate limiting on all endpoints
- Stricter rate limiting on auth endpoints
- CORS configuration
- Helmet security headers
- SQL injection protection via Prisma
- Input validation with Zod

## Admin Credentials

Default admin credentials (from seed):
- **Username**: `admin@luxebyicce.com` or `+233247559387`
- **Password**: `admin123`

**IMPORTANT**: Change the admin password after first login!

## Development Tools

### Prisma Studio
```bash
npm run prisma:studio
```
Opens a visual database browser.

### Database Migrations
```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Deployment

### Environment Variables for Production

Update `.env` with production values:
```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
NODE_ENV=production
FRONTEND_URL="https://yourdomain.com"
SESSION_SECRET="strong-random-secret"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Deployment Steps

1. Build the TypeScript code:
```bash
npm run build
```

2. Run database migrations:
```bash
npm run prisma:migrate deploy
```

3. Start the server:
```bash
npm start
```

### Recommended Hosting

- **Backend**: Railway, Render, Heroku, or VPS
- **Database**: Supabase, Neon, Railway PostgreSQL, or AWS RDS
- **Images**: Cloudinary

## Troubleshooting

### Database Connection Error
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check database credentials

### Migration Errors
- Ensure database exists
- Check for schema conflicts
- Try `npx prisma migrate reset` (development only)

### Port Already in Use
- Change PORT in `.env`
- Kill process using port 3001

## License

Proprietary - Luxe by Icce. All rights reserved.
