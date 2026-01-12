import { auth } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Use Better Auth's API to get session
    const sessionData = await auth.api.getSession({
      headers: req.headers,
    });

    if (sessionData && sessionData.user) {
      return NextResponse.json({
        session: {
          user: sessionData.user,
          sessionToken: sessionData.session?.token || "",
          expiresAt: sessionData.session?.expiresAt?.toISOString() || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
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
