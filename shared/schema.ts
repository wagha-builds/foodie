import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles enum
export const UserRole = {
  CUSTOMER: 'customer',
  RESTAURANT: 'restaurant',
  DELIVERY_PARTNER: 'delivery_partner',
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

// Users table
export const users = pgTable("users", {
  id: varchar("id", { length: 128 }).primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone"),
  role: text("role").notNull().default('customer'),
  avatarUrl: text("avatar_url"),
  firebaseUid: text("firebase_uid").unique(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// User addresses
export const addresses = pgTable("addresses", {
  id: varchar("id", { length: 128 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 128 }).notNull().references(() => users.id),
  label: text("label").notNull(), // Home, Work, Other
  fullAddress: text("full_address").notNull(),
  landmark: text("landmark"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  isDefault: boolean("is_default").default(false),
});

export const insertAddressSchema = createInsertSchema(addresses).omit({ id: true });
export type InsertAddress = z.infer<typeof insertAddressSchema>;
export type Address = typeof addresses.$inferSelect;

// Restaurants table
export const restaurants = pgTable("restaurants", {
  id: varchar("id", { length: 128 }).primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id", { length: 128 }).references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  cuisines: text("cuisines").array().notNull().default(sql`ARRAY[]::text[]`),
  imageUrl: text("image_url"),
  coverImageUrl: text("cover_image_url"),
  address: text("address").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  phone: text("phone"),
  email: text("email"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  priceRange: integer("price_range").default(2), // 1-4 ($ to $$$$)
  deliveryTime: integer("delivery_time").default(30), // minutes
  deliveryFee: decimal("delivery_fee", { precision: 6, scale: 2 }).default("0"),
  minOrderAmount: decimal("min_order_amount", { precision: 8, scale: 2 }).default("0"),
  isVeg: boolean("is_veg").default(false),
  isOpen: boolean("is_open").default(true),
  openingTime: text("opening_time").default("09:00"),
  closingTime: text("closing_time").default("22:00"),
  hasOffers: boolean("has_offers").default(false),
  offerText: text("offer_text"),
});

export const insertRestaurantSchema = createInsertSchema(restaurants).omit({ id: true });
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type Restaurant = typeof restaurants.$inferSelect;

// Menu categories
export const menuCategories = pgTable("menu_categories", {
  id: varchar("id", { length: 128 }).primaryKey().default(sql`gen_random_uuid()`),
  restaurantId: varchar("restaurant_id", { length: 128 }).notNull().references(() => restaurants.id),
  name: text("name").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").default(0),
});

export const insertMenuCategorySchema = createInsertSchema(menuCategories).omit({ id: true });
export type InsertMenuCategory = z.infer<typeof insertMenuCategorySchema>;
export type MenuCategory = typeof menuCategories.$inferSelect;

// Dishes table
export const dishes = pgTable("dishes", {
  id: varchar("id", { length: 128 }).primaryKey().default(sql`gen_random_uuid()`),
  restaurantId: varchar("restaurant_id", { length: 128 }).notNull().references(() => restaurants.id),
  categoryId: varchar("category_id", { length: 128 }).references(() => menuCategories.id),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  price: decimal("price", { precision: 8, scale: 2 }).notNull(),
  isVeg: boolean("is_veg").default(true),
  isAvailable: boolean("is_available").default(true),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  isBestseller: boolean("is_bestseller").default(false),
  isNew: boolean("is_new").default(false),
  isChefSpecial: boolean("is_chef_special").default(false),
  isHealthy: boolean("is_healthy").default(false),
  spiceLevel: integer("spice_level").default(1), // 1-5
  portionSize: text("portion_size"), // Regular, Large
  preparationTime: integer("preparation_time").default(15), // minutes
  customizations: jsonb("customizations").$type<DishCustomization[]>(),
});

export interface DishCustomization {
  name: string;
  required: boolean;
  maxSelections: number;
  options: {
    name: string;
    price: number;
  }[];
}

export const insertDishSchema = createInsertSchema(dishes).omit({ id: true });
export type InsertDish = z.infer<typeof insertDishSchema>;
export type Dish = typeof dishes.$inferSelect;

// Dish reviews
export const dishReviews = pgTable("dish_reviews", {
  id: varchar("id", { length: 128 }).primaryKey().default(sql`gen_random_uuid()`),
  dishId: varchar("dish_id", { length: 128 }).notNull().references(() => dishes.id),
  userId: varchar("user_id", { length: 128 }).notNull().references(() => users.id),
  orderId: varchar("order_id", { length: 128 }),
  rating: integer("rating").notNull(), // 1-10
  tasteRating: integer("taste_rating"), // 1-10
  portionRating: integer("portion_rating"), // 1-10
  packagingRating: integer("packaging_rating"), // 1-10
  freshnessRating: integer("freshness_rating"), // 1-10
  comment: text("comment"),
  photoUrls: text("photo_urls").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDishReviewSchema = createInsertSchema(dishReviews).omit({ id: true, createdAt: true });
export type InsertDishReview = z.infer<typeof insertDishReviewSchema>;
export type DishReview = typeof dishReviews.$inferSelect;

// Shopping cart
export const cartItems = pgTable("cart_items", {
  id: varchar("id", { length: 128 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 128 }).notNull().references(() => users.id),
  dishId: varchar("dish_id", { length: 128 }).notNull().references(() => dishes.id),
  restaurantId: varchar("restaurant_id", { length: 128 }).notNull().references(() => restaurants.id),
  quantity: integer("quantity").notNull().default(1),
  customizations: jsonb("customizations").$type<SelectedCustomization[]>(),
  specialInstructions: text("special_instructions"),
  unitPrice: decimal("unit_price", { precision: 8, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 8, scale: 2 }).notNull(),
});

export interface SelectedCustomization {
  name: string;
  selectedOptions: {
    name: string;
    price: number;
  }[];
}

export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true });
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

// Orders
export const OrderStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  PREPARING: 'preparing',
  READY: 'ready',
  PICKED_UP: 'picked_up',
  ON_THE_WAY: 'on_the_way',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export type OrderStatusType = typeof OrderStatus[keyof typeof OrderStatus];

export const orders = pgTable("orders", {
  id: varchar("id", { length: 128 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 128 }).notNull().references(() => users.id),
  restaurantId: varchar("restaurant_id", { length: 128 }).notNull().references(() => restaurants.id),
  deliveryPartnerId: varchar("delivery_partner_id", { length: 128 }).references(() => users.id),
  addressId: varchar("address_id", { length: 128 }).references(() => addresses.id),
  deliveryAddress: text("delivery_address").notNull(),
  status: text("status").notNull().default('pending'),
  items: jsonb("items").$type<OrderItem[]>().notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  deliveryFee: decimal("delivery_fee", { precision: 6, scale: 2 }).notNull(),
  taxes: decimal("taxes", { precision: 8, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 8, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  couponCode: text("coupon_code"),
  paymentMethod: text("payment_method").notNull(), // upi, card, wallet, cod
  paymentStatus: text("payment_status").default('pending'),
  specialInstructions: text("special_instructions"),
  estimatedDeliveryTime: integer("estimated_delivery_time"), // minutes
  deliveryPartnerLocation: jsonb("delivery_partner_location").$type<{lat: number, lng: number}>(),
  createdAt: timestamp("created_at").defaultNow(),
  acceptedAt: timestamp("accepted_at"),
  preparingAt: timestamp("preparing_at"),
  readyAt: timestamp("ready_at"),
  pickedUpAt: timestamp("picked_up_at"),
  deliveredAt: timestamp("delivered_at"),
});

export interface OrderItem {
  dishId: string;
  dishName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizations?: SelectedCustomization[];
  specialInstructions?: string;
  imageUrl?: string;
}

export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Coupons
export const coupons = pgTable("coupons", {
  id: varchar("id", { length: 128 }).primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  description: text("description"),
  discountType: text("discount_type").notNull(), // percentage, flat
  discountValue: decimal("discount_value", { precision: 8, scale: 2 }).notNull(),
  minOrderAmount: decimal("min_order_amount", { precision: 8, scale: 2 }).default("0"),
  maxDiscount: decimal("max_discount", { precision: 8, scale: 2 }),
  restaurantId: varchar("restaurant_id", { length: 128 }).references(() => restaurants.id), // null = all restaurants
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").default(0),
  validFrom: timestamp("valid_from"),
  validUntil: timestamp("valid_until"),
  isActive: boolean("is_active").default(true),
});

export const insertCouponSchema = createInsertSchema(coupons).omit({ id: true });
export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type Coupon = typeof coupons.$inferSelect;

// Delivery partners additional info
export const deliveryPartners = pgTable("delivery_partners", {
  id: varchar("id", { length: 128 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 128 }).notNull().references(() => users.id).unique(),
  vehicleType: text("vehicle_type").notNull(), // bike, scooter, bicycle
  vehicleNumber: text("vehicle_number"),
  isOnline: boolean("is_online").default(false),
  isAvailable: boolean("is_available").default(true),
  currentLatitude: decimal("current_latitude", { precision: 10, scale: 8 }),
  currentLongitude: decimal("current_longitude", { precision: 11, scale: 8 }),
  totalDeliveries: integer("total_deliveries").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.0"),
  totalEarnings: decimal("total_earnings", { precision: 12, scale: 2 }).default("0"),
});

export const insertDeliveryPartnerSchema = createInsertSchema(deliveryPartners).omit({ id: true });
export type InsertDeliveryPartner = z.infer<typeof insertDeliveryPartnerSchema>;
export type DeliveryPartner = typeof deliveryPartners.$inferSelect;

// Extended types for frontend use
export interface RestaurantWithDetails extends Restaurant {
  dishes?: Dish[];
  categories?: MenuCategory[];
  distance?: number;
}

export interface DishWithDetails extends Dish {
  restaurant?: Restaurant;
  reviews?: DishReview[];
}

export interface CartItemWithDetails extends CartItem {
  dish?: Dish;
  restaurant?: Restaurant;
}

export interface OrderWithDetails extends Order {
  restaurant?: Restaurant;
  user?: User;
  deliveryPartner?: User & { partnerInfo?: DeliveryPartner };
}