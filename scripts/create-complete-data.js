const axios = require('axios');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:3000/api/v1';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

// Database connection (for direct operations)
let db;

async function connectDB() {
  try {
    const mongoUri =
      process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce-dev';
    await mongoose.connect(mongoUri);
    db = mongoose.connection.db;
    log('✅ Connected to MongoDB', 'green');
  } catch (error) {
    log(`❌ MongoDB connection failed: ${error.message}`, 'red');
    throw error;
  }
}

// Sample data
const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    phoneNumber: '+84901234567',
    role: 'user',
    isEmailVerified: true,
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
      {
        fullName: 'John Doe (Work)',
        phone: '+84901234567',
        street: '456 Le Loi Street',
        ward: 'Ben Thanh Ward',
        district: 'District 1',
        city: 'Ho Chi Minh City',
        isDefault: false,
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
  {
    name: 'Admin User',
    email: 'admin@ecommerce.com',
    password: 'admin123456',
    phoneNumber: '+84900000000',
    role: 'admin',
    isEmailVerified: true,
  },
];

const sampleCategories = [
  {
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    isActive: true,
    sortOrder: 1,
    seoTitle: 'Electronics - Latest Gadgets & Devices',
    seoDescription:
      'Shop the latest electronics, smartphones, laptops, and gadgets at great prices.',
  },
  {
    name: 'Fashion',
    description: 'Clothing, shoes, and accessories',
    isActive: true,
    sortOrder: 2,
    seoTitle: 'Fashion - Trendy Clothes & Accessories',
    seoDescription:
      'Discover the latest fashion trends, clothing, shoes and accessories for men and women.',
  },
  {
    name: 'Home & Garden',
    description: 'Home improvement and garden supplies',
    isActive: true,
    sortOrder: 3,
    seoTitle: 'Home & Garden - Furniture & Decor',
    seoDescription:
      'Transform your home with our furniture, decor, and garden supplies collection.',
  },
  {
    name: 'Sports & Fitness',
    description: 'Sports equipment and fitness gear',
    isActive: true,
    sortOrder: 4,
    seoTitle: 'Sports & Fitness - Equipment & Gear',
    seoDescription:
      'Get fit with our sports equipment, fitness gear, and outdoor recreation products.',
  },
];

const sampleSubcategories = [
  {
    name: 'Smartphones',
    description: 'Mobile phones and accessories',
    parentName: 'Electronics',
    isActive: true,
    sortOrder: 1,
  },
  {
    name: 'Laptops',
    description: 'Laptops and notebooks',
    parentName: 'Electronics',
    isActive: true,
    sortOrder: 2,
  },
  {
    name: 'Headphones',
    description: 'Audio devices and headphones',
    parentName: 'Electronics',
    isActive: true,
    sortOrder: 3,
  },
  {
    name: "Men's Clothing",
    description: 'Clothing for men',
    parentName: 'Fashion',
    isActive: true,
    sortOrder: 1,
  },
  {
    name: "Women's Clothing",
    description: 'Clothing for women',
    parentName: 'Fashion',
    isActive: true,
    sortOrder: 2,
  },
  {
    name: 'Shoes',
    description: 'Footwear for all occasions',
    parentName: 'Fashion',
    isActive: true,
    sortOrder: 3,
  },
];

