import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-14 pb-6 px-8">
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-10 text-[12px] tracked-sm">
        <div className="footer-col">
          <Link href="/" className="flex items-center gap-2 mb-3 cursor-pointer">
            <img
              src="https://res.cloudinary.com/dphscxzb4/image/upload/v1784048492/timect/timect_logo.png"
              alt="Timect Logo"
              className="h-10 w-10 object-contain rounded-full"
            />
            <span className="serif text-[20px] font-medium tracking-wider">
              Timect
            </span>
          </Link>
          <p className="text-gray-400 leading-relaxed max-w-[180px]">
            Crafting the future of time through innovation, and exquisite
            craftsmanship.
          </p>
          <div className="flex gap-3 mt-5 text-gray-300">
            <span className="social-icon">  ◎</span>
            <span className="social-icon">◎</span>
            <span className="social-icon">▶</span>
          </div>
        </div>
        <div className="footer-col">
          <div className="text-gray-300 mb-4">COLLECTIONS</div>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="#" className="footer-link">
                New Arrivals
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Best Sellers
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Limited Edition
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Diver's
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Presage
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Seiko 5 Sports
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                King Seiko
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Astron
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <div className="text-gray-300 mb-4">CUSTOMER SERVICE</div>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="#" className="footer-link">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Shipping & Delivery
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Returns & Exchanges
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Warranty
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Care Instructions
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <div className="text-gray-300 mb-4">COMPANY</div>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="#" className="footer-link">
                About Timect
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Our Heritage
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Sustainability
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                News & Events
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Store Locator
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <div className="text-gray-300 mb-4">NEWSLETTER</div>
          <p className="text-gray-400 mb-4">
            Stay updated with our latest collections and offers.
          </p>
          <div className="flex border border-gray-600 newsletter-input-group">
            <input
              type="text"
              placeholder="Enter your email"
              className="bg-transparent text-white text-[12px] px-3 py-2 flex-1 outline-none placeholder-gray-500"
            />
            <button className="px-4 newsletter-btn">›</button>
          </div>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-3 mt-12 pt-5 border-t border-gray-800 text-[11px] text-gray-400">
        <span>© 2006 Timect. All Rights Reserved.</span>
        <span>Privacy Policy &nbsp;&nbsp; Terms & Conditions</span>
      </div>
    </footer>
  );
}
