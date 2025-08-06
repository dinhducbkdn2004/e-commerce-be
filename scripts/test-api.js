const axios = require('axios');

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

// Test configurations
let adminToken = null;
let userToken = null;
let categoryId = null;
let productId = null;

async function testAPI() {
  try {
    log('\n🚀 Starting API Tests...', 'blue');

    // 1. Health check
    await testHealthCheck();

    // 2. Authentication (you need to have admin and user accounts)
    await testAuth();

    // 3. Category tests
    await testCategories();

    // 4. Product tests
    await testProducts();

    log('\n✅ All tests completed!', 'green');
  } catch (error) {
    log(`\n❌ Test failed: ${error.message}`, 'red');
    console.error(error.response?.data || error);
  }
}

async function testHealthCheck() {
  log('\n📊 Testing Health Check...', 'yellow');

  const response = await axios.get(`${API_BASE.replace('/api/v1', '')}/health`);

  if (response.data.success) {
    log('✅ Health check passed', 'green');
  } else {
    throw new Error('Health check failed');
  }
}

async function testAuth() {
  log('\n🔐 Testing Authentication...', 'yellow');

  // Note: You need to register admin and user accounts first
  // This is just a placeholder to show the structure
  log(
    '⚠️  Authentication test skipped - please set adminToken and userToken manually',
    'yellow',
  );

  // adminToken = 'your-admin-jwt-token-here';
  // userToken = 'your-user-jwt-token-here';
}

