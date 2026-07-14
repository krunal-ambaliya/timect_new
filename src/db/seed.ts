import fs from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";

// 1. Manually load environment variables from .env or .env.local
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
          const val = trimmed.substring(firstEqual + 1).trim().replace(/^['"]|['"]$/g, "");
          process.env[key] = val;
        }
      }
    }
    break;
  }
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("Error: DATABASE_URL is not defined in environment variables.");
  process.exit(1);
}

const sql = neon(dbUrl);

async function main() {
  console.log("Connecting to Neon database...");
  
  // 2. Create products table
  console.log("Creating 'products' table if not exists...");
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      is_main_product BOOLEAN NOT NULL DEFAULT FALSE,
      is_new_arrival BOOLEAN NOT NULL DEFAULT FALSE,
      is_recommended BOOLEAN NOT NULL DEFAULT FALSE,
      is_related BOOLEAN NOT NULL DEFAULT FALSE,
      
      name TEXT,
      price TEXT NOT NULL,
      image TEXT,
      
      brand TEXT,
      title TEXT,
      subtitle TEXT,
      price_subtext TEXT,
      sizes JSONB,
      images JSONB,
      variants JSONB,
      specifications JSONB,
      
      tag TEXT,
      emi TEXT,
      
      code TEXT,
      
      collection TEXT,
      description TEXT
    );
  `;
  
  // 3. Clear existing database rows
  console.log("Clearing existing products...");
  await sql`TRUNCATE TABLE products RESTART IDENTITY CASCADE;`;
  
  // 4. Read products.json
  const productsPath = path.resolve(process.cwd(), "src/data/products.json");
  if (!fs.existsSync(productsPath)) {
    console.error(`Error: File not found at ${productsPath}`);
    process.exit(1);
  }
  
  const rawData = fs.readFileSync(productsPath, "utf-8");
  const data = JSON.parse(rawData);
  
  console.log("Seeding main product...");
  const mainProduct = data.mainProduct;
  if (mainProduct) {
    await sql`
      INSERT INTO products (
        is_main_product, is_new_arrival, is_recommended, is_related,
        name, price, image, brand, title, subtitle, price_subtext,
        sizes, images, variants, specifications
      ) VALUES (
        TRUE, FALSE, FALSE, FALSE,
        ${mainProduct.title}, ${mainProduct.price}, ${mainProduct.images?.[0] || null}, 
        ${mainProduct.brand || null}, ${mainProduct.title || null}, ${mainProduct.subtitle || null}, ${mainProduct.priceSubtext || null},
        ${JSON.stringify(mainProduct.sizes || [])}, ${JSON.stringify(mainProduct.images || [])}, 
        ${JSON.stringify(mainProduct.variants || [])}, ${JSON.stringify(mainProduct.specifications || [])}
      );
    `;
  }
  
  console.log("Seeding new arrivals...");
  const newArrivals = data.newArrivals || [];
  for (const item of newArrivals) {
    await sql`
      INSERT INTO products (
        is_main_product, is_new_arrival, is_recommended, is_related,
        name, price, image, tag, emi
      ) VALUES (
        FALSE, TRUE, FALSE, FALSE,
        ${item.name}, ${item.price}, ${item.image || null}, ${item.tag || null}, ${item.emi || null}
      );
    `;
  }
  
  console.log("Seeding recommended products...");
  const recommended = data.recommended || [];
  for (const item of recommended) {
    await sql`
      INSERT INTO products (
        is_main_product, is_new_arrival, is_recommended, is_related,
        name, price, image, code
      ) VALUES (
        FALSE, FALSE, TRUE, FALSE,
        ${item.name}, ${item.price}, ${item.image || null}, ${item.code || null}
      );
    `;
  }
  
  console.log("Seeding related products...");
  const relatedProducts = data.relatedProducts || [];
  for (const item of relatedProducts) {
    await sql`
      INSERT INTO products (
        is_main_product, is_new_arrival, is_recommended, is_related,
        price, image, collection, description
      ) VALUES (
        FALSE, FALSE, FALSE, TRUE,
        ${item.price}, ${item.image || null}, ${item.collection || null}, ${item.description || null}
      );
    `;
  }
  
  console.log("Seeding complete! Database populated successfully.");
}

main().catch((err) => {
  console.error("Error during seeding:", err);
  process.exit(1);
});
