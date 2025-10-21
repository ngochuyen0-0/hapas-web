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
import { Search, Plus, Edit, Trash2, Eye, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Define TypeScript interfaces for our data models
interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Inventory {
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
  inventories: Inventory[];
}

export default function ProductsPage() {
  // Properly type our state variables
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error);
    }
  };

   const handleDeleteProduct = async (productId: string) => {
      if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này sẽ xóa tất cả dữ liệu liên quan đến sản phẩm này (kho, đánh giá, danh sách yêu thích), nhưng sẽ không xóa khỏi đơn hàng đã hoàn tất.')) {
        return;
      }
  
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
        if (data.success) {
          // Refresh the product list
          fetchProducts();
          alert('Xóa sản phẩm thành công!');
        } else {
          alert('Không thể xóa sản phẩm: ' + data.message);
        }
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        alert('Đã xảy ra lỗi khi xóa sản phẩm');
      }
    };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sản Phẩm</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý kho hàng túi xách của bạn
          </p>
        </div>
        <Button
          className="mt-4 sm:mt-0"
          onClick={() => router.push('/admin/products/new')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm Sản Phẩm
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
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
                  <TableHead>Sản Phẩm</TableHead>
                  <TableHead>Danh Mục</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Kho</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead className="text-right">Hành Động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const inventory = product.inventories?.[0] || { quantity: 0 };
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>{product.category.name}</TableCell>
                      <TableCell>
                        {' '}
                        {Number(product.price).toFixed(2)} đ
                      </TableCell>
                      <TableCell>{inventory.quantity}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.is_active ? 'default' : 'destructive'
                          }
                        >
                          {product.is_active ? 'Hoạt Động' : 'Ngừng Hoạt Động'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/admin/products/${product.id}`)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/admin/products/${product.id}/edit`)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
