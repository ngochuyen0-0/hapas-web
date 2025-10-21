import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

// Function to translate order status to Vietnamese
function translateOrderStatusToVietnamese(status: string): string {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Chờ Xử Lý';
    case 'processing':
      return 'Đang Xử Lý';
    case 'shipped':
      return 'Đang Giao';
    case 'completed':
      return 'Hoàn Thành';
    case 'cancelled':
      return 'Đã Hủy';
    case 'delivered':
      return 'Đã Giao';
    case 'refunded':
      return 'Đã Hoàn Tiền';
    default:
      return status; // Return original status if not found in translation
 }
}

// Function to translate order status from Vietnamese back to English
function translateOrderStatusToEnglish(status: string): string {
  switch (status.trim()) {
    case 'Chờ Xử Lý':
      return 'pending';
    case 'Đang Xử Lý':
      return 'processing';
    case 'Đang Giao':
      return 'shipped';
    case 'Đã Giao':
      return 'delivered';
    case 'Hoàn Thành':
      return 'completed';
    case 'Đã Hủy':
      return 'cancelled';
    case 'Đã Hoàn Tiền':
      return 'refunded';
    default:
      return status.toLowerCase(); // Return original status if not found in translation
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const { status } = await request.json();
    
    // Convert Vietnamese status back to English before saving to database
    const englishStatus = translateOrderStatusToEnglish(status);

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
    const validStatuses = [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'completed',
      'cancelled',
      'refunded',
    ];
    if (!validStatuses.includes(englishStatus)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 },
      );
    }

    // Validate that the status transition is allowed
    const order = await prisma.order.findUnique({
      where: { id },
    });
    
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 },
      );
    }
    
    // Define valid status transitions for processing actions
    const validTransitions = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered', 'completed', 'cancelled'],
      delivered: ['completed', 'refunded', 'shipped'], // Allow returning to shipped if needed
      completed: ['refunded'],
    };
    
    if (order.status !== englishStatus &&
        order.status in validTransitions &&
        !validTransitions[order.status as keyof typeof validTransitions].includes(englishStatus)) {
      return NextResponse.json(
        { success: false, message: `Invalid status transition: ${order.status} to ${englishStatus}` },
        { status: 400 },
      );
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: englishStatus,
        updated_at: new Date(), // Update the timestamp when processing
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      order: {
        ...updatedOrder,
        status: translateOrderStatusToVietnamese(updatedOrder.status),
      },
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
