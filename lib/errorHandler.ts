import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Global error handler middleware
export async function handleError(error: any) {
  console.error('Unhandled error:', error);
  
  // Prisma specific errors
  if (error.code === 'P2002') {
    return NextResponse.json(
      { success: false, message: 'A record with this value already exists' },
      { status: 409 }
    );
  }
  
  if (error.code === 'P2025') {
    return NextResponse.json(
      { success: false, message: 'Record not found' },
      { status: 404 }
    );
  }
  
  // Generic error
  return NextResponse.json(
    { success: false, message: 'Internal server error' },
    { status: 500 }
  );
}