import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdminAuth } from '@/lib/apiAuth';

// Protected route - only accessible by authenticated admins
export const GET = withAdminAuth(async (req: Request) => {
  try {
    // Test database connection
    await prisma.$connect();

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
});
