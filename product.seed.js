// products-seed.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    seedProducts();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

// Import the Product model
const Product = require("./src/models/product.model");

const products = [
  // Food and Groceries
  {
    name: "Lamb Ribs",
    description:
      "Premium quality lamb ribs, perfect for grilling or slow cooking. Sourced from grass-fed lambs.",
    price: 12.99,
    compareAtPrice: 15.99,
    category: "food and groceries",
    subcategory: "meat",
    inventory: 50,
    images: [
      {
        url: "/ribs.svg",
        alt: "Lamb Ribs",
      },
    ],
    attributes: [
      {
        name: "Weight",
        value: "500g",
      },
      {
        name: "Origin",
        value: "Kenya",
      },
    ],
    featured: true,
    isNew: true,
  },
  {
    name: "Stock Fish",
    description:
      "Traditional dried cod fish, rich in protein and flavor. Perfect for soups and stews.",
    price: 9.99,
    category: "food and groceries",
    subcategory: "seafood",
    inventory: 30,
    images: [
      {
        url: "/stock.svg",
        alt: "Stock Fish",
      },
    ],
    attributes: [
      {
        name: "Weight",
        value: "250g",
      },
      {
        name: "Origin",
        value: "Nigeria",
      },
    ],
  },
  {
    name: "Indomie Noodles",
    description:
      "Quick and easy instant noodles with authentic African flavors.",
    price: 0.99,
    compareAtPrice: 1.29,
    category: "food and groceries",
    subcategory: "pasta",
    inventory: 200,
    images: [
      {
        url: "/noodles.svg",
        alt: "Indomie Noodles",
      },
    ],
    attributes: [
      {
        name: "Weight",
        value: "70g",
      },
      {
        name: "Flavor",
        value: "Chicken",
      },
    ],
    featured: true,
  },

  // Beverages
  {
    name: "Lacasera",
    description:
      "Refreshing apple-flavored carbonated soft drink, popular across Africa.",
    price: 1.49,
    category: "beverages",
    subcategory: "soft drinks",
    inventory: 100,
    images: [
      {
        url: "/lacasera.svg",
        alt: "Lacasera Drink",
      },
    ],
    attributes: [
      {
        name: "Volume",
        value: "500ml",
      },
      {
        name: "Origin",
        value: "Nigeria",
      },
    ],
  },
  {
    name: "Bigi Apple",
    description: "Sweet and refreshing apple-flavored soft drink.",
    price: 1.29,
    category: "beverages",
    subcategory: "soft drinks",
    inventory: 120,
    images: [
      {
        url: "/bigi.svg",
        alt: "Bigi Apple Drink",
      },
    ],
    attributes: [
      {
        name: "Volume",
        value: "500ml",
      },
      {
        name: "Origin",
        value: "Nigeria",
      },
    ],
  },
  {
    name: "Freshyo",
    description:
      "Refreshing and nutritious yoghurt drink with a perfect balance of sweetness.",
    price: 1.99,
    category: "beverages",
    subcategory: "dairy drinks",
    inventory: 90,
    images: [
      {
        url: "/freshyo.svg",
        alt: "Freshyo Yoghurt Drink",
      },
    ],
    attributes: [
      {
        name: "Volume",
        value: "500ml",
      },
      {
        name: "Flavor",
        value: "Strawberry",
      },
    ],
  },
  {
    name: "Hollandia Yoghurt",
    description:
      "Creamy and nutritious yoghurt drink, perfect for breakfast or as a refreshing snack.",
    price: 2.49,
    compareAtPrice: 2.99,
    category: "beverages",
    subcategory: "dairy drinks",
    inventory: 80,
    images: [
      {
        url: "/Hollandia.svg",
        alt: "Hollandia Yoghurt",
      },
    ],
    attributes: [
      {
        name: "Volume",
        value: "1 liter",
      },
      {
        name: "Flavor",
        value: "Plain",
      },
    ],
    featured: true,
  },

  // Fresh Produce
  {
    name: "Potatoes",
    description:
      "Fresh, high-quality potatoes perfect for boiling, mashing, or frying.",
    price: 2.99,
    category: "fresh produce",
    subcategory: "vegetables",
    inventory: 80,
    images: [
      {
        url: "/potatoes.svg",
        alt: "Fresh Potatoes",
      },
    ],
    attributes: [
      {
        name: "Weight",
        value: "1kg",
      },
      {
        name: "Origin",
        value: "Kenya",
      },
    ],
  },
  {
    name: "Plantains",
    description:
      "Fresh, ripe plantains perfect for frying, boiling, or grilling.",
    price: 3.49,
    category: "fresh produce",
    subcategory: "fruits",
    inventory: 65,
    images: [
      {
        url: "https://images.unsplash.com/photo-1603052875302-d376b7c0638a?q=80&w=600",
        alt: "Plantains",
      },
    ],
    attributes: [
      {
        name: "Weight",
        value: "1kg (approx. 3 plantains)",
      },
      {
        name: "Origin",
        value: "Ghana",
      },
    ],
  },

  // Seasoning & Spices
  {
    name: "Royco Cubes",
    description:
      "Flavor-enhancing bouillon cubes for soups, stews, and rice dishes.",
    price: 3.49,
    category: "seasoning & spices",
    subcategory: "bouillon",
    inventory: 150,
    images: [
      {
        url: "/royco.png",
        alt: "Royco Cubes",
      },
    ],
    attributes: [
      {
        name: "Weight",
        value: "100g",
      },
      {
        name: "Flavor",
        value: "Chicken",
      },
    ],
  },
  {
    name: "Egusi Seeds",
    description:
      "Ground melon seeds, essential for making traditional Egusi soup.",
    price: 5.49,
    category: "seasoning & spices",
    subcategory: "soup ingredients",
    inventory: 70,
    images: [
      {
        url: "/egusi.png",
        alt: "Egusi Seeds",
      },
    ],
    attributes: [
      {
        name: "Weight",
        value: "200g",
      },
      {
        name: "Origin",
        value: "Nigeria",
      },
    ],
  },

  // Health
  {
    name: "Shea Butter",
    description:
      "100% pure and natural African shea butter for skin and hair care.",
    price: 7.99,
    category: "health",
    subcategory: "skin care",
    inventory: 40,
    images: [
      {
        url: "/shea.png",
        alt: "Shea Butter",
      },
    ],
    attributes: [
      {
        name: "Weight",
        value: "250g",
      },
      {
        name: "Origin",
        value: "Ghana",
      },
    ],
  },
  {
    name: "Moringa Powder",
    description:
      "Nutrient-rich superfood powder made from dried moringa leaves.",
    price: 9.99,
    category: "health",
    subcategory: "supplements",
    inventory: 35,
    images: [
      {
        url: "/moringa.png",
        alt: "Moringa Powder",
      },
    ],
    attributes: [
      {
        name: "Weight",
        value: "100g",
      },
      {
        name: "Origin",
        value: "Tanzania",
      },
    ],
    isNew: true,
  },

  // Household and Cleaning
  {
    name: "African Black Soap",
    description:
      "Traditional handmade soap known for its cleansing and healing properties.",
    price: 5.99,
    category: "household and cleaning",
    subcategory: "personal care",
    inventory: 70,
    images: [
      {
        url: "/blacksoap.png",
        alt: "African Black Soap",
      },
    ],
    attributes: [
      {
        name: "Weight",
        value: "150g",
      },
      {
        name: "Origin",
        value: "Ghana",
      },
    ],
  },

  // Additional Products
  {
    name: "Palm Oil",
    description:
      "Traditional red palm oil, essential for authentic African cooking.",
    price: 8.49,
    category: "food and groceries",
    subcategory: "cooking oils",
    inventory: 55,
    images: [
      {
        url: "/palmoil.png",
        alt: "Palm Oil",
      },
    ],
    attributes: [
      {
        name: "Volume",
        value: "1 liter",
      },
      {
        name: "Origin",
        value: "Nigeria",
      },
    ],
  },
  {
    name: "Viju Choco",
    description:
      "Rich and creamy chocolate drink, perfect for any time of the day.",
    price: 3.49,
    category: "beverages",
    subcategory: "chocolate drinks",
    inventory: 50,
    images: [
      {
        url: "/vijuchoco.svg",
        alt: "Viju Choco",
      },
    ],
    attributes: [
      {
        name: "Volume",
        value: "1 liter",
      },
      {
        name: "Ingredients",
        value: "Milk, Cocoa, Sugar",
      },
    ],
    isNew: true,
  },
  {
    name: "Viju Wheat",
    description:
      "Nutritious wheat-based cereal drink, perfect for breakfast or as a healthy snack.",
    price: 3.99,
    category: "beverages",
    subcategory: "cereal drinks",
    inventory: 75,
    images: [
      {
        url: "/vijuwheat.svg",
        alt: "Viju Wheat",
      },
    ],
    attributes: [
      {
        name: "Volume",
        value: "1 liter",
      },
      {
        name: "Ingredients",
        value: "Wheat, Milk, Sugar",
      },
    ],
    isNew: true,
  },

  {
    name: "Peak Milk",
    description:
      "Premium evaporated milk, perfect for tea, coffee, and cooking.",
    price: 2.99,
    category: "beverages",
    subcategory: "dairy drinks",
    inventory: 90,
    images: [
      {
        url: "/PEAK-MILK-POWDER 1.svg",
        alt: "Peak Milk",
      },
    ],
    attributes: [
      {
        name: "Volume",
        value: "410g",
      },
      {
        name: "Type",
        value: "Evaporated Milk",
      },
    ],
    featured: true,
  },
  {
    name: "Nutrimilk",
    description:
      "Premium powdered milk with added vitamins and minerals, perfect for children and adults.",
    price: 5.99,
    category: "beverages",
    subcategory: "dairy drinks",
    inventory: 85,
    images: [
      {
        url: "/nutrimilk.svg",
        alt: "Nutrimilk",
      },
    ],
    attributes: [
      {
        name: "Weight",
        value: "400g",
      },
      {
        name: "Type",
        value: "Powdered Milk",
      },
      {
        name: "Features",
        value: "Fortified with Vitamins A & D",
      },
    ],
    isNew: true,
  },
  {
    name: "Maltina",
    description:
      "A refreshing malt drink with natural ingredients, rich in vitamins and minerals.",
    price: 2.99,
    category: "beverages",
    subcategory: "malt drinks",
    inventory: 120,
    images: [
      {
        url: "/maltina.svg",
        alt: "Maltina",
      },
    ],
    attributes: [
      {
        name: "Volume",
        value: "330ml",
      },
      {
        name: "Type",
        value: "Malt Drink",
      },
      {
        name: "Features",
        value: "Non-alcoholic, Fortified with Vitamins",
      },
    ],
    featured: true,
  },
  {
    name: "Garri",
    description:
      "Cassava flour, a staple food in West Africa, perfect for making eba.",
    price: 4.49,
    category: "food and groceries",
    subcategory: "flours",
    inventory: 60,
    images: [
      {
        url: "/garri.png",
        alt: "Gari",
      },
    ],
    attributes: [
      {
        name: "Weight",
        value: "500g",
      },
      {
        name: "Origin",
        value: "Ghana",
      },
    ],
  },
];

async function seedProducts() {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert new products
    const result = await Product.insertMany(products);
    console.log(`Successfully added ${result.length} products to the database`);

    mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding products:", error);
    mongoose.disconnect();
  }
}
