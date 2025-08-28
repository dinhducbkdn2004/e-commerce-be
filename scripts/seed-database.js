const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

// Connect to MongoDB
async function connectDB() {
  try {
    const mongoUri =
      process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce-dev';
    await mongoose.connect(mongoUri);
    log('✅ Connected to MongoDB', 'green');
    return mongoose.connection.db;
  } catch (error) {
    log(`❌ MongoDB connection failed: ${error.message}`, 'red');
    throw error;
  }
}

// Sample Users Data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@ecommerce.com',
    password: 'admin123456',
    phoneNumber: '+84900000000',
    role: 'admin',
    isEmailVerified: true,
    points: 0,
    addresses: [],
  },
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    phoneNumber: '+84901234567',
    role: 'user',
    isEmailVerified: true,
    points: 50000,
    addresses: [
      {
        fullName: 'John Doe',
        phone: '+84901234567',
        street: '123 Nguyen Hue Street',
        ward: 'Ben Nghe Ward',
        district: 'District 1',
        city: 'Ho Chi Minh City',
        isDefault: true,
      },
    ],
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    phoneNumber: '+84907654321',
    role: 'user',
    isEmailVerified: true,
    points: 25000,
    addresses: [
      {
        fullName: 'Jane Smith',
        phone: '+84907654321',
        street: '789 Dong Khoi Street',
        ward: 'Ben Nghe Ward',
        district: 'District 1',
        city: 'Ho Chi Minh City',
        isDefault: true,
      },
    ],
  },
];

// Sample Categories Data
const sampleCategories = [
  {
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    isActive: true,
    sortOrder: 1,
    seoTitle: 'Electronics - Latest Gadgets & Devices',
    seoDescription:
      'Shop the latest electronics, smartphones, laptops, and gadgets at great prices.',
    children: [
      {
        name: 'Smartphones',
        description: 'Mobile phones and accessories',
        isActive: true,
        sortOrder: 1,
      },
      {
        name: 'Laptops',
        description: 'Laptops and notebooks',
        isActive: true,
        sortOrder: 2,
      },
      {
        name: 'Headphones',
        description: 'Audio devices and headphones',
        isActive: true,
        sortOrder: 3,
      },
    ],
  },
  {
    name: 'Fashion',
    description: 'Clothing, shoes, and accessories',
    isActive: true,
    sortOrder: 2,
    seoTitle: 'Fashion - Trendy Clothes & Accessories',
    seoDescription:
      'Discover the latest fashion trends, clothing, shoes and accessories.',
    children: [
      {
        name: "Men's Clothing",
        description: 'Clothing for men',
        isActive: true,
        sortOrder: 1,
      },
      {
        name: "Women's Clothing",
        description: 'Clothing for women',
        isActive: true,
        sortOrder: 2,
      },
      {
        name: 'Shoes',
        description: 'Footwear for all occasions',
        isActive: true,
        sortOrder: 3,
      },
    ],
  },
  {
    name: 'Home & Garden',
    description: 'Home improvement and garden supplies',
    isActive: true,
    sortOrder: 3,
    seoTitle: 'Home & Garden - Furniture & Decor',
    seoDescription:
      'Transform your home with our furniture, decor, and garden supplies.',
    children: [],
  },
  {
    name: 'Sports & Fitness',
    description: 'Sports equipment and fitness gear',
    isActive: true,
    sortOrder: 4,
    seoTitle: 'Sports & Fitness - Equipment & Gear',
    seoDescription:
      'Get fit with our sports equipment, fitness gear, and outdoor recreation products.',
    children: [],
  },
];

