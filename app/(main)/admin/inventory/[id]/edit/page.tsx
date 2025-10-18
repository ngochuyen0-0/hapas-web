'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter, useSearchParams } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function EditInventoryPage() {
  const [inventoryItem, setInventoryItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    quantity: 0,
    reserved_quantity: 0,
    location: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const inventoryId = searchParams.get('id');

  useEffect(() => {
    if (inventoryId) {
      fetchInventoryItem();
    }
  }, [inventoryId]);

  const fetchInventoryItem = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/inventory/${inventoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setInventoryItem(data.inventory);
        setFormData({
          quantity: data.inventory.quantity,
          reserved_quantity: data.inventory.reserved_quantity,
          location: data.inventory.location || '',
        });
      }
    } catch (error) {
      console.error('Error fetching inventory item:', error);
      setError('Failed to load inventory item');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'location' ? value : parseInt(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/inventory/${inventoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/inventory');
      } else {
        setError(data.message || 'Failed to update inventory');
      }
    } catch (err) {
      setError('An error occurred while updating the inventory');
      console.error(err);
    } finally {
      setSaving(false);
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

  if (!inventoryItem) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Inventory item not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Inventory</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update stock levels for {inventoryItem.product.name}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Details</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium">{inventoryItem.product.name}</h3>
            <p className="text-sm text-gray-500">
              {inventoryItem.product.category.name}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="quantity">Current Stock *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reserved_quantity">Reserved Stock</Label>
                <Input
                  id="reserved_quantity"
                  name="reserved_quantity"
                  type="number"
                  value={formData.reserved_quantity}
                  onChange={handleChange}
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Storage Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Warehouse A, Shelf 12"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/inventory')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
