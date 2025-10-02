import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Public route - accessible by anyone
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const categoryId = searchParams.get('category_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    if (!query && !categoryId) {
      return NextResponse.json(
        { success: false, message: 'Query parameter "q" or "category_id" is required' },
        { status: 400 }
      );
    }

    // Build where clause
    const where: any = { is_active: true };
    
    if (query) {
      where.name = {
        contains: query,
        mode: 'insensitive' // Case-insensitive search
      };
    }
    
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
            name: true
          }
        }
      }
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
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}