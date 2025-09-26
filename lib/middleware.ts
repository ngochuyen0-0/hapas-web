import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { withAdminAuth } from '@/lib/apiAuth';

// Export the new unified middleware
export { withAdminAuth };

// Keep the old function for backward compatibility
export function withAdminAuthOld(handler: (req: Request) => Promise<NextResponse> | NextResponse) {
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
      const decoded = verifyAdminToken(token);

      if (!decoded) {
        return NextResponse.json(
          { success: false, message: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      // Add admin info to request context
      (req as any).admin = decoded;

      // Call the handler
      const result = await handler(req);
      return result;
    } catch (error: any) {
      console.error('Admin auth error:', error);
      return NextResponse.json(
        { success: false, message: 'Internal server error', error: error.message },
        { status: 500 }
      );
    }
  };
}