const sampleProducts = [
  {
    name: 'iPhone 15 Pro',
    description:
      'The latest iPhone with A17 Pro chip, titanium design, and advanced camera system.',
    shortDescription: 'Latest iPhone with A17 Pro chip and titanium design',
    price: 54990000, // VND
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
    tags: ['smartphone', 'apple', 'ios', 'titanium', 'camera'],
    specifications: {
      'Screen Size': '6.1 inches',
      Storage: '256GB',
      Color: 'Natural Titanium',
      Camera: '48MP Main + 12MP Ultra Wide',
      Chip: 'A17 Pro',
      OS: 'iOS 17',
    },
    stock: 50,
    minStock: 10,
    isActive: true,
    isFeatured: true,
    status: 'active',
  },
  {
    name: 'MacBook Pro 14" M3',
    description:
      'Professional laptop with M3 chip, Liquid Retina XDR display, and up to 22 hours of battery life.',
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
    tags: ['laptop', 'apple', 'macbook', 'm3', 'professional'],
    specifications: {
      'Screen Size': '14.2 inches',
      Processor: 'Apple M3',
      Memory: '8GB',
      Storage: '512GB SSD',
      Color: 'Space Gray',
      Battery: 'Up to 22 hours',
    },
    stock: 25,
    minStock: 5,
    isActive: true,
    isFeatured: true,
    status: 'active',
  },
  {
    name: 'Sony WH-1000XM5',
    description:
      'Industry-leading noise canceling headphones with premium sound quality.',
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
    tags: ['headphones', 'sony', 'noise-canceling', 'wireless', 'bluetooth'],
    specifications: {
      Type: 'Over-ear',
      Connectivity: 'Bluetooth 5.2',
      'Battery Life': '30 hours',
      'Noise Canceling': 'Yes',
      Color: 'Black',
      Weight: '250g',
    },
    stock: 40,
    minStock: 8,
    isActive: true,
    isFeatured: false,
    status: 'active',
  },
  {
    name: 'Nike Air Max 270',
    description:
      'Lifestyle shoes with Max Air heel unit for all-day comfort and modern style.',
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
    tags: ['shoes', 'nike', 'sneakers', 'airmax', 'lifestyle'],
    specifications: {
      Type: 'Lifestyle Sneakers',
      Upper: 'Mesh and synthetic',
      Sole: 'Rubber with Max Air',
      Color: 'White/Black',
      Sizes: '6, 7, 8, 9, 10, 11, 12',
    },
    stock: 75,
    minStock: 15,
    isActive: true,
    isFeatured: false,
    status: 'active',
  },
  {
    name: "Levi's 501 Original Jeans",
    description:
      'Classic straight-leg jeans with the authentic fit and feel that started it all.',
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
    tags: ['jeans', 'levis', 'mens', 'denim', 'classic'],
    specifications: {
      Material: '100% Cotton',
      Fit: 'Straight',
      Rise: 'Mid',
      Color: 'Dark Blue',
      Sizes: 'S, M, L, XL, XXL',
    },
    stock: 100,
    minStock: 20,
    isActive: true,
    isFeatured: false,
    status: 'active',
  },
];

// Global variables to store created data
let adminToken = null;
let userTokens = {};
let createdCategories = {};
let createdProducts = {};
let createdUsers = {};

async function createUsers() {
  log('\n👥 Creating users...', 'cyan');

  for (const userData of sampleUsers) {
    try {
      // Register user
      const registerResponse = await axios.post(`${API_BASE}/auth/register`, {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phoneNumber: userData.phoneNumber,
      });

      log(`✅ User registered: ${userData.email}`, 'green');

      // Auto-verify email (direct DB operation)
      await db.collection('users').updateOne(
        { email: userData.email },
        {
          $set: {
            isEmailVerified: true,
            role: userData.role,
            addresses: userData.addresses || [],
          },
        },
      );

      // Login to get token
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: userData.email,
        password: userData.password,
      });

      const token = loginResponse.data.data.accessToken;
      const userId = loginResponse.data.data.user.id;

      if (userData.role === 'admin') {
        adminToken = token;
        log(`✅ Admin token obtained: ${token.substring(0, 20)}...`, 'blue');
      } else {
        userTokens[userData.email] = token;
      }

      createdUsers[userData.email] = {
        id: userId,
        token: token,
        data: userData,
      };

      log(`✅ User logged in: ${userData.email}`, 'green');
    } catch (error) {
      if (error.response?.status === 409) {
        log(`⚠️  User already exists: ${userData.email}`, 'yellow');

        // Try to login existing user
        try {
          const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
            email: userData.email,
            password: userData.password,
          });

          const token = loginResponse.data.data.accessToken;
          const userId = loginResponse.data.data.user.id;

          if (userData.role === 'admin') {
            adminToken = token;
          } else {
            userTokens[userData.email] = token;
          }

          createdUsers[userData.email] = {
            id: userId,
            token: token,
            data: userData,
          };

          log(`✅ Existing user logged in: ${userData.email}`, 'green');
        } catch (loginError) {
          log(`❌ Failed to login existing user ${userData.email}`, 'red');
        }
      } else {
        log(
          `❌ Failed to create user ${userData.email}: ${error.response?.data?.message || error.message}`,
          'red',
        );
      }
    }
  }
}

