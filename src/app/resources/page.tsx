import Link from "next/link";
import { HELP_CENTRES } from "@/data/firmify-data";
import { pageFaqList } from "@/data/firmify-faqs";
import { FaqList } from "@/components/FaqList";

export const metadata = {
  title: "Resources — Firmify",
  description: "Articles, help centre FAQs and calculators — written by lawyers, not generated.",
};

const articles = [
  { kicker: "HR & Employment", title: "Employment or job offer letter — and why it matters", excerpt: "What an offer letter is, who needs one, when to issue it, what it must contain, and the mistakes that cost employers later.", href: "/document/employment-offer-letter", ready: true },
  { kicker: "HR & Employment", title: "Employment contract in India — what must be in it", excerpt: "The difference between an offer letter and a contract, and the clauses the new labour codes make unavoidable.", href: "/document/employment-contract-india", ready: true },
  { kicker: "Website, Data & IP", title: "DPDP Act, 2023 — what your website policy must now say", excerpt: "", href: "/category/website-data-ip", ready: false },
  { kicker: "Startup & Funding", title: "Founders’ agreement vs shareholders’ agreement", excerpt: "", href: "/category/startup-funding", ready: false },
  { kicker: "Property", title: "State-specific rent agreements — stamping and registration", excerpt: "", href: "/category/property", ready: false },
  { kicker: "Company Policies", title: "The policy set an audit will ask for", excerpt: "", href: "/category/company-policies", ready: false },
];

const tools = [
  { name: "Gratuity calculator", note: "Payment of Gratuity Act" },
  { name: "Notice period & F&F calculator", note: "Labour Codes 2025" },
  { name: "Stamp duty estimator", note: "State-wise" },
  { name: "Word to PDF converter", note: "For downloaded documents" },
  { name: "PDF merge & split", note: "Annexures and schedules" },
];

export default function Resources() {
  return (
    <div>
      <div className="border-b border-[#E4EAF6] bg-white">
        <div className="mx-auto max-w-7xl px-[clamp(16px,4vw,26px)] pb-[30px] pt-5">
          <nav aria-label="Breadcrumb" className="mb-3.5 text-sm text-[#5B6B86]">
            <Link href="/" className="text-brand">Home</Link> &nbsp;/&nbsp; Resources
          </nav>
          <h1 className="text-[clamp(28px,3.4vw,44px)] text-navy">Resources</h1>
          <p className="mt-3 max-w-[78ch] text-[clamp(17px,1.3vw,19px)] text-[#3A465C]">
            Articles, help centre FAQs and calculators &mdash; all in one place. Written by
            lawyers, not generated. Read first, then draft with confidence.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-[clamp(16px,4vw,26px)] pb-[clamp(40px,5vw,64px)] pt-[clamp(26px,3vw,42px)]">
        <h2 className="text-[clamp(22px,2.3vw,30px)] text-navy">Articles &amp; guides</h2>
        <div className="mt-[18px] grid grid-cols-[repeat(auto-fill,minmax(285px,1fr))] gap-3.5">
          {articles.map((a) => (
            <Link
              key={a.title}
              href={a.href}
              className="flex flex-col gap-[9px] rounded-[14px] border border-[#DDE5F4] bg-white p-5 text-inherit no-underline hover:border-brand hover:shadow-[0_12px_28px_rgba(10,30,70,.09)]"
            >
              <span className="text-xs font-bold uppercase tracking-[.07em] text-leaf">{a.kicker}</span>
              <h3 className="text-[18.5px] leading-[1.3] text-navy">{a.title}</h3>
              {a.ready ? (
                <>
                  <p className="text-[15px] text-[#4A5468]">{a.excerpt}</p>
                  <p className="text-[14.5px] font-bold text-brand">Read the guide →</p>
                </>
              ) : (
                <p className="rounded-lg border border-dashed border-[#E7C980] bg-[#FFF7E6] px-[11px] py-[9px] text-sm text-[#8A5A00]">
                  Article to be written by your authors
                </p>
              )}
            </Link>
          ))}
        </div>

        <h2 className="mt-[clamp(38px,4.5vw,58px)] text-[clamp(22px,2.3vw,30px)] text-navy">Help Center</h2>
        <div className="mt-[18px] grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[13px]">
          {HELP_CENTRES.map((h) => (
            <Link
              key={h.id}
              href={`/help/${h.id}`}
              className="flex items-center justify-between gap-3 rounded-[13px] border border-[#DDE5F4] bg-white p-[18px] text-inherit no-underline hover:border-brand hover:bg-background"
            >
              <span className="font-display text-[16.5px] font-bold leading-[1.3] text-navy">{h.name}</span>
              <span className="flex-none text-brand">→</span>
            </Link>
          ))}
        </div>

        <h2 className="mt-[clamp(38px,4.5vw,58px)] text-[clamp(22px,2.3vw,30px)] text-navy">
          Calculators &amp; tools
        </h2>
        <p className="mt-2 text-base text-[#5B6B86]">
          Scope and integration to be confirmed with the developer, per your brief.
        </p>
        <div className="mt-[18px] grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3">
          {tools.map((t) => (
            <div key={t.name} className="rounded-xl border border-dashed border-[#C8D5EC] bg-white p-[17px]">
              <p className="font-display text-[16.5px] font-bold text-navy">{t.name}</p>
              <p className="mt-[5px] text-sm text-[#5B6B86]">{t.note}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-[clamp(40px,5vw,64px)] max-w-[900px]">
          <h2 className="text-[clamp(23px,2.4vw,31px)] text-navy">About Resources</h2>
          <div className="mt-5">
            <FaqList faqs={pageFaqList("resources")} pendingNote="Answer to be supplied by Firmify." />
          </div>
        </div>
      </div>
    </div>
  );
}
