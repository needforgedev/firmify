"use client";

import Link from "next/link";
import { CATEGORIES, DOC_BY_SLUG, PACKS, TOTAL_DOCS, docsFor, money } from "@/data/firmify-data";
import { EMPLOYMENT_CONTRACT_FAQS, OFFER_LETTER_FAQS, PAGE_FAQS, type Faq } from "@/data/firmify-faqs";
import { FaqList } from "@/components/FaqList";
import { useStore } from "@/lib/store";

const chip =
  "flex items-center gap-[7px] whitespace-nowrap rounded-full border border-[#D6E0F2] bg-background px-3.5 py-[7px] text-[14.5px]";

export function DocumentLanding({ slug }: { slug: string }) {
  const { entitledTo, ready } = useStore();
  const doc = DOC_BY_SLUG[slug];

  if (!doc) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl text-navy">Document not found</h1>
        <p className="mt-3 text-[#3A465C]">
          <Link href="/all-documents" className="text-brand">Browse all documents</Link>
        </p>
      </div>
    );
  }

  const cat = CATEGORIES.find((c) => c.id === doc.cats[0]);
  const pack = PACKS.find((p) => p.id !== "all-documents-pack" && p.cats.some((c) => doc.cats.includes(c)));
  const owned = ready && entitledTo(slug);
  const isOffer = slug === "employment-offer-letter";
  const isContract = slug === "employment-contract-india";
  const faqs: Faq[] = isOffer
    ? OFFER_LETTER_FAQS
    : isContract
      ? EMPLOYMENT_CONTRACT_FAQS
      : (PAGE_FAQS[doc.cats[0]] || []).map((q) => ({ q, a: null }));
  const related = (cat ? docsFor(cat.id) : [])
    .filter((d) => d.slug !== slug)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 6);

  return (
    <div>
      <div className="border-b border-[#E4EAF6] bg-white">
        <div className="mx-auto max-w-7xl px-[clamp(16px,4vw,26px)] pb-[30px] pt-5">
          <nav aria-label="Breadcrumb" className="mb-3.5 text-sm text-[#5B6B86]">
            <Link href="/" className="text-brand">Home</Link> &nbsp;/&nbsp;{" "}
            <Link href="/all-documents" className="text-brand">All Documents</Link> &nbsp;/&nbsp;{" "}
            <Link href={cat ? `/category/${cat.id}` : "/all-documents"} className="text-brand">
              {cat?.name}
            </Link>{" "}
            &nbsp;/&nbsp; {doc.name}
          </nav>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-[clamp(22px,3vw,40px)]">
            <div className="min-w-0">
              <p className="text-[12.5px] font-bold uppercase tracking-[.08em] text-leaf">
                {doc.type} &middot; India
              </p>
              <h1 className="mt-[11px] text-[clamp(28px,3.4vw,45px)] text-navy [text-wrap:balance]">
                {doc.name}
              </h1>
              <p className="mt-3.5 max-w-[60ch] text-[clamp(17px,1.3vw,19px)] text-[#3A465C]">
                Drafted and kept updated by qualified Indian lawyers. Answer guided questions with
                a tip on every screen, preview it, then download in Word or PDF &mdash; or e-sign
                and send it.
              </p>
              <div className="mt-5 flex flex-wrap gap-[9px]">
                <span className={chip}><span className="font-bold text-leaf">✓</span>Law-firm drafted</span>
                <span className={chip}><span className="font-bold text-leaf">✓</span>Ready in 10 minutes</span>
                <span className={chip}><span className="font-bold text-leaf">✓</span>Word, PDF &amp; e-sign</span>
              </div>
            </div>
            <div className="min-w-0 rounded-2xl border-2 border-brand bg-white p-[22px] shadow-[0_16px_38px_rgba(10,30,70,.10)]">
              {owned ? (
                <p className="text-[13px] font-bold uppercase tracking-[.06em] text-leaf">
                  Unlocked &mdash; included in your access
                </p>
              ) : (
                <>
                  <p className="text-[13px] font-bold uppercase tracking-[.06em] text-[#5B6B86]">Single document</p>
                  <p className="mt-1.5 font-display text-[32px] font-extrabold text-navy">{money(doc.price)}</p>
                  <p className="text-sm text-[#5B6B86]">One-time platform fee, GST extra</p>
                </>
              )}
              <Link
                href={`/create/${slug}`}
                className="mt-4 block h-[54px] w-full rounded-xl bg-brand text-center font-display text-[17.5px] font-extrabold leading-[54px] text-white no-underline hover:bg-brand-dark"
              >
                Start filling &mdash; free to preview
              </Link>
              <p className="mt-[9px] text-center text-[13.5px] text-[#5B6B86]">
                You only pay when you are ready to download
              </p>
              <div className="mt-[18px] border-t border-[#EEF2F9] pt-4">
                <p className="text-[15px] text-[#3A465C]">
                  Or get the <strong className="text-navy">{pack?.name ?? "All Documents Pack"}</strong> at{" "}
                  {money(pack?.price ?? 9999)} and download up to 50 documents.
                </p>
                <Link
                  href="/packs"
                  className="mt-[11px] block h-11 w-full rounded-[10px] border-[1.5px] border-brand bg-[#EEF3FC] text-center text-[15.5px] font-bold leading-[44px] text-brand no-underline hover:bg-brand hover:text-white"
                >
                  See the pack
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-[clamp(16px,4vw,26px)] pb-[clamp(40px,5vw,64px)] pt-[clamp(30px,4vw,52px)]">
        <div className="max-w-[820px]">
          {isOffer || isContract ? (
            <div className="rounded-xl border border-[#DDE5F4] bg-white p-[22px]">
              <p className="text-[12.5px] font-bold uppercase tracking-[.07em] text-leaf">Reference article</p>
              <h2 className="mt-2 text-xl text-navy">
                {isOffer
                  ? "Employment or job offer letter — and why it matters"
                  : "Employment contract in India — what must be in it"}
              </h2>
              <p className="mt-2.5 text-base text-[#3A465C]">
                This document page carries a fully written, lawyer-authored guide in the design
                project ({isOffer ? "OfferLetterArticle" : "EmploymentContractArticle"}). The
                article body is imported on this page in the next implementation pass; its FAQ
                set is already live below.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#E7C980] bg-[#FFF7E6] px-[22px] py-5">
              <h2 className="text-xl text-[#7A5400]">Page copy to be supplied</h2>
              <p className="mt-2.5 text-base text-[#7A5400]">
                Per your brief, each of the {TOTAL_DOCS} documents gets a dedicated page written
                from the keywords Navin&rsquo;s team shares. This shell carries the layout that
                copy drops into: what the document is, who needs it, when to issue it, what it
                must contain, common mistakes, and the FAQ block below. Two pages are fully built
                as reference &mdash;{" "}
                <Link href="/document/employment-offer-letter" className="text-brand">Employment Offer Letter</Link>{" "}
                and{" "}
                <Link href="/document/employment-contract-india" className="text-brand">Employment Contract &ndash; India</Link>.
              </p>
            </div>
          )}

          <div className="mt-[clamp(30px,4vw,48px)] rounded-2xl bg-navy p-[clamp(22px,3vw,32px)] text-white">
            <h2 className="text-[clamp(20px,2.2vw,26px)]">Now let&rsquo;s create this document for you</h2>
            <p className="mt-2.5 text-[16.5px] text-[#D7E2F6]">
              Answer guided questions and download the final document. Save a draft at any point
              and come back to it.
            </p>
            <Link
              href={`/create/${slug}`}
              className="mt-[18px] inline-grid h-[52px] place-items-center rounded-[11px] bg-white px-[26px] font-display text-[17px] font-extrabold text-navy no-underline"
            >
              Start the guided questionnaire →
            </Link>
          </div>

          <h2 className="mt-[clamp(36px,4.5vw,58px)] text-[clamp(23px,2.4vw,31px)] text-navy">
            Frequently asked questions
          </h2>
          <div className="mt-5">
            <FaqList faqs={faqs} pendingNote="Answer to be supplied by Firmify." />
          </div>

          <h2 className="mt-[clamp(36px,4.5vw,58px)] text-[clamp(21px,2.2vw,28px)] text-navy">
            Other documents that may interest you
          </h2>
          <div className="mt-[18px] grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
            {related.map((d) => (
              <Link
                key={d.slug}
                href={`/document/${d.slug}`}
                className="block rounded-xl border border-[#DDE5F4] bg-white p-[15px] text-inherit no-underline hover:border-brand"
              >
                <span className="block font-display text-base font-bold leading-[1.3] text-navy">{d.name}</span>
                <span className="mt-[7px] block text-[14.5px] text-[#5B6B86]">{money(d.price)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
