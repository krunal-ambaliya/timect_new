export default function Hero() {
  return (
    <section className="hero">
      <div className="swirl"></div>
      <div className="relative z-10 max-w-[1400px] mx-auto h-full flex items-center px-8 md:px-16">
        <div className="w-1/2 text-white">
          <div className="serif text-[64px] md:text-[86px] leading-[0.85] font-medium">
            145<sup className="text-[28px] md:text-[36px] align-top">th</sup><br />Anniversary
          </div>
          <p className="mt-6 text-[15px] md:text-[17px] tracked-sm font-light">Celebrating 145 Years<br />of Japanese Craftsmanship</p>
          <button className="btn-dark mt-8">EXPLORE COLLECTION</button>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop" alt="Seiko Watch" className="w-[80%] h-[80%] object-contain drop-shadow-2xl" />
        </div>
      </div>
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        <span className="heroDot"></span><span className="heroDot off"></span><span className="heroDot off"></span>
      </div>
    </section>
  );
}
