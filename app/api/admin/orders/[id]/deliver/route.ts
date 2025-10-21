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

    // Fetch the current order to check its status
    const order = await prisma.order.findUnique({
      where: { id },
    });
    
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 },
      );
    }

    // Only allow confirming delivery if the current status is 'shipped' or 'Đang Giao'
    if (order.status !== 'shipped' && translateOrderStatusToVietnamese(order.status) !== 'Đang Giao') {
      return NextResponse.json(
        { 
          success: false, 
          message: `Cannot confirm delivery for order with status: ${translateOrderStatusToVietnamese(order.status)}. Order must be in 'shipped' status.` 
        },
        { status: 400 },
      );
    }

    // Update order status to 'delivered'
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: 'delivered',
        updated_at: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Order delivery confirmed successfully',
      order: {
        ...updatedOrder,
        status: translateOrderStatusToVietnamese(updatedOrder.status),
      },
    });
  } catch (error) {
    console.error('Error confirming order delivery:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}