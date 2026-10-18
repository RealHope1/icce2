import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/database';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

// Admin authentication middleware
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionId = req.cookies.adminSession;

    if (!sessionId) {
      return res.status(401).json({ error: 'Unauthorized - No session' });
    }

    // Check if session exists and is valid
    const session = await prisma.$queryRaw<Array<{ userId: string; expiresAt: Date }>>`
      SELECT userId, expiresAt FROM admin_sessions
      WHERE sessionId = ${sessionId}
      AND expiresAt > NOW()
      LIMIT 1
    `;

    if (!session || session.length === 0) {
      return res.status(401).json({ error: 'Unauthorized - Invalid or expired session' });
    }

    // Get user and verify admin role
    const user = await prisma.user.findUnique({
      where: { id: session[0].userId },
      select: { id: true, role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden - Admin access required' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Optional admin authentication (doesn't fail if not authenticated)
export async function optionalAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const sessionId = req.cookies.adminSession;

    if (sessionId) {
      const session = await prisma.$queryRaw<Array<{ userId: string; expiresAt: Date }>>`
        SELECT userId, expiresAt FROM admin_sessions
        WHERE sessionId = ${sessionId}
        AND expiresAt > NOW()
        LIMIT 1
      `;

      if (session && session.length > 0) {
        const user = await prisma.user.findUnique({
          where: { id: session[0].userId },
          select: { id: true, role: true },
        });

        if (user && user.role === 'ADMIN') {
          req.user = user;
        }
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
}
