Object.defineProperty(exports, '__esModule', { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime,
} = require('./runtime/edge.js');

const Prisma = {};

exports.Prisma = Prisma;
exports.$Enums = {};

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: '5.22.0',
  engine: '605197351a3c8bdd595af2d2a9bc3025bca48ea2',
};

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError;
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError;
Prisma.PrismaClientInitializationError = PrismaClientInitializationError;
Prisma.PrismaClientValidationError = PrismaClientValidationError;
Prisma.NotFoundError = NotFoundError;
Prisma.Decimal = Decimal;

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag;
Prisma.empty = empty;
Prisma.join = join;
Prisma.raw = raw;
Prisma.validator = Public.validator;

/**
 * Extensions
 */
Prisma.getExtensionContext = Extensions.getExtensionContext;
Prisma.defineExtension = Extensions.defineExtension;

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull;
Prisma.JsonNull = objectEnumValues.instances.JsonNull;
Prisma.AnyNull = objectEnumValues.instances.AnyNull;

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull,
};

/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable',
});

exports.Prisma.AdminScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password_hash: 'password_hash',
  full_name: 'full_name',
  role: 'role',
  created_at: 'created_at',
  updated_at: 'updated_at',
};

exports.Prisma.CustomerScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password_hash: 'password_hash',
  full_name: 'full_name',
  phone: 'phone',
  address: 'address',
  created_at: 'created_at',
  updated_at: 'updated_at',
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  image_url: 'image_url',
  is_active: 'is_active',
  created_at: 'created_at',
  updated_at: 'updated_at',
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  price: 'price',
  category_id: 'category_id',
  brand: 'brand',
  material: 'material',
  color: 'color',
  size: 'size',
  image_urls: 'image_urls',
  is_active: 'is_active',
  created_at: 'created_at',
  updated_at: 'updated_at',
};

exports.Prisma.InventoryScalarFieldEnum = {
  id: 'id',
  product_id: 'product_id',
  quantity: 'quantity',
  reserved_quantity: 'reserved_quantity',
  location: 'location',
  last_updated: 'last_updated',
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  customer_id: 'customer_id',
  status: 'status',
  total_amount: 'total_amount',
  shipping_address: 'shipping_address',
  billing_address: 'billing_address',
  order_date: 'order_date',
  shipped_date: 'shipped_date',
  delivered_date: 'delivered_date',
  created_at: 'created_at',
  updated_at: 'updated_at',
};

exports.Prisma.OrderItemScalarFieldEnum = {
  id: 'id',
  order_id: 'order_id',
  product_id: 'product_id',
  quantity: 'quantity',
  unit_price: 'unit_price',
  total_price: 'total_price',
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  order_id: 'order_id',
  payment_method: 'payment_method',
  transaction_id: 'transaction_id',
  status: 'status',
  amount: 'amount',
  payment_date: 'payment_date',
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  customer_id: 'customer_id',
  product_id: 'product_id',
  rating: 'rating',
  comment: 'comment',
  is_verified_purchase: 'is_verified_purchase',
  created_at: 'created_at',
  updated_at: 'updated_at',
};

exports.Prisma.WishlistScalarFieldEnum = {
  id: 'id',
  customer_id: 'customer_id',
  product_id: 'product_id',
  added_at: 'added_at',
};

exports.Prisma.PromotionScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  discount_type: 'discount_type',
  discount_value: 'discount_value',
  start_date: 'start_date',
  end_date: 'end_date',
  is_active: 'is_active',
  created_at: 'created_at',
  updated_at: 'updated_at',
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc',
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive',
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last',
};

exports.Prisma.ModelName = {
  Admin: 'Admin',
  Customer: 'Customer',
  Category: 'Category',
  Product: 'Product',
  Inventory: 'Inventory',
  Order: 'Order',
  OrderItem: 'OrderItem',
  Payment: 'Payment',
  Review: 'Review',
  Wishlist: 'Wishlist',
  Promotion: 'Promotion',
};
/**
 * Create the Client
 */
