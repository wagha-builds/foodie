import { NextResponse } from "next/server";
import { storage } from "../../../lib/storage";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json([]);
  }
  const addresses = await storage.getAddresses(userId);
  return NextResponse.json(addresses);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const address = await storage.createAddress(body);
    return NextResponse.json(address);
  } catch (error) {
    console.error("Create address error:", error);
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 });
  }
}