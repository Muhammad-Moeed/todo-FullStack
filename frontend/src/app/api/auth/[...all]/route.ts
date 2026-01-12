import { auth } from "@/lib/auth-server";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const handler = toNextJsHandler(auth);

export async function GET(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Directly handle session endpoint if handler fails
  if (pathname === "/api/auth/session" || pathname.includes("/session")) {
    try {
      const response = await handler.GET(req);
      
      // Add CORS headers
      const origin = req.headers.get("origin");
      if (origin) {
        const responseHeaders = new Headers(response.headers);
        responseHeaders.set("Access-Control-Allow-Origin", origin);
        responseHeaders.set("Access-Control-Allow-Credentials", "true");
        return new NextResponse(response.body, {
          status: response.status,
          headers: responseHeaders,
        });
      }
      
      return response;
    } catch (error: any) {
      // If handler fails, return empty session (user not logged in)
      console.log("Session endpoint - no active session");
      const response = NextResponse.json({ session: null, user: null }, { status: 200 });
      
      // Add CORS headers
      const origin = req.headers.get("origin");
      if (origin) {
        response.headers.set("Access-Control-Allow-Origin", origin);
        response.headers.set("Access-Control-Allow-Credentials", "true");
      }
      
      return response;
    }
  }
  
  // Handle all other Better Auth endpoints
  try {
    const response = await handler.GET(req);
    
    // Add CORS headers
    const origin = req.headers.get("origin");
    if (origin) {
      const responseHeaders = new Headers(response.headers);
      responseHeaders.set("Access-Control-Allow-Origin", origin);
      responseHeaders.set("Access-Control-Allow-Credentials", "true");
      return new NextResponse(response.body, {
        status: response.status,
        headers: responseHeaders,
      });
    }
    
    return response;
  } catch (error: any) {
    console.error("Better Auth GET error:", error);
    console.error("Error path:", pathname);
    console.error("Request origin:", req.headers.get("origin"));
    
    const response = NextResponse.json(
      { error: error?.message || "Authentication error" },
      { status: 500 }
    );
    
    // Add CORS headers
    const origin = req.headers.get("origin");
    if (origin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }
    
    return response;
  }
}

export async function POST(req: NextRequest) {
  try {
    const response = await handler.POST(req);
    
    // Add CORS headers for production
    const origin = req.headers.get("origin");
    if (origin) {
      const responseHeaders = new Headers(response.headers);
      responseHeaders.set("Access-Control-Allow-Origin", origin);
      responseHeaders.set("Access-Control-Allow-Credentials", "true");
      return new NextResponse(response.body, {
        status: response.status,
        headers: responseHeaders,
      });
    }
    
    return response;
  } catch (error: any) {
    // Log detailed error information
    console.error("=== Better Auth POST Error ===");
    console.error("Error message:", error?.message);
    console.error("Error name:", error?.name);
    console.error("Error stack:", error?.stack);
    console.error("Request origin:", req.headers.get("origin"));
    console.error("Request URL:", req.url);
    
    // Try to get more details
    if (error?.cause) {
      console.error("Error cause:", error.cause);
    }
    if (error?.response) {
      console.error("Error response:", error.response);
    }
    
    // Return error to client
    const errorMessage = error?.message || error?.toString() || "Authentication error";
    const response = NextResponse.json(
      { 
        error: errorMessage,
        message: "Check server console for detailed error logs"
      },
      { status: 500 }
    );
    
    // Add CORS headers
    const origin = req.headers.get("origin");
    if (origin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }
    
    return response;
  }
}
