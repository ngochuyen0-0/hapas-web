import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';

// Protected route - only accessible by authenticated admins
export const GET = withAdminAuth(async (req: Request) => {
  try {
    // Get admin info from the request context
    const admin = (req as any).admin;

    // Fetch all products (admin can see all products)
    const products = await prisma.product.findMany({
      include: {
        category: true,
        inventories: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      products,
      admin: {
        id: admin.adminId,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
});

// Protected route - only accessible by authenticated admins
export const POST = withAdminAuth(async (req: Request) => {
  try {
    // Get admin info from the request context
    const admin = (req as any).admin;
    
    // Only managers and super admins can create products
    if (admin.role !== 'manager' && admin.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, description, price, category_id, brand, material, color, size, image_urls, initial_stock_quantity } = body;

    // Validate required fields
    if (!name || !price || !category_id) {
      return NextResponse.json(
        { success: false, message: 'Name, price, and category are required' },
        { status: 400 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        category_id,
        brand,
        material,
        color,
        size,
        image_urls,
        is_active: true
      }
    });

    // Create initial inventory record
    await prisma.inventory.create({
      data: {
        product_id: product.id,
        quantity: initial_stock_quantity || 0,
        reserved_quantity: 0
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
});