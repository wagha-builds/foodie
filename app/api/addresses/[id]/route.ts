import { NextResponse } from "next/server";
import { storage } from "../../../../lib/storage";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await storage.deleteAddress(params.id);
  return NextResponse.json({ success: true });
}