import random
from datetime import datetime, timedelta
from decimal import Decimal
from sqlalchemy.orm import Session
from . import crud, schemas

CATEGORIES = [
    "Electronics", "Fashion", "Home & Kitchen", "Books", "Sports & Fitness",
    "Beauty & Personal Care", "Automotive", "Health & Wellness", "Toys & Games",
    "Office Supplies", "Garden & Outdoor", "Pet Supplies"
]

BRANDS = [
    "Apple", "Samsung", "Nike", "Adidas", "Sony", "LG", "Dell", "HP", "Canon",
    "Nikon", "Puma", "Under Armour", "Zara", "H&M", "IKEA", "Philips", "Xiaomi",
    "OnePlus", "Realme", "Boat", "JBL", "Bose", "Amazon Basics", "Lenovo", "Asus"
]

PRODUCT_NAMES = {
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
}

LOCATIONS = ["mumbai", "delhi", "bangalore", "chennai", "kolkata", "pune", "hyderabad", "ahmedabad"]

def get_random_element(array):
    return random.choice(array)

def generate_random_price():
    prices = [299, 499, 799, 999, 1299, 1599, 1999, 2499, 2999, 3999, 4999, 5999, 7999, 9999, 12999, 15999, 19999, 24999, 29999, 39999, 49999, 59999, 79999, 99999, 999999]
    return Decimal(get_random_element(prices))

def generate_competitor_prices(base_price):
    variation = 0.2
    amazon_price = base_price * Decimal(0.9 + random.random() * variation)
    flipkart_price = base_price * Decimal(0.9 + random.random() * variation)
    myntra_price = base_price * Decimal(0.95 + random.random() * variation)
    return {
        "amazon": round(amazon_price, 2),
        "flipkart": round(flipkart_price, 2),
        "myntra": round(myntra_price, 2)
    }

def generate_location_data():
    data = {}
    for location in LOCATIONS:
        data[location] = random.randint(10, 500)
    return data

def generate_random_date(start, end):
    return start + timedelta(seconds=random.randint(0, int((end - start).total_seconds())))

def generate_sample_products(db: Session, count: int = 1000):
    print(f"Generating {count} sample products...")
    start_date = datetime.now() - timedelta(days=2*365)
    end_date = datetime.now()

    for i in range(count):
        category = get_random_element(CATEGORIES)
        brand = get_random_element(BRANDS)
        product_names = PRODUCT_NAMES.get(category, PRODUCT_NAMES["Electronics"])
        name = get_random_element(product_names)
        price = generate_random_price()

        product_data = schemas.ProductCreate(
            name=f"{brand} {name}",
            category=category,
            brand=brand,
            description=f"Premium {name.lower()} from {brand} with advanced features and excellent build quality.",
            price=price,
            competitorPrices=generate_competitor_prices(price),
            rating=Decimal(f"{random.uniform(3.0, 5.0):.1f}"),
            reviewCount=random.randint(10, 10000),
            salesVolume=random.randint(5, 1000),
            profitMargin=Decimal(f"{random.uniform(10.0, 70.0):.2f}"),
            stockLevel=random.randint(10, 500),
            locationData=generate_location_data(),
            launchDate=generate_random_date(start_date, end_date),
            trending=random.random() < 0.15,
        )
        crud.create_product(db, product_data)
        if (i + 1) % 100 == 0:
            print(f"Generated {i + 1} products...")
    print(f"Successfully generated {count} sample products!")

def generate_sample_analytics(db: Session):
    print("Generating sample analytics data...")
    products = crud.get_products(db, limit=100) # Get first 100 products
    start_date = datetime.now() - timedelta(days=6*30)

    for product in products:
        for month in range(6):
            date = start_date + timedelta(days=month*30)
            sales = random.randint(1, product.salesVolume)
            revenue = Decimal(sales) * product.price

            analytics_data = schemas.AnalyticsCreate(
                productId=product.id,
                date=date,
                sales=sales,
                revenue=revenue,
                views=sales * random.randint(10, 60),
                conversions=sales,
                location=get_random_element(LOCATIONS)
            )
            crud.create_analytics(db, analytics_data)
    print("Sample analytics data generated!")


# AI Services (mocked as in original)
def generate_chart_insight(chart_type: str, data: any) -> str:
    insights = {
        "sales": [
            "Revenue shows strong upward trend with 23% growth this quarter. Consider increasing inventory for top-performing products to capitalize on demand.",
            "Sales momentum indicates seasonal peak approaching. Optimize supply chain and marketing spend for maximum ROI.",
            "Strong performance in key categories suggests successful pricing strategy. Continue monitoring competitor pricing for opportunities."
        ],
        "category": [
            "Electronics and Fashion categories drive 65% of total revenue. Focus marketing efforts on these high-performing segments.",
            "Home & Kitchen showing emerging growth potential with 18% increase. Consider expanding product range in this category.",
            "Beauty & Personal Care has highest profit margins at 42%. Increase promotion and inventory allocation for optimal returns."
        ],
        "geographic": [
            "Mumbai and Delhi markets account for 45% of sales. Strong opportunity for regional expansion in Bangalore and Chennai.",
            "North India regions show 35% higher conversion rates. Tailor marketing campaigns to regional preferences for better results.",
            "Tier-2 cities demonstrate untapped potential with lower competition. Strategic expansion could yield significant market share."
        ],
        "profit": [
            "Profit margins are optimized across premium product lines. Focus on volume growth while maintaining pricing power.",
            "Mid-range products show opportunity for margin improvement through better supplier negotiations.",
            "High-margin accessories complement core products well. Cross-selling strategies can boost overall profitability."
        ]
    }
    chart_insights = insights.get(chart_type, insights["sales"])
    return random.choice(chart_insights)

