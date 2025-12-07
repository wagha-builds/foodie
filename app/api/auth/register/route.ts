import { NextResponse } from "next/server";
import { storage } from "../../../../lib/storage";

export async function POST(request: Request) {
  try {
    const { email, name, role } = await request.json();

    const existing = await storage.getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // 🎉 FIX: explicitly type this object as ANY so TS stops inferring NEVER
    const userData: any = {
      email: email,
      name: name,
      phone: null,
      role: role || "customer",
      avatarUrl: null,
      firebaseUid: null,
    };

    const user = await storage.createUser(userData);

    return NextResponse.json(user);
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
