import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withCustomerAuth } from '@/lib/apiAuth';

export const GET = withCustomerAuth(async (req: Request) => {
  try {
    const customer = (req as any).customer;
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const status = url.searchParams.get('status'); // Filter by status (pending, approved, rejected)
    const productId = url.searchParams.get('product_id'); // Filter by specific product

    // Build where clause for customer's reviews
    const whereClause: any = {
      customer_id: customer.id,
    };

    if (status) {
      whereClause.status = status;
    }

    if (productId) {
      whereClause.product_id = productId;
    }

    // Get reviews by the current customer with pagination
    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            image_urls: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await prisma.review.count({
      where: whereClause,
    });

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching customer reviews:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});