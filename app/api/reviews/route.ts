import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withCustomerAuth } from '@/lib/apiAuth';

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get('product_id');
    const customerId = url.searchParams.get('customer_id');
    const status = url.searchParams.get('status') || 'approved'; // Default to approved for public view
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const rating = url.searchParams.get('rating'); // Filter by specific rating

    // Build where clause based on filters
    const whereClause: any = {};
    
    // Only show approved reviews by default for public access
    if (status === 'all') {
      // Allow all statuses only if explicitly requested
      // This should typically be used by authenticated customers for their own reviews
    } else {
      whereClause.status = status || 'approved';
    }

    if (productId) {
      whereClause.product_id = productId;
    }

    if (customerId) {
      whereClause.customer_id = customerId;
    }

    if (rating) {
      whereClause.rating = parseInt(rating);
    }

    // Get reviews with pagination
    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        customer: {
          select: {
            id: true,
            full_name: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
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
};

export const POST = withCustomerAuth(async (req: Request) => {
  try {
    const customer = (req as any).customer;
    const { product_id, rating, comment, is_verified_purchase = false } = await req.json();

    // Validate required fields
    if (!product_id || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Invalid input data. Product ID and rating (1-5) are required.' },
        { status: 400 }
      );
    }

    // Check if customer has purchased the product (for verification)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        order: {
          customer_id: customer.id,
          status: 'delivered', // Only consider delivered orders
        },
        product_id: product_id,
      },
    });

    // Check if customer already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        customer_id: customer.id,
        product_id: product_id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, message: 'You have already reviewed this product.' },
        { status: 409 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: product_id },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        customer_id: customer.id,
        product_id: product_id,
        rating,
        comment: comment || null,
        is_verified_purchase: hasPurchased ? true : is_verified_purchase,
        status: 'approved', // Customer-submitted reviews are auto-approved by default
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
      message: 'Review submitted successfully',
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});