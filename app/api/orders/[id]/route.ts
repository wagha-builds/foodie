import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const order = await storage.getOrder(params.id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const restaurant = await storage.getRestaurant(order.restaurantId);

  return NextResponse.json({
    ...order,
    restaurant: restaurant
      ? { name: restaurant.name, imageUrl: restaurant.imageUrl }
      : undefined,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const updated = await storage.updateOrder(params.id, body);
  if (!updated) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}