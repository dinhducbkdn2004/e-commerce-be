const mongoose = require('mongoose');
require('dotenv').config();

// Define Product Schema directly in the script
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: String,
  price: { type: Number, required: true },
  originalPrice: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  brand: String,
  sku: { type: String, required: true, unique: true },
  images: [String],
  thumbnail: String,
  tags: [String],
  specifications: { type: Map, of: String },
  stock: { type: Number, default: 0 },
  minStock: { type: Number, default: 5 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isDigital: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'out_of_stock'],
    default: 'active',
  },
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  sales: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Define Category Schema
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  seoTitle: String,
  seoDescription: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create models
const Product = mongoose.model('Product', ProductSchema);
const Category = mongoose.model('Category', CategorySchema);

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce',
    );
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

// Sample categories
const sampleCategories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and gadgets',
    isActive: true,
    sortOrder: 1,
    seoTitle: 'Electronics - Latest Gadgets & Devices',
    seoDescription:
      'Shop the latest electronics, smartphones, laptops, and gadgets at great prices.',
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing, shoes, and accessories',
    isActive: true,
    sortOrder: 2,
    seoTitle: 'Fashion - Trendy Clothes & Accessories',
    seoDescription:
      'Discover the latest fashion trends, clothing, shoes and accessories for men and women.',
  },
  {
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Home improvement and garden supplies',
    isActive: true,
    sortOrder: 3,
    seoTitle: 'Home & Garden - Furniture & Decor',
    seoDescription:
      'Transform your home with our furniture, decor, and garden supplies collection.',
  },
  {
    name: 'Sports & Fitness',
    slug: 'sports-fitness',
    description: 'Sports equipment and fitness gear',
    isActive: true,
    sortOrder: 4,
    seoTitle: 'Sports & Fitness - Equipment & Gear',
    seoDescription:
      'Get fit with our sports equipment, fitness gear, and outdoor recreation products.',
  },
];

