import { NextResponse } from "next/server";
import { storage } from "@/lib/storage"; // Adjust path if needed

// FIX: Add Promise type
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // FIX: Await params
  const { id } = await params;

  // Use the correct method to get menu categories by restaurant ID
  const categories = await storage.getMenuCategories(id);

  if (!categories) {
    return NextResponse.json({ error: "Categories not found" }, { status: 404 });
  }

  return NextResponse.json(categories);
}