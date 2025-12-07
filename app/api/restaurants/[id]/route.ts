import { NextResponse } from "next/server";
import { storage } from "../../../../lib/storage";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // FIX: Fetch the RESTAURANT details, not dishes
  const restaurant = await storage.getRestaurant(id);

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }

  return NextResponse.json(restaurant);
}