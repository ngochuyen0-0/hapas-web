import { NextResponse } from 'next/server';
import { verifyAdminToken, verifyCustomerToken } from '@/lib/auth';

// Middleware for protecting admin routes
export function withAdminAuth(
  handler: (req: Request) => Promise<NextResponse> | NextResponse,
) {
  return async function (req: Request) {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          {
            success: false,
            message: 'Authorization header missing or invalid',
          },
          { status: 401 },
        );
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      const decoded = verifyAdminToken(token);

      if (!decoded) {
        return NextResponse.json(
          { success: false, message: 'Invalid or expired token' },
          { status: 401 },
        );
      }

      // Add admin info to request context
      (req as any).admin = decoded;

      // Call the handler
      return await handler(req);
    } catch (error: any) {
      console.error('Admin auth error:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Internal server error',
          error: error.message,
        },
        { status: 500 },
      );
    }
  };
}

// Middleware for protecting customer routes
export function withCustomerAuth(
  handler: (req: Request) => Promise<NextResponse> | NextResponse,
) {
  return async function (req: Request) {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          {
            success: false,
            message: 'Authorization header missing or invalid',
          },
          { status: 401 },
        );
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      const decoded = verifyCustomerToken(token);

      if (!decoded) {
        return NextResponse.json(
          { success: false, message: 'Invalid or expired token' },
          { status: 401 },
        );
      }

      // Add customer info to request context
      (req as any).customer = decoded;
      console.log('Authenticated customer:', decoded);
      // Call the handler
      return await handler(req);
    } catch (error: any) {
      console.error('Customer auth error:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Internal server error',
          error: error.message,
        },
        { status: 500 },
      );
    }
  };
}

// Helper function to extract admin from token (for routes that implement their own auth)
export async function getAdminFromToken(request: Request) {
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

// Helper function to extract customer from token (for routes that implement their own auth)
export async function getCustomerFromToken(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const payload = verifyCustomerToken(token);
  if (!payload) {
    return null;
  }

  return payload;
}
