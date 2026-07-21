"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TopStrip from "@/components/TopStrip";
import { getFilteredProducts, Product } from "@/db/actions";
import {
  LucideHeart,
  LucideSearch,
  LucideSlidersHorizontal,
  LucideStar,
} from "lucide-react";

function WatchesCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL-driven initial category
  const urlCategory = searchParams.get("category") || "all";

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 250000]);
  const [activeCategory, setActiveCategory] = useState<string>(urlCategory);
  const [sortBy, setSortBy] = useState<string>("newest");

  // Trigger state for fetching data
  const [triggerFetch, setTriggerFetch] = useState(0);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Mobile sidebar visibility
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Synchronize category with URL changes
  useEffect(() => {
    const category = searchParams.get("category") || "all";
    setActiveCategory(category);
    setTriggerFetch((prev) => prev + 1);
  }, [searchParams]);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    getFilteredProducts({
      search: searchQuery,
      genders: selectedGenders,
      brands: selectedBrands,
      priceMin: priceRange[0],
      priceMax: priceRange[1],
      category: activeCategory,
      sortBy: sortBy,
    }).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, [triggerFetch, activeCategory, sortBy]);

  const handleApplyFilters = () => {
    setMobileSidebarOpen(false);
    setTriggerFetch((prev) => prev + 1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedGenders([]);
    setSelectedBrands([]);
    setPriceRange([0, 250000]);
    setTriggerFetch((prev) => prev + 1);
  };

  const handleGenderChange = (gender: string) => {
    setSelectedGenders((prev) =>
      prev.includes(gender)
        ? prev.filter((g) => g !== gender)
        : [...prev, gender],
    );
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  // Quick categories pills
  const categoriesList = [
    { id: "all", label: "All Watches" },
    { id: "new", label: "New Arrivals" },
    { id: "recommended", label: "Best Sellers" },
    { id: "related", label: "Premium Collections" },
  ];

  // Helper to clean price format for display
  const formatPrice = (priceVal: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(priceVal);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#111111]">
      <TopStrip />
      <Header />

      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top bar categories */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  // Update URL query param silently
                  router.push(`/watches?category=${cat.id}`, { scroll: false });
                }}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-black text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-black"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-white px-4 py-2 border border-gray-200 rounded-md text-xs font-bold tracking-wider hover:border-black transition"
            >
              <LucideSlidersHorizontal className="h-4 w-4" />
              Filters
            </button>

            {/* Sort Select */}
            <div className="flex items-center gap-2 bg-white px-3 py-2 border border-gray-200 rounded-md">
              <span className="text-xs text-gray-500 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-bold bg-transparent outline-none cursor-pointer text-gray-800"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block bg-white p-6 rounded-2xl border border-gray-200 h-fit sticky top-24 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h3 className="text-sm font-bold tracking-wider uppercase text-gray-900">
                Filters
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs text-gray-500 hover:text-black font-semibold hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Search filter */}
            <div className="mb-6">
              <label className="block text-xs font-bold tracking-wider uppercase text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search watches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:bg-white focus:border-black focus:outline-none transition-all"
                />
                <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold tracking-wider uppercase text-gray-700">
                  Max Price
                </label>
                <span className="text-xs font-bold text-gray-900">
                  {formatPrice(priceRange[1])}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="250000"
                step="5000"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value, 10)])
                }
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black mb-1"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                <span>{formatPrice(0)}</span>
                <span>{formatPrice(125000)}</span>
                <span>{formatPrice(250000)}</span>
              </div>
            </div>

            {/* Gender filter */}
            <div className="mb-6 border-t border-gray-100 pt-4">
              <h4 className="text-xs font-bold tracking-wider uppercase text-gray-700 mb-3">
                Gender
              </h4>
              <div className="space-y-2">
                {["Men", "Women", "Unisex"].map((gender) => (
                  <label
                    key={gender}
                    className="flex items-center gap-3 text-xs text-gray-600 font-medium cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGenders.includes(gender)}
                      onChange={() => handleGenderChange(gender)}
                      className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer accent-black"
                    />
                    {gender}
                  </label>
                ))}
              </div>
            </div>

            {/* Brand filter */}
            <div className="mb-8 border-t border-gray-100 pt-4">
              <h4 className="text-xs font-bold tracking-wider uppercase text-gray-700 mb-3">
                Brand / Collection
              </h4>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 no-scrollbar">
                {[
                  "Exclusive",
                  "Presage",
                  "Prospex",
                  "Astron",
                  "HYDROCONQUEST",
                  "Seiko",
                ].map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-3 text-xs text-gray-600 font-medium cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                      className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer accent-black"
                    />
                    {brand}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleApplyFilters}
              className="w-full bg-black text-white py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 transition duration-300 shadow-sm"
            >
              Apply Filters
            </button>
          </aside>

          {/* Catalog Grid */}
          <div className="lg:col-span-3">
            {/* Active filters status / Results count */}
            <div className="flex items-center justify-between mb-6 px-1">
              <p className="text-xs text-gray-500 font-medium">
                Showing{" "}
                <span className="font-bold text-gray-900">
                  {products.length}
                </span>{" "}
                luxury watches
              </p>
            </div>

            {loading ? (
              <div className="min-h-[400px] flex items-center justify-center bg-white rounded-2xl border border-gray-200">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <p className="text-gray-500 font-medium mb-4">
                  No watches found matching the selected filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-black text-white px-6 py-2.5 rounded-lg text-xs font-bold tracking-wider hover:bg-neutral-800 transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => {
                  const displayBrand =
                    product.brand || product.collection || "Seiko";
                  const displayName =
                    product.name || product.title || "Exclusive Watch";

                  return (
                    <div
                      key={product.id}
                      onClick={() => router.push(`/product/${product.slug}`)}
                      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col p-4 cursor-pointer hover:shadow-xl transition-all duration-500 hover:-translate-y-2 min-w-0"
                    >
                      {/* Product Image block (light gray backdrop) */}
                      <div className="relative aspect-square w-full bg-slate-50 rounded-xl mb-4 overflow-hidden">
                        {/* Top tag (e.g. New / Offer) */}
                        {product.tag && (
                          <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold px-2 py-0.5 tracking-widest rounded-md uppercase z-10">
                            {product.tag}
                          </span>
                        )}
                        {product.isMainProduct && (
                          <span className="absolute top-3 left-3 bg-[#0c2c42] text-white text-[9px] font-bold px-2 py-0.5 tracking-widest rounded-md uppercase z-10">
                            EXCLUSIVE
                          </span>
                        )}

                        {/* Favorite button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="absolute top-3 right-3 h-8 w-8 bg-white border border-gray-150 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 text-gray-400 transition z-10 shadow-sm"
                        >
                          <LucideHeart className="h-4 w-4" />
                        </button>

                        {product.hoverImage ? (
                          <>
                            <img
                              src={
                                product.image ||
                                "https://res.cloudinary.com/dphscxzb4/image/upload/v1784048474/timect/image_4.png"
                              }
                              alt={displayName}
                              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 group-hover:opacity-0 pointer-events-none"
                            />
                            <img
                              src={product.hoverImage}
                              alt={`${displayName} hover`}
                              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
                            />
                          </>
                        ) : (
                          <img
                            src={
                              product.image ||
                              "https://res.cloudinary.com/dphscxzb4/image/upload/v1784048474/timect/image_4.png"
                            }
                            alt={displayName}
                            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                          />
                        )}
                      </div>

                      {/* Product Metadata */}
                      <div className="flex-grow flex flex-col space-y-1 px-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase truncate max-w-[70%]">
                            {displayBrand}
                          </span>

                          {/* Stars Rating */}
                          <div className="flex items-center gap-1 text-amber-500 shrink-0">
                            <LucideStar className="h-3 w-3 fill-amber-500" />
                            <span className="text-[10px] font-bold text-gray-600">
                              {product.rating || "4.5"}
                            </span>
                          </div>
                        </div>

                        <h3
                          className="text-xs font-bold text-gray-900 uppercase truncate leading-tight mt-1"
                          title={displayName}
                        >
                          {displayName}
                        </h3>

                        {product.code && (
                          <span className="text-[10px] font-medium text-gray-400">
                            Ref: {product.code}
                          </span>
                        )}
                        {product.gender && (
                          <span className="text-[9px] font-bold tracking-wider text-gray-400 uppercase">
                            {product.gender}
                          </span>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 mt-auto">
                          <span className="text-sm font-extrabold text-black">
                            {product.price}
                          </span>

                          {/* Styled Button (Shopping Bag icon style) */}
                          <button className="bg-black hover:bg-neutral-800 text-white rounded-lg px-3 py-2.5 text-[10px] font-extrabold tracking-wider transition-all duration-300 w-full sm:w-auto text-center cursor-pointer">
                            VIEW DETAILS
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Modal overlay */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)} 
          className="fixed inset-0 bg-black/50 z-[9999] flex justify-end"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="w-[300px] bg-white h-full p-6 flex flex-col animate-slide-in"
          >
            {/* Header (Sticky / Non-scrollable) */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-150 mb-6 shrink-0">
              <h3 className="text-sm font-bold tracking-wider uppercase text-gray-900">
                Filters
              </h3>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="text-xs text-gray-500 hover:text-black font-bold uppercase cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Scrollable Filters Content */}
            <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-6 mb-6">
              {/* Search filter */}
              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search watches..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:bg-white focus:border-black focus:outline-none transition-all"
                  />
                  <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Price Range Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold tracking-wider uppercase text-gray-700">
                    Max Price
                  </label>
                  <span className="text-xs font-bold text-gray-900">
                    {formatPrice(priceRange[1])}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="250000"
                  step="5000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value, 10)])
                  }
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black mb-1"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                  <span>{formatPrice(0)}</span>
                  <span>{formatPrice(250000)}</span>
                </div>
              </div>

              {/* Gender filter */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold tracking-wider uppercase text-gray-700 mb-3">
                  Gender
                </h4>
                <div className="space-y-2">
                  {["Men", "Women", "Unisex"].map((gender) => (
                    <label
                      key={gender}
                      className="flex items-center gap-3 text-xs text-gray-600 font-medium cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGenders.includes(gender)}
                        onChange={() => handleGenderChange(gender)}
                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer accent-black"
                      />
                      {gender}
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand filter */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold tracking-wider uppercase text-gray-700 mb-3">
                  Brand / Collection
                </h4>
                <div className="space-y-2">
                  {[
                    "Exclusive",
                    "Presage",
                    "Prospex",
                    "Astron",
                    "HYDROCONQUEST",
                    "Seiko",
                  ].map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-3 text-xs text-gray-600 font-medium cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer accent-black"
                      />
                      {brand}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Buttons (Non-scrollable) */}
            <div className="mt-auto pt-4 flex gap-4 border-t border-gray-100 shrink-0">
              <button
                onClick={handleResetFilters}
                className="flex-1 bg-white border border-gray-200 text-black py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:border-black transition cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={handleApplyFilters}
                className="flex-1 bg-black text-white py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 transition cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function WatchesCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        </div>
      }
    >
      <WatchesCatalogContent />
    </Suspense>
  );
}
