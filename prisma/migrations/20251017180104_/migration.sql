-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'staff',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "category_id" TEXT NOT NULL,
    "brand" TEXT,
    "material" TEXT,
    "color" TEXT,
    "size" TEXT,
    "image_urls" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reserved_quantity" INTEGER NOT NULL DEFAULT 0,
    "location" TEXT,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "total_amount" DECIMAL(65,30) NOT NULL,
    "shipping_address" TEXT,
    "billing_address" TEXT,
    "order_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shipped_date" TIMESTAMP(3),
    "delivered_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(65,30) NOT NULL,
    "total_price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "payment_method" TEXT NOT NULL,
    "transaction_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "amount" DECIMAL(65,30) NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "is_verified_purchase" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "discount_type" TEXT NOT NULL,
    "discount_value" DECIMAL(65,30) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_order_id_key" ON "Payment"("order_id");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
