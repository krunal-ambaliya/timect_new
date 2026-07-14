export default function Preloader() {
  return (
    <div className="preloader">
      <img src="https://res.cloudinary.com/dphscxzb4/image/upload/v1784048492/timect/timect_logo.png" alt="Seiko Logo" className="preloader-logo w-14 h-14 rounded-full mx-auto mb-5 object-contain" />
      <div className="preloader-text tracked-sm text-[12px] mb-3">Loading...</div>
      <div className="preloader-line-container">
        <div className="preloader-line"></div>
      </div>
    </div>
  );
}
