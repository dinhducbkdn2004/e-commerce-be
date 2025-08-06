const axios = require('axios');
const mongoose = require('mongoose');

const API_BASE = 'http://localhost:3000/api/v1';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

// You need to set these tokens after creating admin account
let adminToken = process.env.ADMIN_TOKEN || null;

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

// Subcategories will be created after main categories
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
      'The latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Perfect for professionals and photography enthusiasts.',
    shortDescription: 'Latest iPhone with A17 Pro chip and titanium design',
    price: 999,
    originalPrice: 1199,
    categoryName: 'Smartphones',
    brand: 'Apple',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-natural-titanium-select.jpg',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-back-natural-titanium-select.jpg',
    ],
    tags: ['smartphone', 'apple', 'ios', 'titanium', 'camera'],
    specifications: {
      'Screen Size': '6.1 inches',
      Storage: '128GB',
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
    seoTitle: 'iPhone 15 Pro - Latest Apple Smartphone 2024',
    seoDescription:
      'Buy the iPhone 15 Pro with A17 Pro chip, titanium design, and pro camera system. Free shipping included.',
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description:
      'Premium Android smartphone with S Pen, advanced AI features, and exceptional camera capabilities.',
    shortDescription: 'Premium Galaxy with S Pen and AI features',
    price: 1199,
    originalPrice: 1299,
    categoryName: 'Smartphones',
    brand: 'Samsung',
    images: [
      'https://images.samsung.com/is/image/samsung/p6pim/vn/2401/gallery/vn-galaxy-s24-ultra-s928-sm-s928bztqxxv-thumb-539573050.jpg',
    ],
    tags: ['smartphone', 'samsung', 'android', 'spen', 'ai'],
    specifications: {
      'Screen Size': '6.8 inches',
      Storage: '256GB',
      Color: 'Titanium Black',
      Camera: '200MP Main + 50MP Telephoto',
      Chip: 'Snapdragon 8 Gen 3',
      OS: 'Android 14',
    },
    stock: 30,
    minStock: 5,
    isActive: true,
    isFeatured: true,
    status: 'active',
  },
  {
    name: 'MacBook Pro 14" M3',
    description:
      'Professional laptop with M3 chip, Liquid Retina XDR display, and up to 22 hours of battery life.',
    shortDescription: 'Professional MacBook with M3 chip',
    price: 1999,
    originalPrice: 2199,
    categoryName: 'Laptops',
    brand: 'Apple',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310.jpg',
    ],
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
      'Industry-leading noise canceling headphones with premium sound quality and all-day comfort.',
    shortDescription: 'Premium noise canceling headphones',
    price: 399,
    originalPrice: 449,
    categoryName: 'Headphones',
    brand: 'Sony',
    images: [
      'https://www.sony.com/image/5d02da5df552836db894652c8a6fcb7e?fmt=pjpeg&wid=660&bgcolor=FFFFFF&bgc=FFFFFF',
    ],
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
    name: "Levi's 501 Original Jeans",
    description:
      'Classic straight-leg jeans with the authentic fit and feel that started it all.',
    shortDescription: 'Classic straight-leg jeans',
    price: 89,
    originalPrice: 109,
    categoryName: "Men's Clothing",
    brand: "Levi's",
    images: [
      'https://lsco.scene7.com/is/image/lsco/005010114-front-pdp-lse?fmt=jpeg&qlt=70,1&fit=crop,0&op_sharpen=0&resMode=sharp2&op_usm=0.8,1,10,0&iccEmbed=0&printRes=72',
    ],
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
  {
    name: 'Nike Air Max 270',
    description:
      'Lifestyle shoes with Max Air heel unit for all-day comfort and modern style.',
    shortDescription: 'Comfortable lifestyle sneakers',
    price: 150,
    originalPrice: 180,
    categoryName: 'Shoes',
    brand: 'Nike',
    images: [
      'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/awjogtdnqxniqqk0wpgf/air-max-270-shoes-KkLcGR.png',
    ],
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
];

