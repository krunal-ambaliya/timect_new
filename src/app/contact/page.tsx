import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "Contact Us | Timect",
  description:
    "Contact Timect for product questions, orders, warranty support, and after-sales service for your wristwatch.",
};

export default function ContactPage() {
  return (
    <StaticPage
      title="Contact Us"
      subtitle="Questions about a Timect wristwatch, an order, or after-sales service? We are here to help."
    >
      <section className="space-y-10">
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="border border-[var(--line)] p-6">
            <h2 className="tracked-sm text-[11px] text-[var(--muted)] mb-3">
              CUSTOMER CARE
            </h2>
            <p className="text-[#111] font-medium mb-1">Email</p>
            <a
              href="mailto:care@timect.com"
              className="text-[#111] underline underline-offset-4"
            >
              care@timect.com
            </a>
            <p className="text-[var(--muted)] text-[13px] mt-4">
              For orders, shipping, returns, and product questions.
            </p>
          </div>

          <div className="border border-[var(--line)] p-6">
            <h2 className="tracked-sm text-[11px] text-[var(--muted)] mb-3">
              SERVICE & WARRANTY
            </h2>
            <p className="text-[#111] font-medium mb-1">Email</p>
            <a
              href="mailto:service@timect.com"
              className="text-[#111] underline underline-offset-4"
            >
              service@timect.com
            </a>
            <p className="text-[var(--muted)] text-[13px] mt-4">
              For repairs, movement service, and warranty claims.
            </p>
          </div>
        </div>

        <div>
          <h2 className="serif text-[24px] font-medium text-[#111] mb-4">
            Before you write
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-[#333]">
            <li>
              Include your order number if your message is about a purchase.
            </li>
            <li>
              For service requests, note the model name, serial or case reference
              if available, and a brief description of the issue.
            </li>
            <li>
              Photos of the dial, case back, and any damage help our watchmakers
              advise faster.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="serif text-[24px] font-medium text-[#111] mb-4">
            Response times
          </h2>
          <p>
            Our customer care team typically responds within 1–2 business days.
            Service assessments for mechanical or quartz issues may take
            additional time depending on workshop schedule and spare-part
            availability.
          </p>
        </div>

        <div className="border-t border-[var(--line)] pt-8">
          <h2 className="serif text-[24px] font-medium text-[#111] mb-4">
            Send a message
          </h2>
          <form className="space-y-4 max-w-[480px]" action="#" method="post">
            <div>
              <label
                htmlFor="name"
                className="block text-[12px] tracked-sm text-[var(--muted)] mb-2"
              >
                NAME
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full border border-[var(--line)] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
                placeholder="Your name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-[12px] tracked-sm text-[var(--muted)] mb-2"
              >
                EMAIL
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full border border-[var(--line)] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-[12px] tracked-sm text-[var(--muted)] mb-2"
              >
                MESSAGE
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="w-full border border-[var(--line)] px-4 py-3 text-[14px] outline-none focus:border-[#111] resize-y"
                placeholder="How can we help with your Timect watch?"
              />
            </div>
            <button
              type="button"
              className="bg-black text-white text-[12px] tracked-sm px-8 py-3 hover:bg-[#222] transition-colors"
            >
              SEND MESSAGE
            </button>
            <p className="text-[12px] text-[var(--muted)]">
              This form is a front-end placeholder. Please email us directly
              until live messaging is connected.
            </p>
          </form>
        </div>
      </section>
    </StaticPage>
  );
}
