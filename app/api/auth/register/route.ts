import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { validateCustomerData } from '@/lib/validation';
import { ValidationError } from '@/lib/errors';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, full_name } = body;

    const validationErrors = validateCustomerData({
      email,
      password,
      full_name,
    });
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validationErrors,
        },
        { status: 400 },
      );
    }

    const existingCustomer = await prisma.customer.findUnique({
      where: { email },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { success: false, message: 'Email đã được sử dụng' },
        { status: 409 },
      );
    }

    const password_hash = await hashPassword(password);

    const customer = await prisma.customer.create({
      data: {
        email,
        password_hash,
        full_name,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Đăng ký thành công',
        customer: {
          id: customer.id,
          email: customer.email,
          full_name: customer.full_name,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: 'Opps' },
      { status: 500 },
    );
  }
}
