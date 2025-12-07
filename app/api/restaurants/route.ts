import { NextResponse } from "next/server";
import { storage } from "../../../lib/storage";

export async function GET() {
  const restaurants = await storage.getRestaurants();
  return NextResponse.json(restaurants);
}