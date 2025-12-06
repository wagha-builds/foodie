import {
  type User,
  type InsertUser,
  type Restaurant,
  type InsertRestaurant,
  type Dish,
  type InsertDish,
  type MenuCategory,
  type InsertMenuCategory,
  type Order,
  type InsertOrder,
  type Address,
  type InsertAddress,
  type CartItem,
  type InsertCartItem,
  type DeliveryPartner,
  type InsertDeliveryPartner,
  type Coupon,
  type InsertCoupon,
  type DishReview,
  type InsertDishReview,
} from "../shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByFirebaseUid(uid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;

  // Restaurants
  getRestaurants(): Promise<Restaurant[]>;
  getRestaurant(id: string): Promise<Restaurant | undefined>;
  getRestaurantByOwner(ownerId: string): Promise<Restaurant | undefined>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  updateRestaurant(id: string, data: Partial<Restaurant>): Promise<Restaurant | undefined>;

  // Menu Categories
  getMenuCategories(restaurantId: string): Promise<MenuCategory[]>;
  createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory>;

  // Dishes
  getDishes(restaurantId: string): Promise<Dish[]>;
  getDish(id: string): Promise<Dish | undefined>;
  createDish(dish: InsertDish): Promise<Dish>;
  updateDish(id: string, data: Partial<Dish>): Promise<Dish | undefined>;

  // Orders
  getOrders(userId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByRestaurant(restaurantId: string): Promise<Order[]>;
  getAvailableOrdersForDelivery(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, data: Partial<Order>): Promise<Order | undefined>;

  // Addresses
  getAddresses(userId: string): Promise<Address[]>;
  getAddress(id: string): Promise<Address | undefined>;
  createAddress(address: InsertAddress): Promise<Address>;
  deleteAddress(id: string): Promise<void>;

  // Delivery Partners
  getDeliveryPartner(userId: string): Promise<DeliveryPartner | undefined>;
  createDeliveryPartner(partner: InsertDeliveryPartner): Promise<DeliveryPartner>;
  updateDeliveryPartner(userId: string, data: Partial<DeliveryPartner>): Promise<DeliveryPartner | undefined>;

  // Coupons
  getCoupon(code: string): Promise<Coupon | undefined>;
  validateCoupon(code: string, orderAmount: number, restaurantId?: string): Promise<Coupon | null>;

  // Reviews
  createDishReview(review: InsertDishReview): Promise<DishReview>;
  getDishReviews(dishId: string): Promise<DishReview[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private restaurants: Map<string, Restaurant> = new Map();
  private menuCategories: Map<string, MenuCategory> = new Map();
  private dishes: Map<string, Dish> = new Map();
  private orders: Map<string, Order> = new Map();
  private addresses: Map<string, Address> = new Map();
  private deliveryPartners: Map<string, DeliveryPartner> = new Map();
  private coupons: Map<string, Coupon> = new Map();
  private dishReviews: Map<string, DishReview> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // === SEED RESTAURANTS ===
    const restaurants: Restaurant[] = [
      {
        id: "rest-1",
        ownerId: null,
        name: "Tandoori Nights",
        description: "Authentic North Indian cuisine with signature tandoor dishes",
        cuisines: ["North Indian", "Mughlai", "Biryani"],
        imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
        coverImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
        address: "123 Food Street, Koramangala, Bangalore",
        latitude: "12.9352",
        longitude: "77.6245",
        phone: "+91 9876543210",
        email: "tandoori@foodie.com",
        rating: "4.5",
        reviewCount: 324,
        priceRange: 2,
        deliveryTime: 35,
        deliveryFee: "0",
        minOrderAmount: "150",
        isVeg: false,
        isOpen: true,
        openingTime: "11:00",
        closingTime: "23:00",
        hasOffers: true,
        offerText: "50% OFF up to 100",
      },
      {
        id: "rest-2",
        ownerId: null,
        name: "Pizza Paradise",
        description: "Hand-tossed pizzas with fresh ingredients",
        cuisines: ["Italian", "Pizza", "Fast Food"],
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
        coverImageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1200&q=80",
        address: "45 Gourmet Lane, Indiranagar, Bangalore",
        latitude: "12.9716",
        longitude: "77.6412",
        phone: "+91 9876543211",
        email: "pizza@foodie.com",
        rating: "4.3",
        reviewCount: 512,
        priceRange: 3,
        deliveryTime: 30,
        deliveryFee: "30",
        minOrderAmount: "200",
        isVeg: false,
        isOpen: true,
        openingTime: "10:00",
        closingTime: "24:00",
        hasOffers: true,
        offerText: "Free delivery",
      },
      {
        id: "rest-3",
        ownerId: null,
        name: "Dragon Wok",
        description: "Authentic Chinese and Pan-Asian delights",
        cuisines: ["Chinese", "Thai", "Asian"],
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80",
        coverImageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80",
        address: "78 Spice Road, HSR Layout, Bangalore",
        latitude: "12.9121",
        longitude: "77.6446",
        phone: "+91 9876543212",
        email: "dragon@foodie.com",
        rating: "4.2",
        reviewCount: 289,
        priceRange: 2,
        deliveryTime: 40,
        deliveryFee: "20",
        minOrderAmount: "150",
        isVeg: false,
        isOpen: true,
        openingTime: "11:30",
        closingTime: "22:30",
        hasOffers: false,
        offerText: null,
      },
      {
        id: "rest-4",
        ownerId: null,
        name: "Green Bowl",
        description: "Healthy salads and nutritious bowls",
        cuisines: ["Healthy", "Salads", "Continental"],
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
        coverImageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80",
        address: "12 Health Avenue, Whitefield, Bangalore",
        latitude: "12.9698",
        longitude: "77.7499",
        phone: "+91 9876543213",
        email: "green@foodie.com",
        rating: "4.6",
        reviewCount: 178,
        priceRange: 3,
        deliveryTime: 25,
        deliveryFee: "0",
        minOrderAmount: "200",
        isVeg: true,
        isOpen: true,
        openingTime: "08:00",
        closingTime: "21:00",
        hasOffers: true,
        offerText: "20% OFF",
      },
      {
        id: "rest-5",
        ownerId: null,
        name: "Burger Barn",
        description: "Juicy burgers and crispy fries",
        cuisines: ["Burgers", "American", "Fast Food"],
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
        coverImageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&q=80",
        address: "56 Burger Street, Marathahalli, Bangalore",
        latitude: "12.9591",
        longitude: "77.6974",
        phone: "+91 9876543214",
        email: "burger@foodie.com",
        rating: "4.1",
        reviewCount: 445,
        priceRange: 2,
        deliveryTime: 20,
        deliveryFee: "15",
        minOrderAmount: "100",
        isVeg: false,
        isOpen: true,
        openingTime: "10:00",
        closingTime: "23:00",
        hasOffers: true,
        offerText: "Buy 1 Get 1 Free",
      },
      {
        id: "rest-6",
        ownerId: null,
        name: "Dosa Plaza",
        description: "Crispy dosas and authentic South Indian flavors",
        cuisines: ["South Indian", "Dosa", "Idli"],
        imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&q=80",
        coverImageUrl: "https://images.unsplash.com/photo-1589301760557-878121f88599?w=1200&q=80",
        address: "34 Temple Road, Jayanagar, Bangalore",
        latitude: "12.9299",
        longitude: "77.5933",
        phone: "+91 9876543215",
        email: "dosa@foodie.com",
        rating: "4.4",
        reviewCount: 623,
        priceRange: 1,
        deliveryTime: 25,
        deliveryFee: "0",
        minOrderAmount: "80",
        isVeg: true,
        isOpen: true,
        openingTime: "07:00",
        closingTime: "22:00",
        hasOffers: false,
        offerText: null,
      },
      {
        id: "rest-7",
        ownerId: null,
        name: "Royal Biryani House",
        description: "The finest Hyderabadi and Lucknowi Biryanis",
        cuisines: ["Biryani", "Mughlai", "North Indian"],
        imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80",
        coverImageUrl: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=1200&q=80",
        address: "88 Mosque Road, Frazer Town, Bangalore",
        latitude: "12.9969",
        longitude: "77.6135",
        phone: "+91 9876543216",
        email: "royalbiryani@foodie.com",
        rating: "4.7",
        reviewCount: 890,
        priceRange: 2,
        deliveryTime: 45,
        deliveryFee: "25",
        minOrderAmount: "250",
        isVeg: false,
        isOpen: true,
        openingTime: "11:00",
        closingTime: "23:30",
        hasOffers: true,
        offerText: "Flat 100 OFF",
      },
      {
        id: "rest-8",
        ownerId: null,
        name: "Sweet Cravings",
        description: "Desserts, Ice Creams and Shakes",
        cuisines: ["Desserts", "Ice Cream", "Beverages"],
        imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80",
        coverImageUrl: "https://images.unsplash.com/photo-1551024601-562963526310?w=1200&q=80",
        address: "21 Sugar Lane, MG Road, Bangalore",
        latitude: "12.9749",
        longitude: "77.6083",
        phone: "+91 9876543217",
        email: "sweets@foodie.com",
        rating: "4.8",
        reviewCount: 412,
        priceRange: 2,
        deliveryTime: 20,
        deliveryFee: "10",
        minOrderAmount: "100",
        isVeg: true,
        isOpen: true,
        openingTime: "10:00",
        closingTime: "00:00",
        hasOffers: true,
        offerText: "Free Choco Chip with Order > 200",
      }
    ];

    restaurants.forEach((r) => this.restaurants.set(r.id, r));

    // === SEED MENU CATEGORIES ===
    const categories: MenuCategory[] = [
      // Tandoori Nights
      { id: "cat-1", restaurantId: "rest-1", name: "Starters", description: "Appetizers", sortOrder: 1 },
      { id: "cat-2", restaurantId: "rest-1", name: "Main Course", description: "Curries", sortOrder: 2 },
      { id: "cat-3", restaurantId: "rest-1", name: "Breads", description: "Indian Breads", sortOrder: 3 },
      // Pizza Paradise
      { id: "cat-5", restaurantId: "rest-2", name: "Pizzas", description: "Hand-tossed", sortOrder: 1 },
      { id: "cat-6", restaurantId: "rest-2", name: "Sides", description: "Garlic Breads", sortOrder: 2 },
      // Dragon Wok
      { id: "cat-8", restaurantId: "rest-3", name: "Noodles & Rice", description: "Wok Specials", sortOrder: 1 },
      { id: "cat-9", restaurantId: "rest-3", name: "Starters", description: "Dimsums", sortOrder: 2 },
      // Green Bowl
      { id: "cat-10", restaurantId: "rest-4", name: "Salads", description: "Fresh Greens", sortOrder: 1 },
      { id: "cat-11", restaurantId: "rest-4", name: "Smoothies", description: "Healthy Drinks", sortOrder: 2 },
      // Burger Barn
      { id: "cat-12", restaurantId: "rest-5", name: "Burgers", description: "Juicy Patties", sortOrder: 1 },
      { id: "cat-13", restaurantId: "rest-5", name: "Sides", description: "Fries & More", sortOrder: 2 },
      // Dosa Plaza
      { id: "cat-14", restaurantId: "rest-6", name: "Dosas", description: "Crispy Crepes", sortOrder: 1 },
      { id: "cat-15", restaurantId: "rest-6", name: "Idlis", description: "Steamed Cakes", sortOrder: 2 },
      // Royal Biryani House
      { id: "cat-16", restaurantId: "rest-7", name: "Biryanis", description: "Dum Cooked", sortOrder: 1 },
      { id: "cat-17", restaurantId: "rest-7", name: "Kebabs", description: "Tandoor Starters", sortOrder: 2 },
      // Sweet Cravings
      { id: "cat-18", restaurantId: "rest-8", name: "Cakes", description: "Pastries", sortOrder: 1 },
      { id: "cat-19", restaurantId: "rest-8", name: "Ice Creams", description: "Scoops", sortOrder: 2 },
    ];

    categories.forEach((c) => this.menuCategories.set(c.id, c));

    // === SEED DISHES ===
    const dishes: Dish[] = [
      // Tandoori Nights
      { id: "d1", restaurantId: "rest-1", categoryId: "cat-1", name: "Paneer Tikka", description: "Grilled cottage cheese", imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80", price: "249", isVeg: true, isAvailable: true, rating: "4.5", reviewCount: 120, isBestseller: true, isNew: false, isChefSpecial: false, isHealthy: false, spiceLevel: 2, portionSize: "Regular", preparationTime: 20, customizations: null },
      { id: "d2", restaurantId: "rest-1", categoryId: "cat-2", name: "Butter Chicken", description: "Rich tomato gravy", imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80", price: "349", isVeg: false, isAvailable: true, rating: "4.8", reviewCount: 300, isBestseller: true, isNew: false, isChefSpecial: true, isHealthy: false, spiceLevel: 2, portionSize: "Regular", preparationTime: 25, customizations: null },
      
      // Pizza Paradise
      { id: "d3", restaurantId: "rest-2", categoryId: "cat-5", name: "Margherita", description: "Classic cheese pizza", imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80", price: "299", isVeg: true, isAvailable: true, rating: "4.4", reviewCount: 150, isBestseller: true, isNew: false, isChefSpecial: false, isHealthy: false, spiceLevel: 0, portionSize: "Medium", preparationTime: 20, customizations: null },
      { id: "d4", restaurantId: "rest-2", categoryId: "cat-5", name: "Pepperoni", description: "Spicy pepperoni", imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80", price: "399", isVeg: false, isAvailable: true, rating: "4.6", reviewCount: 200, isBestseller: true, isNew: false, isChefSpecial: false, isHealthy: false, spiceLevel: 2, portionSize: "Medium", preparationTime: 20, customizations: null },

      // Dragon Wok
      { id: "d5", restaurantId: "rest-3", categoryId: "cat-8", name: "Hakka Noodles", description: "Veg noodles", imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80", price: "199", isVeg: true, isAvailable: true, rating: "4.3", reviewCount: 90, isBestseller: true, isNew: false, isChefSpecial: false, isHealthy: false, spiceLevel: 1, portionSize: "Regular", preparationTime: 15, customizations: null },

      // Green Bowl
      { id: "d6", restaurantId: "rest-4", categoryId: "cat-10", name: "Greek Salad", description: "Fresh veggies & feta", imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80", price: "279", isVeg: true, isAvailable: true, rating: "4.7", reviewCount: 60, isBestseller: true, isNew: false, isChefSpecial: false, isHealthy: true, spiceLevel: 0, portionSize: "Regular", preparationTime: 10, customizations: null },

      // Burger Barn
      { id: "d7", restaurantId: "rest-5", categoryId: "cat-12", name: "Chicken Burger", description: "Crispy patty", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80", price: "189", isVeg: false, isAvailable: true, rating: "4.2", reviewCount: 110, isBestseller: true, isNew: false, isChefSpecial: false, isHealthy: false, spiceLevel: 1, portionSize: "Regular", preparationTime: 15, customizations: null },

      // Dosa Plaza
      { id: "d8", restaurantId: "rest-6", categoryId: "cat-14", name: "Masala Dosa", description: "Potato filling", imageUrl: "https://images.unsplash.com/photo-1589301760557-878121f88599?w=400&q=80", price: "120", isVeg: true, isAvailable: true, rating: "4.6", reviewCount: 220, isBestseller: true, isNew: false, isChefSpecial: false, isHealthy: true, spiceLevel: 1, portionSize: "Regular", preparationTime: 15, customizations: null },
      { id: "d9", restaurantId: "rest-6", categoryId: "cat-15", name: "Idli Sambar", description: "Steamed rice cakes", imageUrl: "https://images.unsplash.com/photo-1589301760557-878121f88599?w=400&q=80", price: "80", isVeg: true, isAvailable: true, rating: "4.5", reviewCount: 180, isBestseller: false, isNew: false, isChefSpecial: false, isHealthy: true, spiceLevel: 1, portionSize: "2 pcs", preparationTime: 10, customizations: null },

      // Royal Biryani House
      { id: "d10", restaurantId: "rest-7", categoryId: "cat-16", name: "Chicken Biryani", description: "Hyderabadi dum style", imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80", price: "299", isVeg: false, isAvailable: true, rating: "4.8", reviewCount: 500, isBestseller: true, isNew: false, isChefSpecial: true, isHealthy: false, spiceLevel: 3, portionSize: "Serves 1", preparationTime: 30, customizations: null },
      { id: "d11", restaurantId: "rest-7", categoryId: "cat-16", name: "Mutton Biryani", description: "Tender meat & aroma", imageUrl: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400&q=80", price: "399", isVeg: false, isAvailable: true, rating: "4.9", reviewCount: 300, isBestseller: true, isNew: false, isChefSpecial: true, isHealthy: false, spiceLevel: 3, portionSize: "Serves 1", preparationTime: 30, customizations: null },

      // Sweet Cravings
      { id: "d12", restaurantId: "rest-8", categoryId: "cat-18", name: "Chocolate Cake", description: "Rich truffle layer", imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80", price: "150", isVeg: true, isAvailable: true, rating: "4.7", reviewCount: 150, isBestseller: true, isNew: false, isChefSpecial: false, isHealthy: false, spiceLevel: 0, portionSize: "1 slice", preparationTime: 0, customizations: null },
      { id: "d13", restaurantId: "rest-8", categoryId: "cat-19", name: "Vanilla Scoop", description: "Classic vanilla", imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&q=80", price: "80", isVeg: true, isAvailable: true, rating: "4.5", reviewCount: 100, isBestseller: false, isNew: false, isChefSpecial: false, isHealthy: false, spiceLevel: 0, portionSize: "1 scoop", preparationTime: 0, customizations: null },
    ];

    dishes.forEach((d) => this.dishes.set(d.id, d));

    // Seed coupons
    const coupons: Coupon[] = [
      { id: "c1", code: "FIRST50", description: "50% off", discountType: "percentage", discountValue: "50", minOrderAmount: "100", maxDiscount: "100", restaurantId: null, usageLimit: 1000, usedCount: 10, validFrom: new Date(), validUntil: new Date("2025-12-31"), isActive: true },
      { id: "c2", code: "FLAT100", description: "Flat 100 off", discountType: "flat", discountValue: "100", minOrderAmount: "300", maxDiscount: null, restaurantId: null, usageLimit: 500, usedCount: 20, validFrom: new Date(), validUntil: new Date("2025-12-31"), isActive: true },
    ];
    coupons.forEach((c) => this.coupons.set(c.code.toUpperCase(), c));
  }

  // --- DATA ACCESS METHODS ---
  async getUser(id: string) { return this.users.get(id); }
  async getUserByEmail(email: string) { return Array.from(this.users.values()).find((u) => u.email === email); }
  async getUserByFirebaseUid(uid: string) { return Array.from(this.users.values()).find((u) => u.firebaseUid === uid); }
  async createUser(user: InsertUser) { const id = randomUUID(); const newUser = { ...user, id, phone: user.phone ?? null, role: user.role ?? "customer", avatarUrl: user.avatarUrl ?? null, firebaseUid: user.firebaseUid ?? null }; this.users.set(id, newUser); return newUser; }
  async updateUser(id: string, data: Partial<User>) { const user = this.users.get(id); if (!user) return undefined; const updated = { ...user, ...data }; this.users.set(id, updated); return updated; }
  async getRestaurants() { return Array.from(this.restaurants.values()); }
  async getRestaurant(id: string) { return this.restaurants.get(id); }
  async getRestaurantByOwner(ownerId: string) { return Array.from(this.restaurants.values()).find((r) => r.ownerId === ownerId); }
  async createRestaurant(restaurant: InsertRestaurant) { const id = randomUUID(); const newRest = { ...restaurant, id } as Restaurant; this.restaurants.set(id, newRest); return newRest; }
  async updateRestaurant(id: string, data: Partial<Restaurant>) { const r = this.restaurants.get(id); if (!r) return undefined; const updated = { ...r, ...data }; this.restaurants.set(id, updated); return updated; }
  async getMenuCategories(restaurantId: string) { return Array.from(this.menuCategories.values()).filter((c) => c.restaurantId === restaurantId).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)); }
  async createMenuCategory(category: InsertMenuCategory) { const id = randomUUID(); const newCat = { ...category, id } as MenuCategory; this.menuCategories.set(id, newCat); return newCat; }
  async getDishes(restaurantId: string) { return Array.from(this.dishes.values()).filter((d) => d.restaurantId === restaurantId); }
  async getDish(id: string) { return this.dishes.get(id); }
  async createDish(dish: InsertDish) { const id = randomUUID(); const newDish = { ...dish, id } as Dish; this.dishes.set(id, newDish); return newDish; }
  async updateDish(id: string, data: Partial<Dish>) { const d = this.dishes.get(id); if (!d) return undefined; const updated = { ...d, ...data }; this.dishes.set(id, updated); return updated; }
  async getOrders(userId: string) { return Array.from(this.orders.values()).filter((o) => o.userId === userId).sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()); }
  async getOrder(id: string) { return this.orders.get(id); }
  async getOrdersByRestaurant(restaurantId: string) { return Array.from(this.orders.values()).filter((o) => o.restaurantId === restaurantId).sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()); }
  async getAvailableOrdersForDelivery() { return Array.from(this.orders.values()).filter((o) => o.status === "ready" && !o.deliveryPartnerId); }
  async createOrder(order: InsertOrder) { const id = randomUUID(); const newOrder = { ...order, id, createdAt: new Date() } as Order; this.orders.set(id, newOrder); return newOrder; }
  async updateOrder(id: string, data: Partial<Order>) { const o = this.orders.get(id); if (!o) return undefined; const updated = { ...o, ...data }; if (data.status) { if (data.status === 'accepted') updated.acceptedAt = new Date(); if (data.status === 'preparing') updated.preparingAt = new Date(); if (data.status === 'ready') updated.readyAt = new Date(); if (data.status === 'picked_up') updated.pickedUpAt = new Date(); if (data.status === 'delivered') updated.deliveredAt = new Date(); } this.orders.set(id, updated); return updated; }
  async getAddresses(userId: string) { return Array.from(this.addresses.values()).filter((a) => a.userId === userId); }
  async getAddress(id: string) { return this.addresses.get(id); }
  async createAddress(address: InsertAddress) { const id = randomUUID(); const newAddr = { ...address, id } as Address; this.addresses.set(id, newAddr); return newAddr; }
  async deleteAddress(id: string) { this.addresses.delete(id); }
  async getDeliveryPartner(userId: string) { return Array.from(this.deliveryPartners.values()).find((p) => p.userId === userId); }
  async createDeliveryPartner(partner: InsertDeliveryPartner) { const id = randomUUID(); const newP = { ...partner, id } as DeliveryPartner; this.deliveryPartners.set(id, newP); return newP; }
  async updateDeliveryPartner(userId: string, data: Partial<DeliveryPartner>) { const p = await this.getDeliveryPartner(userId); if (!p) return undefined; const updated = { ...p, ...data }; this.deliveryPartners.set(p.id, updated); return updated; }
  async getCoupon(code: string) { return this.coupons.get(code.toUpperCase()); }
  async validateCoupon(code: string, amount: number, restaurantId?: string) { const c = await this.getCoupon(code); if (!c || !c.isActive) return null; if (c.minOrderAmount && amount < Number(c.minOrderAmount)) return null; if (c.restaurantId && c.restaurantId !== restaurantId) return null; if (c.usageLimit && c.usedCount && c.usedCount >= c.usageLimit) return null; if (c.validUntil && new Date() > new Date(c.validUntil)) return null; return c; }
  async createDishReview(review: InsertDishReview) { const id = randomUUID(); const newReview = { ...review, id, createdAt: new Date() } as DishReview; this.dishReviews.set(id, newReview); return newReview; }
  async getDishReviews(dishId: string) { return Array.from(this.dishReviews.values()).filter((r) => r.dishId === dishId).sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()); }
}

const globalForStorage = globalThis as unknown as { storage: MemStorage };
export const storage = globalForStorage.storage || new MemStorage();
if (process.env.NODE_ENV !== "production") globalForStorage.storage = storage;