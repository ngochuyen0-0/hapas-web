import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

// GET - Fetch a single review by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

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

    const review = await prisma.review.findUnique({
      where: { id },
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
    });

    if (!review) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update a review by ID (for approval/rejection)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const { status, comment } = await request.json();

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

    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status. Must be pending, approved, or rejected' },
        { status: 400 }
      );
    }

    const review = await prisma.review.update({
      where: { id },
      data: {
        status,
        comment: comment !== undefined ? comment : undefined, // Only update comment if provided
      },
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
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a review by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

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

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}