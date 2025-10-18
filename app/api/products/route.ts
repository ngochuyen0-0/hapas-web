import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateProductData } from '@/lib/validation';
import { ValidationError } from '@/lib/errors';
import { withAdminAuth, withCustomerAuth } from '@/lib/apiAuth';

// Protected route - only accessible by authenticated admins
export const GET = withCustomerAuth(async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('category_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { is_active: true };
    if (categoryId) {
      where.category_id = categoryId;
    }

    // Fetch products
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    // Get total count for pagination
    const total = await prisma.product.count({ where });

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
});

// Protected route - only accessible by authenticated admins
export const POST = withAdminAuth(async (req: Request) => {
  try {
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
    } = body;

    // Validate product data
    const validationErrors = validateProductData({ name, price, category_id });
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validationErrors,
        },
        { status: 400 },
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category_id,
        brand,
        material,
        color,
        size,
        image_urls,
        is_active: true,
      },
    });

    // Create initial inventory record
    await prisma.inventory.create({
      data: {
        product_id: product.id,
        quantity: 0,
        reserved_quantity: 0,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully',
        product,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating product:', error);

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
});