async function createSampleData() {
  try {
    if (!adminToken) {
      log('\n❌ Admin token is required!', 'red');
      log(
        'Please set ADMIN_TOKEN environment variable or update the script',
        'yellow',
      );
      log(
        'Example: ADMIN_TOKEN=your_jwt_token node scripts/create-sample-data.js',
        'blue',
      );
      return;
    }

    log('\n🚀 Creating sample data for e-commerce...', 'blue');

    // 1. Create main categories
    log('\n📁 Creating main categories...', 'yellow');
    const createdCategories = {};

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

    // 2. Create subcategories
    log('\n📂 Creating subcategories...', 'yellow');

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
          { headers: { Authorization: `Bearer ${adminToken}` } },
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

    // 3. Create products
    log('\n🛍️  Creating products...', 'yellow');

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
          images: product.images,
          tags: product.tags,
          specifications: product.specifications,
          stock: product.stock,
          minStock: product.minStock,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          status: product.status,
          seoTitle: product.seoTitle,
          seoDescription: product.seoDescription,
        };

        const response = await axios.post(`${API_BASE}/products`, productData, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });

        log(`✅ Created product: ${product.name} (${product.price}$)`, 'green');
      } catch (error) {
        log(
          `❌ Failed to create product ${product.name}: ${error.response?.data?.message || error.message}`,
          'red',
        );
      }
    }

    log('\n🎉 Sample data creation completed!', 'green');
    log('\nYou can now test the API with:', 'blue');
    log('- Categories: GET /api/v1/categories', 'blue');
    log('- Products: GET /api/v1/products', 'blue');
    log('- Featured products: GET /api/v1/products/featured', 'blue');
    log('- Search: GET /api/v1/products/search?q=iPhone', 'blue');
  } catch (error) {
    log(`\n💥 Failed to create sample data: ${error.message}`, 'red');
    console.error(error.response?.data || error);
  }
}

// Helper function to create admin user
async function createAdminUser() {
  log('\n👑 Creating admin user...', 'yellow');

  const adminData = {
    name: 'Admin User',
    email: 'admin@ecommerce.com',
    password: 'admin123456',
    role: 'admin',
  };

  try {
    const response = await axios.post(`${API_BASE}/auth/register`, adminData);
    log('✅ Admin user registered successfully', 'green');
    log('📧 Please verify email before continuing', 'yellow');
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      log('✅ Admin user already exists', 'green');
    } else {
      log(
        `❌ Failed to create admin user: ${error.response?.data?.message || error.message}`,
        'red',
      );
    }
  }
}

// Helper function to login and get token
async function loginAdmin() {
  log('\n🔐 Logging in admin user...', 'yellow');

  const loginData = {
    email: 'admin@ecommerce.com',
    password: 'admin123456',
  };

  try {
    const response = await axios.post(`${API_BASE}/auth/login`, loginData);
    const token = response.data.data.accessToken;

    log('✅ Admin login successful', 'green');
    log(`📋 Admin Token: ${token}`, 'blue');
    log('\n💡 You can set this token as environment variable:', 'yellow');
    log(`ADMIN_TOKEN=${token}`, 'blue');

    return token;
  } catch (error) {
    log(
      `❌ Failed to login admin: ${error.response?.data?.message || error.message}`,
      'red',
    );
    return null;
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--setup-admin')) {
    await createAdminUser();
    const token = await loginAdmin();
    if (token) {
      adminToken = token;
      log('\n🚀 Proceeding with sample data creation...', 'blue');
      await createSampleData();
    }
  } else if (args.includes('--help') || args.includes('-h')) {
    log('\n📖 Sample Data Creation Script', 'blue');
    log('\nUsage:', 'yellow');
    log('  node scripts/create-sample-data.js [options]', 'blue');
    log('\nOptions:', 'yellow');
    log(
      '  --setup-admin     Create admin user and login automatically',
      'blue',
    );
    log('  --help, -h        Show this help message', 'blue');
    log('\nEnvironment Variables:', 'yellow');
    log('  ADMIN_TOKEN       JWT token for admin user', 'blue');
    log('\nExamples:', 'yellow');
    log('  # Create admin and sample data', 'blue');
    log('  node scripts/create-sample-data.js --setup-admin', 'blue');
    log('  # Use existing admin token', 'blue');
    log('  ADMIN_TOKEN=your_token node scripts/create-sample-data.js', 'blue');
  } else {
    await createSampleData();
  }
}

main().catch(console.error);
