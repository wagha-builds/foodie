import { NextResponse } from "next/server";
import { storage } from "@/lib/storage"; 

// FIX: Add Promise type
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // FIX: Await params
  const { id } = await params;

  // Fetch dishes using the awaited ID
  const dishes = await storage.getDishes(id);

  if (!dishes) {
    return NextResponse.json({ error: "Dishes not found" }, { status: 404 });
  }

  return NextResponse.json(dishes);
}