const config = {
  generator: {
    name: 'client',
    provider: {
      fromEnvVar: null,
      value: 'prisma-client-js',
    },
    output: {
      value:
        'D:\\Users\\chutu\\Downloads\\HapasProjectH\\hapas-web\\lib\\generated\\prisma',
      fromEnvVar: null,
    },
    config: {
      engineType: 'library',
    },
    binaryTargets: [
      {
        fromEnvVar: null,
        value: 'windows',
        native: true,
      },
    ],
    previewFeatures: [],
    sourceFilePath:
      'D:\\Users\\chutu\\Downloads\\HapasProjectH\\hapas-web\\prisma\\schema.prisma',
    isCustomOutput: true,
  },
  relativeEnvPaths: {
    rootEnvPath: null,
    schemaEnvPath: '../../../.env',
  },
  relativePath: '../../../prisma',
  clientVersion: '5.22.0',
  engineVersion: '605197351a3c8bdd595af2d2a9bc3025bca48ea2',
  datasourceNames: ['db'],
  activeProvider: 'postgresql',
  postinstall: false,
  inlineDatasources: {
    db: {
      url: {
        fromEnvVar: 'DATABASE_URL',
        value: null,
      },
    },
  },
  inlineSchema:
    'generator client {\n  provider = "prisma-client-js"\n  output   = "../lib/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\nmodel Admin {\n  id            String   @id @default(uuid())\n  email         String   @unique\n  password_hash String\n  full_name     String\n  role          String   @default("staff")\n  created_at    DateTime @default(now())\n  updated_at    DateTime @updatedAt\n}\n\nmodel Customer {\n  id            String     @id @default(uuid())\n  email         String     @unique\n  password_hash String\n  full_name     String\n  phone         String?\n  address       String?\n  created_at    DateTime   @default(now())\n  updated_at    DateTime   @updatedAt\n  orders        Order[]\n  reviews       Review[]\n  wishlists     Wishlist[]\n}\n\nmodel Category {\n  id          String    @id @default(uuid())\n  name        String    @unique\n  description String?\n  image_url   String?\n  is_active   Boolean   @default(true)\n  created_at  DateTime  @default(now())\n  updated_at  DateTime  @updatedAt\n  products    Product[]\n}\n\nmodel Product {\n  id          String      @id @default(uuid())\n  name        String\n  description String?\n  price       Decimal\n  category_id String\n  brand       String?\n  material    String?\n  color       String?\n  size        String?\n  image_urls  String?\n  is_active   Boolean     @default(true)\n  created_at  DateTime    @default(now())\n  updated_at  DateTime    @updatedAt\n  category    Category    @relation(fields: [category_id], references: [id])\n  order_items OrderItem[]\n  reviews     Review[]\n  wishlists   Wishlist[]\n  inventories Inventory[]\n}\n\nmodel Inventory {\n  id                String   @id @default(uuid())\n  product_id        String\n  quantity          Int\n  reserved_quantity Int      @default(0)\n  location          String?\n  last_updated      DateTime @default(now())\n  product           Product  @relation(fields: [product_id], references: [id])\n}\n\nmodel Order {\n  id               String      @id @default(uuid())\n  customer_id      String\n  status           String      @default("pending")\n  total_amount     Decimal\n  shipping_address String?\n  billing_address  String?\n  order_date       DateTime    @default(now())\n  shipped_date     DateTime?\n  delivered_date   DateTime?\n  created_at       DateTime    @default(now())\n  updated_at       DateTime    @updatedAt\n  customer         Customer    @relation(fields: [customer_id], references: [id])\n  order_items      OrderItem[]\n  payment          Payment?\n}\n\nmodel OrderItem {\n  id          String  @id @default(uuid())\n  order_id    String\n  product_id  String\n  quantity    Int\n  unit_price  Decimal\n  total_price Decimal\n  order       Order   @relation(fields: [order_id], references: [id])\n  product     Product @relation(fields: [product_id], references: [id])\n}\n\nmodel Payment {\n  id             String   @id @default(uuid())\n  order_id       String   @unique\n  payment_method String\n  transaction_id String?\n  status         String   @default("pending")\n  amount         Decimal\n  payment_date   DateTime @default(now())\n  order          Order    @relation(fields: [order_id], references: [id])\n}\n\nmodel Review {\n  id                   String   @id @default(uuid())\n  customer_id          String\n  product_id           String\n  rating               Int\n  comment              String?\n  is_verified_purchase Boolean  @default(false)\n  created_at           DateTime @default(now())\n  updated_at           DateTime @updatedAt\n  customer             Customer @relation(fields: [customer_id], references: [id])\n  product              Product  @relation(fields: [product_id], references: [id])\n}\n\nmodel Wishlist {\n  id          String   @id @default(uuid())\n  customer_id String\n  product_id  String\n  added_at    DateTime @default(now())\n  customer    Customer @relation(fields: [customer_id], references: [id])\n  product     Product  @relation(fields: [product_id], references: [id])\n}\n\nmodel Promotion {\n  id             String   @id @default(uuid())\n  name           String\n  description    String?\n  discount_type  String\n  discount_value Decimal\n  start_date     DateTime\n  end_date       DateTime\n  is_active      Boolean  @default(true)\n  created_at     DateTime @default(now())\n  updated_at     DateTime @updatedAt\n}\n',
  inlineSchemaHash:
    '4f86681f72b686f9416d3cbd4476aa1cf5a19f8bdb6c872b89780ad1adfceab2',
  copyEngine: true,
};
config.dirname = '/';

