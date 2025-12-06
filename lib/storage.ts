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
      // Seed demo restaurants
      const restaurants: Restaurant[] = [
        {
          id: "rest-1",
          ownerId: null,
          name: "Tandoori Nights",
          description: "Authentic North Indian cuisine with signature tandoor dishes",
          cuisines: ["North Indian", "Mughlai", "Tandoor"],
          imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
          coverImageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&q=80",
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
          cuisines: ["Italian", "Pizza", "Pasta"],
          imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
          coverImageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80",
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
          offerText: "Free delivery on orders above 500",
        },
        {
          id: "rest-3",
          ownerId: null,
          name: "Dragon Wok",
          description: "Authentic Chinese and Pan-Asian delights",
          cuisines: ["Chinese", "Thai", "Asian"],
          imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80",
          coverImageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=1200&q=80",
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
          coverImageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80",
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
          offerText: "20% OFF on first order",
        },
        {
          id: "rest-5",
          ownerId: null,
          name: "Burger Barn",
          description: "Juicy burgers and crispy fries",
          cuisines: ["American", "Burgers", "Fast Food"],
          imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
          coverImageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80",
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
          coverImageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=1200&q=80",
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
      ];
  
      restaurants.forEach((r) => this.restaurants.set(r.id, r));
  
      // Seed menu categories
      const categories: MenuCategory[] = [
        { id: "cat-1", restaurantId: "rest-1", name: "Starters", description: "Appetizers and snacks", sortOrder: 1 },
        { id: "cat-2", restaurantId: "rest-1", name: "Main Course", description: "Rice and curries", sortOrder: 2 },
        { id: "cat-3", restaurantId: "rest-1", name: "Breads", description: "Naan and rotis", sortOrder: 3 },
        { id: "cat-4", restaurantId: "rest-1", name: "Desserts", description: "Sweet endings", sortOrder: 4 },
        { id: "cat-5", restaurantId: "rest-2", name: "Pizzas", description: "Hand-tossed pizzas", sortOrder: 1 },
        { id: "cat-6", restaurantId: "rest-2", name: "Pastas", description: "Italian pasta dishes", sortOrder: 2 },
        { id: "cat-7", restaurantId: "rest-2", name: "Sides", description: "Garlic bread and more", sortOrder: 3 },
      ];
  
      categories.forEach((c) => this.menuCategories.set(c.id, c));
  
      // Seed dishes
      const dishes: Dish[] = [
        {
          id: "dish-1",
          restaurantId: "rest-1",
          categoryId: "cat-1",
          name: "Paneer Tikka",
          description: "Marinated cottage cheese grilled to perfection in tandoor",
          imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80",
          price: "249",
          isVeg: true,
          isAvailable: true,
          rating: "4.6",
          reviewCount: 89,
          isBestseller: true,
          isNew: false,
          isChefSpecial: false,
          isHealthy: false,
          spiceLevel: 2,
          portionSize: "Regular",
          preparationTime: 20,
          customizations: [
            {
              name: "Spice Level",
              required: true,
              maxSelections: 1,
              options: [
                { name: "Mild", price: 0 },
                { name: "Medium", price: 0 },
                { name: "Spicy", price: 0 },
              ],
            },
          ],
        },
        {
          id: "dish-2",
          restaurantId: "rest-1",
          categoryId: "cat-1",
          name: "Chicken Malai Tikka",
          description: "Creamy, tender chicken chunks marinated in cheese and cream",
          imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80",
          price: "329",
          isVeg: false,
          isAvailable: true,
          rating: "4.8",
          reviewCount: 156,
          isBestseller: true,
          isNew: false,
          isChefSpecial: true,
          isHealthy: false,
          spiceLevel: 1,
          portionSize: "Regular",
          preparationTime: 25,
          customizations: null,
        },
        {
          id: "dish-3",
          restaurantId: "rest-1",
          categoryId: "cat-2",
          name: "Butter Chicken",
          description: "Classic creamy tomato-based curry with tender chicken",
          imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
          price: "349",
          isVeg: false,
          isAvailable: true,
          rating: "4.7",
          reviewCount: 234,
          isBestseller: true,
          isNew: false,
          isChefSpecial: false,
          isHealthy: false,
          spiceLevel: 2,
          portionSize: "Regular",
          preparationTime: 20,
          customizations: null,
        },
        {
          id: "dish-4",
          restaurantId: "rest-1",
          categoryId: "cat-2",
          name: "Dal Makhani",
          description: "Slow-cooked black lentils in rich creamy gravy",
          imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80",
          price: "229",
          isVeg: true,
          isAvailable: true,
          rating: "4.5",
          reviewCount: 178,
          isBestseller: false,
          isNew: false,
          isChefSpecial: false,
          isHealthy: false,
          spiceLevel: 1,
          portionSize: "Regular",
          preparationTime: 15,
          customizations: null,
        },
        {
          id: "dish-5",
          restaurantId: "rest-1",
          categoryId: "cat-3",
          name: "Butter Naan",
          description: "Soft leavened bread brushed with butter",
          imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
          price: "59",
          isVeg: true,
          isAvailable: true,
          rating: "4.4",
          reviewCount: 312,
          isBestseller: false,
          isNew: false,
          isChefSpecial: false,
          isHealthy: false,
          spiceLevel: 0,
          portionSize: "1 piece",
          preparationTime: 10,
          customizations: null,
        },
        {
          id: "dish-6",
          restaurantId: "rest-2",
          categoryId: "cat-5",
          name: "Margherita Pizza",
          description: "Classic pizza with fresh mozzarella and basil",
          imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
          price: "299",
          isVeg: true,
          isAvailable: true,
          rating: "4.3",
          reviewCount: 198,
          isBestseller: true,
          isNew: false,
          isChefSpecial: false,
          isHealthy: false,
          spiceLevel: 0,
          portionSize: "Medium (8 inch)",
          preparationTime: 20,
          customizations: [
            {
              name: "Size",
              required: true,
              maxSelections: 1,
              options: [
                { name: "Medium", price: 0 },
                { name: "Large", price: 100 },
              ],
            },
            {
              name: "Extra Toppings",
              required: false,
              maxSelections: 5,
              options: [
                { name: "Extra Cheese", price: 50 },
                { name: "Olives", price: 30 },
                { name: "Jalapenos", price: 30 },
                { name: "Bell Peppers", price: 30 },
              ],
            },
          ],
        },
        {
          id: "dish-7",
          restaurantId: "rest-2",
          categoryId: "cat-5",
          name: "Pepperoni Pizza",
          description: "Loaded with spicy pepperoni and cheese",
          imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80",
          price: "399",
          isVeg: false,
          isAvailable: true,
          rating: "4.5",
          reviewCount: 267,
          isBestseller: true,
          isNew: false,
          isChefSpecial: false,
          isHealthy: false,
          spiceLevel: 2,
          portionSize: "Medium (8 inch)",
          preparationTime: 20,
          customizations: null,
        },
      ];
  
      dishes.forEach((d) => this.dishes.set(d.id, d));
  
      // Seed coupons
      const coupons: Coupon[] = [
        {
          id: "coupon-1",
          code: "FIRST50",
          description: "50% off on first order",
          discountType: "percentage",
          discountValue: "50",
          minOrderAmount: "100",
          maxDiscount: "100",
          restaurantId: null,
          usageLimit: 1000,
          usedCount: 456,
          validFrom: new Date("2024-01-01"),
          validUntil: new Date("2025-12-31"),
          isActive: true,
        },
        {
          id: "coupon-2",
          code: "FLAT100",
          description: "Flat 100 off",
          discountType: "flat",
          discountValue: "100",
          minOrderAmount: "300",
          maxDiscount: null,
          restaurantId: null,
          usageLimit: 500,
          usedCount: 123,
          validFrom: new Date("2024-01-01"),
          validUntil: new Date("2025-12-31"),
          isActive: true,
        },
      ];
  
      coupons.forEach((c) => this.coupons.set(c.code.toUpperCase(), c));
    }
  
    // Users
    async getUser(id: string): Promise<User | undefined> {
      return this.users.get(id);
    }
  
    async getUserByEmail(email: string): Promise<User | undefined> {
      return Array.from(this.users.values()).find((u) => u.email === email);
    }
  
    async getUserByFirebaseUid(uid: string): Promise<User | undefined> {
      return Array.from(this.users.values()).find((u) => u.firebaseUid === uid);
    }
  
    async createUser(insertUser: InsertUser): Promise<User> {
      const id = randomUUID();
      // Ensure `phone`, `role`, `avatarUrl`, and `firebaseUid` are not undefined (set null/default if not provided)
      const user: User = {
        id,
        name: insertUser.name,
        email: insertUser.email,
        phone: insertUser.phone ?? null,
        role: insertUser.role ?? "customer",
        avatarUrl: insertUser.avatarUrl ?? null,
        firebaseUid: insertUser.firebaseUid ?? null,
      };
      this.users.set(id, user);
      return user;
    }
    async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
      const user = this.users.get(id);
      if (!user) return undefined;
      const updated = { ...user, ...data };
      this.users.set(id, updated);
      return updated;
    }
  
    // Restaurants
    async getRestaurants(): Promise<Restaurant[]> {
      return Array.from(this.restaurants.values());
    }
  
    async getRestaurant(id: string): Promise<Restaurant | undefined> {
      return this.restaurants.get(id);
    }
  
    async getRestaurantByOwner(ownerId: string): Promise<Restaurant | undefined> {
      return Array.from(this.restaurants.values()).find((r) => r.ownerId === ownerId);
    }
  
    async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
      const id = randomUUID();
      const newRestaurant: Restaurant = { ...restaurant, id } as Restaurant;
      this.restaurants.set(id, newRestaurant);
      return newRestaurant;
    }
  
    async updateRestaurant(id: string, data: Partial<Restaurant>): Promise<Restaurant | undefined> {
      const restaurant = this.restaurants.get(id);
      if (!restaurant) return undefined;
      const updated = { ...restaurant, ...data };
      this.restaurants.set(id, updated);
      return updated;
    }
  
    // Menu Categories
    async getMenuCategories(restaurantId: string): Promise<MenuCategory[]> {
      return Array.from(this.menuCategories.values())
        .filter((c) => c.restaurantId === restaurantId)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    }
  
    async createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory> {
      const id = randomUUID();
      const newCategory: MenuCategory = { ...category, id } as MenuCategory;
      this.menuCategories.set(id, newCategory);
      return newCategory;
    }
  
    // Dishes
    async getDishes(restaurantId: string): Promise<Dish[]> {
      return Array.from(this.dishes.values()).filter((d) => d.restaurantId === restaurantId);
    }
  
    async getDish(id: string): Promise<Dish | undefined> {
      return this.dishes.get(id);
    }
  
    async createDish(dish: InsertDish): Promise<Dish> {
      const id = randomUUID();
      const newDish: Dish = { ...dish, id } as Dish;
      this.dishes.set(id, newDish);
      return newDish;
    }
  
    async updateDish(id: string, data: Partial<Dish>): Promise<Dish | undefined> {
      const dish = this.dishes.get(id);
      if (!dish) return undefined;
      const updated = { ...dish, ...data };
      this.dishes.set(id, updated);
      return updated;
    }
  
    // Orders
    async getOrders(userId: string): Promise<Order[]> {
      return Array.from(this.orders.values())
        .filter((o) => o.userId === userId)
        .sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
    }
  
    async getOrder(id: string): Promise<Order | undefined> {
      return this.orders.get(id);
    }
  
    async getOrdersByRestaurant(restaurantId: string): Promise<Order[]> {
      return Array.from(this.orders.values())
        .filter((o) => o.restaurantId === restaurantId)
        .sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
    }
  
    async getAvailableOrdersForDelivery(): Promise<Order[]> {
      return Array.from(this.orders.values()).filter(
        (o) => o.status === "ready" && !o.deliveryPartnerId
      );
    }
  
    async createOrder(order: InsertOrder): Promise<Order> {
      const id = randomUUID();
      const newOrder: Order = {
        ...order,
        id,
        createdAt: new Date(),
      } as Order;
      this.orders.set(id, newOrder);
      return newOrder;
    }
  
    async updateOrder(id: string, data: Partial<Order>): Promise<Order | undefined> {
      const order = this.orders.get(id);
      if (!order) return undefined;
      
      // Set timestamps based on status changes
      const updated: Order = { ...order, ...data };
      if (data.status === "accepted" && !order.acceptedAt) {
        updated.acceptedAt = new Date();
      }
      if (data.status === "preparing" && !order.preparingAt) {
        updated.preparingAt = new Date();
      }
      if (data.status === "ready" && !order.readyAt) {
        updated.readyAt = new Date();
      }
      if (data.status === "picked_up" && !order.pickedUpAt) {
        updated.pickedUpAt = new Date();
      }
      if (data.status === "delivered" && !order.deliveredAt) {
        updated.deliveredAt = new Date();
      }
      
      this.orders.set(id, updated);
      return updated;
    }
  
    // Addresses
    async getAddresses(userId: string): Promise<Address[]> {
      return Array.from(this.addresses.values()).filter((a) => a.userId === userId);
    }
  
    async getAddress(id: string): Promise<Address | undefined> {
      return this.addresses.get(id);
    }
  
    async createAddress(address: InsertAddress): Promise<Address> {
      const id = randomUUID();
      const newAddress: Address = { ...address, id } as Address;
      this.addresses.set(id, newAddress);
      return newAddress;
    }
  
    async deleteAddress(id: string): Promise<void> {
      this.addresses.delete(id);
    }
  
    // Delivery Partners
    async getDeliveryPartner(userId: string): Promise<DeliveryPartner | undefined> {
      return Array.from(this.deliveryPartners.values()).find((p) => p.userId === userId);
    }
  
    async createDeliveryPartner(partner: InsertDeliveryPartner): Promise<DeliveryPartner> {
      const id = randomUUID();
      const newPartner: DeliveryPartner = { ...partner, id } as DeliveryPartner;
      this.deliveryPartners.set(id, newPartner);
      return newPartner;
    }
  
    async updateDeliveryPartner(
      userId: string,
      data: Partial<DeliveryPartner>
    ): Promise<DeliveryPartner | undefined> {
      const partner = await this.getDeliveryPartner(userId);
      if (!partner) return undefined;
      const updated = { ...partner, ...data };
      this.deliveryPartners.set(partner.id, updated);
      return updated;
    }
  
    // Coupons
    async getCoupon(code: string): Promise<Coupon | undefined> {
      return this.coupons.get(code.toUpperCase());
    }
  
    async validateCoupon(
      code: string,
      orderAmount: number,
      restaurantId?: string
    ): Promise<Coupon | null> {
      const coupon = await this.getCoupon(code);
      if (!coupon) return null;
      if (!coupon.isActive) return null;
      if (coupon.minOrderAmount && orderAmount < Number(coupon.minOrderAmount)) return null;
      if (coupon.restaurantId && coupon.restaurantId !== restaurantId) return null;
      if (coupon.usageLimit && coupon.usedCount && coupon.usedCount >= coupon.usageLimit)
        return null;
      if (coupon.validUntil && new Date() > new Date(coupon.validUntil)) return null;
      return coupon;
    }
  
    // Reviews
    async createDishReview(review: InsertDishReview): Promise<DishReview> {
      const id = randomUUID();
      const newReview: DishReview = {
        ...review,
        id,
        createdAt: new Date(),
      } as DishReview;
      this.dishReviews.set(id, newReview);
      return newReview;
    }
  
    async getDishReviews(dishId: string): Promise<DishReview[]> {
      return Array.from(this.dishReviews.values())
        .filter((r) => r.dishId === dishId)
        .sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
    }
  }
  
  // Global Singleton for Next.js hot-reload persistence
  const globalForStorage = globalThis as unknown as { storage: MemStorage };
  
  export const storage = globalForStorage.storage || new MemStorage();
  
  if (process.env.NODE_ENV !== "production") globalForStorage.storage = storage;