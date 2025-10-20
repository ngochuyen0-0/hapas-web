import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Check if user is authenticated using custom JWT verification
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization header missing or invalid' },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyAdminToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 },
      );
    }

    // Get review statistics
    const [
      totalReviews,
      pendingReviews,
      approvedReviews,
      rejectedReviews,
      averageRating
    ] = await Promise.all([
      prisma.review.count(),
      prisma.review.count({ where: { status: 'pending' } }),
      prisma.review.count({ where: { status: 'approved' } }),
      prisma.review.count({ where: { status: 'rejected' } }),
      prisma.review.aggregate({
        _avg: {
          rating: true
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        total: totalReviews,
        pending: pendingReviews,
        approved: approvedReviews,
        rejected: rejectedReviews,
        averageRating: averageRating._avg.rating || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}