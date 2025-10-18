import { NextResponse } from 'next/server';
import { withCustomerAuth } from '@/lib/apiAuth';
import { prisma } from '@/lib/prisma';

// Protected route - only accessible by authenticated customers
export const GET = withCustomerAuth(async (req: Request) => {
  try {
    // Get customer info from the request context
    const customer = (req as any).customer;

    // Fetch only active products for customers
    const products = await prisma.product.findMany({
      where: {
        is_active: true,
      },
      include: {
        category: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      products,
      customer: {
        id: customer.customerId,
        email: customer.email,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
});
