/**
 * Catalog category cards → flexible specification filters.
 * Matching runs against the products.specifications JSONB (and related text fields).
 * Add new categories here without schema migrations.
 */

export type SpecCriterion = {
  /**
   * Optional specification section title to scope the match
   * (e.g. "Case", "Dial & Hands", "Movement & Functions", "Strap").
   * Case-insensitive partial match.
   */
  section?: string;
  /**
   * Optional attribute label within a grid section
   * (e.g. "Dial color", "Movement Type").
   */
  label?: string;
  /**
   * Values that satisfy this criterion (OR within the criterion).
   * Matched case-insensitively as substrings against labels, values, and detail lines.
   */
  values: string[];
};

export type CatalogFilter = {
  slug: string;
  label: string;
  description?: string;
  /**
   * Match if ANY criterion group succeeds.
   * Each group is AND of its criteria (all must match).
   * Empty groups / empty anyOfGroups → match all products with readable catalog text.
   */
  anyOfGroups?: SpecCriterion[][];
  /**
   * Free-text keywords matched against flattened specifications + name/title/description.
   * ANY keyword is enough (OR). Used as a fallback / simple path.
   */
  keywordsAny?: string[];
  /**
   * ALL keywords must appear somewhere in flattened product+specs text.
   */
  keywordsAll?: string[];
  /**
   * Restrict by product.gender (exact match, any of).
   */
  genders?: string[];
};

export const CATALOG_FILTERS: Record<string, CatalogFilter> = {
  "quartz-precision": {
    slug: "quartz-precision",
    label: "Quartz Precision",
    description: "Watches powered by precise quartz movements",
    anyOfGroups: [
      [
        {
          section: "Movement",
          label: "Movement Type",
          values: ["Quartz"],
        },
      ],
      [{ values: ["Quartz"] }],
    ],
    keywordsAny: ["Quartz"],
  },
  "sports-chronographs": {
    slug: "sports-chronographs",
    label: "Sports & Chronographs",
    description: "Performance sports watches and chronographs",
    anyOfGroups: [
      [{ values: ["Chronograph"] }],
      [{ values: ["Sports"] }],
      [{ values: ["Diving"] }],
      [
        {
          section: "Case",
          values: ["30 bar", "20 bar", "Water-resistant to 20", "Water-resistant to 30"],
        },
      ],
    ],
    keywordsAny: ["Chronograph", "Sports", "Diving"],
  },
  "case-size": {
    slug: "case-size",
    label: "Case Size",
    description: "Watches with defined case dimensions",
    anyOfGroups: [
      [{ section: "Case", label: "Dimension", values: ["mm"] }],
      [{ values: ["Dimension:"] }],
    ],
    keywordsAny: ["Dimension:", "mm"],
  },
  "dress-luxury": {
    slug: "dress-luxury",
    label: "Dress & Luxury",
    description: "Refined dress and luxury timepieces",
    anyOfGroups: [
      [{ values: ["Dress"] }],
      [{ values: ["Luxury"] }],
      [{ values: ["Classic"] }],
      [{ values: ["Elegant"] }],
      [{ values: ["Presage"] }],
    ],
    keywordsAny: ["Dress", "Luxury", "Classic", "Elegant"],
  },
  material: {
    slug: "material",
    label: "Material",
    description: "Filter by case and bracelet materials",
    anyOfGroups: [
      [{ section: "Case", values: ["Stainless steel"] }],
      [{ section: "Case", values: ["Ceramic"] }],
      [{ section: "Case", values: ["Gold"] }],
      [{ section: "Case", values: ["Titanium"] }],
      [{ section: "Strap", values: ["Stainless steel"] }],
      [{ section: "Strap", values: ["Leather"] }],
    ],
    keywordsAny: ["Stainless steel", "Ceramic", "Titanium", "Leather", "Gold"],
  },
  "gold-truton": {
    slug: "gold-truton",
    label: "Gold Truton",
    description: "Gold Truton collection",
    anyOfGroups: [
      [{ values: ["Gold Truton"] }],
      [{ values: ["Truton"] }],
      [
        {
          section: "Dial",
          values: ["Gold"],
        },
        {
          section: "Case",
          values: ["Gold", "PVD", "Yellow"],
        },
      ],
    ],
    keywordsAny: ["Gold Truton", "Truton", "yellow PVD", "Yellow gold"],
  },
  blue: {
    slug: "blue",
    label: "Blue",
    description: "Blue dial and blue-accent watches",
    anyOfGroups: [
      [{ section: "Dial", label: "Dial color", values: ["Blue"] }],
      [{ values: ["Blue"] }],
    ],
    keywordsAny: ["Blue"],
  },
  ladies: {
    slug: "ladies",
    label: "Ladies",
    description: "Ladies and women's watches",
    genders: ["Women"],
    anyOfGroups: [[{ values: ["Ladies"] }], [{ values: ["Women"] }]],
    keywordsAny: ["Ladies", "Women"],
  },
  "rose-gold": {
    slug: "rose-gold",
    label: "Rose Gold",
    description: "Rose gold cases and accents",
    anyOfGroups: [
      [{ values: ["Rose gold"] }],
      [{ values: ["Rose Gold"] }],
      [{ values: ["rose PVD"] }],
    ],
    keywordsAny: ["Rose gold", "Rose Gold"],
  },
  "rose-ladies": {
    slug: "rose-ladies",
    label: "Rose Ladies",
    description: "Ladies watches with rose gold finishing",
    genders: ["Women", "Unisex"],
    anyOfGroups: [
      [{ values: ["Rose gold"] }, { values: ["Ladies"] }],
      [{ values: ["Rose Gold"] }],
    ],
    keywordsAny: ["Rose gold", "Rose Gold", "Ladies"],
    keywordsAll: ["Rose"],
  },
  "special-edition": {
    slug: "special-edition",
    label: "Special Edition",
    description: "Limited and exclusive editions",
    anyOfGroups: [
      [{ values: ["Limited"] }],
      [{ values: ["Exclusive"] }],
      [{ values: ["Special Edition"] }],
    ],
    keywordsAny: ["Limited", "Exclusive", "Special Edition"],
  },
  him: {
    slug: "him",
    label: "For Him",
    description: "Men's watches",
    genders: ["Men", "Unisex"],
  },
  her: {
    slug: "her",
    label: "For Her",
    description: "Women's watches",
    genders: ["Women", "Unisex"],
  },
};

