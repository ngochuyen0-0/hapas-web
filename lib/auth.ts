import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export interface AdminJwtPayload {
  adminId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface CustomerJwtPayload {
  customerId: string;
  email: string;
  iat: number;
  exp: number;
}

export const generateAdminToken = (admin: any): string => {
  return jwt.sign(
    { 
      adminId: admin.id, 
      email: admin.email, 
      role: admin.role 
    },
    process.env.JWT_SECRET || 'fallback_secret_key',
    { expiresIn: '24h' }
  );
};

export const generateCustomerToken = (customer: any): string => {
  return jwt.sign(
    { 
      customerId: customer.id, 
      email: customer.email 
    },
    process.env.JWT_SECRET || 'fallback_secret_key',
    { expiresIn: '24h' }
  );
};

export const verifyAdminToken = (token: string): AdminJwtPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key') as AdminJwtPayload;
  } catch (error) {
    return null;
  }
};

export const verifyCustomerToken = (token: string): CustomerJwtPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key') as CustomerJwtPayload;
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  const bcrypt = require('bcryptjs');
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(password, hash);
};


