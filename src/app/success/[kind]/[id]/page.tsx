"use client";

import { use } from "react";
import Link from "next/link";
import { DOC_BY_SLUG, PACKS } from "@/data/firmify-data";

export default function SuccessPage({ params }: PageProps<"/success/[kind]/[id]">) {
  const { kind, id } = use(params);
  const isPack = kind === "pack";
  const name = isPack ? PACKS.find((p) => p.id === id)?.name : DOC_BY_SLUG[id]?.name;

  const primary =
    "grid h-[52px] place-items-center rounded-xl bg-brand px-[26px] font-display text-[17px] font-extrabold text-white no-underline hover:bg-brand-dark";
  const secondary =
    "grid h-[52px] place-items-center rounded-xl border-[1.5px] border-brand bg-white px-6 font-display text-[17px] font-extrabold text-brand no-underline hover:bg-[#EEF3FC]";

  return (
    <div className="mx-auto max-w-[760px] px-[clamp(16px,4vw,26px)] py-[clamp(36px,5vw,72px)]">
      <div className="rounded-[18px] border border-[#DDE5F4] bg-white p-[clamp(26px,4vw,40px)] text-center">
        <span className="mx-auto mb-5 grid h-[72px] w-[72px] place-items-center rounded-full bg-leaf text-[34px] text-white">
          ✓
        </span>
        <h1 className="text-[clamp(25px,3vw,36px)] text-navy">Payment successful</h1>
        <p className="mt-3 text-lg text-[#3A465C]">
          {name} is unlocked. Your invoice has been saved to your dashboard.
        </p>
        <div className="mt-[26px] flex flex-wrap justify-center gap-2.5">
          {isPack ? (
            <>
              <Link href="/dashboard" className={primary}>Go to my dashboard</Link>
              <Link href="/all-documents" className={secondary}>Start a document</Link>
            </>
          ) : (
            <>
              <Link href={`/create/${id}`} className={primary}>Download &amp; finish</Link>
              <Link href={`/esign/${id}`} className={secondary}>E-sign instead</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
