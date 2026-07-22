/** URL-safe slug from product name / title */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/** Ensure uniqueness by appending a short suffix when needed */
export function uniqueSlug(base: string, existing: Set<string>, idHint?: number): string {
  const root = slugify(base) || "product";
  if (!existing.has(root)) return root;
  if (idHint && !existing.has(`${root}-${idHint}`)) return `${root}-${idHint}`;
  let n = 2;
  while (existing.has(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}
