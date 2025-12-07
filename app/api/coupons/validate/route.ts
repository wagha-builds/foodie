import { NextResponse } from "next/server";
import { storage } from "../../../../lib/storage";

export async function POST(request: Request) {
  const { code, orderAmount, restaurantId } = await request.json();
  const coupon = await storage.validateCoupon(code, orderAmount, restaurantId);
  
  if (!coupon) {
    return NextResponse.json({ error: "Invalid or expired coupon" }, { status: 400 });
  }
  return NextResponse.json(coupon);
}