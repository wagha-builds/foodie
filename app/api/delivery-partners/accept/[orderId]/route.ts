import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  
  // Note: userId is string | null, but storage expects string. 
  // We should ideally validate userId here, but adhering to logic:
  if (!userId) {
     return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  const order = await storage.updateOrder(params.orderId, {
    deliveryPartnerId: userId,
    status: "picked_up",
  });
  return NextResponse.json(order);
}