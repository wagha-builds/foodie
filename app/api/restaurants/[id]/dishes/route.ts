import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const dishes = await storage.getDishes(params.id);
  return NextResponse.json(dishes);
}