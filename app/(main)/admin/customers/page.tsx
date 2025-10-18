'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Define the Customer type based on the Prisma schema and component usage
interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  is_active: boolean;
  orders_count?: number;
  total_spent?: number;
  created_at: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/customers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setCustomers(data.customers);
      }
    } catch (error) {
      console.error('Lỗi khi tải khách hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Khách Hàng</h1>
        <p className="mt-1 text-sm text-gray-500">
          Quản lý cơ sở khách hàng của bạn
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Tìm kiếm khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách Hàng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Điện Thoại</TableHead>
                  <TableHead>Đơn Hàng</TableHead>
                  <TableHead>Tổng Chi Tiêu</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead className="text-right">Hành Động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.full_name}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone || 'N/A'}</TableCell>
                    <TableCell>{customer.orders_count || 0}</TableCell>
                    <TableCell>
                      ${(customer.total_spent || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={customer.is_active ? 'default' : 'secondary'}
                      >
                        {customer.is_active ? 'Hoạt Động' : 'Ngừng Hoạt Động'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/admin/customers/${customer.id}`)
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