async function createCategories() {
  log('\n📁 Creating categories...', 'cyan');

  // Create main categories first
  for (const category of sampleCategories) {
    try {
      const response = await axios.post(`${API_BASE}/categories`, category, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      createdCategories[category.name] = response.data.data._id;
      log(`✅ Created category: ${category.name}`, 'green');
    } catch (error) {
      log(
        `❌ Failed to create category ${category.name}: ${error.response?.data?.message || error.message}`,
        'red',
      );
    }
  }

  // Create subcategories
  for (const subcategory of sampleSubcategories) {
    try {
      const parentId = createdCategories[subcategory.parentName];
      if (!parentId) {
        log(
          `⚠️  Parent category ${subcategory.parentName} not found, skipping ${subcategory.name}`,
          'yellow',
        );
        continue;
      }

      const categoryData = {
        name: subcategory.name,
        description: subcategory.description,
        parent: parentId,
        isActive: subcategory.isActive,
        sortOrder: subcategory.sortOrder,
      };

      const response = await axios.post(
        `${API_BASE}/categories`,
        categoryData,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        },
      );

      createdCategories[subcategory.name] = response.data.data._id;
      log(`✅ Created subcategory: ${subcategory.name}`, 'green');
    } catch (error) {
      log(
        `❌ Failed to create subcategory ${subcategory.name}: ${error.response?.data?.message || error.message}`,
        'red',
      );
    }
  }
}

