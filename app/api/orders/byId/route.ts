import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateOrderData } from '@/lib/validation';
import { ValidationError } from '@/lib/errors';
import { withCustomerAuth } from '@/lib/apiAuth';

// Protected route - only accessible by authenticated customers
export const GET = withCustomerAuth(async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customer_id');

    if (!customerId) {
      return NextResponse.json(
        { success: false, message: 'Customer ID is required' },
        { status: 400 },
      );
    }

    // Fetch customer orders
    const orders = await prisma.order.findMany({
      where: { customer_id: customerId },
      orderBy: { order_date: 'desc' },
      include: {
        order_items: {
          include: {
            product: {
              select: {
                name: true,
                image_urls: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
});