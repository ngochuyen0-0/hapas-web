import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';
import { p } from 'framer-motion/client';

// GET - Fetch a single product by ID
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
}

// PUT - Update a product by ID
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

    // Check if admin has permission to update products
    if (decoded.role !== 'manager' && decoded.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 },
      );
    }

    const body = await request.json();
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
}

// DELETE - Delete a product by ID
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

    // Check if admin has permission to delete products
    if (decoded.role !== 'manager' && decoded.role !== 'super_admin') {
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
}
