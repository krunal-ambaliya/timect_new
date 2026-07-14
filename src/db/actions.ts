"use server";

import { sql } from "./neon";

export interface Variant {
  id: string;
  name: string;
  image: string;
}

export interface SpecificationItem {
  label?: string;
  value?: string;
  [key: string]: any;
}

export interface Specification {
  title: string;
  type: string;
  items?: any[];
  content?: string;
}

export interface Product {
  id: number;
  name?: string;
  price: string;
  image?: string;
  isMainProduct: boolean;
  isNewArrival: boolean;
  isRecommended: boolean;
  isRelated: boolean;
  
  // Main product fields
  brand?: string;
  title?: string;
  subtitle?: string;
  priceSubtext?: string;
  sizes?: string[];
  images?: string[];
  variants?: Variant[];
  specifications?: Specification[];
  
  // New arrival fields
  tag?: string;
  emi?: string;
  
  // Recommended fields
  code?: string;
  
  // Related product fields
  collection?: string;
  description?: string;
}

function mapRowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name || undefined,
    price: row.price,
    image: row.image || undefined,
    isMainProduct: row.is_main_product,
    isNewArrival: row.is_new_arrival,
    isRecommended: row.is_recommended,
    isRelated: row.is_related,
    
    brand: row.brand || undefined,
    title: row.title || undefined,
    subtitle: row.subtitle || undefined,
    priceSubtext: row.price_subtext || undefined,
    sizes: row.sizes || undefined,
    images: row.images || undefined,
    variants: row.variants || undefined,
    specifications: row.specifications || undefined,
    
    tag: row.tag || undefined,
    emi: row.emi || undefined,
    
    code: row.code || undefined,
    
    collection: row.collection || undefined,
    description: row.description || undefined,
  };
}

export async function getMainProduct(): Promise<Product | null> {
  try {
    const rows = await sql`
      SELECT * FROM products 
      WHERE is_main_product = TRUE 
      LIMIT 1
    `;
    if (rows.length === 0) return null;
    return mapRowToProduct(rows[0]);
  } catch (error) {
    console.error("Error fetching main product:", error);
    return null;
  }
}

export async function getNewArrivals(): Promise<Product[]> {
  try {
    const rows = await sql`
      SELECT * FROM products 
      WHERE is_new_arrival = TRUE 
      ORDER BY id ASC
    `;
    return rows.map(mapRowToProduct);
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return [];
  }
}

export async function getRecommended(): Promise<Product[]> {
  try {
    const rows = await sql`
      SELECT * FROM products 
      WHERE is_recommended = TRUE 
      ORDER BY id ASC
    `;
    return rows.map(mapRowToProduct);
  } catch (error) {
    console.error("Error fetching recommended products:", error);
    return [];
  }
}

export async function getRelatedProducts(): Promise<Product[]> {
  try {
    const rows = await sql`
      SELECT * FROM products 
      WHERE is_related = TRUE 
      ORDER BY id ASC
    `;
    return rows.map(mapRowToProduct);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}
