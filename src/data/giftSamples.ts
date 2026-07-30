/**
 * Corporate gifting sample catalog — static, in-code data.
 * No database reads/writes and no products.json dependency.
 * Images use existing Timect Cloudinary assets.
 */

export type GiftSample = {
  id: number;
  slug: string;
  name: string;
  title?: string;
  price: string;
  image: string;
  hoverImage?: string;
  brand?: string;
  collection?: string;
  gender?: string;
  isMainProduct: boolean;
  isNewArrival: boolean;
  isRecommended: boolean;
  isRelated: boolean;
};

const CDN = "https://res.cloudinary.com/dphscxzb4/image/upload";

export const GIFT_SAMPLES: GiftSample[] = [
  {
    id: 9001,
    slug: "timect-heritage-blue",
    name: "Heritage Blue Automatic",
    price: "₹ 1,25,000",
    image: `${CDN}/v1784048474/timect/image_4.png`,
    hoverImage: `${CDN}/v1784048472/timect/image_2.png`,
    brand: "Timect",
    collection: "Heritage",
    gender: "Men",
    isMainProduct: false,
    isNewArrival: true,
    isRecommended: true,
    isRelated: false,
  },
  {
    id: 9002,
    slug: "timect-presage-silk",
    name: "Presage Silk Classic",
    price: "₹ 1,30,000",
    image: `${CDN}/v1784048472/timect/image_2.png`,
    hoverImage: `${CDN}/v1784048474/timect/image_5.jpg`,
    brand: "Timect",
    collection: "Presage",
    gender: "Unisex",
    isMainProduct: false,
    isNewArrival: true,
    isRecommended: false,
    isRelated: false,
  },
  {
    id: 9003,
    slug: "timect-daydate-azure",
    name: "Day-Date Azure",
    price: "₹ 1,85,000",
    image: `${CDN}/v1784048468/timect/daydate_blue.png`,
    brand: "Timect",
    collection: "Day-Date",
    gender: "Men",
    isMainProduct: false,
    isNewArrival: false,
    isRecommended: true,
    isRelated: true,
  },
  {
    id: 9004,
    slug: "timect-gold-truton",
    name: "Gold Truton Chronograph",
    price: "₹ 2,10,000",
    image: `${CDN}/v1784048470/timect/gold_truton_chronograph.jpg`,
    brand: "Timect",
    collection: "Chronograph",
    gender: "Men",
    isMainProduct: false,
    isNewArrival: true,
    isRecommended: true,
    isRelated: false,
  },
  {
    id: 9005,
    slug: "timect-noir-graphite",
    name: "Noir Graphite",
    price: "₹ 98,000",
    image: `${CDN}/v1784048477/timect/image_8.webp`,
    hoverImage: `${CDN}/v1784048476/timect/image_7.jpg`,
    brand: "Timect",
    collection: "Noir",
    gender: "Unisex",
    isMainProduct: false,
    isNewArrival: false,
    isRecommended: true,
    isRelated: true,
  },
  {
    id: 9006,
    slug: "timect-silver-line",
    name: "Silver Line Automatic",
    price: "₹ 1,12,000",
    image: `${CDN}/v1784048480/timect/image_9.png`,
    brand: "Timect",
    collection: "Silver Line",
    gender: "Men",
    isMainProduct: false,
    isNewArrival: true,
    isRecommended: false,
    isRelated: true,
  },
  {
    id: 9007,
    slug: "timect-rose-gents",
    name: "Rose Gents Date",
    price: "₹ 1,45,000",
    image: `${CDN}/v1784048487/timect/rose_gents_date.png`,
    brand: "Timect",
    collection: "Rose",
    gender: "Men",
    isMainProduct: false,
    isNewArrival: false,
    isRecommended: true,
    isRelated: true,
  },
  {
    id: 9008,
    slug: "timect-rose-ladies",
    name: "Rose Ladies Édition",
    price: "₹ 1,38,000",
    image: `${CDN}/v1784048491/timect/rose_ladies.png`,
    brand: "Timect",
    collection: "Rose",
    gender: "Women",
    isMainProduct: false,
    isNewArrival: true,
    isRecommended: true,
    isRelated: false,
  },
  {
    id: 9009,
    slug: "timect-ladies-gold-tt",
    name: "Ladies Gold Two-Tone",
    price: "₹ 1,55,000",
    image: `${CDN}/v1784048481/timect/ladies_gold_tt.png`,
    brand: "Timect",
    collection: "Ladies",
    gender: "Women",
    isMainProduct: false,
    isNewArrival: false,
    isRecommended: true,
    isRelated: true,
  },
  {
    id: 9010,
    slug: "timect-signature-main",
    name: "Signature Field Watch",
    price: "₹ 1,20,000",
    image: `${CDN}/v1784048484/timect/right-main.png`,
    brand: "Timect",
    collection: "Signature",
    gender: "Unisex",
    isMainProduct: true,
    isNewArrival: false,
    isRecommended: true,
    isRelated: false,
  },
  {
    id: 9011,
    slug: "timect-forest-dial",
    name: "Forest Dial Automatic",
    price: "₹ 1,05,000",
    image: `${CDN}/v1784048476/timect/image_7.jpg`,
    brand: "Timect",
    collection: "Field",
    gender: "Men",
    isMainProduct: false,
    isNewArrival: true,
    isRecommended: false,
    isRelated: true,
  },
  {
    id: 9012,
    slug: "timect-studio-three",
    name: "Studio Three",
    price: "₹ 89,000",
    image: `${CDN}/v1784048472/timect/image_3.jpg`,
    brand: "Timect",
    collection: "Studio",
    gender: "Unisex",
    isMainProduct: false,
    isNewArrival: false,
    isRecommended: true,
    isRelated: true,
  },
  {
    id: 9013,
    slug: "timect-atelier-five",
    name: "Atelier Five",
    price: "₹ 1,18,000",
    image: `${CDN}/v1784048474/timect/image_5.jpg`,
    brand: "Timect",
    collection: "Atelier",
    gender: "Unisex",
    isMainProduct: false,
    isNewArrival: true,
    isRecommended: false,
    isRelated: true,
  },
  {
    id: 9014,
    slug: "timect-atelier-six",
    name: "Atelier Six Chrono",
    price: "₹ 1,62,000",
    image: `${CDN}/v1784048475/timect/image_6.jpg`,
    brand: "Timect",
    collection: "Atelier",
    gender: "Men",
    isMainProduct: false,
    isNewArrival: false,
    isRecommended: true,
    isRelated: true,
  },
];

/** Lightweight list for the orbital gift field UI. */
export function getGiftSamples() {
  return GIFT_SAMPLES.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    title: p.title,
    price: p.price,
    image: p.image,
    hoverImage: p.hoverImage,
  }));
}
