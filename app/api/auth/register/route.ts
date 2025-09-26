import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { validateCustomerData } from '@/lib/validation';
import { ValidationError } from '@/lib/errors';

// This route doesn't need authentication as it's for registering new customers
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, full_name } = body;

    // Validate customer data
    const validationErrors = validateCustomerData({ email, password, full_name });
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: validationErrors },
        { status: 400 }
      );
    }

    // Check if customer already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email }
    });

    if (existingCustomer) {
      return NextResponse.json(
        { success: false, message: 'Customer with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        email,
        password_hash,
        full_name
      }
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Customer registered successfully',
      customer: {
        id: customer.id,
        email: customer.email,
        full_name: customer.full_name
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Customer registration error:', error);
    
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}