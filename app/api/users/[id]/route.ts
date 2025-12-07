import { NextResponse } from "next/server";
import { storage } from "../../lib/storage";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await storage.getUser(params.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const updated = await storage.updateUser(params.id, body);
  if (!updated) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}