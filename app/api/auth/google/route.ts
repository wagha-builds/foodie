import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const { firebaseUid, email, name, avatarUrl } = await request.json();

    // Check if user exists
    let user = await storage.getUserByFirebaseUid(firebaseUid);

    if (!user) {
      // Check by email
      user = await storage.getUserByEmail(email);

      if (user) {
        // Link Firebase UID to existing user
        user = await storage.updateUser(user.id, { firebaseUid });
      } else {
        // Create new user
        user = await storage.createUser({
          email,
          name,
          avatarUrl,
          firebaseUid,
          phone: null,
          role: "customer",
        });
      }
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}