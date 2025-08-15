// Simple MongoDB data insertion script
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const dbName = 'ecommerce-be';

const sampleCategories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and gadgets',
    isActive: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing, shoes, and accessories',
    isActive: true,
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function createSampleData() {
  console.log('🚀 Starting data creation...');

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(dbName);

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.collection('products').deleteMany({});
    await db.collection('categories').deleteMany({});

    // Insert categories
    console.log('📁 Creating categories...');
    const categoryResult = await db
      .collection('categories')
      .insertMany(sampleCategories);
    console.log(`✅ Created ${categoryResult.insertedCount} categories`);

    // Get category IDs
    const categories = await db.collection('categories').find({}).toArray();
    const electronicsCategory = categories.find(
      (c) => c.name === 'Electronics',
    );
    const fashionCategory = categories.find((c) => c.name === 'Fashion');

    // Create products
    const sampleProducts = [
      {
        name: 'iPhone 15 Pro',
        description:
          'The latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Perfect for professionals and photography enthusiasts.',
        shortDescription: 'Latest iPhone with A17 Pro chip and titanium design',
        price: 29990000,
        originalPrice: 34990000,
        category: electronicsCategory._id,
        brand: 'Apple',
        sku: 'IPHONE15PRO-128-TITAN',
        images: [
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-natural-titanium-select.jpg',
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-back-natural-titanium-select.jpg',
        ],
        thumbnail:
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-natural-titanium-select.jpg',
        variants: [],
        tags: ['smartphone', 'apple', 'ios', 'titanium', 'camera'],
        specifications: {
          'Màn hình': '6.1 inches Super Retina XDR',
          'Bộ nhớ': '128GB',
          'Màu sắc': 'Natural Titanium',
          Camera: '48MP Main + 12MP Ultra Wide',
          Chip: 'A17 Pro',
          'Hệ điều hành': 'iOS 17',
        },
        stock: 50,
        minStock: 10,
        isActive: true,
        isFeatured: true,
        isDigital: false,
        status: 'active',
        seoTitle: 'iPhone 15 Pro - Điện thoại Apple mới nhất 2024',
        seoDescription:
          'Mua iPhone 15 Pro với chip A17 Pro, thiết kế titanium và hệ thống camera chuyên nghiệp.',
        seoKeywords: ['iphone', 'apple', 'smartphone'],
        ratings: {
          average: 4.8,
          count: 245,
        },
        sales: 1250,
        views: 5430,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description:
          'Smartphone Android cao cấp với S Pen, tính năng AI tiên tiến và khả năng chụp ảnh vượt trội.',
        shortDescription: 'Galaxy cao cấp với S Pen và tính năng AI',
        price: 31990000,
        originalPrice: 36990000,
        category: electronicsCategory._id,
        brand: 'Samsung',
        sku: 'GALAXYS24ULTRA-256-BLACK',
        images: [
          'https://images.samsung.com/is/image/samsung/p6pim/vn/2401/gallery/vn-galaxy-s24-ultra-s928-sm-s928bztqxxv-thumb-539573050.jpg',
        ],
        thumbnail:
          'https://images.samsung.com/is/image/samsung/p6pim/vn/2401/gallery/vn-galaxy-s24-ultra-s928-sm-s928bztqxxv-thumb-539573050.jpg',
        variants: [],
        tags: ['smartphone', 'samsung', 'android', 'spen', 'ai'],
        specifications: {
          'Màn hình': '6.8 inches Dynamic AMOLED 2X',
          'Bộ nhớ': '256GB',
          'Màu sắc': 'Titanium Black',
          Camera: '200MP Main + 50MP Periscope',
          Chip: 'Snapdragon 8 Gen 3',
          'Hệ điều hành': 'Android 14',
        },
        stock: 30,
        minStock: 5,
        isActive: true,
        isFeatured: true,
        isDigital: false,
        status: 'active',
        ratings: {
          average: 4.7,
          count: 189,
        },
        sales: 890,
        views: 3240,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'MacBook Pro 14" M3',
        description:
          'Laptop chuyên nghiệp với chip M3, màn hình Liquid Retina XDR và thời lượng pin lên đến 22 giờ.',
        shortDescription: 'MacBook chuyên nghiệp với chip M3',
        price: 54990000,
        originalPrice: 59990000,
        category: electronicsCategory._id,
        brand: 'Apple',
        sku: 'MACBOOKPRO14-M3-512-GRAY',
        images: [
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310.jpg',
        ],
        thumbnail:
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310.jpg',
        variants: [],
        tags: ['laptop', 'apple', 'macbook', 'm3', 'professional'],
        specifications: {
          'Màn hình': '14.2 inches Liquid Retina XDR',
          Processor: 'Apple M3',
          RAM: '8GB',
          'Bộ nhớ': '512GB SSD',
          'Màu sắc': 'Space Gray',
          Pin: 'Up to 22 hours',
        },
        stock: 25,
        minStock: 5,
        isActive: true,
        isFeatured: true,
        isDigital: false,
        status: 'active',
        ratings: {
          average: 4.9,
          count: 156,
        },
        sales: 340,
        views: 2890,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Áo thun Nam Premium Cotton',
        description:
          'Áo thun nam chất liệu cotton cao cấp, form regular fit thoải mái, phù hợp mọi hoạt động hàng ngày.',
        shortDescription: 'Áo thun nam cotton cao cấp',
        price: 299000,
        originalPrice: 399000,
        category: fashionCategory._id,
        brand: 'Local Brand',
        sku: 'TSHIRT-COTTON-M-WHITE',
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        ],
        thumbnail:
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        variants: [],
        tags: ['áo thun', 'nam', 'cotton', 'basic'],
        specifications: {
          'Chất liệu': '100% Cotton',
          Form: 'Regular fit',
          'Màu sắc': 'Trắng',
          Size: 'S, M, L, XL, XXL',
          'Xuất xứ': 'Việt Nam',
        },
        stock: 100,
        minStock: 20,
        isActive: true,
        isFeatured: false,
        isDigital: false,
        status: 'active',
        ratings: {
          average: 4.3,
          count: 89,
        },
        sales: 150,
        views: 890,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Giày Sneaker Nam Lifestyle',
        description:
          'Giày sneaker thời trang nam với thiết kế hiện đại, chất liệu cao cấp và đế êm ái.',
        shortDescription: 'Sneaker nam thời trang cao cấp',
        price: 1290000,
        originalPrice: 1590000,
        category: fashionCategory._id,
        brand: 'Fashion Pro',
        sku: 'SNEAKER-LIFESTYLE-42-WHITE',
        images: [
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
        ],
        thumbnail:
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
        variants: [],
        tags: ['giày', 'sneaker', 'nam', 'lifestyle'],
        specifications: {
          'Chất liệu upper': 'Da tổng hợp + Mesh',
          Đế: 'Cao su non',
          Size: '39, 40, 41, 42, 43, 44',
          'Màu sắc': 'Trắng/Đen',
          'Phong cách': 'Lifestyle',
        },
        stock: 50,
        minStock: 10,
        isActive: true,
        isFeatured: true,
        isDigital: false,
        status: 'active',
        ratings: {
          average: 4.2,
          count: 67,
        },
        sales: 85,
        views: 1240,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    console.log('📱 Creating products...');
    const productResult = await db
      .collection('products')
      .insertMany(sampleProducts);
    console.log(`✅ Created ${productResult.insertedCount} products`);

    console.log('\n🎉 Sample data created successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Categories: ${categoryResult.insertedCount}`);
    console.log(`   - Products: ${productResult.insertedCount}`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

createSampleData();
