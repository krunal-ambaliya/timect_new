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
  emi?: string;
  
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
    emi: row.emi || undefined,
    
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
  sortBy?: string; // 'newest' | 'price-asc' | 'price-desc'
}): Promise<Product[]> {
  try {
    const rows = await sql`SELECT * FROM products ORDER BY id ASC`;
    let products = rows.map(mapRowToProduct);

    // 1. Filter by category pill
    if (filters.category && filters.category !== 'all') {
      if (filters.category === 'new') {
        products = products.filter(p => p.isNewArrival);
      } else if (filters.category === 'recommended') {
        products = products.filter(p => p.isRecommended);
      } else if (filters.category === 'related') {
        products = products.filter(p => p.isRelated);
      }
    }

    // Helper to clean price string to number for comparison
    const parsePrice = (priceStr: string): number => {
      const cleaned = priceStr.replace(/[^\d.]/g, '');
      return cleaned ? parseFloat(cleaned) : 0;
    };

    // 2. Filter by price range
    if (filters.priceMin !== undefined) {
      products = products.filter(p => parsePrice(p.price) >= (filters.priceMin || 0));
    }
    if (filters.priceMax !== undefined) {
      products = products.filter(p => parsePrice(p.price) <= (filters.priceMax || Infinity));
    }

    // 3. Filter by gender
    if (filters.genders && filters.genders.length > 0) {
      products = products.filter(p => p.gender && filters.genders!.includes(p.gender));
    }

    // 4. Filter by brand
    if (filters.brands && filters.brands.length > 0) {
      products = products.filter(p => {
        const productBrand = p.brand || p.collection || 'Seiko'; // default fallback
        return filters.brands!.some(b => productBrand.toLowerCase().includes(b.toLowerCase()));
      });
    }

    // 5. Filter by search query
    if (filters.search) {
      const q = filters.search.toLowerCase();
      products = products.filter(p => {
        const name = (p.name || p.title || '').toLowerCase();
        const brand = (p.brand || p.collection || '').toLowerCase();
        const subtitle = (p.subtitle || p.description || '').toLowerCase();
        return name.includes(q) || brand.includes(q) || subtitle.includes(q);
      });
    }

    // 6. Sort
    if (filters.sortBy) {
      if (filters.sortBy === 'price-asc') {
        products.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
      } else if (filters.sortBy === 'price-desc') {
        products.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
      } else if (filters.sortBy === 'newest') {
        products.sort((a, b) => b.id - a.id);
      }
    }

    return products;
  } catch (error) {
    console.error("Error filtering products:", error);
    return [];
  }
}


