import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency in Vietnamese Dong (VND)
export function formatCurrencyVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

// Alternative format without currency symbol if needed
export function formatNumberVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}
