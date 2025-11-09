export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-start overflow-hidden"
      aria-labelledby="hero-title"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/hero_section2.jpg)',
        }}
        role="img"
        aria-label="Luxury lifestyle background"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
      </div>

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 sm:px-10 py-32">
        <div className="max-w-2xl">
          <h1
            id="hero-title"
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.15em] text-black mb-4 animate-fade-in"
          >
            SHOP
          </h1>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.12em] text-black mb-3 animate-fade-in-delay-1">
            PERSONALISE
          </h2>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.12em] text-black mb-8 animate-fade-in-delay-2">
            BE INSPIRED
          </h2>
          <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-yellow-600 mb-12 animate-fade-in-delay-3 italic font-light">
            Live inspired every day
          </p>
          <button
            className="bg-black text-white px-12 py-4 text-xs tracking-[0.2em] hover:bg-yellow-700 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:ring-offset-2 shadow-lg animate-fade-in-delay-4"
            aria-label="Explore our collection"
          >
            EXPLORE NOW
          </button>
        </div>
      </div>
    </section>
  );
}
