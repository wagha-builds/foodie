import { NextResponse } from "next/server";
import { storage } from "../../../../../lib/storage";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const reviews = await storage.getDishReviews(params.id);
  return NextResponse.json(reviews);
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const review = await storage.createDishReview({
      ...body,
      dishId: params.id,
    });
    return NextResponse.json(review);
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}