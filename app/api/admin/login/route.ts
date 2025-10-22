import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, generateAdminToken } from '@/lib/auth';

// This route doesn't need authentication as it's for logging in admins
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
console.log(NextResponse.json)
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 },
      );
    }

    // Find admin user
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 },
      );
    }

    // Check password
    const isPasswordValid = await comparePassword(
      password,
      admin.password_hash,
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 },
      );
    }

    // Generate JWT token
    const token = generateAdminToken(admin);

    // Return success response with token
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
