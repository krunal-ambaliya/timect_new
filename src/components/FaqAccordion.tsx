"use client";

import { useId, useState } from "react";

export type FaqItem = {
  q: string;
  a: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
};

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="divide-y divide-[var(--line)]">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div key={item.q} className="faq-item">
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(index)}
              className="group w-full py-5 flex items-start justify-between gap-4 text-left cursor-pointer"
            >
              <span
                className={`font-medium transition-colors duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  isOpen ? "text-[#111]" : "text-[#222] group-hover:text-[#111]"
                }`}
              >
                {item.q}
              </span>
              <span
                className="relative mt-0.5 h-5 w-5 shrink-0 text-gray-400"
                aria-hidden
              >
                {/* Horizontal bar — always present */}
                <span
                  className={`absolute left-1/2 top-1/2 block h-[1.5px] w-3 -translate-x-1/2 -translate-y-1/2 bg-current transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isOpen ? "opacity-70" : "opacity-100"
                  }`}
                />
                {/* Vertical bar — collapses into minus */}
                <span
                  className={`absolute left-1/2 top-1/2 block h-3 w-[1.5px] -translate-x-1/2 -translate-y-1/2 bg-current transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isOpen
                      ? "scale-y-0 opacity-0"
                      : "scale-y-100 opacity-100"
                  }`}
                />
              </span>
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-[grid-template-rows] duration-[320ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden min-h-0">
                <p
                  className={`text-[#444] pr-8 pb-5 will-change-transform transition-[opacity,transform] duration-[320ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isOpen
                      ? "translate-y-0 opacity-100 delay-[40ms]"
                      : "-translate-y-1.5 opacity-0 delay-0"
                  }`}
                >
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
