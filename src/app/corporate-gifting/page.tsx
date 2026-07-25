import type { Metadata } from "next";
import Link from "next/link";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "Corporate Gifting | Timect",
  description:
    "Timect corporate gifting — precision watches for employee recognition, client gifts, and milestone celebrations.",
};

export default function CorporateGiftingPage() {
  return (
    <StaticPage
      title="Corporate Gifting"
      subtitle="Recognise teams, clients, and milestones with precision timepieces crafted for lasting impression."
    >
      <section className="space-y-6">
        <p>
          Timect partners with organisations that want gifts with substance —
          watches that mark achievement, loyalty, and celebration with quiet
          elegance rather than disposable novelty.
        </p>

        <h2 className="serif text-[24px] font-medium text-[#111] pt-4">
          Ideal for
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Employee recognition and long-service awards</li>
          <li>Client appreciation and partnership gifts</li>
          <li>Conference, launch, and milestone events</li>
          <li>Executive welcome kits and leadership programmes</li>
        </ul>

        <h2 className="serif text-[24px] font-medium text-[#111] pt-4">
          How it works
        </h2>
        <p>
          Share your quantity, budget range, preferred collection, and any
          branding needs (engraving, packaging, or card inserts). Our team will
          recommend suitable models and arrange bulk fulfilment timelines.
        </p>

        <div className="pt-6 flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-black text-white px-8 py-3 text-[12px] tracking-widest font-medium hover:bg-neutral-800 transition"
          >
            ENQUIRE NOW
          </Link>
          <Link
            href="/watches"
            className="inline-flex items-center justify-center border border-black px-8 py-3 text-[12px] tracking-widest font-medium hover:bg-black hover:text-white transition"
          >
            BROWSE WATCHES
          </Link>
        </div>
      </section>
    </StaticPage>
  );
}
