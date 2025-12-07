import { NextResponse } from "next/server";
import { storage } from "../../../../lib/storage";

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const body = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const updated = await storage.updateDeliveryPartner(userId, body);
  return NextResponse.json(updated);
}