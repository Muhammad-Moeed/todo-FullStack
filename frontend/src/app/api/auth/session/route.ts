import { auth } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Use Better Auth's API to get session
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (session) {
      return NextResponse.json({
        session: {
          user: session.user,
          sessionToken: session.sessionToken,
          expiresAt: session.expiresAt,
        },
      });
    }

    // Return empty session if not authenticated
    return NextResponse.json({ session: null, user: null });
  } catch (error: any) {
    console.error("Session endpoint error:", error);
    // Return empty session on error (user not logged in)
    return NextResponse.json({ session: null, user: null });
  }
}
