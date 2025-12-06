import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const coupon = await storage.getCoupon(params.code);
  if (!coupon) {
    return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
  }
  return NextResponse.json(coupon);
}