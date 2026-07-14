export default function ShopByCategory() {
  return (
    <section className="max-w-[1400px] mx-auto px-8 py-16">
      <h2 className="text-center tracked-sm text-[15px] mb-10">SHOP BY CATEGORY</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        <div className="cat-tile" style={{ background: 'linear-gradient(160deg,#2a2a2a,#0a0a0a)' }}>
          <img src="https://res.cloudinary.com/dphscxzb4/image/upload/v1784048472/timect/image_2.png" alt="Quartz Precision" />
          <div className="label">Quartz Precision</div>
        </div>
        <div className="cat-tile" style={{ background: 'linear-gradient(160deg,#3a3a3a,#0a0a0a)' }}>
          <img src="https://res.cloudinary.com/dphscxzb4/image/upload/v1784048474/timect/image_5.jpg" alt="Sports & Chronographs" />
          <div className="label">Sports & Chronographs</div>
        </div>
        <div className="cat-tile" style={{ background: 'linear-gradient(160deg,#0c3a52,#031521)' }}>
          <img src="https://res.cloudinary.com/dphscxzb4/image/upload/v1784048494/timect/watch_size.jpg" alt="Case Size" />
          <div className="label">Case Size</div>
        </div>

        <div className="cat-tile" style={{ background: 'linear-gradient(160deg,#161616,#000)' }}>
          <img src="https://res.cloudinary.com/dphscxzb4/image/upload/v1784048474/timect/image_5.jpg" alt="Dress & Luxury" />
          <div className="label">Dress & Luxury</div>
        </div>
        <div className="cat-tile" style={{ background: 'linear-gradient(160deg,#2a2a2a,#0a0a0a)' }}>
          <img src="https://res.cloudinary.com/dphscxzb4/image/upload/v1784048477/timect/image_8.webp" alt="Material" />
          <div className="label">Material</div>
        </div>

      </div>
    </section>
  );
}
