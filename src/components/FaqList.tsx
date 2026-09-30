"use client";

import { useState } from "react";
import type { Faq } from "@/data/firmify-faqs";

export function FaqList({ faqs, pendingNote }: { faqs: Faq[]; pendingNote?: string }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="overflow-hidden rounded-[14px] border border-[#DDE5F4] bg-white">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="border-b border-[#EEF2F9] last:border-b-0">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-start justify-between gap-3.5 bg-white px-5 py-4 text-left font-display text-[16.5px] font-bold text-navy hover:bg-background"
            >
              <span>{f.q}</span>
              <span className="flex-none text-xl leading-none text-brand">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
              <div className="px-5 pb-[18px]">
                {f.a ? (
                  <p className="text-[16.5px] text-[#3A465C]">{f.a}</p>
                ) : (
                  <p className="rounded-[9px] border border-dashed border-[#E7C980] bg-[#FFF7E6] px-[13px] py-[11px] text-[15px] text-[#8A5A00]">
                    {pendingNote ??
                      "Answer to be supplied by Firmify — question taken verbatim from your Complete FAQ Question Set."}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
