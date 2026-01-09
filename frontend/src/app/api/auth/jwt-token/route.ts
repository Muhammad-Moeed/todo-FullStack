/**
 * JWT Token Bridge Endpoint
 * Converts Better Auth session to JWT token for FastAPI backend
 * 
 * This endpoint:
 * 1. Gets the current Better Auth session from cookies
 * 2. Extracts user_id from the session
 * 3. Generates a JWT token using BETTER_AUTH_SECRET
 * 4. Returns the JWT token to the frontend
 * 
 * The frontend can then use this JWT token in Authorization header for FastAPI requests
 */

import { auth } from "@/lib/auth-server";
import { generateJWTToken } from "@/lib/jwt-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Get Better Auth session from cookies
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Not authenticated", token: null },
        { status: 401 }
      );
    }

    // Extract user_id from session
    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in session", token: null },
        { status: 500 }
      );
    }

    // Generate JWT token for FastAPI
    const jwtToken = await generateJWTToken(userId);

    return NextResponse.json({
      token: jwtToken,
      user_id: userId,
      expires_in: 60 * 60 * 24, // 24 hours
    });
  } catch (error: any) {
    console.error("JWT token generation error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate JWT token", token: null },
      { status: 500 }
    );
  }
}
