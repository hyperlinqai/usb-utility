import * as fs from "fs";
import * as path from "path";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../shared/schema";

// Manually load .env file since dotenv v17 has issues
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    const envContent = fs.readFileSync(envPath, "utf-8");
    const lines = envContent.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;

      const key = trimmed.substring(0, eqIndex).trim();
      let value = trimmed.substring(eqIndex + 1).trim();

      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Unescape escaped quotes
      value = value.replace(/\\"/g, '"');

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch (err) {
    console.error("Failed to load .env file:", err);
  }
}

loadEnv();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not found");
  throw new Error("DATABASE_URL is not set");
}

// Ensure we force UTC timezone for consistent date handling
let connectionUrl = process.env.DATABASE_URL;
// Append timezone=Z (UTC) if not already present
if (!connectionUrl.includes("timezone=")) {
  const separator = connectionUrl.includes("?") ? "&" : "?";
  connectionUrl += `${separator}timezone=Z`;
}

const pool = mysql.createPool(connectionUrl);
export const db = drizzle(pool, { schema, mode: "default" });
