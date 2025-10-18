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
  BarChart3,
  PieChart as LucidePieChart,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  fetchDashboardStats,
  fetchSalesData,
  fetchCategoryData,
} from '@/lib/api';

// Define types for our data
interface SalesDataPoint {
  name: string;
  sales: number;
  orders: number;
}

interface CategoryDataPoint {
  name: string;
  value: number;
}

// Default data for charts while loading
const defaultSalesData: SalesDataPoint[] = [
  { name: 'Tháng 1', sales: 0, orders: 0 },
  { name: 'Tháng 2', sales: 0, orders: 0 },
  { name: 'Tháng 3', sales: 0, orders: 0 },
  { name: 'Tháng 4', sales: 0, orders: 0 },
  { name: 'Tháng 5', sales: 0, orders: 0 },
  { name: 'Tháng 6', sales: 0, orders: 0 },
];

const defaultCategoryData: CategoryDataPoint[] = [
  { name: 'Đang tải...', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function ReportsPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });

  const [salesData, setSalesData] =
    useState<SalesDataPoint[]>(defaultSalesData);
  const [categoryData, setCategoryData] =
    useState<CategoryDataPoint[]>(defaultCategoryData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [statsData, salesData, categoryData] = await Promise.all([
          fetchDashboardStats(),
          fetchSalesData(),
          fetchCategoryData(),
        ]);

        setStats(statsData);
        setSalesData(salesData);
        setCategoryData(categoryData);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu báo cáo:', error);
        // Keep default values in case of error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Type for the label function parameters
  const formatPieLabel = ({
    name,
    percent,
  }: {
    name: string;
    percent: number;
  }) => {
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Báo Cáo & Phân Tích
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Thông tin chi tiết và phân tích cho cửa hàng của bạn
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
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalRevenue.toFixed(2)}
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Xu Hướng Doanh Thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Orders Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Xu Hướng Đơn Hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <Tooltip />
                  <Bar dataKey="orders" fill="#82ca9d" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Product Categories Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <LucidePieChart className="h-5 w-5 mr-2" />
              Danh Mục Sản Phẩm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={formatPieLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
