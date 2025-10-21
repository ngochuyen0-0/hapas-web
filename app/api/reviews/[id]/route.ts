import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch a single review by ID (only if it belongs to the customer)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get customer from token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization header missing or invalid' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const customerPayload = await import('@/lib/auth').then(auth => auth.verifyCustomerToken(token));
    
    if (!customerPayload) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Use customerPayload.customerId instead of customer.id
    const review = await prisma.review.findUnique({
      where: {
        id,
        customer_id: customerPayload.customerId // Ensure the review belongs to the customer
      },
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
    });

    if (!review) {
      return NextResponse.json(
        { success: false, message: 'Review not found or does not belong to you' },
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

// PUT - Update a review by ID (only if it belongs to the customer)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get customer from token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization header missing or invalid' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const customerPayload = await import('@/lib/auth').then(auth => auth.verifyCustomerToken(token));
    
    if (!customerPayload) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { rating, comment } = await request.json();

    // Validate input
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if the review exists and belongs to the customer
    const existingReview = await prisma.review.findUnique({
      where: {
        id,
        customer_id: customerPayload.customerId
      },
    });

    if (!existingReview) {
      return NextResponse.json(
        { success: false, message: 'Review not found or does not belong to you' },
        { status: 404 }
      );
    }

    // Update the review
    const updatedReview = await prisma.review.update({
      where: {
        id,
        customer_id: customerPayload.customerId // Ensure the review belongs to the customer
      },
      data: {
        ...(rating !== undefined && { rating }),
        ...(comment !== undefined && { comment: comment || null }),
        updated_at: new Date(), // Update the timestamp
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
      review: updatedReview,
      message: 'Review updated successfully',
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a review by ID (only if it belongs to the customer)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get customer from token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization header missing or invalid' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const customerPayload = await import('@/lib/auth').then(auth => auth.verifyCustomerToken(token));
    
    if (!customerPayload) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check if the review exists and belongs to the customer
    const existingReview = await prisma.review.findUnique({
      where: {
        id,
        customer_id: customerPayload.customerId
      },
    });

    if (!existingReview) {
      return NextResponse.json(
        { success: false, message: 'Review not found or does not belong to you' },
        { status: 404 }
      );
    }

    // Delete the review
    await prisma.review.delete({
      where: {
        id,
        customer_id: customerPayload.customerId // Ensure the review belongs to the customer
      },
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
