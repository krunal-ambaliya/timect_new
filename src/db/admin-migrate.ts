/**
 * Non-destructive admin schema migration.
 * Creates admin_users, media_library, cms_settings, audit_logs if missing.
 * Seeds a default super admin when none exist (credentials from env).
 *
 *   npx tsx src/db/admin-migrate.ts
 *
 * Does NOT touch the products table.
 */
import fs from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

for (const envFile of [".env.local", ".env"]) {
  const envPath = path.resolve(process.cwd(), envFile);
  if (fs.existsSync(envPath)) {
    console.log(`Loading environment variables from ${envFile}`);
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const firstEqual = trimmed.indexOf("=");
        if (firstEqual !== -1) {
          const key = trimmed.substring(0, firstEqual).trim();
          const val = trimmed
            .substring(firstEqual + 1)
            .trim()
            .replace(/^['"]|['"]$/g, "");
          if (!process.env[key]) process.env[key] = val;
        }
      }
    }
    break;
  }
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("Error: DATABASE_URL is not defined.");
  process.exit(1);
}

const sql = neon(dbUrl);

async function main() {
  console.log("Running admin schema migration (non-destructive)...");

  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin'
        CHECK (role IN ('super_admin', 'admin', 'manager', 'viewer')),
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_login TIMESTAMPTZ
    );
  `;
  console.log("✓ admin_users");

  await sql`
    CREATE TABLE IF NOT EXISTS media_library (
      id SERIAL PRIMARY KEY,
      url TEXT NOT NULL,
      public_id TEXT,
      filename TEXT,
      folder TEXT NOT NULL DEFAULT 'general',
      mime_type TEXT,
      size_bytes INTEGER,
      width INTEGER,
      height INTEGER,
      alt_text TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS media_library_folder_idx
    ON media_library (folder);
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS media_library_filename_idx
    ON media_library (filename);
  `;
  console.log("✓ media_library");

  await sql`
    CREATE TABLE IF NOT EXISTS cms_settings (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  console.log("✓ cms_settings");

  await sql`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id SERIAL PRIMARY KEY,
      admin_user_id INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
      action TEXT NOT NULL,
      entity_type TEXT,
      entity_id TEXT,
      meta JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  console.log("✓ audit_logs");

  // Seed default admin if none
  const existing = await sql`SELECT id FROM admin_users LIMIT 1`;
  if (existing.length === 0) {
    const email =
      process.env.ADMIN_SEED_EMAIL || "admin@timect.com";
    const password =
      process.env.ADMIN_SEED_PASSWORD || "TimectAdmin!2026";
    const fullName = process.env.ADMIN_SEED_NAME || "Timect Super Admin";
    const hash = await bcrypt.hash(password, 12);

    await sql`
      INSERT INTO admin_users (full_name, email, password_hash, role, is_active)
      VALUES (${fullName}, ${email.toLowerCase()}, ${hash}, 'super_admin', TRUE)
    `;
    console.log("");
    console.log("────────────────────────────────────────");
    console.log("Seeded default super admin:");
    console.log(`  Email:    ${email}`);
    console.log(`  Password: ${password}`);
    console.log("  Change this password after first login.");
    console.log("────────────────────────────────────────");
  } else {
    console.log("Admin users already present — skip seed.");
  }

  // Seed default CMS settings from static catalog data if empty
  const shopSetting =
    await sql`SELECT key FROM cms_settings WHERE key = 'shop_by_category'`;
  if (shopSetting.length === 0) {
    const { SHOP_BY_CATEGORY } = await import("../data/categoryFilters");
    await sql`
      INSERT INTO cms_settings (key, value)
      VALUES ('shop_by_category', ${JSON.stringify([...SHOP_BY_CATEGORY])}::jsonb)
      ON CONFLICT (key) DO NOTHING
    `;
    console.log("✓ seeded shop_by_category from static data");
  }

  const filtersSetting =
    await sql`SELECT key FROM cms_settings WHERE key = 'catalog_filters'`;
  if (filtersSetting.length === 0) {
    const { CATALOG_FILTERS } = await import("../data/categoryFilters");
    await sql`
      INSERT INTO cms_settings (key, value)
      VALUES ('catalog_filters', ${JSON.stringify(CATALOG_FILTERS)}::jsonb)
      ON CONFLICT (key) DO NOTHING
    `;
    console.log("✓ seeded catalog_filters from static data");
  }

  console.log("\nAdmin migration complete.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
