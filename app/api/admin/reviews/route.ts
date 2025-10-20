import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdminAuth } from '@/lib/apiAuth';

export const GET = withAdminAuth(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status'); // pending, approved, rejected
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';

    // Build where clause based on status and search
    const whereClause: any = {};
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    
    if (search) {
      whereClause.OR = [
        { comment: { contains: search, mode: 'insensitive' } },
        { customer: { full_name: { contains: search, mode: 'insensitive' } } },
        { product: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Get reviews with pagination
    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        customer: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
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
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});

export const POST = withAdminAuth(async (req: Request) => {
  try {
    const { customer_id, product_id, rating, comment, is_verified_purchase = false } = await req.json();

    // Validate required fields
    if (!customer_id || !product_id || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Invalid input data' },
        { status: 400 }
      );
    }

    // Check if customer and product exist
    const [customer, product] = await Promise.all([
      prisma.customer.findUnique({ where: { id: customer_id } }),
      prisma.product.findUnique({ where: { id: product_id } }),
    ]);

    if (!customer || !product) {
      return NextResponse.json(
        { success: false, message: 'Customer or product not found' },
        { status: 404 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        customer_id,
        product_id,
        rating,
        comment: comment || null,
        is_verified_purchase,
        status: 'pending', // Default to pending for admin-created reviews
      },
      include: {
        customer: {
          select: {
            full_name: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});