def generate_dashboard_recommendations(user_location: str, products_data: list, analytics_data: list) -> dict:
    location_insights = {
        "mumbai": {
            "summary": "Your Mumbai market shows strong performance with premium product focus. Electronics and fashion lead with 67% of revenue, indicating sophisticated consumer base.",
            "recommendations": [
                "Expand premium electronics inventory by 25% - Mumbai consumers show high willingness to pay for quality",
                "Launch targeted campaigns for fashion accessories - 40% higher conversion rate in your region",
                "Consider same-day delivery for Mumbai metropolitan area to boost competitiveness"
            ],
            "trends": [
                "Premium smartphone accessories trending up 45% in Mumbai market",
                "Sustainable fashion gaining momentum with 32% growth in eco-friendly products",
                "Home workout equipment seeing sustained demand post-pandemic"
            ],
            "opportunities": [
                "Partner with local fashion designers for exclusive Mumbai collections",
                "Tap into Bollywood merchandise market - high demand during festival seasons",
                "Expand to Navi Mumbai and Thane suburbs with dedicated last-mile delivery"
            ]
        },
        "delhi": {
            "summary": "Delhi market demonstrates strong seasonal patterns with high-value purchases during festivals. Winter apparel and gifting categories show exceptional performance.",
            "recommendations": [
                "Stock up winter apparel 3 months ahead - Delhi shows 60% higher seasonal demand",
                "Focus on gifting categories during Diwali and wedding seasons",
                "Optimize logistics for NCR region - significant opportunity in Gurgaon and Noida"
            ],
            "trends": [
                "Wedding season products showing 55% growth in Delhi NCR region",
                "Air purifiers and health products trending due to pollution concerns",
                "Traditional wear with modern twist gaining popularity among millennials"
            ],
            "opportunities": [
                "Launch Delhi-specific product bundles for wedding and festival seasons",
                "Partner with wedding planners and event companies for B2B sales",
                "Create pollution-focused product category for health-conscious consumers"
            ]
        }
    }
    default_insight = {
        "summary": f"Your {user_location} market shows promising growth potential with diverse product portfolio performing well across multiple categories.",
        "recommendations": [
            "Optimize inventory for top-performing products in your region",
            "Implement competitive pricing strategy based on local market conditions",
            "Enhance customer experience with region-specific promotions and offers"
        ],
        "trends": [
            "Mobile-first shopping increasing across all age groups in India",
            "Vernacular content and regional preferences driving purchase decisions",
            "Quick commerce and fast delivery becoming key differentiators"
        ],
        "opportunities": [
            "Expand into adjacent product categories with similar customer base",
            "Leverage social commerce and influencer partnerships",
            "Implement loyalty programs to increase customer lifetime value"
        ]
    }
    return location_insights.get(user_location.lower(), default_insight)

def chatbot_response(user_message: str, user_context: dict) -> dict:
    message = user_message.lower()

    if 'trending' in message or 'trend' in message:
        return {
            "message": "Based on current market analysis, wireless earbuds, smart watches, and eco-friendly products are trending strongly. Gaming accessories and home fitness equipment also show consistent growth. Would you like specific data on any category?",
            "suggestions": ["Show me gaming product trends", "What's trending in electronics?", "Best profit margin products?"]
        }
    if 'profit' in message or 'margin' in message:
        return {
            "message": "Your highest profit margins are in Beauty & Personal Care (42%), Premium Electronics (38%), and Home Accessories (35%). Focus on these categories for optimal returns. Consider bundling strategies to increase average order value.",
            "suggestions": ["How to improve margins?", "Best selling high-profit products?", "Pricing optimization tips?"]
        }
    if 'sales' in message or 'improve' in message or 'increase' in message:
        return {
            "message": "To boost sales: 1) Optimize your top 10 products for better visibility, 2) Run targeted promotions during peak hours (7-9 PM), 3) Improve product images and descriptions, 4) Implement cross-selling for complementary items. Your conversion rate can improve by 15-25% with these changes.",
            "suggestions": ["What are my peak sales hours?", "How to increase conversion rate?", "Best promotion strategies?"]
        }
    if 'hello' in message or 'hi' in message or 'help' in message:
        return {
            "message": "Hello! I'm your AI e-commerce assistant. I can help you with product trends, profit optimization, sales strategies, competitor analysis, and market opportunities. What specific area would you like to explore?",
            "suggestions": ["What's trending now?", "How to improve profits?", "Show me competitor analysis"]
        }

    return {
        "message": "I can help you analyze market trends, optimize pricing, improve sales performance, and identify growth opportunities. Which aspect of your e-commerce business would you like to focus on today?",
        "suggestions": ["Product trends analysis", "Pricing optimization", "Sales improvement tips", "Market opportunities"]
    }