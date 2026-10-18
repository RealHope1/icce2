import { Router } from 'express';
import { z } from 'zod';
import prisma from '../utils/database';
import { requireAdmin } from '../middleware/auth';
import { updateSettingsSchema } from '../schemas/validation';

const router = Router();

// GET /api/settings - Get public store settings
router.get('/', async (req, res) => {
  try {
    let settings = await prisma.storeSettings.findFirst();

    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {},
      });
    }

    // Return only public-safe settings
    res.json({
      businessName: settings.businessName,
      businessDescription: settings.businessDescription,
      whatsappNumber: settings.whatsappNumber,
      email: settings.email,
      phone: settings.phone,
      address: settings.address,
      announcementText: settings.announcementText,
      businessHours: settings.businessHours,
      returnPolicy: settings.returnPolicy,
      currency: settings.currency,
      socialMedia: settings.socialMedia,
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/settings - Update settings (admin only)
router.patch('/', requireAdmin, async (req, res) => {
  try {
    const data = updateSettingsSchema.parse(req.body);

    let settings = await prisma.storeSettings.findFirst();

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data,
      });
    } else {
      settings = await prisma.storeSettings.update({
        where: { id: settings.id },
        data,
      });
    }

    res.json(settings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
