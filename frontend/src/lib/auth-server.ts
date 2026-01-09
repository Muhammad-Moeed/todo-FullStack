// Server-side only Better Auth configuration
// This file should NEVER be imported in client components

import { betterAuth } from "better-auth";
import { Pool } from "pg";

// Validate environment variables
const DATABASE_URL = process.env.DATABASE_URL;
const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;
const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";

if (!DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL is not set. Better Auth will not work without a database.");
}

if (!BETTER_AUTH_SECRET) {
  console.warn("⚠️  BETTER_AUTH_SECRET is not set. Better Auth will not work without a secret.");
}

// Create PostgreSQL connection pool
const pool = DATABASE_URL ? new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
}) : undefined;

// Server-side auth configuration
export const auth = betterAuth({
  database: pool ? pool : {
    provider: "postgres",
    url: DATABASE_URL || "",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Disable email verification for now
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  secret: BETTER_AUTH_SECRET || "",
  baseURL: BETTER_AUTH_URL,
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