export function getCatalogFilter(slug: string | null | undefined): CatalogFilter | null {
  if (!slug) return null;
  return CATALOG_FILTERS[slug] ?? null;
}

export function getCatalogFilterLabel(slug: string | null | undefined): string | null {
  return getCatalogFilter(slug)?.label ?? null;
}

/** Homepage "Shop by Category" cards + watches sidebar collection filters (ordered). */
export const SHOP_BY_CATEGORY = [
  {
    slug: "sports-chronographs",
    label: "Sports & Chronographs",
    image:
      "https://res.cloudinary.com/dphscxzb4/image/upload/v1784048474/timect/image_5.jpg",
    bg: "linear-gradient(160deg,#3a3a3a,#0a0a0a)",
  },
  {
    slug: "dress-luxury",
    label: "Dress & Luxury",
    image:
      "https://res.cloudinary.com/dphscxzb4/image/upload/v1784048474/timect/image_5.jpg",
    bg: "linear-gradient(160deg,#161616,#000)",
  },
  {
    slug: "gold-truton",
    label: "GOLD TRUTON",
    image:
      "https://res.cloudinary.com/dphscxzb4/image/upload/v1784048470/timect/gold_truton_chronograph.jpg",
    bg: "linear-gradient(160deg,#1a2a3a,#0a1622)",
  },
  {
    slug: "blue",
    label: "BLUE",
    image:
      "https://res.cloudinary.com/dphscxzb4/image/upload/v1784048468/timect/daydate_blue.png",
    bg: "linear-gradient(160deg,#0d3a56,#04141f)",
  },
  {
    slug: "ladies",
    label: "LADIES",
    image:
      "https://res.cloudinary.com/dphscxzb4/image/upload/v1784048481/timect/ladies_gold_tt.png",
    bg: "linear-gradient(160deg,#dedac8,#b7b295)",
  },
  {
    slug: "rose-ladies",
    label: "ROSE LADIES",
    image:
      "https://res.cloudinary.com/dphscxzb4/image/upload/v1784048491/timect/rose_ladies.png",
    bg: "linear-gradient(160deg,#0c0c0c,#000)",
  },
] as const;

export type ShopByCategorySlug = (typeof SHOP_BY_CATEGORY)[number]["slug"];

