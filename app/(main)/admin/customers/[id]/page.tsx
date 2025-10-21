'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter, useSearchParams } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
} from 'lucide-react';

export default function ViewCustomerPage() {
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const customerId = searchParams.get('id');

  useEffect(() => {
    if (customerId) {
      fetchCustomer();
    }
  }, [customerId]);

  const fetchCustomer = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/customers/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setCustomer(data.customer);
      } else {
        setError(data.message || 'Failed to load customer');
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
      setError('Failed to load customer');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!customer) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Customer not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
        <p className="mt-1 text-sm text-gray-500">
          View customer information and order history
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>{customer.full_name}</CardTitle>
            <Badge variant={customer.is_active ? 'default' : 'secondary'}>
              {customer.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Name:</span>{' '}
                  {customer.full_name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {customer.email}
                </p>
                {customer.phone && (
                  <p>
                    <span className="font-medium">Phone:</span> {customer.phone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Address
              </h3>
              <div className="space-y-2">
                {customer.address ? (
                  <p>{customer.address}</p>
                ) : (
                  <p className="text-gray-500">No address provided</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Order Summary
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Total Orders:</span>{' '}
                  {customer.orders_count || 0}
                </p>
                <p>
                  <span className="font-medium">Total Spent:</span> $
                  {(customer.total_spent || 0).toFixed(2)}
                </p>
                <p>
                  <span className="font-medium">Member Since:</span>{' '}
                  {new Date(customer.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Recent Orders</h3>
            {customer.recent_orders && customer.recent_orders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customer.recent_orders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        #{order.id.substring(0, 8)}
                      </TableCell>
                      <TableCell>
                        {new Date(order.order_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === 'completed'
                              ? 'default'
                              : order.status === 'pending'
                                ? 'destructive'
                                : 'secondary'
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500">No orders found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
