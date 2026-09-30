import Link from "next/link";
import { CATEGORIES, TOTAL_DOCS } from "@/data/firmify-data";
import { pageFaqList } from "@/data/firmify-faqs";
import { FaqList } from "@/components/FaqList";
import { LibraryList } from "@/components/LibraryList";

export const metadata = {
  title: "All Documents — Firmify",
  description: "The complete Firmify document library — 224 law-firm drafted contracts and policies for India.",
};

export default function AllDocuments() {
  return (
    <div>
      <div className="border-b border-[#E4EAF6] bg-white">
        <div className="mx-auto max-w-7xl px-[clamp(16px,4vw,26px)] pb-[30px] pt-5">
          <nav aria-label="Breadcrumb" className="mb-3.5 text-sm text-[#5B6B86]">
            <Link href="/" className="text-brand">Home</Link> &nbsp;/&nbsp; All Documents
          </nav>
          <h1 className="text-[clamp(28px,3.4vw,44px)] text-navy">All Documents</h1>
          <p className="mt-3 max-w-[80ch] text-[clamp(17px,1.3vw,19px)] text-[#3A465C]">
            The complete Firmify document library &mdash; {TOTAL_DOCS} paid contracts and policies
            plus free resources including NDAs, rent receipts and affidavits. Browse a category,
            or search by what you are trying to do.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-[clamp(16px,4vw,26px)] py-[clamp(26px,3vw,40px)]">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(285px,1fr))] gap-3.5">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.id}`}
              className="flex flex-col gap-2 rounded-[14px] border border-[#DDE5F4] bg-white p-5 text-inherit no-underline hover:border-brand hover:shadow-[0_12px_28px_rgba(10,30,70,.09)]"
            >
              <h2 className="text-[18.5px] text-navy">{c.name}</h2>
              <p className="flex-1 text-[15px] text-[#4A5468]">{c.blurb}</p>
              <p className="text-[14.5px] font-bold text-brand">{c.docs.length} documents →</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-[clamp(16px,4vw,26px)] pb-[clamp(40px,5vw,64px)]">
        <LibraryList />
        <div className="mx-auto mt-[clamp(40px,5vw,64px)] max-w-[900px]">
          <h2 className="text-[clamp(23px,2.4vw,31px)] text-navy">Choosing the right document</h2>
          <div className="mt-5">
            <FaqList faqs={pageFaqList("all-documents")} />
          </div>
        </div>
      </div>
    </div>
  );
}
