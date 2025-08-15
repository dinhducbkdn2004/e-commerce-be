const axios = require('axios');

const API_BASE = 'http://localhost:3000/api/v1';

// Sample data
const sampleCategories = [
  {
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    isActive: true,
    sortOrder: 1,
  },
  {
    name: 'Fashion',
    description: 'Clothing, shoes, and accessories',
    isActive: true,
    sortOrder: 2,
  },
];

const sampleProducts = [
  {
    name: 'iPhone 15 Pro',
    description:
      'The latest iPhone with A17 Pro chip, titanium design, and advanced camera system.',
    shortDescription: 'Latest iPhone with A17 Pro chip',
    price: 29990000,
    originalPrice: 34990000,
    brand: 'Apple',
    sku: 'IPHONE15PRO-128-TITAN',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-natural-titanium-select.jpg',
    ],
    thumbnail:
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-natural-titanium-select.jpg',
    tags: ['smartphone', 'apple', 'ios', 'titanium'],
    specifications: {
      'Màn hình': '6.1 inches',
      Chip: 'A17 Pro',
      'Bộ nhớ': '128GB',
    },
    stock: 50,
    minStock: 10,
    isActive: true,
    isFeatured: true,
    status: 'active',
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android smartphone with S Pen and AI features.',
    shortDescription: 'Premium Galaxy with S Pen',
    price: 31990000,
    originalPrice: 36990000,
    brand: 'Samsung',
    sku: 'GALAXYS24ULTRA-256-BLACK',
    images: [
      'https://images.samsung.com/is/image/samsung/p6pim/vn/2401/gallery/vn-galaxy-s24-ultra-s928-sm-s928bztqxxv-thumb-539573050.jpg',
    ],
    thumbnail:
      'https://images.samsung.com/is/image/samsung/p6pim/vn/2401/gallery/vn-galaxy-s24-ultra-s928-sm-s928bztqxxv-thumb-539573050.jpg',
    tags: ['smartphone', 'samsung', 'android', 'spen'],
    specifications: {
      'Màn hình': '6.8 inches',
      Chip: 'Snapdragon 8 Gen 3',
      'Bộ nhớ': '256GB',
    },
    stock: 30,
    minStock: 5,
    isActive: true,
    isFeatured: true,
    status: 'active',
  },
  {
    name: 'Áo thun Nam Premium',
    description:
      'Áo thun nam chất liệu cotton cao cấp, form regular fit thoải mái.',
    shortDescription: 'Áo thun nam cotton cao cấp',
    price: 299000,
    originalPrice: 399000,
    brand: 'Local Brand',
    sku: 'TSHIRT-COTTON-M-WHITE',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    ],
    thumbnail:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    tags: ['áo thun', 'nam', 'cotton'],
    specifications: {
      'Chất liệu': '100% Cotton',
      Form: 'Regular fit',
      Size: 'S, M, L, XL',
    },
    stock: 100,
    minStock: 20,
    isActive: true,
    isFeatured: false,
    status: 'active',
  },
];

async function createData() {
  console.log('Starting data creation...');

  try {
    // Create categories first
    console.log('Creating categories...');
    const createdCategories = [];

    for (const category of sampleCategories) {
      try {
        const response = await axios.post(`${API_BASE}/categories`, category);
        console.log(`✅ Created category: ${category.name}`);
        createdCategories.push(response.data.data);
      } catch (error) {
        console.log(`⚠️ Category ${category.name} might already exist`);
        // Try to get existing category
        try {
          const existing = await axios.get(`${API_BASE}/categories`);
          const found = existing.data.categories?.find(
            (c) => c.name === category.name,
          );
          if (found) createdCategories.push(found);
        } catch (e) {
          console.log('Could not fetch existing categories');
        }
      }
    }

    console.log(`Created ${createdCategories.length} categories`);

    // Create products
    console.log('Creating products...');
    let productCount = 0;

    for (const product of sampleProducts) {
      try {
        // Find appropriate category
        let categoryId = null;
        if (
          product.tags.includes('smartphone') ||
          product.tags.includes('apple') ||
          product.tags.includes('samsung')
        ) {
          const electronics = createdCategories.find(
            (c) => c.name === 'Electronics',
          );
          categoryId = electronics?._id;
        } else {
          const fashion = createdCategories.find((c) => c.name === 'Fashion');
          categoryId = fashion?._id;
        }

        if (categoryId) {
          const productData = { ...product, category: categoryId };
          const response = await axios.post(
            `${API_BASE}/products`,
            productData,
          );
          console.log(`✅ Created product: ${product.name}`);
          productCount++;
        } else {
          console.log(`⚠️ No category found for product: ${product.name}`);
        }
      } catch (error) {
        console.log(`❌ Failed to create product: ${product.name}`);
        console.log(`Error: ${error.response?.data?.message || error.message}`);
      }
    }

    console.log(`\n🎉 Data creation completed!`);
    console.log(`📊 Created ${productCount} products`);
  } catch (error) {
    console.error('❌ Error during data creation:', error.message);
  }
}

createData();
