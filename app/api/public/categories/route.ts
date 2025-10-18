import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Public route - accessible by anyone
export async function GET(req: Request) {
  try {
    const categories = await prisma.category.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
