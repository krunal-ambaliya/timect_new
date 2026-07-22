"use server";

import { sql } from "./neon";
import { getCatalogFilter } from "@/data/categoryFilters";
import {
  catalogFilterSqlKeywords,
  productMatchesCatalogFilter,
} from "@/lib/specifications";

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
  slug: string;
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
  
  // Recommended fields
  code?: string;
  
  // Related product fields
  collection?: string;
  description?: string;
  gender?: string;
  rating?: number;
  hoverImage?: string;
}

function mapRowToProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
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
    
    code: row.code || undefined,
    
    collection: row.collection || undefined,
    description: row.description || undefined,
    gender: row.gender || undefined,
    rating: row.rating ? parseFloat(row.rating) : undefined,
    hoverImage: row.hover_image || undefined,
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

export async function getProductById(id: number): Promise<Product | null> {
  try {
    const rows = await sql`
      SELECT * FROM products 
      WHERE id = ${id}
      LIMIT 1
    `;
    if (rows.length === 0) return null;
    return mapRowToProduct(rows[0]);
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return null;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const rows = await sql`
      SELECT * FROM products 
      WHERE slug = ${slug}
      LIMIT 1
    `;
    if (rows.length === 0) return null;
    return mapRowToProduct(rows[0]);
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    return null;
  }
}

export async function getFilteredProducts(filters: {
  search?: string;
  genders?: string[];
  brands?: string[];
  priceMin?: number;
  priceMax?: number;
  category?: string; // 'all', 'new', 'recommended', 'related'
  /**
   * Shop-by-category / collection slug (e.g. quartz-precision, blue).
   * Matched against products.specifications JSONB + related text fields.
   */
  filter?: string;
  /**
   * Optional free-form specification keyword(s), comma-separated.
   * Example: "Quartz,Chronograph" — any match in specifications JSONB.
   */
  spec?: string;
  sortBy?: string; // 'newest' | 'price-asc' | 'price-desc'
  page?: number;
  pageSize?: number;
}): Promise<{ products: Product[]; total: number; hasMore: boolean }> {
  try {
    const catalogFilter = getCatalogFilter(filters.filter);
    const sqlKeywords = catalogFilter
      ? catalogFilterSqlKeywords(catalogFilter)
      : [];
    const freeSpecKeywords = (filters.spec || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // PostgreSQL JSONB pre-filter: shrink candidate set using ILIKE on specs + text fields.
    // Precise category matching still runs in JS (supports section/label structure).
    let rows;
    const prefilterKeywords = [...sqlKeywords, ...freeSpecKeywords];

    if (prefilterKeywords.length > 0) {
      // Regex any-of for JSONB text + catalog fields (GIN index helps specs lookups at scale)
      const escaped = prefilterKeywords
        .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|");
      const pattern = `(${escaped})`;
      rows = await sql`
        SELECT * FROM products
        WHERE
          COALESCE(specifications::text, '') ~* ${pattern}
          OR COALESCE(name, '') ~* ${pattern}
          OR COALESCE(title, '') ~* ${pattern}
          OR COALESCE(subtitle, '') ~* ${pattern}
          OR COALESCE(description, '') ~* ${pattern}
          OR COALESCE(collection, '') ~* ${pattern}
          OR COALESCE(brand, '') ~* ${pattern}
        ORDER BY id ASC
      `;
    } else {
      rows = await sql`SELECT * FROM products ORDER BY id ASC`;
    }

    let products = rows.map(mapRowToProduct);

    // 1. Filter by category pill (homepage sections)
    if (filters.category && filters.category !== "all") {
      if (filters.category === "new") {
        products = products.filter((p) => p.isNewArrival);
      } else if (filters.category === "recommended") {
        products = products.filter((p) => p.isRecommended);
      } else if (filters.category === "related") {
        products = products.filter((p) => p.isRelated);
      }
    }

    // 2. Catalog filter from shop-by-category / collection cards (specifications JSONB)
    if (catalogFilter) {
      products = products.filter((p) =>
        productMatchesCatalogFilter(p, catalogFilter),
      );
    }

    // 3. Free-form spec keywords (any match against flattened specifications)
    if (freeSpecKeywords.length > 0) {
      products = products.filter((p) => {
        const blob = [
          JSON.stringify(p.specifications || []),
          p.name,
          p.title,
          p.description,
          p.collection,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return freeSpecKeywords.some((kw) => blob.includes(kw.toLowerCase()));
      });
    }

    // Helper to clean price string to number for comparison
    const parsePrice = (priceStr: string): number => {
      const cleaned = priceStr.replace(/[^\d.]/g, "");
      return cleaned ? parseFloat(cleaned) : 0;
    };

    // 4. Filter by price range
    if (filters.priceMin !== undefined) {
      products = products.filter(
        (p) => parsePrice(p.price) >= (filters.priceMin || 0),
      );
    }
    if (filters.priceMax !== undefined) {
      products = products.filter(
        (p) => parsePrice(p.price) <= (filters.priceMax || Infinity),
      );
    }

    // 5. Filter by gender
    if (filters.genders && filters.genders.length > 0) {
      products = products.filter(
        (p) => p.gender && filters.genders!.includes(p.gender),
      );
    }

    // 6. Filter by brand
    if (filters.brands && filters.brands.length > 0) {
      products = products.filter((p) => {
        const productBrand = p.brand || p.collection || "Seiko";
        return filters.brands!.some((b) =>
          productBrand.toLowerCase().includes(b.toLowerCase()),
        );
      });
    }

    // 7. Filter by search query (includes specifications JSON)
    if (filters.search) {
      const q = filters.search.toLowerCase();
      products = products.filter((p) => {
        const name = (p.name || p.title || "").toLowerCase();
        const brand = (p.brand || p.collection || "").toLowerCase();
        const subtitle = (p.subtitle || p.description || "").toLowerCase();
        const specs = JSON.stringify(p.specifications || []).toLowerCase();
        return (
          name.includes(q) ||
          brand.includes(q) ||
          subtitle.includes(q) ||
          specs.includes(q)
        );
      });
    }

    // 8. Sort
    if (filters.sortBy) {
      if (filters.sortBy === "price-asc") {
        products.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
      } else if (filters.sortBy === "price-desc") {
        products.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
      } else if (filters.sortBy === "newest") {
        products.sort((a, b) => b.id - a.id);
      }
    }

    const total = products.length;
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    const start = (page - 1) * pageSize;
    const paginatedProducts = products.slice(start, start + pageSize);

    return {
      products: paginatedProducts,
      total,
      hasMore: start + pageSize < total,
    };
  } catch (error) {
    console.error("Error filtering products:", error);
    return {
      products: [],
      total: 0,
      hasMore: false,
    };
  }
}


