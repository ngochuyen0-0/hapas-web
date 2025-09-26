'use client';

import { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter, useSearchParams } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Package, Tag, DollarSign, Palette, Ruler } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default function ViewProductPage({ params }: Props) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const {id: productId} = use(params);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    } else {
      setError('Thiếu ID sản phẩm');
      setLoading(false);
    }
  }, [productId]);

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
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Lỗi HTTP! trạng thái: ${response.status}`);
      }
      
      if (data.success) {
        setProduct(data.product);
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

  if (!product) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Không tìm thấy sản phẩm</AlertDescription>
      </Alert>
    );
  }

  const inventory = product.inventories?.[0] || { quantity: 0 };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Chi tiết sản phẩm</h1>
        <p className="mt-1 text-sm text-gray-500">
          Xem thông tin sản phẩm túi xách
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>{product.name}</CardTitle>
            <div className="flex space-x-2">
              <Button onClick={() => router.push(`/admin/products/${product.id}/edit`)}>Chỉnh sửa</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {product.image_urls ? (
                <div className="grid grid-cols-1 gap-4">
                  {/* Handle both base64 images and URL images properly */}
                  {(() => {
                    const imageUrls = product.image_urls;
                    // Check if it's a base64 image (starts with data:image/)
                    if (imageUrls.startsWith('data:image/')) {
                      // Single base64 image
                      return (
                        <img 
                          src={imageUrls} 
                          alt={`${product.name} - Hình ảnh`}
                          className="w-full h-64 object-cover rounded-xl border"
                        />
                      );
                    }
                    // Check if it contains multiple images (URLs separated by commas)
                    else if (imageUrls.includes('http')) {
                      // Multiple URL images separated by commas
                      return imageUrls.split(',').map((url: string, index: number) => {
                        const trimmedUrl = url.trim();
                        return trimmedUrl ? (
                          <img 
                            key={index}
                            src={trimmedUrl} 
                            alt={`${product.name} - Hình ảnh ${index + 1}`}
                            className="w-full h-64 object-cover rounded-xl border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://placehold.co/400x400?text=Hình+ảnh+lỗi';
                            }}
                          />
                        ) : null;
                      });
                    }
                    // Fallback for any other case
                    return (
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
                        <span className="text-gray-500">Không có hình ảnh hợp lệ</span>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
                  <span className="text-gray-500">Không có hình ảnh</span>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Giá</p>
                  <p className="font-medium">đ{typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Tag className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Danh mục</p>
                  <p className="font-medium">{product.category?.name || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Package className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Kho hàng</p>
                  <p className="font-medium">{inventory.quantity} sản phẩm</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Palette className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Màu sắc</p>
                  <p className="font-medium">{product.color || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Ruler className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Kích thước</p>
                  <p className="font-medium">{product.size || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Mô tả</p>
                <p className="mt-1">{product.description || 'Không có mô tả'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Trạng thái</p>
                <p className={`mt-1 font-medium ${product.is_active ? 'text-green-600' : 'text-red-600'}`}>
                  {product.is_active ? 'Hoạt động' : 'Ngừng hoạt động'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}