config.runtimeDataModel = JSON.parse(
  '{"models":{"Admin":{"dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"uuid(4)","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"email","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"password_hash","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"full_name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"role","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":"staff","isGenerated":false,"isUpdatedAt":false},{"name":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Customer":{"dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"uuid(4)","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"email","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"password_hash","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"full_name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"phone","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"address","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"orders","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Order","relationName":"CustomerToOrder","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"reviews","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Review","relationName":"CustomerToReview","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"wishlists","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Wishlist","relationName":"CustomerToWishlist","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Category":{"dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"uuid(4)","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"image_url","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"is_active","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","default":true,"isGenerated":false,"isUpdatedAt":false},{"name":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"products","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Product","relationName":"CategoryToProduct","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Product":{"dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"uuid(4)","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"price","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Decimal","isGenerated":false,"isUpdatedAt":false},{"name":"category_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"brand","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"material","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"color","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"size","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"image_urls","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"is_active","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","default":true,"isGenerated":false,"isUpdatedAt":false},{"name":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"category","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Category","relationName":"CategoryToProduct","relationFromFields":["category_id"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"order_items","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"OrderItem","relationName":"OrderItemToProduct","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"reviews","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Review","relationName":"ProductToReview","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"wishlists","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Wishlist","relationName":"ProductToWishlist","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"inventories","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Inventory","relationName":"InventoryToProduct","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Inventory":{"dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"uuid(4)","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"product_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"quantity","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"reserved_quantity","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"location","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"last_updated","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"product","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Product","relationName":"InventoryToProduct","relationFromFields":["product_id"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Order":{"dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"uuid(4)","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"customer_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":"pending","isGenerated":false,"isUpdatedAt":false},{"name":"total_amount","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Decimal","isGenerated":false,"isUpdatedAt":false},{"name":"shipping_address","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"billing_address","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"order_date","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"shipped_date","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"delivered_date","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"customer","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Customer","relationName":"CustomerToOrder","relationFromFields":["customer_id"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"order_items","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"OrderItem","relationName":"OrderToOrderItem","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"payment","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Payment","relationName":"OrderToPayment","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"OrderItem":{"dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"uuid(4)","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"order_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"product_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"quantity","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"unit_price","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Decimal","isGenerated":false,"isUpdatedAt":false},{"name":"total_price","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Decimal","isGenerated":false,"isUpdatedAt":false},{"name":"order","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Order","relationName":"OrderToOrderItem","relationFromFields":["order_id"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"product","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Product","relationName":"OrderItemToProduct","relationFromFields":["product_id"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Payment":{"dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"uuid(4)","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"order_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"payment_method","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"transaction_id","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":"pending","isGenerated":false,"isUpdatedAt":false},{"name":"amount","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Decimal","isGenerated":false,"isUpdatedAt":false},{"name":"payment_date","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"order","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Order","relationName":"OrderToPayment","relationFromFields":["order_id"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Review":{"dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"uuid(4)","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"customer_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"product_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"rating","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","isGenerated":false,"isUpdatedAt":false},{"name":"comment","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"is_verified_purchase","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true},{"name":"customer","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Customer","relationName":"CustomerToReview","relationFromFields":["customer_id"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"product","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Product","relationName":"ProductToReview","relationFromFields":["product_id"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Wishlist":{"dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"uuid(4)","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"customer_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"product_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"added_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"customer","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Customer","relationName":"CustomerToWishlist","relationFromFields":["customer_id"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"product","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Product","relationName":"ProductToWishlist","relationFromFields":["product_id"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Promotion":{"dbName":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","default":{"name":"uuid(4)","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"discount_type","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","isGenerated":false,"isUpdatedAt":false},{"name":"discount_value","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Decimal","isGenerated":false,"isUpdatedAt":false},{"name":"start_date","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"end_date","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":false},{"name":"is_active","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","default":true,"isGenerated":false,"isUpdatedAt":false},{"name":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false}},"enums":{},"types":{}}',
);
defineDmmfProperty(exports.Prisma, config.runtimeDataModel);
config.engineWasm = undefined;

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL:
      (typeof globalThis !== 'undefined' && globalThis['DATABASE_URL']) ||
      (typeof process !== 'undefined' &&
        process.env &&
        process.env.DATABASE_URL) ||
      undefined,
  },
});

if (
  (typeof globalThis !== 'undefined' && globalThis['DEBUG']) ||
  (typeof process !== 'undefined' && process.env && process.env.DEBUG) ||
  undefined
) {
  Debug.enable(
    (typeof globalThis !== 'undefined' && globalThis['DEBUG']) ||
      (typeof process !== 'undefined' && process.env && process.env.DEBUG) ||
      undefined,
  );
}

const PrismaClient = getPrismaClient(config);
exports.PrismaClient = PrismaClient;
Object.assign(exports, Prisma);
