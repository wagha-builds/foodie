import { NextResponse } from "next/server";
import { storage } from "../../../../lib/storage";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get("restaurantId");

  if (!restaurantId) {
    return NextResponse.json([]);
  }
  const orders = await storage.getOrdersByRestaurant(restaurantId);
  return NextResponse.json(orders);
}