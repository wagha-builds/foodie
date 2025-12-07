import { NextResponse } from "next/server";
import { storage } from "../../../../lib/storage";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const partner = await storage.getDeliveryPartner(userId);
  return NextResponse.json(partner);
}