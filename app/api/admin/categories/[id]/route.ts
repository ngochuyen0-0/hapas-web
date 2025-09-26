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

// PUT /api/admin/categories/[id] - Update a category
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromToken(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const categoryId = params.id;
    const body = await req.json();
    const { name, description, image_url, is_active } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Tên danh mục là bắt buộc' },
        { status: 400 }
      );
    }

    // Check if another category with same name already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        NOT: { id: categoryId }
      }
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: 'Danh mục với tên này đã tồn tại' },
        { status: 400 }
      );
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        description: description !== undefined ? description : undefined,
        image_url: image_url !== undefined ? image_url : undefined,
        is_active: is_active !== undefined ? is_active : undefined
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Cập nhật danh mục thành công',
      category
    });
  } catch (error: any) {
    console.error('Error updating category:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy danh mục' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/categories/[id] - Delete a category
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromToken(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const categoryId = params.id;

    // Check if category has products
    const productCount = await prisma.product.count({
      where: { category_id: categoryId }
    });

    if (productCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Không thể xóa danh mục vì đang có sản phẩm thuộc danh mục này' 
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: categoryId }
    });

    return NextResponse.json({
      success: true,
      message: 'Xóa danh mục thành công'
    });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy danh mục' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}