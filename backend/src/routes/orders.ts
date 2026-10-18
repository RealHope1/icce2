import { Router } from 'express';
import { z } from 'zod';
import prisma from '../utils/database';
import { requireAdmin } from '../middleware/auth';
import { createOrderSchema, trackOrderSchema, updateOrderStatusSchema } from '../schemas/validation';
import { normalizePhoneNumber, generateOrderReference, formatPrice } from '../utils/auth';

const router = Router();

// POST /api/orders - Create order (public)
router.post('/', async (req, res) => {
  try {
    const data = createOrderSchema.parse(req.body);

    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(data.customerPhone);

    // Validate products and calculate totals in a transaction
    const order = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItems = [];

      for (const item of data.items) {
        // Get product with current price
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: {
            variants: true,
          },
        });

        if (!product || !product.isPublished) {
          throw new Error(`Product ${item.productId} not found or not published`);
        }

        // Check variant if provided
        if (item.variantId) {
          const variant = product.variants.find(v => v.id === item.variantId);
          if (!variant || !variant.isActive) {
            throw new Error(`Variant ${item.variantId} not found or inactive`);
          }
          if (variant.stock < item.quantity) {
            throw new Error(`Insufficient stock for variant ${item.variantId}`);
          }
        } else {
          if (product.stockQuantity < item.quantity) {
            throw new Error(`Insufficient stock for product ${product.id}`);
          }
        }

        // Use sale price if available, otherwise regular price
        const unitPrice = product.salePrice || product.regularPrice;
        const lineTotal = unitPrice * item.quantity;
        subtotal += lineTotal;

        orderItems.push({
          productId: product.id,
          variantId: item.variantId,
          productName: product.name,
          productSku: product.sku,
          variantName: item.variantId
            ? product.variants.find(v => v.id === item.variantId)?.name
            : null,
          quantity: item.quantity,
          unitPrice,
          lineTotal,
        });
      }

      // Calculate delivery fee (simplified - in production, use delivery zones)
      const deliveryFee = data.deliveryMethod === 'PICKUP' ? 0 : 2000; // GH₵20 default

      const totalAmount = subtotal + deliveryFee;

      // Generate order reference
      const orderReference = generateOrderReference();

      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderReference,
          customerName: data.customerName,
          customerPhone: normalizedPhone,
          customerEmail: data.customerEmail || null,
          deliveryAddress: data.deliveryAddress,
          deliveryRegion: data.deliveryRegion,
          deliveryTown: data.deliveryTown,
          deliveryInstructions: data.deliveryInstructions,
          deliveryMethod: data.deliveryMethod,
          subtotal,
          deliveryFee,
          totalAmount,
          currency: 'GHS',
          userId: data.userId,
          items: {
            create: orderItems,
          },
          statusHistory: {
            create: {
              status: 'PENDING',
              notes: 'Order received',
            },
          },
        },
        include: {
          items: true,
          statusHistory: true,
        },
      });

      // Update inventory
      for (const item of data.items) {
        if (item.variantId) {
          // Update variant stock
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        // Update product stock
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        });

        // Record inventory movement
        await tx.inventoryMovement.create({
          data: {
            productId: item.productId,
            variantId: item.variantId,
            quantity: -item.quantity,
            type: 'sale',
            orderId: newOrder.id,
          },
        });
      }

      return newOrder;
    });

    res.status(201).json({
      order,
      whatsappMessage: `Hello Luxe by Icce, I have placed order ${order.orderReference}. Please confirm my order and provide any necessary delivery updates.`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/orders/track - Track order (public)
router.post('/track', async (req, res) => {
  try {
    const { orderReference, customerPhone } = trackOrderSchema.parse(req.body);

    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(customerPhone);

    // Find order
    const order = await prisma.order.findUnique({
      where: { orderReference },
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify phone number (rate limiting handled by middleware)
    if (order.customerPhone !== normalizedPhone) {
      return res.status(403).json({ error: 'Phone number does not match order' });
    }

    // Return order details (excluding sensitive info)
    res.json({
      orderReference: order.orderReference,
      orderStatus: order.orderStatus,
      customerName: order.customerName,
      deliveryRegion: order.deliveryRegion,
      deliveryTown: order.deliveryTown,
      deliveryMethod: order.deliveryMethod,
      totalAmount: formatPrice(order.totalAmount, order.currency),
      currency: order.currency,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      statusHistory: order.statusHistory,
      items: order.items.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: formatPrice(item.unitPrice, order.currency),
        lineTotal: formatPrice(item.lineTotal, order.currency),
      })),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Track order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/orders/:reference - Get order by reference (public, with phone verification)
router.get('/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number required' });
    }

    const normalizedPhone = normalizePhoneNumber(phone as string);

    const order = await prisma.order.findUnique({
      where: { orderReference: reference },
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.customerPhone !== normalizedPhone) {
      return res.status(403).json({ error: 'Phone number does not match order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
