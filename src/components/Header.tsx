export default function Header() {
  return (
    <header className="border-b border-[var(--line)]">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-8 py-5">
        <div className="serif leading-none">
          <div className="text-[28px] tracked font-medium">SEIKO</div>
          <div className="text-[9px] tracked-sm text-center text-[var(--muted)]">SINCE 1881</div>
        </div>
        <nav className="hidden md:flex gap-10 text-[12px] tracked-sm">
          <a href="#" className="nav-link">Collections</a>
          <a href="#" className="nav-link">New Arrivals</a>
          <a href="#" className="nav-link">Best Sellers</a>
          <a href="#" className="nav-link">Technology</a>
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