// Sample products
const generateSampleProducts = (categoryId) => [
  {
    name: 'iPhone 15 Pro',
    description:
      'The latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Perfect for professionals and photography enthusiasts who demand the best mobile technology.',
    shortDescription: 'Latest iPhone with A17 Pro chip and titanium design',
    price: 29990000, // 29,990,000 VND
    originalPrice: 34990000, // 34,990,000 VND
    category: categoryId,
    brand: 'Apple',
    sku: 'IPHONE15PRO-128-TITAN',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-natural-titanium-select.jpg',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-back-natural-titanium-select.jpg',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-side-natural-titanium-select.jpg',
    ],
    thumbnail:
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-natural-titanium-select.jpg',
    tags: ['smartphone', 'apple', 'ios', 'titanium', 'camera', 'flagship'],
    specifications: {
      'Màn hình': '6.1 inches Super Retina XDR',
      'Bộ nhớ': '128GB',
      'Màu sắc': 'Natural Titanium',
      Camera: '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
      Chip: 'A17 Pro',
      'Hệ điều hành': 'iOS 17',
      Pin: 'Up to 23 hours video playback',
      'Chất liệu': 'Titanium',
    },
    stock: 50,
    minStock: 10,
    isActive: true,
    isFeatured: true,
    isDigital: false,
    status: 'active',
    seoTitle: 'iPhone 15 Pro - Điện thoại Apple mới nhất 2024',
    seoDescription:
      'Mua iPhone 15 Pro với chip A17 Pro, thiết kế titanium và hệ thống camera chuyên nghiệp. Miễn phí vận chuyển.',
    ratings: {
      average: 4.8,
      count: 245,
    },
    sales: 1250,
    views: 5430,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description:
      'Smartphone Android cao cấp với S Pen, tính năng AI tiên tiến và khả năng chụp ảnh vượt trội.',
    shortDescription: 'Galaxy cao cấp với S Pen và tính năng AI',
    price: 31990000, // 31,990,000 VND
    originalPrice: 36990000, // 36,990,000 VND
    category: categoryId,
    brand: 'Samsung',
    sku: 'GALAXYS24ULTRA-256-BLACK',
    images: [
      'https://images.samsung.com/is/image/samsung/p6pim/vn/2401/gallery/vn-galaxy-s24-ultra-s928-sm-s928bztqxxv-thumb-539573050.jpg',
      'https://images.samsung.com/is/image/samsung/p6pim/vn/2401/gallery/vn-galaxy-s24-ultra-s928-sm-s928bztqxxv-thumb-539573051.jpg',
    ],
    thumbnail:
      'https://images.samsung.com/is/image/samsung/p6pim/vn/2401/gallery/vn-galaxy-s24-ultra-s928-sm-s928bztqxxv-thumb-539573050.jpg',
    tags: ['smartphone', 'samsung', 'android', 'spen', 'ai', 'camera'],
    specifications: {
      'Màn hình': '6.8 inches Dynamic AMOLED 2X',
      'Bộ nhớ': '256GB',
      'Màu sắc': 'Titanium Black',
      Camera: '200MP Main + 50MP Periscope + 12MP Ultra Wide',
      Chip: 'Snapdragon 8 Gen 3',
      'Hệ điều hành': 'Android 14',
      'S Pen': 'Có',
      RAM: '12GB',
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
  },
  {
    name: 'MacBook Pro 14" M3',
    description:
      'Laptop chuyên nghiệp với chip M3, màn hình Liquid Retina XDR và thời lượng pin lên đến 22 giờ.',
    shortDescription: 'MacBook chuyên nghiệp với chip M3',
    price: 54990000, // 54,990,000 VND
    originalPrice: 59990000, // 59,990,000 VND
    category: categoryId,
    brand: 'Apple',
    sku: 'MACBOOKPRO14-M3-512-GRAY',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310.jpg',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310_GEO_VN.jpg',
    ],
    thumbnail:
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310.jpg',
    tags: ['laptop', 'apple', 'macbook', 'm3', 'professional', 'design'],
    specifications: {
      'Màn hình': '14.2 inches Liquid Retina XDR',
      Processor: 'Apple M3 (8-core CPU)',
      RAM: '8GB Unified Memory',
      'Bộ nhớ': '512GB SSD',
      'Màu sắc': 'Space Gray',
      Pin: 'Up to 22 hours',
      'Trọng lượng': '1.55 kg',
      'Cổng kết nối': '3x Thunderbolt 4, HDMI, SD card',
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
  },
  {
    name: 'Sony WH-1000XM5',
    description:
      'Tai nghe chống ồn hàng đầu ngành với chất lượng âm thanh cao cấp và sự thoải mái cả ngày.',
    shortDescription: 'Tai nghe chống ồn cao cấp',
    price: 8990000, // 8,990,000 VND
    originalPrice: 9990000, // 9,990,000 VND
    category: categoryId,
    brand: 'Sony',
    sku: 'SONYWH1000XM5-BLACK',
    images: [
      'https://www.sony.com/image/5d02da5df552836db894652c8a6fcb7e?fmt=pjpeg&wid=660&bgcolor=FFFFFF&bgc=FFFFFF',
      'https://www.sony.com/image/a7c4c80ea8b82ac25e6b8b6a8d9a9c4e?fmt=pjpeg&wid=660&bgcolor=FFFFFF&bgc=FFFFFF',
    ],
    thumbnail:
      'https://www.sony.com/image/5d02da5df552836db894652c8a6fcb7e?fmt=pjpeg&wid=660&bgcolor=FFFFFF&bgc=FFFFFF',
    tags: [
      'headphones',
      'sony',
      'noise-canceling',
      'wireless',
      'bluetooth',
      'premium',
    ],
    specifications: {
      Loại: 'Over-ear',
      'Kết nối': 'Bluetooth 5.2, Jack 3.5mm',
      'Thời lượng pin': '30 giờ',
      'Chống ồn': 'Adaptive Noise Canceling',
      'Màu sắc': 'Black',
      'Trọng lượng': '250g',
      Driver: '30mm',
      'Tần số': '4Hz-40kHz',
    },
    stock: 40,
    minStock: 8,
    isActive: true,
    isFeatured: false,
    isDigital: false,
    status: 'active',
    ratings: {
      average: 4.6,
      count: 298,
    },
    sales: 580,
    views: 1890,
  },
  {
    name: 'iPad Air 5th Gen',
    description:
      'Máy tính bảng mạnh mẽ với chip M1, hỗ trợ Apple Pencil và Magic Keyboard cho công việc và giải trí.',
    shortDescription: 'iPad Air với chip M1 mạnh mẽ',
    price: 16990000, // 16,990,000 VND
    originalPrice: 19990000, // 19,990,000 VND
    category: categoryId,
    brand: 'Apple',
    sku: 'IPADAIR5-64-BLUE',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-blue-202203.jpg',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-blue-202203_FMT_WHH.jpg',
    ],
    thumbnail:
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-blue-202203.jpg',
    tags: ['tablet', 'apple', 'ipad', 'm1', 'creative', 'productivity'],
    specifications: {
      'Màn hình': '10.9 inches Liquid Retina',
      Chip: 'Apple M1',
      'Bộ nhớ': '64GB',
      'Màu sắc': 'Sky Blue',
      Camera: '12MP Wide, 12MP Ultra Wide Front',
      'Kết nối': 'Wi-Fi 6, USB-C',
      Pin: 'Up to 10 hours',
      'Trọng lượng': '461g',
    },
    stock: 35,
    minStock: 7,
    isActive: true,
    isFeatured: false,
    isDigital: false,
    status: 'active',
    ratings: {
      average: 4.5,
      count: 142,
    },
    sales: 420,
    views: 2140,
  },
  {
    name: 'Xiaomi 13 Ultra',
    description:
      'Smartphone camera phone với hệ thống camera Leica, hiệu năng flagship và sạc nhanh 90W.',
    shortDescription: 'Camera phone cao cấp với Leica',
    price: 24990000, // 24,990,000 VND
    originalPrice: 27990000, // 27,990,000 VND
    category: categoryId,
    brand: 'Xiaomi',
    sku: 'XIAOMI13ULTRA-256-BLACK',
    images: [
      'https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1679478826.62434524.jpg',
      'https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1679478826.89854833.jpg',
    ],
    thumbnail:
      'https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1679478826.62434524.jpg',
    tags: [
      'smartphone',
      'xiaomi',
      'camera',
      'leica',
      'flagship',
      'photography',
    ],
    specifications: {
      'Màn hình': '6.73 inches AMOLED',
      Chip: 'Snapdragon 8 Gen 2',
      RAM: '12GB',
      'Bộ nhớ': '256GB',
      Camera: '50MP Main + 50MP Ultra Wide + 50MP Telephoto (Leica)',
      Pin: '5000mAh + 90W Fast Charging',
      'Màu sắc': 'Black',
      'Hệ điều hành': 'MIUI 14 (Android 13)',
    },
    stock: 20,
    minStock: 5,
    isActive: true,
    isFeatured: true,
    isDigital: false,
    status: 'active',
    ratings: {
      average: 4.4,
      count: 178,
    },
    sales: 320,
    views: 1560,
  },
];

