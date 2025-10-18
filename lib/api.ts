import { verifyAdminToken } from '@/lib/auth';

// Generic API fetch function with admin authentication
export async function fetchWithAuth(endpoint: string) {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`/api/admin${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

// Fetch statistics for the dashboard
export async function fetchDashboardStats() {
  try {
    // Fetch products count
    const productsResponse = await fetchWithAuth('/products');
    const totalProducts = productsResponse.success
      ? productsResponse.products.length
      : 0;

    // Fetch orders
    const ordersResponse = await fetchWithAuth('/orders');
    const orders = ordersResponse.success ? ordersResponse.orders : [];

    const totalOrders = orders.length;

    // Calculate revenue from orders
    const totalRevenue = orders.reduce((sum: number, order: any) => {
      return sum + parseFloat(order.total_amount);
    }, 0);

    // Fetch customers
    const customersResponse = await fetchWithAuth('/customers');
    const totalCustomers = customersResponse.success
      ? customersResponse.customers.length
      : 0;

    return {
      totalProducts,
      totalOrders,
      totalRevenue,
      totalCustomers,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}

// Fetch sales data for charts
export async function fetchSalesData() {
  try {
    const ordersResponse = await fetchWithAuth('/orders');
    const orders = ordersResponse.success ? ordersResponse.orders : [];

    // Group orders by month for chart data
    const monthlyData: Record<string, { sales: number; orders: number }> = {};

    orders.forEach((order: any) => {
      const date = new Date(order.order_date);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const key = `${month} ${year}`;

      if (!monthlyData[key]) {
        monthlyData[key] = { sales: 0, orders: 0 };
      }

      monthlyData[key].sales += parseFloat(order.total_amount);
      monthlyData[key].orders += 1;
    });

    // Convert to array format for charts
    return Object.entries(monthlyData).map(([name, data]) => ({
      name,
      sales: data.sales,
      orders: data.orders,
    }));
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw error;
  }
}

// Fetch category data for charts
export async function fetchCategoryData() {
  try {
    const productsResponse = await fetchWithAuth('/products');
    const products = productsResponse.success ? productsResponse.products : [];

    // Group products by category
    const categoryCount: Record<string, number> = {};

    products.forEach((product: any) => {
      const categoryName = product.category?.name || 'Uncategorized';
      categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
    });

    // Convert to array format for charts
    return Object.entries(categoryCount).map(([name, value]) => ({
      name,
      value,
    }));
  } catch (error) {
    console.error('Error fetching category data:', error);
    throw error;
  }
}
