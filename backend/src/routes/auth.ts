import { Router } from 'express';
import { z } from 'zod';
import prisma from '../utils/database';
import { hashPassword, verifyPassword, generateSessionId, normalizePhoneNumber } from '../utils/auth';
import { loginSchema } from '../schemas/validation';

const router = Router();

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    // Find admin user by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: username },
          { phone: normalizePhoneNumber(username) },
        ],
        role: 'ADMIN',
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create session
    const sessionId = generateSessionId();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.adminSession.create({
      data: {
        userId: user.id,
        sessionId,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        expiresAt,
      },
    });

    // Set HttpOnly cookie
    res.cookie('adminSession', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin logout
router.post('/admin/logout', async (req, res) => {
  try {
    const sessionId = req.cookies.adminSession;

    if (sessionId) {
      await prisma.adminSession.deleteMany({
        where: { sessionId },
      });
    }

    res.clearCookie('adminSession');
    res.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check admin session
router.get('/admin/check', async (req, res) => {
  try {
    const sessionId = req.cookies.adminSession;

    if (!sessionId) {
      return res.json({ authenticated: false });
    }

    const session = await prisma.adminSession.findUnique({
      where: { sessionId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      res.clearCookie('adminSession');
      return res.json({ authenticated: false });
    }

    res.json({
      authenticated: true,
      user: session.user,
    });
  } catch (error) {
    console.error('Check session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
