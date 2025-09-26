'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter, useSearchParams } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, User, MapPin, CreditCard, Package } from 'lucide-react';

export default function ViewOrderPage() {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setOrder(data.order);
      } else {
        setError(data.message || 'Failed to load order');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (status: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();
      if (data.success) {
        // Refresh the order
        fetchOrder();
      } else {
        alert('Failed to update order status: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('An error occurred while updating the order status');
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

  if (!order) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Order not found</AlertDescription>
      </Alert>
    );
  }

  const getStatusActions = () => {
    switch (order.status) {
      case 'pending':
        return (
          <div className="flex space-x-2">
            <Button onClick={() => handleUpdateOrderStatus('processing')}>Process Order</Button>
            <Button variant="destructive" onClick={() => handleUpdateOrderStatus('cancelled')}>Cancel Order</Button>
          </div>
        );
      case 'processing':
        return (
          <div className="flex space-x-2">
            <Button onClick={() => handleUpdateOrderStatus('shipped')}>Mark as Shipped</Button>
            <Button variant="destructive" onClick={() => handleUpdateOrderStatus('cancelled')}>Cancel Order</Button>
          </div>
        );
      case 'shipped':
        return (
          <Button onClick={() => handleUpdateOrderStatus('completed')}>Mark as Delivered</Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
        <p className="mt-1 text-sm text-gray-500">
          View order information and manage status
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>Order #{order.id}</CardTitle>
            <div className="flex flex-col items-end">
              <Badge className="mb-2">
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              {getStatusActions()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Customer Information
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {order.customer.full_name}</p>
                <p><span className="font-medium">Email:</span> {order.customer.email}</p>
                {order.customer.phone && (
                  <p><span className="font-medium">Phone:</span> {order.customer.phone}</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Shipping Address
              </h3>
              <div className="space-y-2">
                <p>{order.shipping_address}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Information
              </h3>
              <div className="space-y-2">
                <p><span className="font-medium">Total:</span> ${order.total_amount.toFixed(2)}</p>
                <p><span className="font-medium">Date:</span> {new Date(order.order_date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Order Items
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.order_items.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.unit_price.toFixed(2)}</TableCell>
                    <TableCell>${item.total_price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}