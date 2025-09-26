import { NextResponse } from 'next/server';
import { verifyCustomerToken } from '@/lib/auth';
import { withCustomerAuth } from '@/lib/apiAuth';

// Export the new unified middleware
export { withCustomerAuth };

// Keep the old function for backward compatibility
export async function withCustomerAuthOld(handler: (req: Request) => Promise<NextResponse>) {
  return async function (req: Request) {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { success: false, message: 'Authorization header missing or invalid' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      const decoded = verifyCustomerToken(token);

      if (!decoded) {
        return NextResponse.json(
          { success: false, message: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      // Add customer info to request context
      (req as any).customer = decoded;

      // Call the handler
      return await handler(req);
    } catch (error) {
      console.error('Customer auth error:', error);
      return NextResponse.json(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}