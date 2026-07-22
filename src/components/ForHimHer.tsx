import Link from "next/link";

export default function ForHimHer() {
  return (
    <section className="max-w-[1400px] mx-auto px-8 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/watches?filter=him"
          className="relative h-[420px] flex items-end justify-start p-8 group cursor-pointer"
          style={{ background: "linear-gradient(160deg,#d9d9d9,#bbb)" }}
        >
          <img
            src="https://res.cloudinary.com/dphscxzb4/image/upload/v1784048483/timect/man_watch_cat.jpg"
            alt="For Him"
            className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-500 group-hover:opacity-70"
          />
          <div className="relative z-10">
            <div className="text-[20px] tracked-sm">FOR HIM</div>
            <div className="text-[12px] tracked-sm mt-1 underline">
              EXPLORE ›
            </div>
          </div>
        </Link>
        <Link
          href="/watches?filter=her"
          className="relative h-[420px] flex items-end justify-start p-8 group cursor-pointer"
          style={{ background: "linear-gradient(160deg,#2a2a2a,#000)" }}
        >
          <img
            src="https://res.cloudinary.com/dphscxzb4/image/upload/v1784048495/timect/woman_watch_cat.jpg"
            alt="For Her"
            className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-500 group-hover:opacity-70"
          />
          <div className="relative z-10">
            <div className="text-[20px] tracked-sm text-white">FOR HER</div>
            <div className="text-[12px] tracked-sm mt-1 underline text-white">
              EXPLORE ›
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
