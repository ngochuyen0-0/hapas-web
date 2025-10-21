'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Package,
  ShoppingCart,
  DollarSign,
 Users,
  TrendingUp,
 TrendingDown,
} from 'lucide-react';
import { fetchDashboardStats, fetchWithAuth, fetchSalesData } from '@/lib/api';
import { formatCurrencyVND } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface Order {
  id: string;
  customer: {
    full_name: string;
  };
  total_amount: string;
  status: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const statsData = await fetchDashboardStats();
        setStats(statsData);

        const ordersResponse = await fetchWithAuth('/orders');
        if (ordersResponse.success) {
          const recent = ordersResponse.orders.slice(0, 5);
          setRecentOrders(recent);
        }
        
        // Fetch sales data for the chart
        const salesResponse = await fetchSalesData();
        setSalesData(salesResponse);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu bảng điều khiển:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        Đang tải dữ liệu bảng điều khiển...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-90">Bảng Điều Khiển</h1>
        <p className="mt-1 text-sm text-gray-500">
          Chào mừng bạn đến với bảng điều khiển quản lý cửa hàng Hapas
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Sản Phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              +12% so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Đơn Hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +8% so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng Doanh Thu
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrencyVND(stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              +15% so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng Khách Hàng
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              +5% so với tháng trước
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Sales Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Đơn Hàng Gần Đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-500">
                      {order.customer?.full_name || 'Khách Hàng Không Xác Định'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrencyVND(parseFloat(order.total_amount))}
                    </p>
                    <p
                      className={`text-sm ${
                        order.status === 'Hoàn Thành'
                          ? 'text-green-600'
                          : order.status === 'Đang Xử Lý'
                            ? 'text-yellow-600'
                            : order.status === 'Đã Giao'
                              ? 'text-blue-600'
                              : order.status === 'Chờ Xử Lý'
                                ? 'text-orange-600'
                                : order.status === 'Đã Hủy'
                                  ? 'text-red-600'
                                  : 'text-gray-600'
                      }`}
                    >
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tổng Quan Doanh Thu</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              sales: {
                label: "Doanh Thu",
                color: "hsl(220, 70%, 50%)",
              }
            }} className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={salesData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(220, 70%, 50%)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(20, 70%, 50%)" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      // Format the Y-axis values as Vietnamese currency
                      return new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                        notation: 'compact',
                        maximumFractionDigits: 1
                      }).format(value);
                    }}
                  />
                  <Tooltip 
                    formatter={(value) => [
                      new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(Number(value)),
                      'Doanh Thu'
                    ]}
                    labelFormatter={(label) => `Tháng: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(220, 70%, 50%)"
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
 );
}
