import { NextResponse } from "next/server";
import { storage } from "../../../lib/storage";

export async function GET(request: Request) {
  // Logic from original file: In production, would query by deliveryPartnerId
  return NextResponse.json(null);
}