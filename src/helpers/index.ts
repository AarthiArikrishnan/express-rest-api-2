import crypto from "crypto";

// Use an environment-provided secret in production. Fall back to a default
// for local development only. Do NOT commit a real secret to source control.
const SECRET = process.env.AUTH_SECRET || "ANTONIO-REST-API-DEV-FALLBACK";

// Generate a cryptographically secure random string to use as salts/tokens
export const random = (): string => crypto.randomBytes(128).toString("base64");

// Hashing helper: uses HMAC with SHA-256 combining salt and password.
// This is a simple helper — for production consider a slow KDF like bcrypt/scrypt/argon2.
export const authentication = (salt: string, password: string): string =>
  crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
