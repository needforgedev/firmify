"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, CITIES, HELP_CENTRES, LEGAL_PAGES, MAIN_PAGES, slugify } from "@/data/firmify-data";

const h3Class = "mb-[13px] text-sm font-bold uppercase tracking-[.09em] text-white";
const linkClass = "text-[15px] text-[#C9D8EF] no-underline hover:text-white";

export function SiteFooter() {
  const [subscribed, setSubscribed] = useState(false);

  const footerMain = [
    { label: "Home", href: "/" },
    { label: "All Documents", href: "/all-documents" },
    ...MAIN_PAGES.map((mp) => ({ label: mp.name, href: `/page/${mp.id}` })),
    { label: "Subscription Packs", href: "/packs" },
    { label: "Resources", href: "/resources" },
  ];

  return (
    <footer className="mt-auto bg-navy text-[#C9D8EF] print:hidden">
      <div className="mx-auto max-w-7xl px-[clamp(16px,4vw,26px)] pb-7 pt-[clamp(40px,4.5vw,60px)]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-[clamp(22px,3vw,38px)]">
          <div>
            <div className="mb-3.5 flex items-center gap-[9px]">
              <Image src="/assets/logo-mark.png" alt="Firmify" width={22} height={30} className="h-[30px] w-auto" />
              <span className="font-display text-[22px] font-extrabold text-white">Firmify</span>
            </div>
            <p className="text-[15px] leading-[1.55]">
              Download law firm drafted contracts &amp; policies. India-specific, legally
              enforceable, ready in under ten minutes.
            </p>
            <div className="mt-4 flex gap-[9px]">
              <Link href="/legal/contact-support" className="rounded-[9px] border border-[#2E4C7D] px-[13px] py-2 text-sm font-bold text-[#D7E2F6] no-underline hover:bg-brand-dark hover:text-white">
                Follow on LinkedIn
              </Link>
              <Link href="/legal/contact-support" className="rounded-[9px] border border-[#2E4C7D] px-[13px] py-2 text-sm font-bold text-[#D7E2F6] no-underline hover:bg-brand-dark hover:text-white">
                Instagram
              </Link>
            </div>
          </div>
          <nav aria-label="Main pages">
            <h3 className={h3Class}>Main pages</h3>
            <ul className="flex list-none flex-col gap-2 p-0">
              {footerMain.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="All Documents categories">
            <h3 className={h3Class}>All Documents categories</h3>
            <ul className="flex list-none flex-col gap-2 p-0">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link href={`/category/${c.id}`} className={linkClass}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Help Center">
            <h3 className={h3Class}>Help Center</h3>
            <ul className="flex list-none flex-col gap-2 p-0">
              {HELP_CENTRES.map((h) => (
                <li key={h.id}>
                  <Link href={`/help/${h.id}`} className={linkClass}>{h.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h3 className={h3Class}>Legal &amp; platform</h3>
            <ul className="mb-5 flex list-none flex-col gap-2 p-0">
              {LEGAL_PAGES.map((l) => (
                <li key={l.id}>
                  <Link href={`/legal/${l.id}`} className={linkClass}>{l.name}</Link>
                </li>
              ))}
            </ul>
            <h3 className="mb-[11px] text-sm font-bold uppercase tracking-[.09em] text-white">Newsletter</h3>
            <div className="flex flex-wrap gap-[7px]">
              <input
                type="email"
                placeholder="you@company.in"
                aria-label="Email address for newsletter"
                className="h-[42px] min-w-[130px] flex-1 rounded-[9px] border border-[#2E4C7D] bg-[#0E2654] px-3 text-white outline-none focus:border-[#6E93D6]"
              />
              <button
                type="button"
                onClick={() => setSubscribed(true)}
                className="h-[42px] rounded-[9px] bg-brand px-[15px] text-[14.5px] font-bold text-white hover:bg-[#2C56D4]"
              >
                {subscribed ? "Subscribed ✓" : "Subscribe"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-[34px] border-t border-[#1E3868] pt-6">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-[.09em] text-white">
            Legal contract drafting near you
          </h3>
          <div className="flex flex-wrap gap-x-3.5 gap-y-[7px]">
            {CITIES.map((c) => (
              <Link key={c} href={`/city/${slugify(c)}`} className="text-sm text-[#9EB5DC] no-underline hover:text-white">
                Legal contract drafting in {c}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-[30px] grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-start gap-6 border-t border-[#1E3868] pt-6">
          <div className="flex flex-wrap gap-2.5">
            {["BCI compliant", "Law-firm drafted", "DPDP Act ready", "Labour Codes ready"].map((t) => (
              <span key={t} className="flex items-center gap-2 rounded-[10px] border border-[#2E4C7D] px-[13px] py-[9px] text-[13.5px] font-semibold text-[#D7E2F6]">
                <span className="grid h-[22px] w-[22px] flex-none place-items-center rounded-full bg-leaf text-xs text-white">✓</span>
                {t}
              </span>
            ))}
          </div>
          <p className="text-[13.5px] leading-[1.6] text-[#9EB5DC]">
            Firmify is a technology-platform that provides consumers with access to professionally
            drafted legal contracts and agreements. We operate in strict compliance with the Bar
            Council of India (BCI) Rules, particularly those governing legal practice, advertising,
            and professional conduct of advocates.{" "}
            <Link href="/legal/bci-compliance-note" className="font-bold text-[#D7E2F6]">
              Read the Firmify BCI Compliance Note
            </Link>{" "}
            highlighting the key BCI regulations and Firmify&rsquo;s due compliance.
          </p>
        </div>

        <p className="mt-[26px] text-[13.5px] text-[#7E97C4]">
          &copy; 2026 Firmify. www.firmify.in &mdash; Firmify is not a law firm and does not
          provide legal advice.{" "}
          <Link href="/admin" className="text-[#7E97C4]">Admin CMS</Link>
        </p>
      </div>
    </footer>
  );
}
