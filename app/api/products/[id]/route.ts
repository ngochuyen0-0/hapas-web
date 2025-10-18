import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withCustomerAuth } from '@/lib/apiAuth';

// Protected route - only accessible by authenticated customers
export const GET = withCustomerAuth(async (req: Request) => {
  try {
    // Extract product ID from URL
    const url = new URL(req.url);
    const productId = url.pathname.split('/').pop();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 },
      );
    }

    // Fetch product with category info
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 },
      );
    }

    // Fetch inventory info
    const inventory = await prisma.inventory.findFirst({
      where: { product_id: productId },
    });

    // Fetch reviews
    const reviews = await prisma.review.findMany({
      where: { product_id: productId },
      include: {
        customer: {
          select: {
            full_name: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        inventory: inventory || null,
        reviews,
      },
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
});
