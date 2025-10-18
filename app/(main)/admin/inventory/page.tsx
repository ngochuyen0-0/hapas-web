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
import { Search, Plus, Edit, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Define TypeScript interfaces for our data
interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface InventoryItem {
  id: string;
  product_id: string;
  quantity: number;
  reserved_quantity: number;
  location: string | null;
  last_updated: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string;
  brand: string | null;
  material: string | null;
  color: string | null;
  size: string | null;
  image_urls: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category: Category;
  inventories: InventoryItem[];
}

interface InventoryItemWithProduct extends InventoryItem {
  product: Product;
}

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<
    InventoryItemWithProduct[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      // Fetch products which include inventory information
      const response = await fetch('/api/admin/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        // Transform the data to match our inventory structure
        const inventoryData = data.products.flatMap((product: Product) =>
          product.inventories.map((inventory: InventoryItem) => ({
            ...inventory,
            product: product,
          })),
        );
        setInventoryItems(inventoryData);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (
    inventoryId: string,
    newQuantity: number,
  ) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/inventory/${inventoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      const data = await response.json();
      if (data.success) {
        // Refresh the inventory list
        fetchInventory();
      } else {
        alert('Failed to update inventory: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
      alert('An error occurred while updating the inventory');
    }
  };

  const filteredInventory = inventoryItems.filter(
    (item) =>
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.category.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage product stock levels
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search inventory..."
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
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Reserved</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const available = item.quantity - item.reserved_quantity;
                  const isLowStock = available <= 5;

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.product.name}
                      </TableCell>
                      <TableCell>{item.product.category.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.reserved_quantity}</TableCell>
                      <TableCell>{available}</TableCell>
                      <TableCell>
                        {isLowStock ? (
                          <Badge
                            variant="destructive"
                            className="flex items-center"
                          >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge variant="default">In Stock</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/admin/inventory/${item.id}/edit`)
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