// Sample Products Data (extensive list)
const sampleProducts = [
  // Electronics - Smartphones
  {
    name: 'iPhone 15 Pro',
    description:
      'The latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Perfect for professionals and photography enthusiasts.',
    shortDescription: 'Latest iPhone with A17 Pro chip and titanium design',
    price: 54990000, // 54.99M VND
    originalPrice: 59990000,
    categoryName: 'Smartphones',
    brand: 'Apple',
    sku: 'IPHONE15PRO-256-TITAN',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-natural-titanium-select.jpg',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-back-natural-titanium-select.jpg',
    ],
    thumbnail:
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-natural-titanium-select.jpg',
    tags: ['smartphone', 'apple', 'ios', 'titanium', 'camera', 'a17-pro'],
    specifications: {
      'Screen Size': '6.1 inches',
      Storage: '256GB',
      Color: 'Natural Titanium',
      Camera: '48MP Main + 12MP Ultra Wide',
      Chip: 'A17 Pro',
      OS: 'iOS 17',
      Battery: 'Up to 23 hours video playback',
      Weight: '187g',
    },
    stock: 50,
    minStock: 10,
    isActive: true,
    isFeatured: true,
    status: 'active',
    sales: 145,
    views: 2847,
    rating: 4.8,
    reviewCount: 67,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description:
      'Premium Android smartphone with S Pen, advanced AI features, 200MP camera, and exceptional performance.',
    shortDescription: 'Premium Galaxy with S Pen and AI features',
    price: 52990000,
    originalPrice: 56990000,
    categoryName: 'Smartphones',
    brand: 'Samsung',
    sku: 'GALAXY-S24-ULTRA-256-BLACK',
    images: [
      'https://images.samsung.com/is/image/samsung/p6pim/vn/2401/gallery/vn-galaxy-s24-ultra-s928-sm-s928bztqxxv-thumb-539573050.jpg',
    ],
    thumbnail:
      'https://images.samsung.com/is/image/samsung/p6pim/vn/2401/gallery/vn-galaxy-s24-ultra-s928-sm-s928bztqxxv-thumb-539573050.jpg',
    tags: ['smartphone', 'samsung', 'android', 'spen', 'ai', '200mp'],
    specifications: {
      'Screen Size': '6.8 inches',
      Storage: '256GB',
      Color: 'Titanium Black',
      Camera: '200MP Main + 50MP Telephoto',
      Chip: 'Snapdragon 8 Gen 3',
      OS: 'Android 14',
      Battery: '5000mAh',
      Weight: '232g',
    },
    stock: 35,
    minStock: 8,
    isActive: true,
    isFeatured: true,
    status: 'active',
    sales: 89,
    views: 1924,
    rating: 4.6,
    reviewCount: 43,
  },
  {
    name: 'Xiaomi 14 Ultra',
    description:
      'Photography-focused flagship with Leica partnership, advanced camera system, and premium build quality.',
    shortDescription: 'Photography flagship with Leica cameras',
    price: 28990000,
    originalPrice: 31990000,
    categoryName: 'Smartphones',
    brand: 'Xiaomi',
    sku: 'XIAOMI14-ULTRA-512-WHITE',
    images: [
      'https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1708065816.00716085.jpg',
    ],
    thumbnail:
      'https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1708065816.00716085.jpg',
    tags: ['smartphone', 'xiaomi', 'leica', 'photography', 'flagship'],
    specifications: {
      'Screen Size': '6.73 inches',
      Storage: '512GB',
      Color: 'White',
      Camera: '50MP Leica Main + Variable Aperture',
      Chip: 'Snapdragon 8 Gen 3',
      OS: 'Android 14 with HyperOS',
      Battery: '5300mAh',
      Weight: '224g',
    },
    stock: 25,
    minStock: 5,
    isActive: true,
    isFeatured: false,
    status: 'active',
    sales: 56,
    views: 1234,
    rating: 4.5,
    reviewCount: 28,
  },

  // Electronics - Laptops
  {
    name: 'MacBook Pro 14" M3',
    description:
      'Professional laptop with M3 chip, Liquid Retina XDR display, and up to 22 hours of battery life. Perfect for creative professionals.',
    shortDescription: 'Professional MacBook with M3 chip',
    price: 54990000,
    originalPrice: 59990000,
    categoryName: 'Laptops',
    brand: 'Apple',
    sku: 'MACBOOKPRO14-M3-512-GRAY',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310.jpg',
    ],
    thumbnail:
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310.jpg',
    tags: ['laptop', 'apple', 'macbook', 'm3', 'professional', 'creative'],
    specifications: {
      'Screen Size': '14.2 inches',
      Processor: 'Apple M3',
      Memory: '8GB Unified Memory',
      Storage: '512GB SSD',
      Color: 'Space Gray',
      Battery: 'Up to 22 hours',
      Weight: '1.55kg',
      Ports: '3x Thunderbolt 4, HDMI, SD Card',
    },
    stock: 20,
    minStock: 5,
    isActive: true,
    isFeatured: true,
    status: 'active',
    sales: 78,
    views: 2156,
    rating: 4.9,
    reviewCount: 45,
  },
  {
    name: 'Dell XPS 13 Plus',
    description:
      'Ultra-portable laptop with 13th Gen Intel processors, stunning InfinityEdge display, and premium design.',
    shortDescription: 'Ultra-portable premium laptop',
    price: 42990000,
    originalPrice: 47990000,
    categoryName: 'Laptops',
    brand: 'Dell',
    sku: 'DELL-XPS13-PLUS-512-PLATINUM',
    images: [
      'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9320/media-gallery/notebook-xps-13-9320-nt-blue-gallery-4.psd',
    ],
    thumbnail:
      'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9320/media-gallery/notebook-xps-13-9320-nt-blue-gallery-4.psd',
    tags: ['laptop', 'dell', 'ultrabook', 'portable', 'intel'],
    specifications: {
      'Screen Size': '13.4 inches',
      Processor: 'Intel Core i7-1360P',
      Memory: '16GB LPDDR5',
      Storage: '512GB SSD',
      Color: 'Platinum Silver',
      Battery: 'Up to 12 hours',
      Weight: '1.24kg',
      Ports: '2x Thunderbolt 4',
    },
    stock: 15,
    minStock: 3,
    isActive: true,
    isFeatured: false,
    status: 'active',
    sales: 34,
    views: 896,
    rating: 4.4,
    reviewCount: 19,
  },
  {
    name: 'ASUS ROG Strix G16',
    description:
      'Gaming laptop with RTX 4060, 13th Gen Intel i7, 165Hz display, and advanced cooling system.',
    shortDescription: 'High-performance gaming laptop',
    price: 38990000,
    originalPrice: 42990000,
    categoryName: 'Laptops',
    brand: 'ASUS',
    sku: 'ASUS-ROG-G16-RTX4060-1TB',
    images: [
      'https://dlcdnwebimgs.asus.com/gain/E86B4D6D-9A62-4D1F-8A89-F92DFF3E8D96/w717/h525',
    ],
    thumbnail:
      'https://dlcdnwebimgs.asus.com/gain/E86B4D6D-9A62-4D1F-8A89-F92DFF3E8D96/w717/h525',
    tags: ['laptop', 'gaming', 'asus', 'rog', 'rtx4060', 'intel'],
    specifications: {
      'Screen Size': '16 inches',
      Processor: 'Intel Core i7-13650HX',
      Memory: '16GB DDR5',
      Storage: '1TB SSD',
      Graphics: 'RTX 4060 8GB',
      Display: '165Hz FHD',
      Weight: '2.5kg',
      Cooling: 'ROG Intelligent Cooling',
    },
    stock: 12,
    minStock: 3,
    isActive: true,
    isFeatured: false,
    status: 'active',
    sales: 67,
    views: 1567,
    rating: 4.6,
    reviewCount: 31,
  },

  // Electronics - Headphones
  {
    name: 'Sony WH-1000XM5',
    description:
      'Industry-leading noise canceling headphones with premium sound quality, 30-hour battery, and all-day comfort.',
    shortDescription: 'Premium noise canceling headphones',
    price: 9990000,
    originalPrice: 11290000,
    categoryName: 'Headphones',
    brand: 'Sony',
    sku: 'SONY-WH1000XM5-BLACK',
    images: [
      'https://www.sony.com/image/5d02da5df552836db894652c8a6fcb7e?fmt=pjpeg&wid=660&bgcolor=FFFFFF&bgc=FFFFFF',
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
      Type: 'Over-ear',
      Connectivity: 'Bluetooth 5.2',
      'Battery Life': '30 hours',
      'Noise Canceling': 'Industry-leading ANC',
      Color: 'Black',
      Weight: '250g',
      'Frequency Response': '4Hz-40,000Hz',
      'Quick Charge': '3 min = 3 hours',
    },
    stock: 40,
    minStock: 8,
    isActive: true,
    isFeatured: true,
    status: 'active',
    sales: 234,
    views: 3456,
    rating: 4.7,
    reviewCount: 89,
  },
  {
    name: 'AirPods Pro (3rd generation)',
    description:
      "Apple's flagship earbuds with adaptive transparency, personalized spatial audio, and up to 6 hours of listening time.",
    shortDescription: 'Premium wireless earbuds with ANC',
    price: 6990000,
    originalPrice: 7490000,
    categoryName: 'Headphones',
    brand: 'Apple',
    sku: 'AIRPODS-PRO-3GEN-USB-C',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83.jpg',
    ],
    thumbnail:
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83.jpg',
    tags: ['earbuds', 'apple', 'airpods', 'anc', 'spatial-audio', 'wireless'],
    specifications: {
      Type: 'True Wireless Earbuds',
      Connectivity: 'Bluetooth 5.3',
      'Battery Life': '6 hours + 30 hours with case',
      'Noise Canceling': 'Active Noise Cancellation',
      Color: 'White',
      'Water Resistance': 'IPX4',
      Chip: 'H2',
      Charging: 'USB-C, Wireless, MagSafe',
    },
    stock: 60,
    minStock: 15,
    isActive: true,
    isFeatured: true,
    status: 'active',
    sales: 312,
    views: 4123,
    rating: 4.8,
    reviewCount: 156,
  },
  {
    name: 'Bose QuietComfort Ultra',
    description:
      'Premium headphones with world-class noise cancellation, immersive audio, and luxurious comfort.',
    shortDescription: 'Ultra-premium noise canceling headphones',
    price: 11990000,
    originalPrice: 13490000,
    categoryName: 'Headphones',
    brand: 'Bose',
    sku: 'BOSE-QC-ULTRA-BLACK',
    images: [
      'https://assets.bose.com/content/dam/cloudassets/Bose_DAM/Web/consumer_electronics/global/products/headphones/qc_ultra_headphones/product_silo_images/QC_Ultra_Headphones_Black_EC_01.jpg/_jcr_content/renditions/cq5dam.web.1000.1000.jpeg',
    ],
    thumbnail:
      'https://assets.bose.com/content/dam/cloudassets/Bose_DAM/Web/consumer_electronics/global/products/headphones/qc_ultra_headphones/product_silo_images/QC_Ultra_Headphones_Black_EC_01.jpg/_jcr_content/renditions/cq5dam.web.1000.1000.jpeg',
    tags: ['headphones', 'bose', 'premium', 'noise-canceling', 'immersive'],
    specifications: {
      Type: 'Over-ear',
      Connectivity: 'Bluetooth 5.3',
      'Battery Life': '24 hours',
      'Noise Canceling': 'World-class Quiet Mode',
      Color: 'Black',
      Weight: '254g',
      'Immersive Audio': 'Bose Immersive Audio',
      Controls: 'Touch & Button',
    },
    stock: 18,
    minStock: 5,
    isActive: true,
    isFeatured: false,
    status: 'active',
    sales: 45,
    views: 987,
    rating: 4.6,
    reviewCount: 23,
  },

  // Fashion - Men's Clothing
  {
    name: "Levi's 501 Original Jeans",
    description:
      'Classic straight-leg jeans with the authentic fit and feel that started it all. Made from premium denim with timeless style.',
    shortDescription: 'Classic straight-leg jeans',
    price: 2290000,
    originalPrice: 2690000,
    categoryName: "Men's Clothing",
    brand: "Levi's",
    sku: 'LEVIS-501-DARKBLUE-32',
    images: [
      'https://lsco.scene7.com/is/image/lsco/005010114-front-pdp-lse?fmt=jpeg&qlt=70,1&fit=crop,0&op_sharpen=0&resMode=sharp2&op_usm=0.8,1,10,0&iccEmbed=0&printRes=72',
    ],
    thumbnail:
      'https://lsco.scene7.com/is/image/lsco/005010114-front-pdp-lse?fmt=jpeg&qlt=70,1&fit=crop,0&op_sharpen=0&resMode=sharp2&op_usm=0.8,1,10,0&iccEmbed=0&printRes=72',
    tags: ['jeans', 'levis', 'mens', 'denim', 'classic', 'straight-leg'],
    specifications: {
      Material: '100% Cotton',
      Fit: 'Straight',
      Rise: 'Mid',
      Color: 'Dark Blue',
      Sizes: 'S, M, L, XL, XXL',
      Wash: 'Dark Indigo',
      Origin: 'USA',
      Care: 'Machine wash cold',
    },
    stock: 100,
    minStock: 20,
    isActive: true,
    isFeatured: false,
    status: 'active',
    sales: 189,
    views: 2345,
    rating: 4.5,
    reviewCount: 78,
  },
  {
    name: 'Uniqlo Heattech Crew Neck Long Sleeve T-Shirt',
    description:
      'Ultra-warm base layer with innovative Heattech technology. Perfect for layering in cold weather.',
    shortDescription: 'Thermal base layer shirt',
    price: 490000,
    originalPrice: 590000,
    categoryName: "Men's Clothing",
    brand: 'Uniqlo',
    sku: 'UNIQLO-HEATTECH-BLACK-L',
    images: [
      'https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422990/item/goods_09_422990.jpg',
    ],
    thumbnail:
      'https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/422990/item/goods_09_422990.jpg',
    tags: ['t-shirt', 'uniqlo', 'heattech', 'thermal', 'base-layer', 'mens'],
    specifications: {
      Material: '52% Polyester, 33% Rayon, 10% Spandex',
      Technology: 'Heattech',
      Fit: 'Regular',
      Color: 'Black',
      Sizes: 'XS, S, M, L, XL, XXL',
      Features: 'Heat-generating, Moisture-wicking',
      Care: 'Machine wash',
      Season: 'Fall/Winter',
    },
    stock: 150,
    minStock: 30,
    isActive: true,
    isFeatured: false,
    status: 'active',
    sales: 267,
    views: 1876,
    rating: 4.4,
    reviewCount: 92,
  },

  // Fashion - Women's Clothing
  {
    name: 'Zara Ribbed Knit Sweater',
    description:
      'Elegant ribbed knit sweater with a modern silhouette. Perfect for both casual and semi-formal occasions.',
    shortDescription: 'Elegant ribbed knit sweater',
    price: 1190000,
    originalPrice: 1390000,
    categoryName: "Women's Clothing",
    brand: 'Zara',
    sku: 'ZARA-RIBBED-SWEATER-BEIGE-M',
    images: [
      'https://static.zara.net/photos//2023/I/0/1/p/5536/144/711/2/w/750.jpg',
    ],
    thumbnail:
      'https://static.zara.net/photos//2023/I/0/1/p/5536/144/711/2/w/750.jpg',
    tags: ['sweater', 'zara', 'womens', 'knit', 'elegant', 'ribbed'],
    specifications: {
      Material: '60% Cotton, 40% Polyester',
      Fit: 'Regular',
      Neckline: 'Round neck',
      Color: 'Beige',
      Sizes: 'XS, S, M, L, XL',
      Sleeve: 'Long sleeve',
      Style: 'Casual/Semi-formal',
      Care: 'Hand wash recommended',
    },
    stock: 75,
    minStock: 15,
    isActive: true,
    isFeatured: false,
    status: 'active',
    sales: 134,
    views: 1654,
    rating: 4.3,
    reviewCount: 56,
  },
  {
    name: 'H&M Conscious Collection Dress',
    description:
      'Sustainable midi dress made from organic cotton. Features a flattering A-line silhouette and feminine details.',
    shortDescription: 'Sustainable organic cotton dress',
    price: 890000,
    originalPrice: 1090000,
    categoryName: "Women's Clothing",
    brand: 'H&M',
    sku: 'HM-CONSCIOUS-DRESS-NAVY-S',
    images: [
      'https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F36%2F1a%2F361ae8b8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e.jpg%5D',
    ],
    thumbnail:
      'https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F36%2F1a%2F361ae8b8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e.jpg%5D',
    tags: ['dress', 'hm', 'sustainable', 'organic', 'midi', 'womens'],
    specifications: {
      Material: '100% Organic Cotton',
      Length: 'Midi',
      Fit: 'A-line',
      Color: 'Navy Blue',
      Sizes: 'XS, S, M, L, XL',
      Sustainability: 'Conscious Collection',
      Occasion: 'Casual/Work',
      Care: 'Machine wash 30°C',
    },
    stock: 85,
    minStock: 20,
    isActive: true,
    isFeatured: true,
    status: 'active',
    sales: 198,
    views: 2567,
    rating: 4.6,
    reviewCount: 87,
  },

  // Fashion - Shoes
  {
    name: 'Nike Air Max 270',
    description:
      'Lifestyle shoes with Max Air heel unit for all-day comfort and modern style. Perfect for casual wear and light activities.',
    shortDescription: 'Comfortable lifestyle sneakers',
    price: 3990000,
    originalPrice: 4490000,
    categoryName: 'Shoes',
    brand: 'Nike',
    sku: 'NIKE-AIRMAX270-WHITE-42',
    images: [
      'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/awjogtdnqxniqqk0wpgf/air-max-270-shoes-KkLcGR.png',
    ],
    thumbnail:
      'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/awjogtdnqxniqqk0wpgf/air-max-270-shoes-KkLcGR.png',
    tags: ['shoes', 'nike', 'sneakers', 'airmax', 'lifestyle', 'comfort'],
    specifications: {
      Type: 'Lifestyle Sneakers',
      Upper: 'Mesh and synthetic',
      Sole: 'Rubber with Max Air',
      Color: 'White/Black',
      Sizes: '36, 37, 38, 39, 40, 41, 42, 43, 44, 45',
      Technology: 'Max Air 270',
      Weight: 'Lightweight',
      Style: 'Athletic/Casual',
    },
    stock: 75,
    minStock: 15,
    isActive: true,
    isFeatured: true,
    status: 'active',
    sales: 345,
    views: 4567,
    rating: 4.5,
    reviewCount: 167,
  },
  {
    name: 'Adidas Ultraboost 22',
    description:
      'Premium running shoes with responsive Boost cushioning and Primeknit upper for ultimate comfort and performance.',
    shortDescription: 'Premium running shoes with Boost',
    price: 4990000,
    originalPrice: 5490000,
    categoryName: 'Shoes',
    brand: 'Adidas',
    sku: 'ADIDAS-ULTRABOOST22-BLACK-41',
    images: [
      'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg',
    ],
    thumbnail:
      'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg',
    tags: ['shoes', 'adidas', 'running', 'ultraboost', 'boost', 'performance'],
    specifications: {
      Type: 'Running Shoes',
      Upper: 'Primeknit',
      Midsole: 'Boost cushioning',
      Color: 'Core Black',
      Sizes: '36, 37, 38, 39, 40, 41, 42, 43, 44, 45',
      Technology: 'Boost, Primeknit',
      Drop: '10mm',
      Use: 'Running, Training',
    },
    stock: 55,
    minStock: 12,
    isActive: true,
    isFeatured: false,
    status: 'active',
    sales: 187,
    views: 2987,
    rating: 4.7,
    reviewCount: 94,
  },
  {
    name: 'Vans Old Skool Classic',
    description:
      'Iconic skateboarding shoes with classic side stripe design. Durable canvas and suede construction.',
    shortDescription: 'Classic skateboarding shoes',
    price: 1890000,
    originalPrice: 2190000,
    categoryName: 'Shoes',
    brand: 'Vans',
    sku: 'VANS-OLDSKOOL-BLACK-40',
    images: [
      'https://images.vans.com/is/image/Vans/VN000D3HY28-HERO?$583x583$',
    ],
    thumbnail:
      'https://images.vans.com/is/image/Vans/VN000D3HY28-HERO?$583x583$',
    tags: [
      'shoes',
      'vans',
      'skateboarding',
      'classic',
      'canvas',
      'street-style',
    ],
    specifications: {
      Type: 'Skateboarding Shoes',
      Upper: 'Canvas and suede',
      Sole: 'Waffle rubber',
      Color: 'Black/White',
      Sizes: '36, 37, 38, 39, 40, 41, 42, 43, 44, 45',
      Features: 'Padded collar, Side stripe',
      Style: 'Street/Skate',
      Durability: 'High',
    },
    stock: 90,
    minStock: 18,
    isActive: true,
    isFeatured: false,
    status: 'active',
    sales: 256,
    views: 3123,
    rating: 4.4,
    reviewCount: 112,
  },
];

