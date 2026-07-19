'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductAccordion from '@/components/product/ProductAccordion';
import RelatedProducts from '@/components/product/RelatedProducts';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import TopStrip from '@/components/TopStrip';
import { getMainProduct, getProductById, Product } from '@/db/actions';

export default function ProductPage() {
  const params = useParams();
  const idStr = params?.id;
  const id = idStr ? parseInt(idStr as string, 10) : null;

  const [productData, setProductData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id !== null && !isNaN(id)) {
      getProductById(id).then((data) => {
        setProductData(data);
        setLoading(false);
      });
    } else {
      getMainProduct().then((data) => {
        setProductData(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500 font-medium">Product not found</p>
      </div>
    );
  }

  const specifications = productData.specifications && productData.specifications.length > 0
    ? productData.specifications
    : [
        {
          title: "Description",
          type: "text",
          content: productData.description || productData.subtitle || "No additional description available."
        }
      ];

  const accordionItems = specifications.map((spec) => {

    let content: React.ReactNode;
    if (spec.type === 'details' && spec.items) {
      content = (
        <ul className="space-y-2 list-disc list-inside">
          {spec.items.map((item, idx) => {
            if (typeof item !== 'string') return null;
            const parts = item.split(': ');
            if (parts.length > 1) {
              return (
                <li key={idx}>
                  <strong>{parts[0]}:</strong> {parts.slice(1).join(': ')}
                </li>
              );
            }
            return <li key={idx}>{item}</li>;
          })}
        </ul>
      );
    } else if (spec.type === 'grid' && spec.items) {
      content = (
        <div className="grid grid-cols-2 gap-4">
          {spec.items.map((item: any, idx) => (
            <div key={idx}>
              <p className="font-semibold text-black">{item.label}</p>
              <p>{item.value}</p>
            </div>
          ))}
        </div>
      );
    } else {
      content = <p>{spec.content}</p>;
    }

    return {
      title: spec.title,
      content,
    };
  });

  return (
    <div className="min-h-screen bg-white">
      <TopStrip />
      <Header />
      {/* Optional Top Nav / Breadcrumbs could go here */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Left Column - Gallery */}
          <div className="w-full lg:sticky lg:top-24 h-fit">
            <ProductGallery 
              key={productData.id}
              images={
                productData.images && productData.images.length > 0
                  ? productData.images
                  : (productData.image ? [productData.image] : [])
              } 
            />
          </div>

          {/* Right Column - Product Info & Details */}
          <div className="w-full max-w-xl mx-auto lg:mx-0 pt-4 lg:pt-12">
            <ProductInfo
              brand={productData.brand || productData.collection || "Exclusive"}
              title={productData.title || productData.name || "Product Detail"}
              subtitle={productData.subtitle || productData.description || productData.code || ""}
              sizes={productData.sizes || []}
              price={productData.price}
              priceSubtext={productData.priceSubtext || "Recommended Retail Price"}
              variants={productData.variants || []}
              selectedVariantId={productData.variants?.[0]?.id || ""}
              onVariantSelect={() => {}} // Will implement client-side in a real scenario
            />
            
            <ProductAccordion items={accordionItems} />
          </div>

        </div>

        {/* Related Products Slider Section */}
        <RelatedProducts />
      </div>
      <Footer />
    </div>
  );
}
