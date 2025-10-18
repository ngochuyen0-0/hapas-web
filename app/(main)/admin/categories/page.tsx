'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Search, Plus, Edit, Trash2, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Define TypeScript interface for Category
interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Form state for creating/editing categories
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    is_active: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      } else {
        setError(data.message || 'Không thể tải danh sách danh mục');
      }
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error);
      setError('Đã xảy ra lỗi khi tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image_url: '',
      is_active: true,
    });
    setIsFormOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image_url: category.image_url || '',
      is_active: category.is_active,
    });
    setIsFormOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Xóa danh mục thành công');
        fetchCategories();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Không thể xóa danh mục');
      }
    } catch (error) {
      console.error('Lỗi khi xóa danh mục:', error);
      setError('Đã xảy ra lỗi khi xóa danh mục');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('adminToken');
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories';

      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(
          editingCategory
            ? 'Cập nhật danh mục thành công'
            : 'Tạo danh mục thành công',
        );
        setIsFormOpen(false);
        fetchCategories();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(
          data.message ||
            `Không thể ${editingCategory ? 'cập nhật' : 'tạo'} danh mục`,
        );
      }
    } catch (error) {
      console.error('Lỗi khi lưu danh mục:', error);
      setError('Đã xảy ra lỗi khi lưu danh mục');
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isFormOpen) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {editingCategory ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
          </h1>
          <Button variant="outline" onClick={() => setIsFormOpen(false)}>
            Quay Lại
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert
            variant="default"
            className="bg-green-100 border-green-500 text-green-800"
          >
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên Danh Mục *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nhập tên danh mục"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô Tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Nhập mô tả danh mục"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">URL Hình Ảnh</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  placeholder="Nhập URL hình ảnh"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label htmlFor="is_active">Kích Hoạt</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit">
                  {editingCategory ? 'Cập Nhật' : 'Tạo Danh Mục'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Danh Mục</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý danh mục sản phẩm của cửa hàng
          </p>
        </div>
        <Button className="mt-4 sm:mt-0" onClick={handleCreateCategory}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm Danh Mục
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert
          variant="default"
          className="bg-green-100 border-green-500 text-green-800"
        >
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Tìm kiếm danh mục..."
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
                  <TableHead>Tên Danh Mục</TableHead>
                  <TableHead>Mô Tả</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead className="text-right">Hành Động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>
                      {category.description || 'Không có mô tả'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={category.is_active ? 'default' : 'secondary'}
                      >
                        {category.is_active ? 'Hoạt Động' : 'Ngừng Hoạt Động'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCategories.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-gray-500"
                    >
                      {searchTerm
                        ? 'Không tìm thấy danh mục phù hợp'
                        : 'Chưa có danh mục nào'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
