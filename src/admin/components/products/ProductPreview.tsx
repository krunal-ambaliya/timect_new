"use client";

import type { ProductInput } from "@/admin/lib/product-mapper";

/** Lightweight storefront-style PDP preview (mirrors public product page layout) */
export default function ProductPreview({ data }: { data: ProductInput }) {
  const title = data.title || data.name || "Untitled product";
  const images =
    data.images && data.images.length > 0
      ? data.images
      : data.image
        ? [data.image]
        : [];
  const main = images[0] || "";
  const specs = data.specifications || [];
  const sizes = data.sizes || [];
  const variants = data.variants || [];

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--admin-line)] bg-white text-[#111]">
      <div className="border-b border-[#e5e5e5] bg-[#fafafa] px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-[#6b6b6b]">
        Storefront preview · /product/{data.slug || "…"}
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        {/* Gallery */}
        <div className="flex flex-col-reverse gap-3 bg-[#f7f7f7] p-4 lg:flex-row">
          <div className="flex gap-2 overflow-x-auto lg:w-16 lg:flex-col">
            {images.slice(0, 5).map((img, i) => (
              <div
                key={i}
                className="relative h-16 w-14 shrink-0 overflow-hidden border border-[#ddd] bg-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <div className="relative min-h-[280px] flex-1 overflow-hidden bg-white">
            {main ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={main}
                alt={title}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full min-h-[280px] items-center justify-center text-sm text-gray-400">
                No image
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5 p-6 font-sans">
          {data.brand && (
            <span className="inline-block w-fit border border-gray-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
              {data.brand}
            </span>
          )}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0a1e36] lg:text-3xl">
              {title}
            </h1>
            {(data.subtitle || data.description) && (
              <p className="mt-2 text-sm text-gray-600">
                {data.subtitle || data.description}
              </p>
            )}
          </div>

          {sizes.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium">Case size:</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <span
                    key={s}
                    className="border border-gray-300 px-3 py-1.5 text-sm text-gray-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {variants.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium">Variants:</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center gap-2 rounded border border-gray-200 px-2 py-1 text-xs"
                  >
                    {v.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={v.image}
                        alt=""
                        className="h-6 w-6 rounded object-cover"
                      />
                    )}
                    {v.name || "Unnamed"}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-2xl font-semibold">{data.price || "—"}</p>
            {data.priceSubtext && (
              <p className="mt-1 text-xs text-gray-500">{data.priceSubtext}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider text-gray-500">
            {data.isNewArrival && (
              <span className="rounded bg-black px-2 py-1 text-white">New</span>
            )}
            {data.isRecommended && (
              <span className="rounded border px-2 py-1">Recommended</span>
            )}
            {data.isRelated && (
              <span className="rounded border px-2 py-1">Related</span>
            )}
            {data.isMainProduct && (
              <span className="rounded border px-2 py-1">Main</span>
            )}
            {data.tag && (
              <span className="rounded border px-2 py-1">{data.tag}</span>
            )}
            {data.gender && (
              <span className="rounded border px-2 py-1">{data.gender}</span>
            )}
            {data.collection && (
              <span className="rounded border px-2 py-1">
                {data.collection}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Specs accordion-style */}
      {specs.length > 0 && (
        <div className="border-t border-[#e5e5e5] px-6 py-4">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Specifications
          </h2>
          <div className="divide-y divide-[#e5e5e5]">
            {specs.map((spec, i) => (
              <details key={i} className="group py-3" open={i === 0}>
                <summary className="cursor-pointer list-none text-sm font-semibold text-[#0a1e36]">
                  {spec.title}
                </summary>
                <div className="mt-2 text-sm text-gray-700">
                  {spec.type === "text" && <p>{spec.content}</p>}
                  {spec.type === "details" && Array.isArray(spec.items) && (
                    <ul className="list-inside list-disc space-y-1">
                      {(spec.items as string[]).map((line, j) => (
                        <li key={j}>{line}</li>
                      ))}
                    </ul>
                  )}
                  {spec.type === "grid" && Array.isArray(spec.items) && (
                    <div className="grid grid-cols-2 gap-2">
                      {spec.items.map(
                        (
                          item: { label?: string; value?: string },
                          j: number,
                        ) => (
                          <div key={j}>
                            <span className="text-gray-500">
                              {item.label}:{" "}
                            </span>
                            {item.value}
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
