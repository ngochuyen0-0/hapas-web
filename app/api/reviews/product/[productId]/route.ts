import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const sortBy = url.searchParams.get('sortBy') || 'newest'; // newest, oldest, highestRating, lowestRating
    const rating = url.searchParams.get('rating'); // Filter by specific rating

    // Validate product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Build where clause for approved reviews
    const whereClause: any = {
      product_id: productId,
      status: 'approved',
    };

    if (rating) {
      whereClause.rating = parseInt(rating);
    }

    // Build orderBy clause
    let orderBy: any = { created_at: 'desc' }; // Default to newest
    switch (sortBy) {
      case 'oldest':
        orderBy = { created_at: 'asc' };
        break;
      case 'highestRating':
        orderBy = { rating: 'desc' };
        break;
      case 'lowestRating':
        orderBy = { rating: 'asc' };
        break;
      default:
        orderBy = { created_at: 'desc' };
    }

    // Get reviews for the product with pagination
    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        customer: {
          select: {
            id: true,
            full_name: true,
          },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await prisma.review.count({
      where: whereClause,
    });

    // Calculate average rating for the product
    const avgRatingResult = await prisma.review.aggregate({
      where: whereClause,
      _avg: {
        rating: true,
      },
    });

    // Get rating distribution
    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: whereClause,
      _count: {
        rating: true,
      },
    });

    const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingDistribution.forEach(item => {
      ratingCounts[item.rating] = item._count.rating;
    });

    return NextResponse.json({
      success: true,
      data: reviews,
      stats: {
        averageRating: avgRatingResult._avg.rating || 0,
        totalReviews: totalCount,
        ratingDistribution: ratingCounts,
      },
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}