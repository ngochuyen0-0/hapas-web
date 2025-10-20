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
import { Search, Eye, Trash2, Check, X, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Define TypeScript interfaces for our data models
interface Customer {
  id: string;
  full_name: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
  image_urls: string | null;
}

interface Review {
  id: string;
  customer: Customer;
  product: Product;
  rating: number;
  comment: string | null;
  is_verified_purchase: boolean;
  status: string; // pending, approved, rejected
 created_at: string;
  updated_at: string;
}

export default function ReviewsPage() {
  // Properly type our state variables
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all'); // all, pending, approved, rejected
  const router = useRouter();

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      let url = `/api/admin/reviews?search=${searchTerm}`;
      if (statusFilter !== 'all') {
        url += `&status=${statusFilter}`;
      }
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải đánh giá:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (reviewId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        // Refresh the reviews list
        fetchReviews();
      } else {
        alert('Không thể cập nhật trạng thái đánh giá: ' + data.message);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đánh giá:', error);
      alert('Đã xảy ra lỗi khi cập nhật trạng thái đánh giá');
    }
  };

 const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        // Refresh the reviews list
        fetchReviews();
      } else {
        alert('Không thể xóa đánh giá: ' + data.message);
      }
    } catch (error) {
      console.error('Lỗi khi xóa đánh giá:', error);
      alert('Đã xảy ra lỗi khi xóa đánh giá');
    }
 };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const filteredReviews = reviews.filter((review) =>
    review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.product.name.toLowerCase().includes(searchTerm.toLowerCase())
 );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Đánh Giá</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý đánh giá từ khách hàng
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Tìm kiếm đánh giá..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
              >
                Tất cả
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('pending')}
              >
                Chờ duyệt
              </Button>
              <Button
                variant={statusFilter === 'approved' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('approved')}
              >
                Đã duyệt
              </Button>
              <Button
                variant={statusFilter === 'rejected' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('rejected')}
              >
                Từ chối
              </Button>
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
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">
                      {review.customer.full_name}
                      <br />
                      <span className="text-xs text-gray-500">{review.customer.email}</span>
                    </TableCell>
                    <TableCell>{review.product.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {review.comment || 'Không có bình luận'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getStatusIcon(review.status)}
                        <Badge
                          variant={getStatusBadgeVariant(review.status)}
                          className="ml-2"
                        >
                          {review.status === 'pending' 
                            ? 'Chờ duyệt' 
                            : review.status === 'approved' 
                              ? 'Đã duyệt' 
                              : 'Từ chối'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(review.created_at).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {review.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateStatus(review.id, 'approved')}
                              title="Duyệt đánh giá"
                            >
                              <Check className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateStatus(review.id, 'rejected')}
                              title="Từ chối đánh giá"
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}