"use client";

import { Suspense, type ReactNode } from "react";
import ScrollToTop from "@/components/ScrollToTop";
import RoutePreloader from "@/components/RoutePreloader";

export default function StorefrontProviders({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {/* Preloader must NOT sit behind searchParams Suspense — that caused dummy content to flash first */}
      <RoutePreloader />
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
      {children}
    </>
  );
}