// Create collections and insert data
async function seedDatabase() {
  try {
    const db = await connectDB();

    log('\n🚀 Starting database seeding...', 'blue');

    // Clear existing data
    log('\n🧹 Clearing existing data...', 'yellow');
    await db.collection('users').deleteMany({});
    await db.collection('categories').deleteMany({});
    await db.collection('products').deleteMany({});
    log('✅ Existing data cleared', 'green');

    // Create users with hashed passwords
    log('\n👥 Creating users...', 'cyan');
    const users = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = {
        ...userData,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.push(user);
    }

    const userResult = await db.collection('users').insertMany(users);
    log(`✅ Created ${userResult.insertedCount} users`, 'green');

    // Get admin user ID for category creation
    const adminUser = await db.collection('users').findOne({ role: 'admin' });
    if (!adminUser) {
      throw new Error('Admin user not found');
    }

    // Helper function to generate slug
    function generateSlug(name) {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();
    }

    // Create categories and subcategories
    log('\n📁 Creating categories...', 'cyan');
    const categories = [];
    const categoryMap = {};

    for (const categoryData of sampleCategories) {
      // Create main category
      const mainCategory = {
        name: categoryData.name,
        description: categoryData.description,
        slug: generateSlug(categoryData.name),
        isActive: categoryData.isActive,
        sortOrder: categoryData.sortOrder,
        level: 0,
        path: [],
        children: [],
        productCount: 0,
        seoTitle: categoryData.seoTitle,
        seoDescription: categoryData.seoDescription,
        createdBy: adminUser._id,
        updatedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const categoryResult = await db
        .collection('categories')
        .insertOne(mainCategory);
      categoryMap[categoryData.name] = categoryResult.insertedId;
      log(`✅ Created category: ${categoryData.name}`, 'green');

      // Create subcategories
      for (const subcat of categoryData.children) {
        const subcategory = {
          name: subcat.name,
          description: subcat.description,
          slug: generateSlug(subcat.name),
          parent: categoryResult.insertedId,
          isActive: subcat.isActive,
          sortOrder: subcat.sortOrder,
          level: 1,
          path: [categoryResult.insertedId],
          children: [],
          productCount: 0,
          createdBy: adminUser._id,
          updatedBy: adminUser._id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const subcatResult = await db
          .collection('categories')
          .insertOne(subcategory);
        categoryMap[subcat.name] = subcatResult.insertedId;

        // Update parent's children array
        await db
          .collection('categories')
          .updateOne(
            { _id: categoryResult.insertedId },
            { $push: { children: subcatResult.insertedId } },
          );

        log(`✅ Created subcategory: ${subcat.name}`, 'green');
      }
    }

    // Create products
    log('\n🛍️ Creating products...', 'cyan');
    const products = [];

    for (const productData of sampleProducts) {
      const categoryId = categoryMap[productData.categoryName];
      if (!categoryId) {
        log(
          `⚠️ Category ${productData.categoryName} not found, skipping ${productData.name}`,
          'yellow',
        );
        continue;
      }

      const product = {
        name: productData.name,
        description: productData.description,
        shortDescription: productData.shortDescription,
        price: productData.price,
        originalPrice: productData.originalPrice,
        category: categoryId,
        brand: productData.brand,
        sku: productData.sku,
        images: productData.images,
        thumbnail: productData.thumbnail,
        variants: [],
        tags: productData.tags,
        specifications: productData.specifications,
        stock: productData.stock,
        minStock: productData.minStock,
        isActive: productData.isActive,
        isFeatured: productData.isFeatured,
        isDigital: false,
        status: productData.status,
        sales: productData.sales,
        views: productData.views,
        rating: productData.rating,
        reviewCount: productData.reviewCount,
        reviews: [],
        relatedProducts: [],
        metaTitle: productData.name,
        metaDescription: productData.shortDescription,
        createdBy: adminUser._id,
        updatedBy: adminUser._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      products.push(product);
    }

    const productResult = await db.collection('products').insertMany(products);
    log(`✅ Created ${productResult.insertedCount} products`, 'green');

    // Summary
    log('\n🎉 Database seeding completed successfully!', 'green');
    log('\n📊 Summary:', 'blue');
    log(`👥 Users: ${userResult.insertedCount}`, 'blue');
    log(`📁 Categories: ${Object.keys(categoryMap).length}`, 'blue');
    log(`🛍️ Products: ${productResult.insertedCount}`, 'blue');

    log('\n🔑 Test Credentials:', 'yellow');
    log('🔐 Admin: admin@ecommerce.com / admin123456', 'blue');
    log('👤 User 1: john.doe@example.com / password123', 'blue');
    log('👤 User 2: jane.smith@example.com / password123', 'blue');

    log('\n🌐 Test the APIs:', 'yellow');
    log('📖 API Docs: http://localhost:3000/docs', 'blue');
    log('❤️ Health Check: http://localhost:3000/health', 'blue');
    log('🛍️ Products: http://localhost:3000/api/v1/products', 'blue');
    log('📁 Categories: http://localhost:3000/api/v1/categories', 'blue');
  } catch (error) {
    log(`\n💥 Seeding failed: ${error.message}`, 'red');
    console.error(error);
  } finally {
    await mongoose.disconnect();
    log('\n✅ Disconnected from MongoDB', 'green');
  }
}

// Run the seeding
seedDatabase().catch(console.error);
