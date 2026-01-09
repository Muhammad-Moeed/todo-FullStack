// Client-side only Better Auth configuration
// Safe to import in client components

import { createAuthClient } from "better-auth/react";

// Client-side auth client
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});
