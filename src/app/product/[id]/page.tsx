'use client';

import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductAccordion from '@/components/product/ProductAccordion';
import RelatedProducts from '@/components/product/RelatedProducts';
import Footer from '@/components/Footer';

// Mock data for the product page
const productData = {
  id: '1',
  brand: 'Exclusive',
  title: 'HYDROCONQUEST EXCLUSIVE EDITION',
  subtitle: 'Automatic watch, Ø 42.00 mm, stainless steel and ceramic bezel, L3.788.4.98.6',
  price: '₹225,000.00',
  priceSubtext: 'Recommended Retail Price - Our authorized retailers remain free to set their own price',
  sizes: ['39 mm', '42 mm'],
  images: [
    '/images/image_4.png', // Main watch image
    '/images/image_2.png', // Alternate view
    '/images/image_3.jpg', // Detail view
    '/images/image_5.jpg', // Detail view
    '/images/image_6.jpg', // Detail view
  ],
  variants: [
    { id: 'v1', name: 'Blue', image: '/images/image_4.png' },
    { id: 'v2', name: 'Green', image: '/images/image_7.png' },
    { id: 'v3', name: 'Black', image: '/images/image_8.webp' },
    { id: 'v4', name: 'Silver', image: '/images/image_9.png' },
    { id: 'v5', name: 'Gold', image: '/images/daydate_blue.png' },
  ],
  accordionItems: [
    {
      title: 'Case',
      content: (
        <ul className="space-y-2 list-disc list-inside">
          <li><strong>Material:</strong> Stainless steel and ceramic bezel</li>
          <li><strong>Glass:</strong> Scratch-resistant sapphire crystal, with several layers of anti-reflective coating on both sides</li>
          <li><strong>Dimension:</strong> 42.00 mm</li>
          <li><strong>Water Resistance:</strong> Water-resistant to 30 bar</li>
        </ul>
      ),
    },
    {
      title: 'Dial & Hands',
      content: (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-black">Dial color</p>
            <p>Frosted Blue sunray</p>
          </div>
          <div>
            <p className="font-semibold text-black">Hands</p>
            <p>Silvered polished hands</p>
          </div>
          <div>
            <p className="font-semibold text-black">Hour markers</p>
            <p>Applied indexes</p>
          </div>
          <div>
            <p className="font-semibold text-black">Specificities</p>
            <p>Swiss Super-LumiNova®</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Movement & Functions',
      content: (
        <ul className="space-y-2">
          <li><strong>Movement Type:</strong> Automatic</li>
          <li><strong>Caliber:</strong> L888</li>
          <li><strong>Power Reserve:</strong> ~72 hours</li>
        </ul>
      ),
    },
    {
      title: 'Strap',
      content: <p>Stainless steel bracelet with double safety folding clasp and integrated diving extension.</p>,
    },
    {
      title: 'General',
      content: <p>Exclusive edition combining technical excellence with elegant design.</p>,
    },
  ],
};

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Optional Top Nav / Breadcrumbs could go here */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Left Column - Gallery */}
          <div className="w-full lg:sticky lg:top-24 h-fit">
            <ProductGallery images={productData.images} />
          </div>

          {/* Right Column - Product Info & Details */}
          <div className="w-full max-w-xl mx-auto lg:mx-0 pt-4 lg:pt-12">
            <ProductInfo
              brand={productData.brand}
              title={productData.title}
              subtitle={productData.subtitle}
              sizes={productData.sizes}
              price={productData.price}
              priceSubtext={productData.priceSubtext}
              variants={productData.variants}
              selectedVariantId={productData.variants[0].id}
              onVariantSelect={() => {}} // Will implement client-side in a real scenario
            />
            
            <ProductAccordion items={productData.accordionItems} />
          </div>

        </div>

        {/* Related Products Slider Section */}
        <RelatedProducts />
      </div>
      <Footer />
    </div>
  );
}
