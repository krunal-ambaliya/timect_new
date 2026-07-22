import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type StaticPageProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function StaticPage({
  title,
  subtitle,
  children,
}: StaticPageProps) {
  return (
    <div>
      <Header />
      <main className="min-h-[60vh]">
        <div className="border-b border-[var(--line)] bg-[#fafafa]">
          <div className="max-w-[800px] mx-auto px-8 py-14 md:py-20">
            <p className="tracked-sm text-[11px] text-[var(--muted)] mb-3">
              TIMECT
            </p>
            <h1 className="serif text-[36px] md:text-[48px] font-medium leading-tight">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-4 text-[15px] text-[var(--muted)] leading-relaxed max-w-[560px]">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
        <div className="max-w-[800px] mx-auto px-8 py-12 md:py-16">
          <div className="static-content text-[15px] leading-[1.8] text-[#333]">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