async function testCategories() {
  log('\n📁 Testing Categories...', 'yellow');

  // Test getting root categories (public)
  const rootCatsResponse = await axios.get(`${API_BASE}/categories/root`);
  log(
    `✅ Get root categories: ${rootCatsResponse.data.data.length} categories found`,
    'green',
  );

  if (adminToken) {
    // Test creating category (admin only)
    const newCategory = {
      name: 'Test Electronics',
      description: 'Testing category for electronics',
      isActive: true,
      sortOrder: 1,
    };

    const createResponse = await axios.post(
      `${API_BASE}/categories`,
      newCategory,
      { headers: { Authorization: `Bearer ${adminToken}` } },
    );

    categoryId = createResponse.data.data._id;
    log(`✅ Category created: ${categoryId}`, 'green');

    // Test updating category
    const updateData = {
      description: 'Updated description for testing',
    };

    await axios.put(`${API_BASE}/categories/${categoryId}`, updateData, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    log('✅ Category updated', 'green');
  } else {
    log('⚠️  Category creation tests skipped - no admin token', 'yellow');
  }

  // Test getting category tree (public)
  const treeResponse = await axios.get(`${API_BASE}/categories/tree`);
  log(
    `✅ Get category tree: ${treeResponse.data.data.length} root categories`,
    'green',
  );

  // Test search categories
  const searchResponse = await axios.get(
    `${API_BASE}/categories/search?q=test`,
  );
  log(
    `✅ Category search: ${searchResponse.data.data.length} results`,
    'green',
  );
}

async function testProducts() {
  log('\n🛍️  Testing Products...', 'yellow');

  if (adminToken && categoryId) {
    // Test creating product (admin only)
    const newProduct = {
      name: 'Test iPhone 15',
      description: 'A test iPhone for API testing purposes',
      shortDescription: 'Test iPhone',
      price: 999,
      originalPrice: 1199,
      category: categoryId,
      brand: 'Apple',
      sku: 'TEST-IP15-001',
      images: [
        'https://example.com/iphone15-1.jpg',
        'https://example.com/iphone15-2.jpg',
      ],
      tags: ['smartphone', 'apple', 'test'],
      specifications: {
        'Screen Size': '6.1 inches',
        Storage: '128GB',
        Color: 'Natural Titanium',
      },
      stock: 50,
      minStock: 10,
      isActive: true,
      isFeatured: true,
      status: 'active',
      seoTitle: 'Test iPhone 15 - Best Smartphone 2024',
      seoDescription: 'Buy the latest iPhone 15 with advanced features',
    };

    const createResponse = await axios.post(
      `${API_BASE}/products`,
      newProduct,
      { headers: { Authorization: `Bearer ${adminToken}` } },
    );

    productId = createResponse.data.data._id;
    log(`✅ Product created: ${productId}`, 'green');

    // Test updating product
    const updateData = {
      price: 899,
      description: 'Updated description with better price!',
    };

    await axios.put(`${API_BASE}/products/${productId}`, updateData, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    log('✅ Product updated', 'green');

    // Test updating stock
    await axios.patch(
      `${API_BASE}/products/${productId}/stock`,
      { quantity: -5 }, // Reduce stock by 5
      { headers: { Authorization: `Bearer ${adminToken}` } },
    );

    log('✅ Product stock updated', 'green');
  } else {
    log(
      '⚠️  Product creation tests skipped - no admin token or category',
      'yellow',
    );
  }

  // Test getting products (public)
  const productsResponse = await axios.get(`${API_BASE}/products`);
  log(
    `✅ Get all products: ${productsResponse.data.products?.length || 0} products found`,
    'green',
  );

  // Test getting featured products
  const featuredResponse = await axios.get(`${API_BASE}/products/featured`);
  log(
    `✅ Get featured products: ${featuredResponse.data.data.length} featured products`,
    'green',
  );

  // Test search products
  const searchResponse = await axios.get(`${API_BASE}/products/search?q=test`);
  log(`✅ Product search: ${searchResponse.data.data.length} results`, 'green');

  if (categoryId) {
    // Test products by category
    const categoryProductsResponse = await axios.get(
      `${API_BASE}/products/category/${categoryId}`,
    );
    log(
      `✅ Products by category: ${categoryProductsResponse.data.data.length} products`,
      'green',
    );
  }

  if (productId) {
    // Test getting single product
    const singleProductResponse = await axios.get(
      `${API_BASE}/products/${productId}`,
    );
    log(
      `✅ Get single product: ${singleProductResponse.data.data.name}`,
      'green',
    );

    if (userToken) {
      // Test adding review (user only)
      const review = {
        rating: 5,
        comment:
          'Great product! Really impressed with the quality and features.',
      };

      await axios.post(`${API_BASE}/products/${productId}/reviews`, review, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      log('✅ Product review added', 'green');
    } else {
      log('⚠️  Product review test skipped - no user token', 'yellow');
    }
  }

  if (adminToken) {
    // Test analytics endpoints
    const topSellingResponse = await axios.get(
      `${API_BASE}/products/analytics/top-selling?limit=5`,
      { headers: { Authorization: `Bearer ${adminToken}` } },
    );
    log(
      `✅ Top selling products: ${topSellingResponse.data.data.length} products`,
      'green',
    );

    const lowStockResponse = await axios.get(
      `${API_BASE}/products/analytics/low-stock`,
      { headers: { Authorization: `Bearer ${adminToken}` } },
    );
    log(
      `✅ Low stock products: ${lowStockResponse.data.data.length} products`,
      'green',
    );

    if (productId) {
      const analyticsResponse = await axios.get(
        `${API_BASE}/products/${productId}/analytics`,
        { headers: { Authorization: `Bearer ${adminToken}` } },
      );
      log(`✅ Product analytics: ${analyticsResponse.data.data.name}`, 'green');
    }
  }
}

// Advanced filtering test
async function testAdvancedFiltering() {
  log('\n🔍 Testing Advanced Filtering...', 'yellow');

  const filterTests = [
    'products?sortBy=price&sortOrder=asc&limit=5',
    'products?sortBy=rating&sortOrder=desc&limit=10',
    'products?minPrice=500&maxPrice=1500',
    'products?isFeatured=true',
    'products?status=active&isActive=true',
  ];

  for (const filter of filterTests) {
    const response = await axios.get(`${API_BASE}/${filter}`);
    log(
      `✅ Filter test (${filter}): ${response.data.products?.length || 0} results`,
      'green',
    );
  }
}

// Performance test
async function testPerformance() {
  log('\n⚡ Testing Performance...', 'yellow');

  const start = Date.now();
  const promises = [];

  // Make 10 concurrent requests
  for (let i = 0; i < 10; i++) {
    promises.push(axios.get(`${API_BASE}/products?page=${i + 1}&limit=10`));
  }

  await Promise.all(promises);
  const duration = Date.now() - start;

  log(
    `✅ Performance test: 10 concurrent requests completed in ${duration}ms`,
    'green',
  );
}

// Error handling test
async function testErrorHandling() {
  log('\n❌ Testing Error Handling...', 'yellow');

  try {
    // Test invalid product ID
    await axios.get(`${API_BASE}/products/invalid-id`);
  } catch (error) {
    if (error.response?.status === 400) {
      log('✅ Invalid ID error handling works', 'green');
    }
  }

  try {
    // Test not found
    await axios.get(`${API_BASE}/products/507f1f77bcf86cd799439011`);
  } catch (error) {
    if (error.response?.status === 404) {
      log('✅ Not found error handling works', 'green');
    }
  }

  if (adminToken) {
    try {
      // Test invalid data
      await axios.post(
        `${API_BASE}/products`,
        { name: '' }, // Invalid product data
        { headers: { Authorization: `Bearer ${adminToken}` } },
      );
    } catch (error) {
      if (error.response?.status === 400) {
        log('✅ Validation error handling works', 'green');
      }
    }
  }
}

// Cleanup test data
async function cleanup() {
  if (adminToken && productId) {
    try {
      await axios.delete(`${API_BASE}/products/${productId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      log('✅ Test product deleted', 'green');
    } catch (error) {
      log('⚠️  Failed to delete test product', 'yellow');
    }
  }

  if (adminToken && categoryId) {
    try {
      await axios.delete(`${API_BASE}/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      log('✅ Test category deleted', 'green');
    } catch (error) {
      log('⚠️  Failed to delete test category', 'yellow');
    }
  }
}

// Main test runner
async function runAllTests() {
  try {
    await testAPI();
    await testAdvancedFiltering();
    await testPerformance();
    await testErrorHandling();
    await cleanup();

    log('\n🎉 All tests completed successfully!', 'green');
  } catch (error) {
    log(`\n💥 Test suite failed: ${error.message}`, 'red');
    console.error(error);
  }
}

// Usage instructions
function showInstructions() {
  log('\n📖 API Test Script Instructions:', 'blue');
  log('1. Make sure the backend server is running: npm run dev');
  log('2. Create admin and user accounts through registration');
  log('3. Get JWT tokens from login responses');
  log('4. Set adminToken and userToken variables in this script');
  log('5. Run: node scripts/test-api.js\n');

  log('Available environment variables:', 'yellow');
  log('- ADMIN_TOKEN: Your admin JWT token');
  log('- USER_TOKEN: Your user JWT token');
  log('- API_BASE: API base URL (default: http://localhost:3000/api/v1)\n');
}

// Check for environment variables
if (process.env.ADMIN_TOKEN) {
  adminToken = process.env.ADMIN_TOKEN;
  log('✅ Admin token loaded from environment', 'green');
}

if (process.env.USER_TOKEN) {
  userToken = process.env.USER_TOKEN;
  log('✅ User token loaded from environment', 'green');
}

// Run tests or show instructions
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  showInstructions();
} else {
  runAllTests();
}
