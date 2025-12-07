import { NextResponse } from "next/server";
import { storage } from "../../../../lib/storage";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ownerId = searchParams.get("ownerId");

  if (!ownerId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const restaurant = await storage.getRestaurantByOwner(ownerId);
  return NextResponse.json(restaurant);
}