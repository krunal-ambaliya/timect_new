export default function Recommended() {
  return (
    <section className="grid md:grid-cols-2 gap-0 mb-16">
      <div className="watch-wrap relative" style={{ background: 'linear-gradient(160deg,#04121c,#0c2c42 60%,#123a56)', minHeight: '480px', aspectRatio: 'auto' }}>
        <img src="/images/right-main.png" alt="Featured Watch" className="absolute inset-0 w-full h-full" style={{ objectFit: 'cover' }} />
      </div>

      <div className="px-4 md:px-8 py-6 md:py-12">
        <h2 className="text-center tracked-sm text-[15px] mb-8">RECOMMENDED FOR YOU</h2>
        <div className="grid grid-cols-3 gap-6">

          <div className="text-center">
            <div className="watch-wrap"><img src="/images/image_2.png" alt="King Seiko" className="watch-svg object-contain" /></div>
            <div className="mt-2 prod-name">King Seiko</div>
            <div className="prod-code">SLA063</div>
            <div className="price">₹ 2,10,000</div>
          </div>

          <div className="text-center">
            <div className="watch-wrap"><img src="/images/image_4.png" alt="Prospex" className="watch-svg object-contain" /></div>
            <div className="mt-2 prod-name">Prospex</div>
            <div className="prod-code">SPB319</div>
            <div className="price">₹ 1,20,000</div>
          </div>

          <div className="text-center">
            <div className="watch-wrap"><img src="/images/image_2.png" alt="Presage" className="watch-svg object-contain" /></div>
            <div className="mt-2 prod-name">Presage</div>
            <div className="prod-code">HCC002</div>
            <div className="price">₹ 63,000</div>
          </div>

          <div className="text-center">
            <div className="watch-wrap"><img src="/images/image_4.png" alt="Seiko 5 Sports" className="watch-svg object-contain" /></div>
            <div className="mt-2 prod-name">Seiko 5 Sports</div>
            <div className="prod-code">SSPL83</div>
            <div className="price">₹ 32,000</div>
          </div>

          <div className="text-center">
            <div className="watch-wrap"><img src="/images/image_2.png" alt="Astron" className="watch-svg object-contain" /></div>
            <div className="mt-2 prod-name">Astron</div>
            <div className="prod-code">SSH175</div>
            <div className="price">₹ 1,85,000</div>
          </div>

          <div className="text-center">
            <div className="watch-wrap"><img src="/images/image_4.png" alt="Seiko Power Design Project" className="watch-svg object-contain" /></div>
            <div className="mt-2 prod-name">Seiko Power Design Project</div>
            <div className="prod-code">SSEH021</div>
            <div className="price">₹ 45,000</div>
          </div>

        </div>

        <div className="flex justify-center mt-10">
          <button className="btn-outline">VIEW ALL WATCHES</button>
        </div>
      </div>
    </section>
  );
}
