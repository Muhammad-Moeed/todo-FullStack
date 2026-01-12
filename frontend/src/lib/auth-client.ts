// Client-side only Better Auth configuration
// Safe to import in client components

import { createAuthClient } from "better-auth/react";

// Get baseURL - use environment variable or detect from window location
const getBaseURL = () => {
  // In production, use environment variable or detect from current location
  if (typeof window !== "undefined") {
    // Use environment variable if set, otherwise use current origin
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || window.location.origin;
  }
  // Server-side fallback
  return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";
};

// Client-side auth client
export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});
