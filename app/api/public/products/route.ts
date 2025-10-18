import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Public route - accessible by anyone
export async function GET(req: Request) {
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
}
