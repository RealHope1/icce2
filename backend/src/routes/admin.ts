import { Router } from 'express';
import { z } from 'zod';
import prisma from '../utils/database';
import { requireAdmin } from '../middleware/auth';
import { updateOrderStatusSchema, createCategorySchema } from '../schemas/validation';

const router = Router();

// Dashboard statistics
router.get('/dashboard', requireAdmin, async (req, res) => {
  try {
    const [
      totalOrders,
      newOrders,
      confirmedOrders,
      processingOrders,
      dispatchedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count({ where: { isArchived: false } }),
      prisma.order.count({ where: { orderStatus: 'PENDING', isArchived: false } }),
      prisma.order.count({ where: { orderStatus: 'CONFIRMED', isArchived: false } }),
      prisma.order.count({ where: { orderStatus: 'PROCESSING', isArchived: false } }),
      prisma.order.count({ where: { orderStatus: 'DISPATCHED', isArchived: false } }),
      prisma.order.count({ where: { orderStatus: 'DELIVERED', isArchived: false } }),
      prisma.order.count({ where: { orderStatus: 'CANCELLED', isArchived: false } }),
      prisma.order.aggregate({
        where: {
          orderStatus: { in: ['DELIVERED', 'CONFIRMED'] },
          isArchived: false,
        },
        _sum: { totalAmount: true },
      }),
      prisma.product.count({
        where: {
          isPublished: true,
          stockQuantity: { lte: 5 },
        },
      }),
      prisma.order.findMany({
        where: { isArchived: false },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          items: true,
        },
      }),
    ]);

    res.json({
      statistics: {
        totalOrders,
        newOrders,
        confirmedOrders,
        processingOrders,
        dispatchedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        lowStockProducts,
      },
      recentOrders,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Orders management
router.get('/orders', requireAdmin, async (req, res) => {
  try {
    const {
      status,
      search,
      page = '1',
      limit = '20',
      startDate,
      endDate,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      isArchived: false,
    };

    if (status) {
      where.orderStatus = status;
    }

    if (search) {
      where.OR = [
        { orderReference: { contains: search as string, mode: 'insensitive' } },
        { customerName: { contains: search as string, mode: 'insensitive' } },
        { customerPhone: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate as string);
      }
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
          statusHistory: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single order
router.get('/orders/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
        payments: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order status
router.patch('/orders/:id/status', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = updateOrderStatusSchema.parse(req.body);
    const adminId = req.user?.id;

    const order = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id },
        data: {
          orderStatus: status,
        },
      });

      // Add status history
      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          status,
          notes,
          changedBy: adminId,
        },
      });

      return updatedOrder;
    });

    res.json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Archive order
router.post('/orders/:id/archive', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.order.update({
      where: { id },
      data: { isArchived: true },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Archive order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Restore archived order
router.post('/orders/:id/restore', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.order.update({
      where: { id },
      data: { isArchived: false },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Restore order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Categories management
router.get('/categories', requireAdmin, async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create category
router.post('/categories', requireAdmin, async (req, res) => {
  try {
    const data = createCategorySchema.parse(req.body);

    const category = await prisma.category.create({
      data,
    });

    res.status(201).json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update category
router.patch('/categories/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const data = createCategorySchema.partial().parse(req.body);

    const category = await prisma.category.update({
      where: { id },
      data,
    });

    res.json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete category
router.delete('/categories/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
