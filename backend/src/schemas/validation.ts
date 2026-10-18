import { z } from 'zod';

// Product validation schemas
export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.string().cuid('Invalid category ID'),
  sku: z.string().optional(),
  regularPrice: z.number().int().positive('Regular price must be positive'),
  salePrice: z.number().int().positive().optional(),
  currency: z.string().default('GHS'),
  stockQuantity: z.number().int().min(0, 'Stock quantity cannot be negative'),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  images: z.array(z.object({
    imageUrl: z.string().url('Invalid image URL'),
    altText: z.string().optional(),
    isPrimary: z.boolean().default(false),
  })).min(1, 'At least one image is required'),
  variants: z.array(z.object({
    name: z.string().min(1),
    sku: z.string().optional(),
    stock: z.number().int().min(0),
  })).optional(),
});

export const updateProductSchema = createProductSchema.partial();

// Order validation schemas
export const createOrderSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required').max(255),
  customerPhone: z.string().min(10, 'Phone number is required'),
  customerEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  deliveryAddress: z.string().min(1, 'Delivery address is required'),
  deliveryRegion: z.string().min(1, 'Delivery region is required'),
  deliveryTown: z.string().min(1, 'Delivery town is required'),
  deliveryInstructions: z.string().optional(),
  deliveryMethod: z.enum(['DELIVERY', 'PICKUP']).default('DELIVERY'),
  items: z.array(z.object({
    productId: z.string().cuid('Invalid product ID'),
    variantId: z.string().cuid().optional(),
    quantity: z.number().int().positive('Quantity must be positive'),
  })).min(1, 'At least one item is required'),
  userId: z.string().cuid().optional(),
});

export const trackOrderSchema = z.object({
  orderReference: z.string().min(1, 'Order reference is required'),
  customerPhone: z.string().min(10, 'Phone number is required'),
});

// Admin authentication schema
export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// Category validation schema
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100),
  description: z.string().optional(),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

// Settings validation schema
export const updateSettingsSchema = z.object({
  businessName: z.string().min(1).max(255).optional(),
  businessDescription: z.string().optional(),
  whatsappNumber: z.string().min(10).optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  announcementText: z.string().optional(),
  businessHours: z.string().optional(),
  returnPolicy: z.string().optional(),
  currency: z.string().optional(),
  socialMedia: z.object({
    facebook: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
  }).optional(),
});

// Order status update schema
export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'READY_FOR_DISPATCH',
    'DISPATCHED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
    'REJECTED',
  ]),
  notes: z.string().optional(),
});

// Promotion validation schema
export const createPromotionSchema = z.object({
  name: z.string().min(1, 'Promotion name is required').max(255),
  description: z.string().optional(),
  discountPercent: z.number().int().min(0).max(100).optional(),
  discountAmount: z.number().int().positive().optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  isActive: z.boolean().default(true),
  productIds: z.array(z.string().cuid()).optional(),
}).refine((data) => {
  // Either discountPercent or discountAmount must be provided
  return data.discountPercent !== undefined || data.discountAmount !== undefined;
}, {
  message: 'Either discountPercent or discountAmount must be provided',
});
