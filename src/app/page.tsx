"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CATEGORIES,
  DOCUMENTS,
  HERO_POPULAR,
  MAIN_PAGES,
  PACKS,
  docsFor,
  money,
  packDocCount,
} from "@/data/firmify-data";
import { pageFaqList } from "@/data/firmify-faqs";
import { DocCard } from "@/components/DocCard";
import { FaqList } from "@/components/FaqList";

const container = "mx-auto max-w-7xl px-[clamp(16px,4vw,26px)]";

const valueProps = [
  { title: "Step by step guidance & ready in less than ten minutes", body: "Each contract protects and equips you with clear filling instructions, simple explanations along with helpful notes so you always know what to fill and can have a ready contract in less than ten minutes!" },
  { title: "Save 90 percent cost per contract, or more", body: "You save an average of Rs. 9,000/- for every Rs. 1,000/- you spend on Firmify and if you go for our value packs, then you save even more!" },
  { title: "India’s most trusted & transparent contract platform", body: "No generic templates. No hidden disclaimers. And no hidden charges — just solid legal protection, delivered instantly." },
  { title: "One stop shop for HR, MSMEs & Start Ups", body: "Whether you’re a founder raising funds, an HR manager onboarding talent, a freelancer closing new clients, or someone buying their dream home, Firmify equips you with the contracts you need." },
  { title: "We only offer contracts, & peace of mind", body: "We stick to our expertise and offer only two things: contracts you can trust, and the peace of mind that comes with them. Every Firmify contract is drafted by real lawyers and specifically for Indian legal requirements." },
];

const trustBadges = [
  { glyph: "⚑", title: "Built for BCI 100% compliance", sub: "No ads, no referral, no solicitation" },
  { glyph: "⚖", title: "Drafted by India’s lawyers", sub: "For Indian clients, under Indian law" },
  { glyph: "₹", title: "100% transparent pricing", sub: "No hidden charges or disclaimers" },
  { glyph: "⌂", title: "Legally enforceable documents", sub: "Labour Codes & DPDP Act compliant" },
];

const personaCards = [
  { href: "/page/hr-employment-documents", img: "/assets/photo-desk.png", kicker: "For employers, founders and HR teams", title: "HR & Employment Documents", body: "Hiring, onboarding, policies, employee communications and exits.", count: 98 },
  { href: "/page/company-contracts-policies", img: "/assets/photo-laptop.png", kicker: "For businesses working with vendors and clients", title: "Company Contracts & Policies", body: "Commercial contracts, website terms, privacy documents and the internal policy library.", count: 130 },
  { href: "/page/startup-fundraising-documents", img: "/assets/photo-standing.png", kicker: "For founders and early-stage businesses", title: "Startup & Fundraising Documents", body: "Founders’ agreements, term sheets, ESOP, SAFE and share subscription documents.", count: 54 },
  { href: "/page/property-personal-documents", img: "/assets/photo-primary.png", kicker: "For individuals, landlords and families", title: "Property & Personal Documents", body: "Sale deeds, rent agreements for eight states, powers of attorney, wills and trust deeds.", count: 54 },
];

const testimonials = [
  { img: "/assets/photo-desk.png", time: "0:48", quote: "“I issued eleven offer letters in a week without once opening a lawyer’s inbox. The guidance notes told me exactly what to put in.”", slot: "Video testimonial slot 1", who: "HR Manager — to be filmed" },
  { img: "/assets/photo-standing.png", time: "1:02", quote: "“Our founders’ agreement and ESOP policy cost us under five thousand rupees. Our last law firm quoted forty.”", slot: "Video testimonial slot 2", who: "Founder — to be filmed" },
  { img: "/assets/photo-laptop.png", time: "0:39", quote: "“The rent agreement was state-specific and stamped correctly. That is the part nobody else gets right.”", slot: "Video testimonial slot 3", who: "Individual user — to be filmed" },
];

const loveUs = [
  { glyph: "₹", title: "Affordable professional services", body: "Law-firm quality contracts drafted by senior Indian lawyers, at a fraction of law firm fees." },
  { glyph: "⚖", title: "Diverse expert network", body: "Talk to lawyers, chartered accountants (CAs) and company secretaries (CSs) to meet your legal and financial needs." },
  { glyph: "▤", title: "Easy-to-use dashboard", body: "Streamlined navigation for drafts, downloads, e-signature and renewal tracking." },
  { glyph: "↻", title: "Quick customer support", body: "Queries are responded to within 24 hours*" },
];

