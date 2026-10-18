import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { phone: '+233247559387' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@luxebyicce.com',
      phone: '+233247559387',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'handbags' },
      update: {},
      create: {
        name: 'Handbags',
        slug: 'handbags',
        description: 'Elegant handbags for every occasion',
        displayOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'heels' },
      update: {},
      create: {
        name: 'Heels',
        slug: 'heels',
        description: 'Stylish heels to elevate your look',
        displayOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'shoes' },
      update: {},
      create: {
        name: 'Shoes',
        slug: 'shoes',
        description: 'Comfortable and fashionable shoes',
        displayOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sandals' },
      update: {},
      create: {
        name: 'Sandals',
        slug: 'sandals',
        description: 'Perfect sandals for warm weather',
        displayOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'slides' },
      update: {},
      create: {
        name: 'Slides',
        slug: 'slides',
        description: 'Comfortable slides for everyday wear',
        displayOrder: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'accessories' },
      update: {},
      create: {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Fashion accessories to complete your look',
        displayOrder: 6,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'gifts' },
      update: {},
      create: {
        name: 'Gifts',
        slug: 'gifts',
        description: 'Perfect gifts for special occasions',
        displayOrder: 7,
      },
    }),
  ]);
  console.log('✅ Categories created');

  // Create sample products
  const handbagsCategory = categories.find(c => c.slug === 'handbags');
  const heelsCategory = categories.find(c => c.slug === 'heels');

  if (handbagsCategory) {
    await prisma.product.create({
      data: {
        name: 'Classic Leather Handbag',
        slug: 'classic-leather-handbag',
        description: 'A timeless classic leather handbag perfect for any occasion. Crafted with premium materials and attention to detail.',
        categoryId: handbagsCategory.id,
        sku: 'LHB-001',
        regularPrice: 35000, // GH₵350.00
        salePrice: 29000, // GH₵290.00
        currency: 'GHS',
        stockQuantity: 10,
        isFeatured: true,
        isNewArrival: true,
        isPublished: true,
        publishedAt: new Date(),
        images: {
          create: [
            {
              imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/products/handbag1.jpg',
              altText: 'Classic Leather Handbag - Front View',
              isPrimary: true,
              displayOrder: 0,
            },
          ],
        },
      },
    });

    await prisma.product.create({
      data: {
        name: 'Elegant Tote Bag',
        slug: 'elegant-tote-bag',
        description: 'Spacious and elegant tote bag for everyday use. Features multiple compartments and durable construction.',
        categoryId: handbagsCategory.id,
        sku: 'LHB-002',
        regularPrice: 28000, // GH₵280.00
        currency: 'GHS',
        stockQuantity: 15,
        isBestSeller: true,
        isPublished: true,
        publishedAt: new Date(),
        images: {
          create: [
            {
              imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/products/tote1.jpg',
              altText: 'Elegant Tote Bag',
              isPrimary: true,
              displayOrder: 0,
            },
          ],
        },
      },
    });
  }

  if (heelsCategory) {
    await prisma.product.create({
      data: {
        name: 'Stiletto Heels',
        slug: 'stiletto-heels',
        description: 'Elegant stiletto heels for special occasions. Comfortable cushioned insole for all-day wear.',
        categoryId: heelsCategory.id,
        sku: 'LHL-001',
        regularPrice: 32000, // GH₵320.00
        currency: 'GHS',
        stockQuantity: 8,
        isFeatured: true,
        isPublished: true,
        publishedAt: new Date(),
        images: {
          create: [
            {
              imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/products/heels1.jpg',
              altText: 'Stiletto Heels',
              isPrimary: true,
              displayOrder: 0,
            },
          ],
        },
        variants: {
          create: [
            { name: 'Black, Size 38', sku: 'LHL-001-BLK-38', stock: 3 },
            { name: 'Black, Size 39', sku: 'LHL-001-BLK-39', stock: 3 },
            { name: 'Black, Size 40', sku: 'LHL-001-BLK-40', stock: 2 },
          ],
        },
      },
    });
  }

  console.log('✅ Sample products created');

  // Create store settings
  await prisma.storeSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      businessName: 'Luxe by Icce',
      businessDescription: 'Your destination for elegance, style, and quality.',
      whatsappNumber: '233247559387',
      announcementText: 'Welcome to Luxe by Icce - Your destination for elegance and style',
      currency: 'GHS',
    },
  });
  console.log('✅ Store settings created');

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
