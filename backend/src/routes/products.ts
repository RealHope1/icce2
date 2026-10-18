import { Router } from 'express';
import { z } from 'zod';
import prisma from '../utils/database';
import { requireAdmin, optionalAdmin } from '../middleware/auth';
import { createProductSchema, updateProductSchema } from '../schemas/validation';

const router = Router();

// GET /api/products - Get all published products (public)
router.get('/', async (req, res) => {
  try {
    const {
      category,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured,
      newArrival,
      bestSeller,
      page = '1',
      limit = '20',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {
      isPublished: true,
    };

    if (category) {
      where.category = {
        slug: category as string,
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (newArrival === 'true') {
      where.isNewArrival = true;
    }

    if (bestSeller === 'true') {
      where.isBestSeller = true;
    }

    // Build order by
    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder;

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: { displayOrder: 'asc' },
          },
          variants: {
            where: { isActive: true },
          },
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/products/:slug - Get single product by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: { displayOrder: 'asc' },
        },
        variants: {
          where: { isActive: true },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!product.isPublished) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get related products (same category, excluding current)
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isPublished: true,
      },
      include: {
        category: true,
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
      take: 4,
    });

    res.json({
      product,
      relatedProducts,
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/products/id/:id - Get single product by ID (admin only)
router.get('/id/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { displayOrder: 'asc' },
        },
        variants: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/products - Create product (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const data = createProductSchema.parse(req.body);

    // Create product with images and variants in a transaction
    const product = await prisma.$transaction(async (tx) => {
      const newProduct = await tx.product.create({
        data: {
          name: data.name,
          slug: data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now(),
          description: data.description,
          categoryId: data.categoryId,
          sku: data.sku,
          regularPrice: data.regularPrice,
          salePrice: data.salePrice,
          currency: data.currency,
          stockQuantity: data.stockQuantity,
          isFeatured: data.isFeatured,
          isNewArrival: data.isNewArrival,
          isBestSeller: data.isBestSeller,
          isPublished: data.isPublished,
          publishedAt: data.isPublished ? new Date() : null,
          images: {
            create: data.images.map((img, index) => ({
              imageUrl: img.imageUrl,
              altText: img.altText,
              isPrimary: img.isPrimary || index === 0,
              displayOrder: index,
            })),
          },
          variants: data.variants ? {
            create: data.variants.map(v => ({
              name: v.name,
              sku: v.sku,
              stock: v.stock,
            })),
          } : undefined,
        },
        include: {
          images: true,
          variants: true,
        },
      });

      return newProduct;
    });

    res.status(201).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/products/:id - Update product (admin only)
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const data = updateProductSchema.parse(req.body);

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        publishedAt: data.isPublished ? new Date() : undefined,
      },
      include: {
        images: true,
        variants: true,
      },
    });

    res.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
