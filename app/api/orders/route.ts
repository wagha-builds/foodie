import { NextResponse } from "next/server";
import { storage } from "../../../lib/storage";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json([]);
  }
  const orders = await storage.getOrders(userId);

  // Enrich with restaurant info
  const enrichedOrders = await Promise.all(
    orders.map(async (order) => {
      const restaurant = await storage.getRestaurant(order.restaurantId);
      return {
        ...order,
        restaurant: restaurant
          ? { name: restaurant.name, imageUrl: restaurant.imageUrl }
          : undefined,
      };
    })
  );

  return NextResponse.json(enrichedOrders);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = await storage.createOrder(body);
    return NextResponse.json(order);
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}