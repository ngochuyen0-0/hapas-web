'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
        <p className="mt-1 text-sm text-gray-500">
          Quản lý cài đặt hệ thống
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chức năng đang phát triển</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Trang cài đặt sẽ được cập nhật trong phiên bản tiếp theo.</p>
        </CardContent>
      </Card>
    </div>
  );
}