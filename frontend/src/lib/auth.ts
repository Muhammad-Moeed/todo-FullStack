// Client-side exports only (safe to use in client components)
// For server-side auth, import directly from "./auth-server"

export { authClient } from "./auth-client";

// Note: Server-side exports (auth, Session, User) are NOT exported here
// to prevent pg from being bundled in client components.
// Import directly from "./auth-server" in API routes and server components.