const pillarLinks = [
  { kicker: "Guide", title: "Employment or job offer letter — and why it matters", href: "/document/employment-offer-letter" },
  { kicker: "Guide", title: "Employment contract in India — what must be in it", href: "/document/employment-contract-india" },
  { kicker: "Help Center", title: "Firmify Basics & General FAQs", href: "/help/firmify-basics-general-faqs" },
  { kicker: "Tools", title: "Calculators and PDF conversion tools", href: "/resources" },
];

export default function Home() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [quickTab, setQuickTab] = useState(CATEGORIES[0].id);

  const quickDocs = docsFor(quickTab)
    .slice()
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 8);

  const doSearch = () => router.push(`/search?q=${encodeURIComponent(q)}`);

  return (
    <div>
      {/* ---------- Hero (per client's above-the-fold sample) ---------- */}
      <div className="border-b border-[#E4EAF6] bg-gradient-to-b from-[#F2F6FD] to-background">
        <div className={`${container} pb-9 pt-[clamp(20px,3vw,34px)]`}>
          <div className="flex flex-wrap items-center gap-[clamp(20px,3vw,40px)]">
            <div className="grid min-w-0 flex-[1.25_1_300px] place-items-center px-[clamp(12px,2.5vw,30px)] py-[clamp(18px,3.5vw,44px)]">
              <Image
                src="/assets/hero-contract-pen.png"
                alt="Signed partnership agreement with a pen resting on it"
                width={625}
                height={603}
                priority
                className="block w-full max-w-[625px] -rotate-[7deg] drop-shadow-[0_24px_36px_rgba(10,30,70,.16)]"
              />
            </div>

            <div className="min-w-0 flex-[2.1_1_360px]">
              <h1 className="text-[clamp(30px,3.6vw,50px)] text-navy">
                Create legal contracts and policies
                <br />
                <span className="text-leaf">in less than 10 minutes</span>:
              </h1>
              <ol className="mt-[26px] flex list-none flex-col gap-[19px] p-0">
                {[
                  ["Choose a contract or policy", "Search on the search bar for the contract or policy you want or buy from the links provided here."],
                  ["Help us protect your rights", "Answer a few questions with step by step guidance and your document is created automatically."],
                  ["Save-Print or E-sign!", "Your contract or policy is ready to be used and shared!"],
                ].map(([title, sub], i) => (
                  <li key={title} className="flex gap-3.5">
                    <span className="grid h-[34px] w-[34px] flex-none place-items-center rounded-full bg-leaf font-display text-[17px] font-extrabold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="mb-[3px] text-[21px] text-brand">{title}</h3>
                      <p className="text-[17px] text-[#2A3547]">{sub}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="min-w-0 flex-[1_1_240px]">
              <div
                role="button"
                tabIndex={0}
                aria-label="Play: how Firmify works, under one minute"
                className="relative aspect-[4/5] max-h-[430px] cursor-pointer overflow-hidden rounded-[14px] bg-navy shadow-[0_14px_34px_rgba(10,30,70,.18)] hover:shadow-[0_18px_40px_rgba(10,30,70,.26)]"
              >
                <Image
                  src="/assets/photo-laptop.png"
                  alt="A Firmify specialist at her laptop"
                  fill
                  className="object-cover object-[52%_22%]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,30,70,.10)_0%,rgba(10,30,70,.06)_38%,rgba(10,30,70,.72)_78%,rgba(10,30,70,.90)_100%)]" />
                <span className="absolute left-3.5 top-3.5 flex items-center gap-[7px] rounded-full bg-white/95 px-3 py-[5px] text-xs font-extrabold uppercase tracking-[.06em] text-navy">
                  <span className="h-[7px] w-[7px] rounded-full bg-leaf" />
                  0:58
                </span>
                <span className="absolute left-1/2 top-1/2 grid h-[78px] w-[78px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 pl-1.5 text-[29px] text-brand shadow-[0_10px_26px_rgba(10,30,70,.34)]">
                  ▶
                </span>
                <div className="absolute inset-x-0 bottom-0 px-5 pb-5 pt-[18px]">
                  <p className="font-display text-[19px] font-extrabold leading-[1.25] text-white">
                    See how Firmify works
                  </p>
                  <p className="mt-1.5 text-[13.5px] leading-[1.45] text-[#DCE6F8]">
                    A Firmify team member walks you through it &mdash; under one minute
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Search + popular ---------- */}
        <div className={`${container} pb-[30px]`}>
          <h2 className="mb-3 text-[clamp(20px,2vw,25px)] text-navy">What will you draft today?</h2>
          <div className="flex flex-wrap items-center gap-2.5 rounded-xl border-[1.5px] border-[#C8D5EC] bg-white p-1.5 pl-4 shadow-[0_6px_18px_rgba(10,30,70,.06)]">
            <span className="text-xl text-[#5B6B86]">⚲</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doSearch()}
              type="search"
              placeholder="Search for contracts, policies and documents…"
              aria-label="Search for contracts, policies and documents"
              className="h-[50px] min-w-[160px] flex-1 bg-transparent text-[17.5px] outline-none"
            />
            <button
              type="button"
              onClick={doSearch}
              className="h-[50px] rounded-lg bg-navy px-[34px] font-display text-[17px] font-extrabold text-white hover:bg-brand-dark"
            >
              Search
            </button>
          </div>
          <div className="mt-3.5 flex flex-wrap items-center gap-x-[18px] gap-y-2">
            <span className="font-display text-[15px] font-extrabold text-navy">Popular documents:</span>
            {HERO_POPULAR.map((name, i) => {
              const d = DOCUMENTS.find((x) => x.name === name);
              return (
                <Link
                  key={name}
                  href={`/document/${d?.slug ?? ""}`}
                  className="inline-flex items-center gap-[7px] text-[15.5px] font-semibold text-brand no-underline hover:underline"
                >
                  <span className="grid h-[21px] w-[21px] flex-none place-items-center rounded-full bg-brand text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  {name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ---------- Trust badges ---------- */}
        <div className={`${container} pb-[34px]`}>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] overflow-hidden rounded-[14px] border border-[#DDE5F4] bg-white">
            {trustBadges.map((t) => (
              <div key={t.title} className="flex flex-col items-center gap-2.5 border-r border-[#EEF2F9] p-6 text-center last:border-r-0">
                <span className="grid h-16 w-16 place-items-center rounded-full border border-[#D6E0F2] bg-[#EEF3FC] text-2xl text-brand">
                  {t.glyph}
                </span>
                <p className="font-display text-[15.5px] font-extrabold leading-[1.3] text-navy">{t.title}</p>
                <p className="text-[13.5px] leading-[1.4] text-[#5B6B86]">{t.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Marquee ---------- */}
      <div className="overflow-hidden bg-navy py-[13px] text-white">
        <div className="fm-marquee flex w-max">
          {[0, 1].map((i) => (
            <span key={i} className="whitespace-nowrap pr-11 font-display text-[17px] font-bold tracking-[.01em]">
              Simplify (&amp; protect) with Firmify, affordable law firm drafted contracts&nbsp; •
              &nbsp;No generic templates&nbsp; • &nbsp;No hidden disclaimers&nbsp; • &nbsp;No hidden
              charges&nbsp; • &nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ---------- Value props ---------- */}
      <section className={`${container} py-[clamp(44px,5vw,72px)]`}>
        <h2 className="max-w-[22ch] text-[clamp(26px,3vw,40px)] text-navy">
          Simplify (&amp; protect) with Firmify
        </h2>
        <p className="mt-3.5 max-w-[74ch] text-[clamp(17px,1.3vw,19.5px)] text-[#2A3547]">
          Legal contracts shouldn&rsquo;t cost a lot of money, take time, or make you play with
          luck by not legally saving you. Unlike online templates and AI drafts, which are not
          legally enforceable, our contracts are drafted by Indian lawyers and are simple to
          understand, immediately downloadable &amp; legally enforceable to protect your rights.
        </p>
        <div className="mt-[34px] grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[18px]">
          {valueProps.map((v) => (
            <div key={v.title} className="rounded-[14px] border border-[#DDE5F4] bg-white px-6 py-[26px]">
              <span className="mb-4 block h-1 w-10 rounded bg-leaf" />
              <h3 className="mb-[9px] text-[20.5px] text-navy">{v.title}</h3>
              <p className="text-[16.5px] text-[#3A465C]">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Quick buy ---------- */}
      <section className="border-y border-[#E4EAF6] bg-white">
        <div className={`${container} py-[clamp(40px,4.5vw,64px)]`}>
          <div className="mb-[22px] flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-[clamp(24px,2.6vw,34px)] text-navy">
                Quick buy &mdash; our most downloaded documents
              </h2>
              <p className="mt-2 text-[16.5px] text-[#4A5468]">
                Ranked by how often Indian businesses need them. Start filling in one click.
              </p>
            </div>
            <Link href="/all-documents" className="whitespace-nowrap text-[15.5px] font-bold text-brand no-underline hover:underline">
              All 224 documents →
            </Link>
          </div>
          <div className="mb-5 flex flex-wrap gap-2">
            {CATEGORIES.slice(0, 5).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setQuickTab(c.id)}
                className={`h-[34px] rounded-full px-[15px] font-display text-sm font-bold ${
                  c.id === quickTab ? "bg-navy text-white" : "bg-[#EEF3FC] text-brand"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-3.5">
            {quickDocs.map((d) => (
              <DocCard key={d.slug} doc={d} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Persona cards ---------- */}
      <section className={`${container} py-[clamp(44px,5vw,72px)]`}>
        <h2 className="text-[clamp(24px,2.6vw,34px)] text-navy">
          One stop shop for HR, MSMEs &amp; Start Ups
        </h2>
        <p className="mt-2.5 max-w-[78ch] text-[17px] text-[#3A465C]">
          Whether you&rsquo;re a founder raising funds, an HR manager onboarding talent, a
          freelancer closing new clients, or someone buying their dream home &mdash; Firmify
          equips you with the contracts you need.
        </p>
        <div className="mt-7 grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-[18px]">
          {personaCards.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#DDE5F4] bg-white text-inherit no-underline hover:border-brand hover:shadow-[0_14px_34px_rgba(10,30,70,.10)]"
            >
              <Image src={p.img} alt={p.title} width={560} height={186} className="block h-[186px] w-full object-cover object-[center_22%]" />
              <div className="p-5">
                <p className="mb-[7px] text-[12.5px] font-bold uppercase tracking-[.07em] text-leaf">{p.kicker}</p>
                <h3 className="mb-2 text-xl text-navy">{p.title}</h3>
                <p className="text-[15.5px] text-[#4A5468]">{p.body}</p>
                <p className="mt-3.5 text-[15px] font-bold text-brand">{p.count} documents →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Browse by category ---------- */}
      <section className="border-y border-[#E4EAF6] bg-white">
        <div className={`${container} py-[clamp(40px,4.5vw,64px)]`}>
          <h2 className="text-[clamp(24px,2.6vw,34px)] text-navy">Browse the full library by category</h2>
          <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(242px,1fr))] gap-3">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.id}`}
                className="flex items-center justify-between gap-3 rounded-[13px] border border-[#DDE5F4] bg-white p-[18px] text-inherit no-underline hover:border-brand hover:bg-background"
              >
                <span>
                  <span className="block font-display text-[17px] font-extrabold leading-[1.25] text-navy">{c.name}</span>
                  <span className="mt-1 block text-sm text-[#5B6B86]">{c.docs.length} documents</span>
                </span>
                <span className="flex-none text-[19px] text-brand">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Value packs ---------- */}
      <section className={`${container} py-[clamp(44px,5vw,72px)]`}>
        <h2 className="text-[clamp(24px,2.6vw,34px)] text-navy">Choose from our value packs</h2>
        <p className="mt-2.5 max-w-[70ch] text-[17px] text-[#3A465C]">
          Which make our low-cost contracts even more affordable. Each pack is valid for 6 months
          or 1 year, with up to 50 downloads.
        </p>
        <div className="mt-[26px] grid grid-cols-[repeat(auto-fit,minmax(238px,1fr))] gap-3.5">
          {PACKS.map((p) => (
            <div
              key={p.id}
              className={`flex flex-col rounded-[15px] bg-white p-[22px] transition-all hover:-translate-y-0.5 hover:border-brand hover:bg-[#F4F7FF] hover:shadow-[0_8px_22px_rgba(27,63,174,.14)] ${
                p.best ? "border-2 border-brand" : "border border-[#DDE5F4]"
              }`}
            >
              {p.best && (
                <span className="mb-2.5 self-start rounded-full bg-leaf px-[11px] py-[3px] text-xs font-bold uppercase tracking-[.05em] text-white">
                  Best value
                </span>
              )}
              <h3 className="text-[19px] leading-[1.25] text-navy">{p.name}</h3>
              <p className="mt-2 flex-1 text-[15px] text-[#4A5468]">{p.blurb}</p>
              <div className="mt-3.5 flex flex-wrap items-baseline gap-[9px]">
                <span className="whitespace-nowrap font-display text-[26px] font-extrabold text-navy">{money(p.price)}</span>
                <span className="whitespace-nowrap text-[15px] text-[#8A97AD] line-through">{money(p.was)}</span>
              </div>
              <p className="mt-1 text-sm font-bold text-leaf">{packDocCount(p)} documents included</p>
              <Link
                href="/packs"
                className="mt-3.5 block h-11 w-full rounded-[10px] border border-brand bg-brand text-center text-[15.5px] font-bold leading-[44px] text-white no-underline hover:bg-brand-dark"
              >
                View pack
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Why customers love us ---------- */}
      <section className="border-y border-[#E4EAF6] bg-white">
        <div className={`${container} grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-center gap-[clamp(28px,4vw,56px)] py-[clamp(40px,4.5vw,66px)]`}>
          <div className="relative aspect-[5/4] max-h-[400px] min-w-0 rounded-[18px] border border-[#E4EAF6] bg-[radial-gradient(circle_at_50%_50%,#EEF3FC_0%,#F8FAFE_70%)]">
            <Image
              src="/assets/logo-mark.png"
              alt=""
              width={95}
              height={132}
              className="absolute left-1/2 top-1/2 w-[clamp(84px,16%,132px)] -translate-x-1/2 -translate-y-1/2 opacity-95"
            />
            <div className="absolute left-[6%] top-[11%] rounded-xl border border-[#D6E0F2] bg-white px-3.5 py-[9px] shadow-[0_8px_22px_rgba(10,30,70,.10)]">
              <p className="font-display text-xl font-extrabold leading-[1.1] text-navy">500+</p>
              <p className="mt-0.5 text-[11.5px] tracking-[.02em] text-[#5B6B86]">Professionals</p>
            </div>
            <div className="absolute right-[7%] top-[4%] rounded-xl bg-navy px-3.5 py-[9px] shadow-[0_8px_22px_rgba(10,30,70,.18)]">
              <p className="font-display text-xl font-extrabold leading-[1.1] text-white">5,00,000+</p>
              <p className="mt-0.5 text-[11.5px] tracking-[.02em] text-[#AFC3E6]">Businesses</p>
            </div>
            <div className="absolute bottom-[13%] left-[4%] rounded-xl border border-[#D6E0F2] bg-white px-3.5 py-[9px] shadow-[0_8px_22px_rgba(10,30,70,.10)]">
              <p className="font-display text-xl font-extrabold leading-[1.1] text-navy">1 lakh+</p>
              <p className="mt-0.5 text-[11.5px] tracking-[.02em] text-[#5B6B86]">Contracts delivered</p>
            </div>
            <div className="absolute bottom-[4%] right-[9%] rounded-xl bg-leaf px-3.5 py-[9px] shadow-[0_8px_22px_rgba(10,30,70,.14)]">
              <p className="font-display text-xl font-extrabold leading-[1.1] text-white">1,00,000+</p>
              <p className="mt-0.5 text-[11.5px] tracking-[.02em] text-[#D3F0DE]">Downloads</p>
            </div>
          </div>
          <div className="min-w-0">
            <h2 className="text-[clamp(25px,2.9vw,37px)] tracking-[-0.025em] text-navy">
              Why do customers love us?
            </h2>
            <div className="mt-[22px] flex flex-col gap-[18px]">
              {loveUs.map((f) => (
                <div key={f.title} className="flex gap-3.5">
                  <span className="grid h-[38px] w-[38px] flex-none place-items-center rounded-full bg-[#EEF3FC] text-[17px] font-bold text-brand">
                    {f.glyph}
                  </span>
                  <div>
                    <h3 className="text-[16.5px] text-navy">{f.title}</h3>
                    <p className="mt-1 text-[14.5px] leading-[1.5] text-[#4A5468]">{f.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Who makes our contracts ---------- */}
      <section className="bg-navy text-white">
        <div className={`${container} grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] items-center gap-[clamp(26px,4vw,52px)] py-[clamp(44px,5vw,72px)]`}>
          <div className="min-w-0">
            <h2 className="text-[clamp(26px,3vw,38px)]">Who makes our contracts?</h2>
            <p className="mt-4 text-[clamp(17px,1.3vw,19px)] text-[#D7E2F6]">
              Each document is prepared and updated by India&rsquo;s premier law firms and
              corporate lawyers. Our knowledge partners, that are prominent law firms including{" "}
              <strong className="text-white">Corrida Legal</strong> for corporate and employment
              law documents, ensure legal accuracy, enforceability, and protection of your rights.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {["Labour Codes 2025 compliant", "DPDP Act, 2023 compliant", "Reviewed almost daily"].map((t) => (
                <span key={t} className="whitespace-nowrap rounded-full border border-[#2E4C7D] px-[15px] py-[7px] text-[14.5px] text-[#D7E2F6]">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="grid min-w-0 grid-cols-2 gap-3.5">
            <Image src="/assets/photo-standing.png" alt="Indian corporate lawyer at the Firmify office" width={560} height={340} className="block h-full max-h-[340px] w-full rounded-[14px] object-cover" />
            <Image src="/assets/photo-laptop.png" alt="Firmify legal team member reviewing a contract" width={560} height={340} className="block h-full max-h-[340px] w-full rounded-[14px] object-cover" />
          </div>
        </div>
      </section>

      {/* ---------- Contracts for everyone ---------- */}
      <section className={`${container} py-[clamp(44px,5vw,72px)]`}>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(330px,1fr))] items-center gap-[clamp(26px,4vw,56px)]">
          <div className="order-1 grid grid-cols-2 gap-4">
            {[
              { href: "/page/startup-fundraising-documents", img: "/assets/photo-standing.png", label: <>For Startups<br />&amp; Founders</> },
              { href: "/page/company-contracts-policies", img: "/assets/photo-laptop.png", label: <>For Companies<br />&amp; SMEs</> },
              { href: "/page/hr-employment-documents", img: "/assets/photo-desk.png", label: <>For HR<br />Professionals</> },
              { href: "/page/property-personal-documents", img: "/assets/photo-primary.png", label: <>For Individuals<br />&amp; Landlords</> },
            ].map((c, i) => (
              <Link
                key={i}
                href={c.href}
                className="flex flex-col overflow-hidden rounded-[15px] border border-[#E4EAF6] bg-[#F3F7FD] text-inherit no-underline transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-[0_12px_30px_rgba(10,30,70,.12)]"
              >
                <Image src={c.img} alt="" width={400} height={132} className="block h-[132px] w-full object-cover object-[center_18%]" />
                <div className="flex flex-1 items-end justify-between gap-2.5 px-4 pb-4 pt-[15px]">
                  <h3 className="text-[17px] leading-[1.25] text-navy">{c.label}</h3>
                  <span aria-hidden className="flex-none text-[17px] text-brand">→</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="order-2 min-w-0">
            <h2 className="text-[clamp(30px,3.6vw,46px)] leading-[1.1] tracking-[-0.03em] text-navy">
              Contracts
              <br />
              for everyone
            </h2>
            <p className="mt-4 max-w-[46ch] text-[16.5px] leading-[1.6] text-[#3A465C]">
              Drafted by Indian lawyers, built for Indian law. Whether you are raising your first
              round, onboarding a team, or renting out a flat &mdash; start from the library made
              for you.
            </p>
            <Link
              href="/all-documents"
              className="mt-5 inline-flex min-h-12 items-center gap-[9px] whitespace-nowrap rounded-[11px] bg-brand px-[22px] py-[13px] font-display text-[15.5px] font-extrabold text-white no-underline hover:bg-brand-dark"
            >
              Browse all documents <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Highlights ---------- */}
      <section className="bg-[linear-gradient(115deg,#14307F_0%,#0A1E46_62%)]">
        <div className={`${container} py-[clamp(40px,4.5vw,62px)] text-center`}>
          <p className="inline-flex items-center gap-[7px] text-xs font-bold uppercase tracking-[.14em] text-[#AFC3E6]">
            <span aria-hidden>⚡</span> Why choose us
          </p>
          <h2 className="mt-2.5 text-[clamp(26px,3vw,38px)] tracking-[-0.025em] text-white">A few highlights</h2>
          <div className="mt-[30px] grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[clamp(22px,3vw,40px)]">
            {[
              ["72%", "of users found hidden legal risks they didn’t know existed."],
              ["Most MSMEs", "check contracts only after a payment issue. We help catch that earlier."],
              ["Startup founders", "most often struggle with unclear equity clauses. We flag this upfront."],
            ].map(([stat, body]) => (
              <div key={stat}>
                <p className="font-display text-[clamp(22px,2.3vw,28px)] font-extrabold text-white">{stat}</p>
                <p className="mt-2 text-[15px] leading-[1.55] text-[#D3DEF2]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Clients ---------- */}
      <section className="border-y border-[#E4EAF6] bg-white">
        <div className={`${container} py-[clamp(36px,4vw,56px)]`}>
          <p className="text-center text-[13px] font-bold uppercase tracking-[.1em] text-[#5B6B86]">Our clients</p>
          <div className="mt-[22px] grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3.5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="grid h-[72px] place-items-center rounded-[11px] border border-dashed border-[#C8D5EC] bg-[#FAFCFF]">
                <span className="px-2 text-center font-mono text-[10.5px] uppercase tracking-[.06em] text-[#8A97AD]">
                  client logo {n}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section className={`${container} py-[clamp(44px,5vw,72px)]`}>
        <h2 className="text-[clamp(24px,2.6vw,34px)] text-navy">What our clients say</h2>
        <p className="mt-2.5 text-[16.5px] text-[#4A5468]">Video testimonials from real Firmify users.</p>
        <div className="mt-[26px] grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
          {testimonials.map((t) => (
            <div key={t.slot} className="overflow-hidden rounded-[15px] border border-[#DDE5F4] bg-white">
              <div className="relative">
                <Image src={t.img} alt="Firmify client video testimonial" width={520} height={230} className="block h-[230px] w-full object-cover object-[center_18%]" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-[62px] w-[62px] place-items-center rounded-full bg-[rgba(10,30,70,.82)] pl-[5px] text-[22px] text-white">▶</span>
                </span>
                <span className="absolute bottom-2.5 right-2.5 rounded-md bg-navy px-2 py-[3px] text-xs font-bold text-white">{t.time}</span>
              </div>
              <div className="p-[18px]">
                <p className="text-[16.5px] leading-[1.5] text-[#1A2438]">{t.quote}</p>
                <p className="mt-[11px] text-[14.5px] font-bold text-navy">{t.slot}</p>
                <p className="text-sm text-[#5B6B86]">{t.who}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Learn before you draft ---------- */}
      <section className="border-y border-[#DDE5F4] bg-[#EEF3FC]">
        <div className={`${container} grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-center gap-[clamp(24px,3vw,44px)] py-[clamp(40px,4.5vw,64px)]`}>
          <div>
            <h2 className="text-[clamp(24px,2.6vw,34px)] text-navy">Learn before you draft</h2>
            <p className="mt-3 max-w-[60ch] text-[17px] text-[#3A465C]">
              Guides written by lawyers, not by AI &mdash; on what each document does, where
              employers go wrong, and what to check before you sign. Plus calculators and PDF
              tools.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/resources" className="grid h-[50px] place-items-center rounded-[11px] bg-brand px-[22px] font-display text-[16.5px] font-extrabold text-white no-underline hover:bg-brand-dark">
                Explore Resources
              </Link>
              <Link href="/help/firmify-basics-general-faqs" className="grid h-[50px] place-items-center rounded-[11px] border-[1.5px] border-brand px-[22px] font-display text-[16.5px] font-extrabold text-brand no-underline hover:bg-white">
                Help Center
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            {pillarLinks.map((p) => (
              <Link
                key={p.title}
                href={p.href}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#DDE5F4] bg-white px-[17px] py-[15px] text-inherit no-underline hover:border-brand"
              >
                <span>
                  <span className="block text-xs font-bold uppercase tracking-[.07em] text-leaf">{p.kicker}</span>
                  <span className="mt-[3px] block font-display text-[16.5px] font-bold text-navy">{p.title}</span>
                </span>
                <span className="flex-none text-brand">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FAQs ---------- */}
      <section className="mx-auto max-w-[900px] px-[clamp(16px,4vw,26px)] py-[clamp(44px,5vw,72px)]">
        <h2 className="text-[clamp(24px,2.6vw,34px)] text-navy">Frequently asked questions</h2>
        <div className="mt-[22px]">
          <FaqList
            faqs={pageFaqList("home").slice(0, 6)}
            pendingNote="Answer to be supplied by Firmify — this question is from your Complete FAQ Question Set, where answers are still to be prepared."
          />
        </div>
      </section>
    </div>
  );
}
