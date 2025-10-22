import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, generateCustomerToken } from '@/lib/auth';

// This route doesn't need authentication as it's for logging in
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 },
      );
    }

    // Find customer
    const customer = await prisma.customer.findUnique({
      where: { email },
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 },
      );
    }

    // Check password
    const isPasswordValid = await comparePassword(
      password,
      customer.password_hash,
    );



    // Generate JWT token
    const token = generateCustomerToken(customer);

    // Return success response with token
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: customer.id,
        email: customer.email,
        full_name: customer.full_name,
        phone: customer.phone,
        address: customer.address,
      },
    });
  } catch (error) {
    console.error('Customer login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
