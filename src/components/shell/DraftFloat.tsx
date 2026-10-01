"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export function DraftFloat() {
  const router = useRouter();
  const { activeDraft, draftsReady } = useStore();
  const [hidden, setHidden] = useState(false);

  const draft = draftsReady ? activeDraft() : null;
  if (!draft || hidden) return null;

  return (
    <div className="fm-fade fixed bottom-[18px] left-4 z-[70] flex max-w-[330px] items-center gap-3 rounded-[13px] border border-[#C8D5EC] border-l-4 border-l-leaf bg-white px-[15px] py-[13px] shadow-[0_18px_42px_rgba(10,30,70,.20)] print:hidden">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-[.07em] text-leaf">Open project</p>
        <p className="mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap font-display text-[15.5px] font-bold leading-[1.3] text-navy">
          {draft.name}
        </p>
        <div className="mt-[7px] h-1.5 overflow-hidden rounded bg-[#E9EEF8]">
          <div className="h-full rounded bg-leaf" style={{ width: `${draft.pct}%` }} />
        </div>
        <p className="mt-[5px] text-[13px] text-[#5B6B86]">{draft.pct}% complete</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => router.push(`/create/${draft.slug}`)}
          className="h-[34px] rounded-lg bg-brand px-[13px] text-sm font-bold text-white hover:bg-brand-dark"
        >
          Resume
        </button>
        <button
          type="button"
          onClick={() => setHidden(true)}
          className="h-7 rounded-lg border border-[#DCE4F3] bg-white px-[13px] text-[13px] text-[#5B6B86]"
        >
          Hide
        </button>
      </div>
    </div>
  );
}
