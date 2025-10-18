'use client';

import { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter, useSearchParams } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: Props) {
  const [formData, setFormData] = useState({
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
  });
  const [inventoryQuantity, setInventoryQuantity] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id: productId } = use(params);

  useEffect(() => {
    if (productId) {
      fetchProduct();
      fetchCategories();
    } else {
      // If no product ID, redirect to products list
      router.push('/admin/products');
    }
  }, [productId, router]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/admin/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || `Lỗi HTTP! trạng thái: ${response.status}`,
        );
      }

      const data = await response.json();
      if (data.success) {
        const product = data.product;
        setFormData({
          name: product.name,
          description: product.description || '',
          price: product.price.toString(),
          category_id: product.category_id,
          brand: product.brand || '',
          material: product.material || '',
          color: product.color || '',
          size: product.size || '',
          image_urls: product.image_urls || '',
          is_active: product.is_active,
        });

        // Set inventory quantity if exists
        if (product.inventories && product.inventories.length > 0) {
          setInventoryQuantity(product.inventories[0].quantity);
        }
      } else {
        setError(data.message || 'Không thể tải sản phẩm');
      }
    } catch (error: any) {
      console.error('Lỗi khi tải sản phẩm:', error);
      setError(error.message || 'Không thể tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/public/categories');
      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || `Lỗi HTTP! trạng thái: ${response.status}`,
        );
      }

      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      } else {
        console.error('Không thể tải danh mục:', data.message);
      }
    } catch (error: any) {
      console.error('Lỗi khi tải danh mục:', error.message || error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'number'
            ? parseFloat(value) || 0
            : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          inventory_quantity: inventoryQuantity,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || `Lỗi HTTP! trạng thái: ${response.status}`,
        );
      }

      const data = await response.json();

      if (data.success) {
        router.push('/admin/products');
      } else {
        setError(data.message || 'Không thể cập nhật sản phẩm');
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi cập nhật sản phẩm');
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h1>
        <p className="mt-1 text-sm text-gray-500">
          Cập nhật thông tin sản phẩm túi xách
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Thông tin cơ bản */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên sản phẩm *</Label>
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
                    <Label htmlFor="category_id">Danh mục *</Label>
                    <select
                      id="category_id"
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                      className="w-full p-2 border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((category: any) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Thương hiệu</Label>
                    <Input
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      placeholder="Nhập thương hiệu"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thông tin chi tiết */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin chi tiết</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="material">Chất liệu</Label>
                    <Input
                      id="material"
                      name="material"
                      value={formData.material}
                      onChange={handleChange}
                      placeholder="Ví dụ: Da, Vải..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Màu sắc</Label>
                    <Input
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder="Ví dụ: Đen, Trắng..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Kích thước</Label>
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
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Mô tả chi tiết về sản phẩm..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Kho và hình ảnh */}
            <Card>
              <CardHeader>
                <CardTitle>Kho và hình ảnh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="inventoryQuantity">Số Lượng Kho</Label>
                    <Input
                      id="inventoryQuantity"
                      name="inventoryQuantity"
                      type="number"
                      min="0"
                      value={inventoryQuantity}
                      onChange={(e) =>
                        setInventoryQuantity(parseInt(e.target.value) || 0)
                      }
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
                  <Label htmlFor="image_urls">
                    URL Hình ảnh (phân tách bằng dấu phẩy)
                  </Label>
                  <Textarea
                    id="image_urls"
                    name="image_urls"
                    value={formData.image_urls}
                    onChange={handleChange}
                    rows={3}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                </div>

                {/* Image preview section */}
                {formData.image_urls && (
                  <div className="space-y-2">
                    <Label>Xem trước hình ảnh</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {/* Handle both base64 images and URL images properly */}
                      {(() => {
                        const imageUrls = formData.image_urls;
                        // Check if it's a base64 image (starts with data:image/)
                        if (imageUrls.startsWith('data:image/')) {
                          // Single base64 image
                          return (
                            <div className="relative">
                              <img
                                src={imageUrls}
                                alt={`Xem trước hình ảnh`}
                                className="w-full h-32 object-cover rounded-lg border"
                              />
                              <p className="text-xs text-center mt-1 text-gray-500">
                                Hình ảnh base64
                              </p>
                            </div>
                          );
                        }
                        // Check if it contains multiple images (URLs separated by commas)
                        else if (imageUrls.includes('http')) {
                          // Multiple URL images separated by commas
                          return imageUrls
                            .split(',')
                            .map((url: string, index: number) => {
                              const trimmedUrl = url.trim();
                              return trimmedUrl ? (
                                <div key={index} className="relative">
                                  <img
                                    src={trimmedUrl}
                                    alt={`Xem trước ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border"
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.src =
                                        'https://placehold.co/400x400?text=Lỗi+hình+ảnh';
                                    }}
                                  />
                                  <p className="text-xs text-center mt-1 text-gray-500">
                                    Hình {index + 1}
                                  </p>
                                </div>
                              ) : null;
                            });
                        }
                        // Fallback for any other case
                        return (
                          <div className="col-span-full text-center py-4 text-gray-500">
                            Không có hình ảnh hợp lệ để hiển thị
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/admin/products')}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
