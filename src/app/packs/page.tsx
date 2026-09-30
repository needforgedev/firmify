"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CATEGORIES, PACKS, PACK_TERMS, money, packDocCount } from "@/data/firmify-data";
import { pageFaqList } from "@/data/firmify-faqs";
import { FaqList } from "@/components/FaqList";
import { useStore } from "@/lib/store";

export default function PacksPage() {
  const router = useRouter();
  const { store, ready } = useStore();

  return (
    <div>
      <div className="border-b border-[#E4EAF6] bg-white">
        <div className="mx-auto max-w-7xl px-[clamp(16px,4vw,26px)] pb-5 pt-3.5">
          <nav aria-label="Breadcrumb" className="mb-2.5 text-[13px] text-[#5B6B86]">
            <Link href="/" className="text-brand">Home</Link> &nbsp;/&nbsp; Subscription Packs
          </nav>
          <h1 className="text-[clamp(25px,2.7vw,34px)] text-navy">Subscription Packs</h1>
          <p className="mt-2 max-w-[88ch] text-[15.5px] leading-[1.5] text-[#3A465C]">
            Choose from our value packs which make our low-cost contracts even more affordable.
            Every pack is valid for 6 months or 1 year, allows up to 50 downloads, and includes
            Word, PDF and e-sign.
          </p>
          <div className="mt-3 flex flex-wrap gap-[7px]">
            {PACK_TERMS.map((t) => (
              <span key={t} className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#D6E0F2] bg-background px-[11px] py-[5px] text-[12.5px] text-[#2A3547]">
                <span className="font-bold text-leaf">✓</span>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-[clamp(16px,4vw,26px)] pb-[clamp(40px,5vw,64px)] pt-[18px]">
        <div className="grid items-stretch gap-3 min-[680px]:grid-cols-2 min-[1080px]:grid-cols-5">
          {PACKS.map((p) => {
            const owned = ready && store.entitlements.packs.includes(p.id);
            return (
              <div
                key={p.id}
                className={`flex min-w-0 flex-col rounded-[14px] bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-[0_10px_26px_rgba(27,63,174,.13)] ${
                  p.best ? "border-2 border-brand" : "border border-[#DDE5F4]"
                }`}
              >
                {p.best && (
                  <span className="mb-[9px] self-start rounded-full bg-leaf px-[9px] py-[3px] text-[10.5px] font-bold uppercase tracking-[.05em] text-white">
                    Best value
                  </span>
                )}
                <h2 className="text-[16.5px] leading-[1.25] text-navy">{p.name}</h2>
                <p className="mt-1.5 text-[13px] leading-[1.45] text-[#4A5468]">{p.blurb}</p>
                <div className="mt-3 flex flex-wrap items-baseline gap-[7px]">
                  <span className="whitespace-nowrap font-display text-[23px] font-extrabold text-navy">{money(p.price)}</span>
                  <span className="whitespace-nowrap text-[13px] text-[#8A97AD] line-through">{money(p.was)}</span>
                </div>
                <p className="mt-1 text-[12.5px] font-bold text-leaf">{packDocCount(p)} documents included</p>
                <div className="mt-[11px] flex flex-1 flex-wrap content-start gap-[5px]">
                  {p.cats.map((cid) => {
                    const c = CATEGORIES.find((x) => x.id === cid)!;
                    return (
                      <Link
                        key={cid}
                        href={`/category/${cid}`}
                        title={`${c.name} — ${c.docs.length} documents`}
                        className="inline-flex items-center gap-[5px] whitespace-nowrap rounded-full border border-[#E4EAF6] bg-background px-2 py-1 text-[12.5px] leading-[1.2] text-[#1A2438] no-underline hover:border-brand hover:bg-[#F1F5FF]"
                      >
                        <span>{c.name}</span>
                        <span className="text-[#5B6B86]">{c.docs.length}</span>
                      </Link>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => router.push(owned ? "/dashboard" : `/checkout/pack/${p.id}`)}
                  className="mt-[13px] h-[42px] w-full rounded-[10px] bg-brand font-display text-sm font-extrabold text-white hover:bg-brand-dark"
                >
                  {owned ? "Active — go to dashboard" : "Buy this pack"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-[clamp(40px,5vw,64px)] max-w-[900px]">
          <h2 className="text-[clamp(23px,2.4vw,31px)] text-navy">Packs, payments and downloads</h2>
          <div className="mt-5">
            <FaqList faqs={pageFaqList("packs")} />
          </div>
        </div>
      </div>
    </div>
  );
}
