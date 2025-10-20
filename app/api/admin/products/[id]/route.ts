import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';

// Protected route - only accessible by authenticated admins
export const GET = withAdminAuth(async (req: Request, { params }) => {
  try {
    const { id } = params as { id: string };

    // Fetch product with category and inventory info
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        inventories: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
});

// Protected route - only accessible by authenticated admins
export const PUT = withAdminAuth(async (req: Request, { params }) => {
  try {
    const { id } = params as { id: string };

    // Get admin info from the request context
    const admin = (req as any).admin;

    // Only managers and super admins can update products
    if (admin.role !== 'manager' && admin.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 },
      );
    }

    const body = await req.json();
    const {
      name,
      description,
      price,
      category_id,
      brand,
      material,
      color,
      size,
      image_urls,
      is_active,
      inventory_quantity,
    } = body;

    // Validate required fields
    if (!name || price === undefined || !category_id) {
      return NextResponse.json(
        { success: false, message: 'Name, price, and category are required' },
        { status: 400 },
      );
    }

    // Update product
    const product = await prisma.product.update({
      where: { id },
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
        is_active,
      },
    });

    // Update inventory if provided
    if (inventory_quantity !== undefined) {
      const existingInventory = await prisma.inventory.findFirst({
        where: { product_id: id },
      });

      if (existingInventory) {
        await prisma.inventory.update({
          where: { id: existingInventory.id },
          data: { quantity: inventory_quantity },
        });
      } else {
        await prisma.inventory.create({
          data: {
            product_id: id,
            quantity: inventory_quantity,
            reserved_quantity: 0,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error: any) {
    console.error('Error updating product:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 },
    );
  }
});

// Protected route - only accessible by authenticated admins
export const DELETE = withAdminAuth(async (req: Request, { params }) => {
 try {
    const { id } = params as { id: string };

    // Get admin info from the request context
    const admin = (req as any).admin;

    // Only managers and super admins can delete products
    if (admin.role !== 'manager' && admin.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 },
      );
    }

    // Delete product
    await prisma.inventory.deleteMany({
      where: { product_id: id },
    });
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 },
    );
  }
});
