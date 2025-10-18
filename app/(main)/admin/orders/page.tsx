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
import { Search, Eye, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Define TypeScript interfaces for our data
interface Customer {
  id: string;
  full_name: string;
  email: string;
}

interface Order {
  id: string;
  customer_id: string;
  customer: Customer;
  status: string;
  total_amount: number;
  order_date: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (data.success) {
        // Refresh the order list
        fetchOrders();
      } else {
        alert('Không thể cập nhật trạng thái đơn hàng: ' + data.message);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
      alert('Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng');
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Hoàn Thành</Badge>;
      case 'processing':
        return <Badge variant="secondary">Đang Xử Lý</Badge>;
      case 'shipped':
        return <Badge variant="outline">Đã Giao</Badge>;
      case 'pending':
        return <Badge variant="destructive">Chờ Xử Lý</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Đã Hủy</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Đơn Hàng</h1>
        <p className="mt-1 text-sm text-gray-500">
          Quản lý đơn hàng của khách hàng
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Tìm kiếm đơn hàng..."
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
                  <TableHead>Mã Đơn Hàng</TableHead>
                  <TableHead>Khách Hàng</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Số Tiền</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead className="text-right">Hành Động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer.full_name}</TableCell>
                    <TableCell>
                      {new Date(order.order_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/admin/orders/${order.id}`)
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {order.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, 'processing')
                            }
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {order.status === 'processing' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, 'shipped')
                            }
                          >
                            <Truck className="h-4 w-4" />
                          </Button>
                        )}
                        {order.status !== 'completed' &&
                          order.status !== 'cancelled' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateOrderStatus(order.id, 'cancelled')
                              }
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
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
