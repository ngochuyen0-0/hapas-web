import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateOrderData } from '@/lib/validation';
import { ValidationError } from '@/lib/errors';
import { withCustomerAuth } from '@/lib/apiAuth';

// Protected route - only accessible by authenticated customers
export const GET = withCustomerAuth(async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customer_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    if (!customerId) {
      return NextResponse.json(
        { success: false, message: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Fetch customer orders
    const orders = await prisma.order.findMany({
      where: { customer_id: customerId },
      skip,
      take: limit,
      orderBy: { order_date: 'desc' },
      include: {
        order_items: {
          include: {
            product: {
              select: {
                name: true,
                image_urls: true
              }
            }
          }
        }
      }
    });

    // Get total count for pagination
    const total = await prisma.order.count({ 
      where: { customer_id: customerId } 
    });

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});

// Protected route - only accessible by authenticated customers
export const POST = withCustomerAuth(async (req: Request) => {
  try {
    const body = await req.json();
    // Extract customer_id from the authenticated customer context
    const customer = (req as any).customer;
    const customerId = customer.customerId;
    
    const { shipping_address, billing_address, items } = body;

    // Validate order data (excluding customer_id since it comes from auth context)
    const validationErrors = validateOrderData({ customer_id: customerId, items });
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: validationErrors },
        { status: 400 }
      );
    }

    // Calculate total amount
    let total_amount = 0;
    for (const item of items) {
      total_amount += item.quantity * item.unit_price;
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        customer_id: customerId,
        total_amount,
        shipping_address,
        billing_address,
        status: 'pending',
        order_items: {
          create: items.map((item: any) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.quantity * item.unit_price
          }))
        }
      },
      include: {
        order_items: true
      }
    });

    // Update inventory (reserve quantities)
    for (const item of items) {
      await prisma.inventory.updateMany({
        where: { product_id: item.product_id },
        data: {
          reserved_quantity: {
            increment: item.quantity
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});