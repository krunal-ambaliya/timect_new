export default function NewArrivals() {
  return (
    <section className="max-w-[1400px] mx-auto px-8 py-16">
      <div className="flex justify-center gap-12 mb-12">
        <button className="text-[15px] tracked-sm border-b-2 border-black pb-2 font-medium">NEW ARRIVALS</button>
        <button className="text-[15px] tracked-sm text-gray-400 pb-2">BEST SELLER</button>
      </div>

      <div className="relative">
        <button className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition z-10">‹</button>
        <button className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition z-10">›</button>

        <div className="overflow-x-auto pb-4">
          <div className="flex gap-8 min-w-max px-4 md:px-0" style={{ gap: '1rem' }}>

            {/* product 1 */}
            <div className="text-center group cursor-pointer w-[16rem] flex-shrink-0">
              <div className="watch-wrap relative transition">
                <span className="tag">NEW</span>
                <img src="/images/image_2.png" alt="King Seiko" className="watch-svg object-contain" />
              </div>
              <div className="mt-4 space-y-1">
                <div className="prod-name font-medium">King Seiko</div>
                <div className="prod-code">SLA063</div>
                <div className="price font-semibold">₹ 2,10,000</div>
              </div>
            </div>

            {/* product 2 */}
            <div className="text-center group cursor-pointer w-[16rem] flex-shrink-0">
              <div className="watch-wrap relative transition">
                <span className="tag">NEW</span>
                <img src="/images/image_2.png" alt="Prospex" className="watch-svg object-contain" />
              </div>
              <div className="mt-4 space-y-1">
                <div className="prod-name font-medium">Prospex</div>
                <div className="prod-code">SPB319</div>
                <div className="price font-semibold">₹ 1,20,000</div>
              </div>
            </div>

            {/* product 3 */}
            <div className="text-center group cursor-pointer w-[16rem] flex-shrink-0">
              <div className="watch-wrap relative transition">
                <span className="tag">NEW</span>
                <img src="/images/image_4.png" alt="Presage" className="watch-svg object-contain" />
              </div>
              <div className="mt-4 space-y-1">
                <div className="prod-name font-medium">Presage</div>
                <div className="prod-code">HCC002</div>
                <div className="price font-semibold">₹ 63,000</div>
              </div>
            </div>

            {/* product 4 */}
            <div className="text-center group cursor-pointer w-[16rem] flex-shrink-0">
              <div className="watch-wrap relative transition">
                <span className="tag">NEW</span>
                <img src="/images/image_2.png" alt="Astron" className="watch-svg object-contain" />
              </div>
              <div className="mt-4 space-y-1">
                <div className="prod-name font-medium">Astron</div>
                <div className="prod-code">SSH175</div>
                <div className="price font-semibold">₹ 1,85,000</div>
              </div>
            </div>

            {/* product 5 */}
            <div className="text-center group cursor-pointer w-[16rem] flex-shrink-0">
              <div className="watch-wrap relative transition">
                <span className="tag">NEW</span>
                <img src="/images/image_4.png" alt="Seiko 5 Sports" className="watch-svg object-contain" />
              </div>
              <div className="mt-4 space-y-1">
                <div className="prod-name font-medium">Seiko 5 Sports</div>
                <div className="prod-code">SSPL83</div>
                <div className="price font-semibold">₹ 32,000</div>
              </div>
            </div>

            {/* product 6 */}
            <div className="text-center group cursor-pointer w-[16rem] flex-shrink-0">
              <div className="watch-wrap relative transition">
                <span className="tag">NEW</span>
                <img src="/images/image_2.png" alt="Seiko Power Design Project" className="watch-svg object-contain" />
              </div>
              <div className="mt-4 space-y-1">
                <div className="prod-name font-medium">Seiko Power Design Project</div>
                <div className="prod-code">SSEH021</div>
                <div className="price font-semibold">₹ 45,000</div>
              </div>
            </div>

          </div>
        </div>

        <div className="flex justify-center mt-12">
          <button className="btn-dark">VIEW ALL</button>
        </div>
      </div>
    </section>
  );
}
