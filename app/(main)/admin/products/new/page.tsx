'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface Category {
  id: string;
 name: string;
 description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductFormData {
  name: string;
  description: string;
    price: string;
  category_id: string;
  brand: string;
 material: string;
 color: string;
 size: string;
    image_urls: string;
  is_active: boolean;
  initial_stock_quantity: number;
}
export default function NewProductPage() {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category_id: '',
    brand: '',
    material: '',
    color: '',
    size: '',
    image_urls: '',
    is_active: true,
    initial_stock_quantity: 0
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/public/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error);
    }
 };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'initial_stock_quantity' ? parseInt(value) || 0 : (type === 'number' ? parseFloat(value) || 0 : value))
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          initial_stock_quantity: parseInt(formData.initial_stock_quantity.toString()) || 0
        })
      });

      const data = await response.json();
      
      if (data.success) {
        router.push('/admin/products');
      } else {
        setError(data.message || 'Không thể tạo sản phẩm');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi tạo sản phẩm');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Thêm Sản Phẩm Mới</h1>
        <p className="mt-1 text-sm text-gray-500">
          Tạo sản phẩm túi xách mới
        </p>
      </div>

      {/* Thông tin cơ bản */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Tên Sản Phẩm *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Nhập tên sản phẩm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Giá *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category_id">Danh Mục *</Label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full p-2 border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category: Category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brand">Thương Hiệu</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Nhập thương hiệu"
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Thông tin chi tiết */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin chi tiết</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="material">Chất Liệu</Label>
                <Input
                  id="material"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  placeholder="Ví dụ: Da, Vải..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color">Màu Sắc</Label>
                <Input
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Ví dụ: Đen, Trắng..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="size">Kích Thước</Label>
                <Input
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="Ví dụ: S, M, L..."
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Mô Tả</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Mô tả chi tiết về sản phẩm..."
              />
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Kho và hình ảnh */}
      <Card>
        <CardHeader>
          <CardTitle>Kho và hình ảnh</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="initial_stock_quantity">Số Lượng Kho Ban Đầu</Label>
                <Input
                  id="initial_stock_quantity"
                  name="initial_stock_quantity"
                  type="number"
                  min="0"
                  value={formData.initial_stock_quantity}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="is_active">Trạng Thái</Label>
                <div className="flex items-center pt-2">
                  <input
                    id="is_active"
                    name="is_active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <Label htmlFor="is_active" className="ml-2 font-normal">
                    Kích Hoạt
                  </Label>
                </div>
              </div>
            </div>
          
            <div className="space-y-2">
              <Label htmlFor="image_urls">URL Hình Ảnh (phân tách bằng dấu phẩy)</Label>
              <Textarea
                id="image_urls"
                name="image_urls"
                value={formData.image_urls}
                onChange={handleChange}
                rows={3}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/products')}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Đang tạo...' : 'Tạo Sản Phẩm'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}