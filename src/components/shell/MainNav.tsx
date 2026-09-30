"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { DOCUMENTS, MAIN_PAGES } from "@/data/firmify-data";
import { AuthModal } from "./AuthModal";
import { useStore } from "@/lib/store";

const navLink =
  "self-center rounded-t-lg px-3 py-2.5 text-[15.5px] font-semibold no-underline hover:bg-[#EEF3FC] hover:text-brand";
const active = "border-b-[3px] border-brand font-bold text-brand";
const inactive = "border-b-[3px] border-transparent text-[#111827]";

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { store } = useStore();
  const [q, setQ] = useState("");
  const [focusSearch, setFocusSearch] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNavOpen(false);
    setFocusSearch(false);
  }, [pathname]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setFocusSearch(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const suggestions =
    q.trim().length > 1
      ? DOCUMENTS.filter((d) => d.name.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 6)
      : [];

  const doSearch = () => {
    setFocusSearch(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const mobileNav = [
    { label: "Home", href: "/" },
    { label: "All Documents", href: "/all-documents" },
    ...MAIN_PAGES.map((mp) => ({ label: mp.name, href: `/page/${mp.id}` })),
    { label: "Subscription Packs", href: "/packs" },
    { label: "Resources", href: "/resources" },
  ];

  return (
    <div className="sticky top-0 z-[60] border-b border-[#DCE4F3] bg-white print:hidden">
      <div className="mx-auto flex min-h-[62px] max-w-7xl items-center gap-3.5 px-[clamp(14px,4vw,26px)]">
        {/* Mobile row */}
        <div className="flex min-w-0 flex-1 items-center gap-2.5 lg:hidden">
          <button
            type="button"
            onClick={() => setNavOpen((v) => !v)}
            aria-label="Open menu"
            className="grid h-[42px] w-[42px] flex-none place-items-center gap-1 rounded-[10px] border border-[#DCE4F3] bg-white px-[9px] py-[11px]"
          >
            <span className="block h-0.5 w-full rounded bg-navy" />
            <span className="block h-0.5 w-full rounded bg-navy" />
            <span className="block h-0.5 w-full rounded bg-navy" />
          </button>
          <Link href="/" className="flex min-w-0 items-center gap-[7px] no-underline">
            <Image src="/assets/logo-mark.png" alt="Firmify" width={17} height={24} className="h-6 w-auto" />
            <span className="font-display text-[19px] font-extrabold text-foreground">Firmify</span>
          </Link>
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="h-[42px] flex-none rounded-[10px] bg-brand px-3.5 text-[15px] font-bold text-white"
          >
            {store.signedIn ? "My Profile" : "Sign In"}
          </button>
        </div>

        {/* Desktop row */}
        <div className="hidden min-w-0 flex-1 items-center gap-1.5 lg:flex">
          <nav aria-label="Main" className="flex min-w-0 flex-1 items-stretch gap-0.5">
            <Link href="/" className={`${navLink} whitespace-nowrap ${isActive("/") ? active : inactive}`}>
              Home
            </Link>
            <Link
              href="/all-documents"
              className={`${navLink} whitespace-nowrap ${
                isActive("/all-documents") || isActive("/category") || isActive("/document") ? active : inactive
              }`}
            >
              All Documents
            </Link>
            {MAIN_PAGES.map((mp) => (
              <Link
                key={mp.id}
                href={`/page/${mp.id}`}
                className={`${navLink} whitespace-pre-line text-center text-[15px] leading-[1.24] ${
                  isActive(`/page/${mp.id}`) ? active : inactive
                }`}
              >
                {mp.nav}
              </Link>
            ))}
            <Link
              href="/packs"
              className={`${navLink} whitespace-pre-line text-center text-[15px] leading-[1.24] ${isActive("/packs") ? active : inactive}`}
            >
              {"Subscription\nPacks"}
            </Link>
            <Link href="/resources" className={`${navLink} whitespace-nowrap ${isActive("/resources") ? active : inactive}`}>
              Resources
            </Link>
          </nav>
          <div ref={boxRef} className="relative w-[clamp(180px,22vw,290px)] flex-none">
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setFocusSearch(true);
              }}
              onKeyDown={(e) => e.key === "Enter" && doSearch()}
              type="search"
              placeholder="Search documents, topics…"
              aria-label="Search documents"
              className="h-[42px] w-full rounded-[10px] border border-[#C8D5EC] bg-background pl-[38px] pr-3 outline-none focus:border-brand focus:bg-white"
            />
            <span className="absolute left-[13px] top-[11px] text-[17px] text-[#5B6B86]">⚲</span>
            {focusSearch && suggestions.length > 0 && (
              <div className="fm-fade absolute left-0 right-0 top-12 z-[80] overflow-hidden rounded-xl border border-[#D6E0F2] bg-white shadow-[0_18px_40px_rgba(10,30,70,.16)]">
                {suggestions.map((s) => (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => {
                      setFocusSearch(false);
                      router.push(`/document/${s.slug}`);
                    }}
                    className="block w-full border-b border-[#EEF2F9] bg-white px-[13px] py-2.5 text-left text-[15px] font-semibold text-[#0B1F4B] hover:bg-[#EEF3FC]"
                  >
                    {s.name}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={doSearch}
                  className="block w-full bg-background px-[13px] py-2.5 text-left text-sm font-bold text-brand"
                >
                  See all results →
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="flex h-[42px] flex-none items-center gap-[7px] rounded-[10px] bg-brand px-4 text-[15px] font-bold text-white hover:bg-brand-dark"
          >
            <span className="block h-[18px] w-[18px] rounded-full border-2 border-white" />
            {store.signedIn ? "My Profile" : "Sign In"}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {navOpen && (
        <div className="fm-fade border-t border-[#DCE4F3] bg-white px-[clamp(14px,4vw,26px)] pb-5 pt-3.5 lg:hidden">
          <div className="relative mb-3.5">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doSearch()}
              type="search"
              placeholder="Search 224 contracts & policies…"
              aria-label="Search documents"
              className="h-12 w-full rounded-[10px] border border-[#C8D5EC] bg-background pl-10 pr-3.5 outline-none"
            />
            <span className="absolute left-3.5 top-[13px] text-lg text-[#5B6B86]">⚲</span>
          </div>
          <div className="flex flex-col gap-0.5">
            {mobileNav.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                onClick={() => setNavOpen(false)}
                className="border-b border-[#F0F4FB] px-3 py-[13px] text-[17px] font-bold text-[#0B1F4B] no-underline"
              >
                {m.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setNavOpen(false);
                setAuthOpen(true);
              }}
              className="mt-2.5 rounded-[10px] bg-brand px-3 py-[13px] text-center font-display text-[17px] font-extrabold text-white"
            >
              {store.signedIn ? "My Profile" : "Sign In"}
            </button>
          </div>
        </div>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