async function createSampleData() {
  console.log('🚀 Bắt đầu tạo dữ liệu mẫu...');

  try {
    // Clear existing data
    console.log('🧹 Xóa dữ liệu cũ...');
    await Product.deleteMany({});
    await Category.deleteMany({});

    // Create categories
    console.log('📁 Tạo danh mục...');
    const createdCategories = await Category.insertMany(sampleCategories);
    console.log(`✅ Đã tạo ${createdCategories.length} danh mục`);

    // Create products for Electronics category
    const electronicsCategory = createdCategories.find(
      (cat) => cat.name === 'Electronics',
    );
    if (electronicsCategory) {
      console.log('📱 Tạo sản phẩm Electronics...');
      const products = generateSampleProducts(electronicsCategory._id);
      const createdProducts = await Product.insertMany(products);
      console.log(`✅ Đã tạo ${createdProducts.length} sản phẩm Electronics`);
    }

    // Create some fashion products
    const fashionCategory = createdCategories.find(
      (cat) => cat.name === 'Fashion',
    );
    if (fashionCategory) {
      console.log('👕 Tạo sản phẩm Fashion...');
      const fashionProducts = [
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
            'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500',
          ],
          thumbnail:
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
          tags: ['áo thun', 'nam', 'cotton', 'basic', 'everyday'],
          specifications: {
            'Chất liệu': '100% Cotton',
            Form: 'Regular fit',
            'Màu sắc': 'Trắng',
            Size: 'S, M, L, XL, XXL',
            'Xuất xứ': 'Việt Nam',
            'Hướng dẫn giặt': 'Giặt máy ở nhiệt độ thường',
          },
          stock: 100,
          minStock: 20,
          isActive: true,
          isFeatured: false,
          isDigital: false,
          status: 'active',
          ratings: { average: 4.3, count: 89 },
          sales: 150,
          views: 890,
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
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500',
          ],
          thumbnail:
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
          tags: ['giày', 'sneaker', 'nam', 'lifestyle', 'thời trang'],
          specifications: {
            'Chất liệu upper': 'Da tổng hợp + Mesh',
            Đế: 'Cao su non',
            Size: '39, 40, 41, 42, 43, 44',
            'Màu sắc': 'Trắng/Đen',
            'Phong cách': 'Lifestyle',
            'Xuất xứ': 'Việt Nam',
          },
          stock: 50,
          minStock: 10,
          isActive: true,
          isFeatured: true,
          isDigital: false,
          status: 'active',
          ratings: { average: 4.2, count: 67 },
          sales: 85,
          views: 1240,
        },
      ];

      const createdFashionProducts = await Product.insertMany(fashionProducts);
      console.log(
        `✅ Đã tạo ${createdFashionProducts.length} sản phẩm Fashion`,
      );
    }

    console.log('\n🎉 Hoàn thành tạo dữ liệu mẫu!');
    console.log('📊 Thống kê:');

    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();

    console.log(`   - Danh mục: ${totalCategories}`);
    console.log(`   - Sản phẩm: ${totalProducts}`);
  } catch (error) {
    console.error('❌ Lỗi khi tạo dữ liệu:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Đã đóng kết nối database');
  }
}

// Run the script
connectDB().then(() => {
  createSampleData();
});
