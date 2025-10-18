import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Helper function to get admin from token
async function getAdminFromToken(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const payload = verifyAdminToken(token);
  if (!payload) {
    return null;
  }

  return payload;
}

// GET /api/admin/categories - Get all categories
export async function GET(req: Request) {
  try {
    const admin = await getAdminFromToken(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);
    const isActive = searchParams.get('is_active');

    const where: any = {};
    if (isActive !== null) {
      where.is_active = isActive === 'true';
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: { created_at: 'desc' },
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

// POST /api/admin/categories - Create a new category
export async function POST(req: Request) {
  try {
    const admin = await getAdminFromToken(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { name, description, image_url, is_active } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Tên danh mục là bắt buộc' },
        { status: 400 },
      );
    }

    // Check if category with same name already exists
    const existingCategory = await prisma.category.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: 'Danh mục với tên này đã tồn tại' },
        { status: 400 },
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        description: description || null,
        image_url: image_url || null,
        is_active: is_active !== undefined ? is_active : true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Tạo danh mục thành công',
      category,
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