async function createProducts() {
  log('\n🛍️  Creating products...', 'cyan');

  for (const product of sampleProducts) {
    try {
      const categoryId = createdCategories[product.categoryName];
      if (!categoryId) {
        log(
          `⚠️  Category ${product.categoryName} not found, skipping ${product.name}`,
          'yellow',
        );
        continue;
      }

      const productData = {
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        price: product.price,
        originalPrice: product.originalPrice,
        category: categoryId,
        brand: product.brand,
        sku: product.sku,
        images: product.images,
        thumbnail: product.thumbnail,
        tags: product.tags,
        specifications: product.specifications,
        stock: product.stock,
        minStock: product.minStock,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        status: product.status,
      };

      const response = await axios.post(`${API_BASE}/products`, productData, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      createdProducts[product.name] = response.data.data._id;
      log(
        `✅ Created product: ${product.name} (${(product.price / 1000000).toFixed(1)}M VND)`,
        'green',
      );
    } catch (error) {
      log(
        `❌ Failed to create product ${product.name}: ${error.response?.data?.message || error.message}`,
        'red',
      );
    }
  }
}

async function createSampleCartAndWishlist() {
  log('\n🛒 Creating sample cart and wishlist data...', 'cyan');

  const userEmail = 'john.doe@example.com';
  const user = createdUsers[userEmail];

  if (!user) {
    log('⚠️  User not found for cart/wishlist creation', 'yellow');
    return;
  }

  const productIds = Object.values(createdProducts);

  try {
    // Add items to cart
    const cartItems = [
      { productId: productIds[0], quantity: 1 }, // iPhone
      { productId: productIds[2], quantity: 1 }, // Sony Headphones
    ];

    for (const item of cartItems) {
      try {
        await axios.post(`${API_BASE}/cart`, item, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        log(`✅ Added item to cart`, 'green');
      } catch (error) {
        log(
          `❌ Failed to add item to cart: ${error.response?.data?.message || error.message}`,
          'red',
        );
      }
    }

    // Add items to wishlist
    const wishlistItems = [productIds[1], productIds[3], productIds[4]]; // MacBook, Nike, Jeans

    for (const productId of wishlistItems) {
      try {
        await axios.post(
          `${API_BASE}/wishlist`,
          { productId },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );
        log(`✅ Added item to wishlist`, 'green');
      } catch (error) {
        log(
          `❌ Failed to add item to wishlist: ${error.response?.data?.message || error.message}`,
          'red',
        );
      }
    }
  } catch (error) {
    log(`❌ Error creating cart/wishlist: ${error.message}`, 'red');
  }
}

async function createSampleOrders() {
  log('\n📦 Creating sample orders...', 'cyan');

  const userEmail = 'jane.smith@example.com';
  const user = createdUsers[userEmail];

  if (!user) {
    log('⚠️  User not found for order creation', 'yellow');
    return;
  }

  const productIds = Object.values(createdProducts);

  // Create a sample order
  const orderData = {
    items: [
      {
        productId: productIds[0],
        name: 'iPhone 15 Pro',
        price: 54990000,
        quantity: 1,
        images: [
          'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-natural-titanium-select.jpg',
        ],
      },
    ],
    shippingAddress: {
      fullName: 'Jane Smith',
      phone: '+84907654321',
      street: '789 Dong Khoi Street',
      ward: 'Ben Nghe Ward',
      district: 'District 1',
      city: 'Ho Chi Minh City',
    },
    paymentMethod: 'cod',
    notes: 'Please call before delivery',
  };

  try {
    const response = await axios.post(`${API_BASE}/orders`, orderData, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    log(`✅ Created order: ${response.data.data.orderNumber}`, 'green');

    // Create loyalty points for the order
    const orderTotal = orderData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const points = Math.floor(orderTotal * 0.01); // 1 point per 100 VND

    await db.collection('loyaltytransactions').insertOne({
      userId: new mongoose.Types.ObjectId(user.id),
      type: 'earn',
      points: points,
      description: `Earned ${points} points from order ${response.data.data.orderNumber}`,
      orderId: new mongoose.Types.ObjectId(response.data.data._id),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      createdAt: new Date(),
    });

    // Update user points
    await db
      .collection('users')
      .updateOne(
        { _id: new mongoose.Types.ObjectId(user.id) },
        { $inc: { points: points } },
      );

    log(`✅ Awarded ${points} loyalty points`, 'green');
  } catch (error) {
    log(
      `❌ Failed to create order: ${error.response?.data?.message || error.message}`,
      'red',
    );
  }
}

async function updateProductStats() {
  log('\n📊 Updating product statistics...', 'cyan');

  try {
    const productIds = Object.values(createdProducts);

    for (const productId of productIds) {
      // Add random sales and views
      const sales = Math.floor(Math.random() * 500) + 50;
      const views = Math.floor(Math.random() * 3000) + 500;
      const rating = (Math.random() * 2 + 3).toFixed(1); // 3.0 - 5.0
      const reviewCount = Math.floor(Math.random() * 100) + 10;

      await db.collection('products').updateOne(
        { _id: new mongoose.Types.ObjectId(productId) },
        {
          $set: {
            sales: sales,
            views: views,
            rating: parseFloat(rating),
            reviewCount: reviewCount,
          },
        },
      );
    }

    log(`✅ Updated stats for ${productIds.length} products`, 'green');
  } catch (error) {
    log(`❌ Failed to update product stats: ${error.message}`, 'red');
  }
}

async function createCompleteData() {
  try {
    log('\n🚀 Creating complete e-commerce data...', 'blue');

    await connectDB();

    await createUsers();

    if (!adminToken) {
      log('❌ Admin token not available, cannot create data', 'red');
      return;
    }

    await createCategories();
    await createProducts();
    await createSampleCartAndWishlist();
    await createSampleOrders();
    await updateProductStats();

    log('\n🎉 Complete data creation finished!', 'green');
    log('\n📋 Summary:', 'blue');
    log(`- Users: ${Object.keys(createdUsers).length}`, 'blue');
    log(`- Categories: ${Object.keys(createdCategories).length}`, 'blue');
    log(`- Products: ${Object.keys(createdProducts).length}`, 'blue');
    log('- Cart items: Added for john.doe@example.com', 'blue');
    log('- Wishlist items: Added for john.doe@example.com', 'blue');
    log('- Orders: Created sample order for jane.smith@example.com', 'blue');
    log('- Loyalty points: Awarded for order', 'blue');

    log('\n🔑 Test Credentials:', 'yellow');
    log('Admin: admin@ecommerce.com / admin123456', 'blue');
    log('User 1: john.doe@example.com / password123', 'blue');
    log('User 2: jane.smith@example.com / password123', 'blue');

    log('\n🌐 Test the APIs:', 'yellow');
    log('- API Docs: http://localhost:3000/docs', 'blue');
    log('- Health: http://localhost:3000/health', 'blue');
    log('- Products: http://localhost:3000/api/v1/products', 'blue');
    log('- Categories: http://localhost:3000/api/v1/categories', 'blue');
  } catch (error) {
    log(`\n💥 Failed to create complete data: ${error.message}`, 'red');
    console.error(error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      log('\n✅ Disconnected from MongoDB', 'green');
    }
  }
}

// Run the script
createCompleteData().catch(console.error);
