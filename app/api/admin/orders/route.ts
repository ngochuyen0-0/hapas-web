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
      return 'Đã Giao';
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

    // Fetch all orders with customer information
    const orders = await prisma.order.findMany({
      include: {
        customer: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
      orderBy: {
        order_date: 'desc',
      },
    });
    
    // Translate order statuses to Vietnamese
    const translatedOrders = orders.map(order => ({
      ...order,
      status: translateOrderStatusToVietnamese(order.status),
    }));

    return NextResponse.json({
      success: true,
      orders: translatedOrders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { status, id } = await request.json();

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

    // Convert Vietnamese status back to English before saving to database
    const englishStatus = translateOrderStatusToEnglish(status);
    
    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: englishStatus },
    });
    
    // Translate status back to Vietnamese for response
    updatedOrder.status = translateOrderStatusToVietnamese(updatedOrder.status);

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
