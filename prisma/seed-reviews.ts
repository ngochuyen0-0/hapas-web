import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

async function seedReviews() {
  try {
    // Get some existing customers and products to create reviews
    const customers = await prisma.customer.findMany({ take: 5 });
    const products = await prisma.product.findMany({ take: 5 });

    if (customers.length === 0 || products.length === 0) {
      console.log('No customers or products found. Please seed those first.');
      return;
    }

    // Create sample reviews
    const reviewsData = [
      {
        customer_id: customers[0].id,
        product_id: products[0].id,
        rating: 5,
        comment: 'Sản phẩm tuyệt vời, chất lượng tốt, giao hàng nhanh',
        is_verified_purchase: true,
        status: 'pending',
      },
      {
        customer_id: customers[1].id,
        product_id: products[1].id,
        rating: 4,
        comment: 'Túi đẹp nhưng có một chút lỗi nhỏ',
        is_verified_purchase: true,
        status: 'pending',
      },
      {
        customer_id: customers[2].id,
        product_id: products[2].id,
        rating: 3,
        comment: 'Sản phẩm tạm ổn, đúng như mô tả',
        is_verified_purchase: false,
        status: 'approved',
      },
      {
        customer_id: customers[3].id,
        product_id: products[3].id,
        rating: 1,
        comment: 'Chất lượng không như mong đợi, thất vọng',
        is_verified_purchase: true,
        status: 'rejected',
      },
      {
        customer_id: customers[4].id,
        product_id: products[4].id,
        rating: 5,
        comment: 'Rất ưng ý, sẽ ủng hộ tiếp',
        is_verified_purchase: true,
        status: 'pending',
      },
    ];

    for (const reviewData of reviewsData) {
      await prisma.review.create({
        data: reviewData,
      });
    }

    console.log('Sample reviews created successfully!');
  } catch (error) {
    console.error('Error seeding reviews:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedReviews();