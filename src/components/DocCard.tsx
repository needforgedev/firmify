import Link from "next/link";
import { money, type CatalogDocument } from "@/data/firmify-data";

/** Grid card for a catalogue document (quick buy / category / main pages). */
export function DocCard({ doc, compact }: { doc: CatalogDocument; compact?: boolean }) {
  return (
    <div className="flex flex-col gap-2.5 rounded-[13px] border border-[#DDE5F4] bg-white p-[18px] transition-shadow hover:border-brand hover:shadow-[0_10px_26px_rgba(10,30,70,.09)]">
      <span className="text-xs font-bold uppercase tracking-[.07em] text-[#5B6B86]">{doc.type}</span>
      <h3 className={`${compact ? "text-[17px]" : "text-lg"} font-display font-bold leading-[1.28] text-navy`}>
        {doc.name}
      </h3>
      <div className="flex-1" />
      <div className="flex items-center justify-between gap-2.5">
        <span className="font-display text-[17px] font-extrabold text-navy">{money(doc.price)}</span>
        <Link
          href={`/document/${doc.slug}`}
          className="rounded-[9px] border border-brand bg-[#EEF3FC] px-[15px] py-2 text-[14.5px] font-bold text-brand no-underline hover:bg-brand hover:text-white"
        >
          {compact ? "Open" : "Start →"}
        </Link>
      </div>
    </div>
  );
}

/** List row used on All Documents / search results. */
export function DocRow({ doc, ownedLabel }: { doc: CatalogDocument; ownedLabel?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-[#F2F5FB] px-5 py-[15px] hover:bg-background">
      <div className="min-w-[220px] flex-1">
        <Link
          href={`/document/${doc.slug}`}
          className="font-display text-[17px] font-bold text-navy no-underline hover:text-brand"
        >
          {doc.name}
        </Link>
        <p className="mt-0.5 text-[13.5px] text-[#5B6B86]">
          {doc.type}
          {ownedLabel && <span className="font-bold text-leaf"> · {ownedLabel}</span>}
        </p>
      </div>
      <span className="min-w-[86px] text-right font-display text-base font-extrabold text-navy">
        {money(doc.price)}
      </span>
      <Link
        href={`/document/${doc.slug}`}
        className="rounded-[9px] border border-brand bg-[#EEF3FC] px-4 py-2 text-[14.5px] font-bold text-brand no-underline hover:bg-brand hover:text-white"
      >
        Open
      </Link>
    </div>
  );
}
