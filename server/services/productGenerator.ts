import { type InsertProduct } from "@shared/schema";
import { storage } from "../storage";

const CATEGORIES = [
  "Electronics", "Fashion", "Home & Kitchen", "Books", "Sports & Fitness", 
  "Beauty & Personal Care", "Automotive", "Health & Wellness", "Toys & Games", 
  "Office Supplies", "Garden & Outdoor", "Pet Supplies"
];

const BRANDS = [
  "Apple", "Samsung", "Nike", "Adidas", "Sony", "LG", "Dell", "HP", "Canon", 
  "Nikon", "Puma", "Under Armour", "Zara", "H&M", "IKEA", "Philips", "Xiaomi", 
  "OnePlus", "Realme", "Boat", "JBL", "Bose", "Amazon Basics", "Lenovo", "Asus"
];

const PRODUCT_NAMES = {
  "Electronics": [
    "Wireless Earbuds Pro", "Smart Watch Series", "Gaming Laptop", "4K Smart TV", 
    "Bluetooth Speaker", "Digital Camera", "Smartphone", "Tablet", "Power Bank", 
    "Wireless Charger", "Smart Home Hub", "Fitness Tracker", "Gaming Mouse", 
    "Mechanical Keyboard", "Monitor", "Router", "Webcam", "Drone", "Action Camera"
  ],
  "Fashion": [
    "Designer Backpack", "Casual T-Shirt", "Denim Jeans", "Running Shoes", 
    "Leather Wallet", "Sunglasses", "Wrist Watch", "Handbag", "Sneakers", 
    "Formal Shirt", "Winter Jacket", "Summer Dress", "Belt", "Scarf", "Cap"
  ],
  "Home & Kitchen": [
    "Coffee Maker", "Air Fryer", "Vacuum Cleaner", "Blender", "Microwave Oven", 
    "Toaster", "Rice Cooker", "Water Purifier", "Kitchen Scale", "Mixer Grinder", 
    "Pressure Cooker", "Food Processor", "Dishwasher", "Refrigerator", "Washing Machine"
  ],
  "Beauty & Personal Care": [
    "Face Cream", "Shampoo", "Body Lotion", "Moisturizer", "Sunscreen", 
    "Hair Oil", "Face Wash", "Lip Balm", "Perfume", "Serum", "Mask", "Soap"
  ],
  "Sports & Fitness": [
    "Yoga Mat", "Dumbbells", "Treadmill", "Exercise Bike", "Protein Powder", 
    "Gym Bag", "Water Bottle", "Resistance Bands", "Foam Roller", "Sports Shoes"
  ]
};

const LOCATIONS = ["mumbai", "delhi", "bangalore", "chennai", "kolkata", "pune", "hyderabad", "ahmedabad"];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomPrice(): string {
  const prices = [299, 499, 799, 999, 1299, 1599, 1999, 2499, 2999, 3999, 4999, 5999, 7999, 9999, 12999, 15999, 19999, 24999, 29999, 39999, 49999, 59999, 79999, 99999, 999999];
  return getRandomElement(prices).toString();
}

function generateCompetitorPrices(basePrice: number) {
  const variation = 0.2; // 20% variation
  const amazonPrice = basePrice * (0.9 + Math.random() * variation);
  const flipkartPrice = basePrice * (0.9 + Math.random() * variation);
  const myntraPrice = basePrice * (0.95 + Math.random() * variation);
  
  return {
    amazon: Math.round(amazonPrice),
    flipkart: Math.round(flipkartPrice),
    myntra: Math.round(myntraPrice)
  };
}

function generateLocationData() {
  const data: Record<string, number> = {};
  LOCATIONS.forEach(location => {
    data[location] = Math.floor(Math.random() * 500 + 10);
  });
  return data;
}

function generateRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export async function generateSampleProducts(count: number = 10000): Promise<void> {
  console.log(`Generating ${count} sample products...`);
  
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 2); // 2 years ago
  const endDate = new Date();

  for (let i = 0; i < count; i++) {
    const category = getRandomElement(CATEGORIES);
    const brand = getRandomElement(BRANDS);
    const productNames = PRODUCT_NAMES[category as keyof typeof PRODUCT_NAMES] || PRODUCT_NAMES["Electronics"];
    const name = getRandomElement(productNames);
    const price = generateRandomPrice();
    const basePrice = parseFloat(price);
    
    const product: InsertProduct = {
      name: `${brand} ${name}`,
      category,
      brand,
      description: `Premium ${name.toLowerCase()} from ${brand} with advanced features and excellent build quality.`,
      price,
      competitorPrices: generateCompetitorPrices(basePrice),
      rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
      reviewCount: Math.floor(Math.random() * 10000 + 10),
      salesVolume: Math.floor(Math.random() * 1000 + 5),
      profitMargin: (Math.random() * 60 + 10).toFixed(2), // 10% to 70%
      stockLevel: Math.floor(Math.random() * 500 + 10),
      locationData: generateLocationData(),
      launchDate: generateRandomDate(startDate, endDate),
      trending: Math.random() < 0.15, // 15% chance of being trending
    };

    await storage.createProduct(product);
    
    if (i % 1000 === 0) {
      console.log(`Generated ${i + 1} products...`);
    }
  }
  
  console.log(`Successfully generated ${count} sample products!`);
}

export async function generateSampleAnalytics(): Promise<void> {
  console.log("Generating sample analytics data...");
  
  const products = await storage.getProducts(1000); // Get first 1000 products
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6); // 6 months ago
  
  for (const product of products) {
    // Generate analytics for last 6 months
    for (let month = 0; month < 6; month++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + month);
      
      const sales = Math.floor(Math.random() * product.salesVolume + 1);
      const revenue = sales * parseFloat(product.price);
      
      await storage.createAnalytics({
        productId: product.id,
        date,
        sales,
        revenue: revenue.toString(),
        views: Math.floor(sales * (Math.random() * 50 + 10)), // 10-60x sales
        conversions: sales,
        location: getRandomElement(LOCATIONS)
      });
    }
  }
  
  console.log("Sample analytics data generated!");
}
