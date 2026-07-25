/**
 * Utility to format price strings to always have the rupee symbol (₹) and clean/proper formatting.
 */
export function formatPrice(price: string | number | undefined | null): string {
  if (price === undefined || price === null) return "";
  const priceStr = String(price).trim();
  if (!priceStr) return "";

  const cleaned = priceStr.replace(/[^\d.]/g, "");
  if (!cleaned) {
    return priceStr.startsWith("₹") ? priceStr : `₹${priceStr}`;
  }

  const num = parseFloat(cleaned);
  if (isNaN(num)) {
    return priceStr.startsWith("₹") ? priceStr : `₹${priceStr}`;
  }

  try {
    const hasDecimal = priceStr.includes(".");
    const formatter = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: hasDecimal ? 2 : 0,
      maximumFractionDigits: 2,
    });
    return `₹${formatter.format(num)}`;
  } catch (e) {
    return priceStr.startsWith("₹") ? priceStr : `₹${priceStr}`;
  }
}
