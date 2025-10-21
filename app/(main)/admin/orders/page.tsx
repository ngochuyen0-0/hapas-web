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
import { formatCurrencyVND } from '@/lib/utils';

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

  const fetchOrders = async (recentOnly: boolean = false, processingOnly: boolean = false) => {
    try {
      setLoading(true);
      let url = '/api/admin/orders';
      const params = [];
      if (recentOnly) params.push('recent=true');
      if (processingOnly) params.push('processing=true');
      if (params.length > 0) url += '?' + params.join('&');
      
      const token = localStorage.getItem('adminToken');
      const response = await fetch(url, {
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
  
  const fetchOrdersWithStatus = async (status: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/orders?status=${status}`, {
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
  
  const handleUpdateOrderStatus = async (orderId: string, status: string, action?: string) => {
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

  const handleConfirmDelivery = async (orderId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        // Refresh the order list
        fetchOrders();
      } else {
        alert('Không thể xác nhận giao hàng: ' + data.message);
      }
    } catch (error) {
      console.error('Lỗi khi xác nhận giao hàng:', error);
      alert('Đã xảy ra lỗi khi xác nhận giao hàng');
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
      case 'Hoàn Thành':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Hoàn Thành</Badge>;
      case 'processing':
      case 'Đang Xử Lý':
        return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600">Đang Xử Lý</Badge>;
      case 'shipped':
      case 'Đang Giao':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Đang Giao</Badge>;
      case 'delivered':
      case 'Đã Giao':
        return <Badge variant="outline" className="border-purple-500 text-purple-500">Đã Giao</Badge>;
      case 'pending':
      case 'Chờ Xử Lý':
        return <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">Chờ Xử Lý</Badge>;
      case 'cancelled':
      case 'Đã Hủy':
        return <Badge variant="destructive" className="bg-red-500 hover:bg-red-600">Đã Hủy</Badge>;
      case 'refunded':
      case 'Đã Hoàn Tiền':
        return <Badge variant="outline" className="border-gray-500 text-gray-500">Đã Hoàn Tiền</Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-200">{status}</Badge>;
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
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-50" />
                <Input
                  placeholder="Tìm kiếm đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchOrders(true, false)}
                >
                  Đơn Mới
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchOrders(false, true)}
                >
                  Đang Xử Lý
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchOrders(false, false)}
                >
                  Tất Cả
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchOrdersWithStatus('completed')}
                >
                  Hoàn Thành
                </Button>
              </div>
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
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customer.full_name}</TableCell>
                    <TableCell>
                      {new Date(order.order_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{formatCurrencyVND(order.total_amount)}</TableCell>
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
                        {order.status === 'Chờ Xử Lý' && (
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, 'Đang Xử Lý', 'Started processing order')
                            }
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {order.status === 'Đang Xử Lý' && (
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, 'Đang Giao', 'Order shipped to customer')
                            }
                          >
                            <Truck className="h-4 w-4" />
                          </Button>
                        )}
                        {order.status === 'Đang Giao' && (
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                            onClick={() =>
                              handleConfirmDelivery(order.id)
                            }
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {order.status === 'Đã Giao' && (
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, 'Hoàn Thành', 'Order completed')
                            }
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {order.status === 'Hoàn Thành' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-orange-600 border-orange-600 hover:bg-orange-50"
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, 'Đã Hoàn Tiền', 'Order refunded')
                            }
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {order.status !== 'Hoàn Thành' &&
                          order.status !== 'Đã Hủy' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, 'Đã Hủy', 'Order cancelled')
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
