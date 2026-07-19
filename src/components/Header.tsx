export default function Header() {
  return (
    <header className="border-b border-[var(--line)]">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-8 py-5">
        <div className="flex items-center">
          <img
            src="https://res.cloudinary.com/dphscxzb4/image/upload/v1784048492/timect/timect_logo.png"
            alt="Timect Logo"
            className="h-12 w-12 object-contain"
          />
        </div>
        <nav className="hidden md:flex gap-10 text-[12px] tracked-sm">
          <a href="#" className="nav-link">
            Collections
          </a>
          <a href="#" className="nav-link">
            New Arrivals
          </a>
          <a href="#" className="nav-link">
            Best Sellers
          </a>
          <a href="#" className="nav-link">
            Technology
          </a>
        </nav>
        <div className="flex items-center gap-5 text-[12px] tracked-sm">
          <span className="hidden sm:inline">Account</span>
          <span>♡</span>
          <span>⚲</span>
          <span>🛍</span>
        </div>
      </div>
    </header>
  );
}
