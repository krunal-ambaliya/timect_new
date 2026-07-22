"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { getFilteredProducts, Product } from "@/db/actions";
import {
  getCatalogFilterLabel,
  SHOP_BY_CATEGORY,
} from "@/data/categoryFilters";
import {
  LucideSearch,
  LucideSlidersHorizontal,
  LucideStar,
  LucideX,
} from "lucide-react";

const DEFAULT_PRICE_MAX = 250000;

function WatchesCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL-driven initial category / specification filter
  const urlCategory = searchParams.get("category") || "all";
  const urlFilter = searchParams.get("filter") || "";

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    DEFAULT_PRICE_MAX,
  ]);
  const [activeCategory, setActiveCategory] = useState<string>(urlCategory);
  const [activeFilter, setActiveFilter] = useState<string>(urlFilter);
  const [sortBy, setSortBy] = useState<string>("newest");

  // Debounced filters for API requests
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [debouncedPriceRange, setDebouncedPriceRange] = useState<
    [number, number]
  >([0, DEFAULT_PRICE_MAX]);

  // Pagination & Results status state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Mobile sidebar visibility
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Debounce price range
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 300);
    return () => clearTimeout(handler);
  }, [priceRange]);

  // Synchronize category + specification filter with URL changes
  useEffect(() => {
    const category = searchParams.get("category") || "all";
    const filter = searchParams.get("filter") || "";
    setActiveCategory(category);
    setActiveFilter(filter);
  }, [searchParams]);

  // Reset page to 1 whenever any filter parameter changes
  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearchQuery,
    selectedGenders,
    selectedBrands,
    debouncedPriceRange,
    activeCategory,
    activeFilter,
    sortBy,
  ]);

  // Fetch products
  useEffect(() => {
    let isMounted = true;
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    getFilteredProducts({
      search: debouncedSearchQuery,
      genders: selectedGenders,
      brands: selectedBrands,
      priceMin: debouncedPriceRange[0],
      priceMax: debouncedPriceRange[1],
      category: activeCategory,
      filter: activeFilter || undefined,
      sortBy: sortBy,
      page: page,
      pageSize: 20,
    }).then((data) => {
      if (!isMounted) return;
      if (page === 1) {
        setProducts(data.products);
      } else {
        setProducts((prev) => [...prev, ...data.products]);
      }
      setTotalCount(data.total);
      setHasMore(data.hasMore);
      setLoading(false);
      setLoadingMore(false);
    });

    return () => {
      isMounted = false;
    };
  }, [
    debouncedSearchQuery,
    selectedGenders,
    selectedBrands,
    debouncedPriceRange,
    activeCategory,
    activeFilter,
    sortBy,
    page,
  ]);

  const handleApplyFilters = () => {
    setMobileSidebarOpen(false);
  };

  const buildWatchesUrl = (opts: {
    category?: string;
    filter?: string | null;
  }) => {
    const params = new URLSearchParams();
    const category = opts.category ?? activeCategory;
    const filter =
      opts.filter === null ? "" : (opts.filter ?? activeFilter);
    if (category && category !== "all") params.set("category", category);
    if (filter) params.set("filter", filter);
    const qs = params.toString();
    return qs ? `/watches?${qs}` : "/watches";
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedGenders([]);
    setSelectedBrands([]);
    setPriceRange([0, DEFAULT_PRICE_MAX]);
    setActiveFilter("");
    setActiveCategory("all");
    router.push("/watches", { scroll: false });
  };

  const clearCatalogFilter = () => {
    setActiveFilter("");
    router.push(buildWatchesUrl({ filter: null }), { scroll: false });
  };

  const setCatalogFilter = (slug: string) => {
    const next = activeFilter === slug ? "" : slug;
    setActiveFilter(next);
    router.push(
      buildWatchesUrl({ filter: next || null }),
      { scroll: false },
    );
  };

  const filterLabel = getCatalogFilterLabel(activeFilter);

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

  const removeGender = (gender: string) => {
    setSelectedGenders((prev) => prev.filter((g) => g !== gender));
  };

  const removeBrand = (brand: string) => {
    setSelectedBrands((prev) => prev.filter((b) => b !== brand));
  };

  const clearSearch = () => setSearchQuery("");

  const clearPrice = () => setPriceRange([0, DEFAULT_PRICE_MAX]);

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

  type ActiveChip = {
    id: string;
    label: string;
    onRemove: () => void;
  };

  const activeChips: ActiveChip[] = [];
  if (filterLabel && activeFilter) {
    activeChips.push({
      id: `filter-${activeFilter}`,
      label: filterLabel,
      onRemove: clearCatalogFilter,
    });
  }
  if (debouncedSearchQuery.trim()) {
    activeChips.push({
      id: `search-${debouncedSearchQuery}`,
      label: `Search: ${debouncedSearchQuery.trim()}`,
      onRemove: clearSearch,
    });
  }
  if (priceRange[1] < DEFAULT_PRICE_MAX) {
    activeChips.push({
      id: "price-max",
      label: `Max ${formatPrice(priceRange[1])}`,
      onRemove: clearPrice,
    });
  }
  for (const gender of selectedGenders) {
    activeChips.push({
      id: `gender-${gender}`,
      label: gender,
      onRemove: () => removeGender(gender),
    });
  }
  for (const brand of selectedBrands) {
    activeChips.push({
      id: `brand-${brand}`,
      label: brand,
      onRemove: () => removeBrand(brand),
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-[#111111]">
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
                  setActiveFilter("");
                  router.push(
                    buildWatchesUrl({ category: cat.id, filter: null }),
                    { scroll: false },
                  );
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
                max={DEFAULT_PRICE_MAX}
                step="5000"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value, 10)])
                }
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black mb-1"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                <span>{formatPrice(0)}</span>
                <span>{formatPrice(DEFAULT_PRICE_MAX / 2)}</span>
                <span>{formatPrice(DEFAULT_PRICE_MAX)}</span>
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

            {/* Collection filters (Shop by Category) */}
            <div className="mb-6 border-t border-gray-100 pt-4">
              <h4 className="text-xs font-bold tracking-wider uppercase text-gray-700 mb-3">
                Collection
              </h4>
              <div className="space-y-2">
                {SHOP_BY_CATEGORY.map((item) => {
                  const selected = activeFilter === item.slug;
                  return (
                    <label
                      key={item.slug}
                      className="flex items-center gap-3 text-xs text-gray-600 font-medium cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => setCatalogFilter(item.slug)}
                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer accent-black"
                      />
                      <span className={selected ? "text-black font-semibold" : ""}>
                        {item.label}
                      </span>
                    </label>
                  );
                })}
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
          </aside>

          {/* Catalog Grid */}
          <div className="lg:col-span-3">
            {/* Active filters status / Results count */}
            <div className="flex flex-col gap-3 mb-6 px-1">
              <p className="text-xs text-gray-500 font-medium">
                Showing{" "}
                <span className="font-bold text-gray-900">
                  {products.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-900">{totalCount}</span>{" "}
                luxury watches
              </p>
              {activeChips.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {activeChips.map((chip) => (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={chip.onRemove}
                      className="inline-flex items-center gap-1.5 bg-black text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full hover:bg-neutral-800 transition"
                    >
                      {chip.label}
                      <LucideX className="h-3 w-3" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-[10px] font-bold tracking-wider uppercase text-gray-500 hover:text-black underline underline-offset-2"
                  >
                    Clear all
                  </button>
                </div>
              )}
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
              <>
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
                <div className="flex flex-col items-center mt-12 mb-6">
                  {hasMore && (
                    <button
                      onClick={() => setPage((prev) => prev + 1)}
                      disabled={loadingMore}
                      className="bg-black hover:bg-neutral-800 text-white px-8 py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loadingMore ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          LOADING...
                        </>
                      ) : (
                        "LOAD MORE PRODUCTS"
                      )}
                    </button>
                  )}
                </div>
              </>
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
                  max={DEFAULT_PRICE_MAX}
                  step="5000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value, 10)])
                  }
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black mb-1"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                  <span>{formatPrice(0)}</span>
                  <span>{formatPrice(DEFAULT_PRICE_MAX)}</span>
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

              {/* Collection filters */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold tracking-wider uppercase text-gray-700 mb-3">
                  Collection
                </h4>
                <div className="space-y-2">
                  {SHOP_BY_CATEGORY.map((item) => {
                    const selected = activeFilter === item.slug;
                    return (
                      <label
                        key={item.slug}
                        className="flex items-center gap-3 text-xs text-gray-600 font-medium cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => setCatalogFilter(item.slug)}
                          className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer accent-black"
                        />
                        <span
                          className={
                            selected ? "text-black font-semibold" : ""
                          }
                        >
                          {item.label}
                        </span>
                      </label>
                    );
                  })}
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
