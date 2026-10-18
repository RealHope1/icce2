import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate session ID
export function generateSessionId(): string {
  return nanoid(32);
}

// Normalize Ghanaian phone number to +233XXXXXXXXX format
export function normalizePhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // If starts with 0, replace with +233
  if (digits.startsWith('0')) {
    return '+233' + digits.substring(1);
  }

  // If starts with 233 (without +), add +
  if (digits.startsWith('233')) {
    return '+' + digits;
  }

  // If already has +, return as is
  if (digits.startsWith('+233')) {
    return '+' + digits.substring(1);
  }

  // Default: assume it's missing country code
  return '+233' + digits;
}

// Generate order reference (e.g., LUX-2024-ABC123)
export function generateOrderReference(): string {
  const year = new Date().getFullYear();
  const random = nanoid(6).toUpperCase();
  return `LUX-${year}-${random}`;
}

// Format price from minor units to currency string
export function formatPrice(amount: number, currency: string = 'GHS'): string {
  const majorUnits = amount / 100;
  return `${currency} ${majorUnits.toFixed(2)}`;
}

// Calculate discount percentage
export function calculateDiscountPercent(regularPrice: number, salePrice: number): number {
  if (regularPrice <= 0) return 0;
  const discount = regularPrice - salePrice;
  return Math.round((discount / regularPrice) * 100);
}
