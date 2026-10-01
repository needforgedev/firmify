"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DOC_BY_SLUG, PACKS, money, packDocCount } from "@/data/firmify-data";
import { useStore } from "@/lib/store";

const fmt = (t: number) =>
  new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function Dashboard() {
  const router = useRouter();
  const { store, draftsReady, reset } = useStore();

  const drafts = store.drafts.slice().sort((a, b) => b.at - a.at);
  const open = drafts.filter((d) => d.pct < 100);
  const done = drafts.filter((d) => d.pct >= 100);

  if (!draftsReady) return <div className="min-h-[50vh]" />;

  return (
    <div className="mx-auto w-full max-w-[1160px] px-[clamp(16px,4vw,26px)] pb-[clamp(44px,5vw,70px)] pt-[26px]">
      <div className="flex flex-wrap items-end justify-between gap-3.5">
        <div>
          <nav aria-label="Breadcrumb" className="mb-3 text-sm text-[#5B6B86]">
            <Link href="/" className="text-brand">Home</Link> &nbsp;/&nbsp; Dashboard
          </nav>
          <h1 className="text-[clamp(27px,3.2vw,40px)] text-navy">My dashboard</h1>
        </div>
        <button
          type="button"
          onClick={reset}
          className="h-10 whitespace-nowrap rounded-[10px] border border-[#DCE4F3] bg-white px-[15px] text-sm text-[#5B6B86]"
        >
          Reset demo data
        </button>
      </div>

      <section className="mt-[30px]">
        <h2 className="text-[clamp(20px,2vw,25px)] text-navy">Open projects</h2>
        <p className="mt-1.5 text-[15.5px] text-[#5B6B86]">
          Unfinished documents stay here until you complete them.
        </p>
        <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[13px]">
          {open.map((d) => (
            <div key={d.slug} className="rounded-[13px] border border-[#DDE5F4] border-l-4 border-l-leaf bg-white p-[18px]">
              <h3 className="text-[17.5px] leading-[1.3] text-navy">{d.name}</h3>
              <div className="mt-3 h-[7px] overflow-hidden rounded bg-[#E9EEF8]">
                <div className="h-full rounded bg-leaf" style={{ width: `${d.pct}%` }} />
              </div>
              <p className="mt-[7px] text-sm text-[#5B6B86]">
                {d.pct}% complete &middot; last saved {fmt(d.at)}
              </p>
              <button
                type="button"
                onClick={() => router.push(`/create/${d.slug}`)}
                className="mt-3.5 h-[42px] rounded-[10px] bg-brand px-[18px] text-[15px] font-bold text-white hover:bg-brand-dark"
              >
                Resume
              </button>
            </div>
          ))}
          {open.length === 0 && (
            <div className="rounded-[13px] border border-dashed border-[#C8D5EC] bg-white p-[22px] text-center">
              <p className="text-base text-[#5B6B86]">
                No open projects.{" "}
                <Link href="/all-documents" className="text-brand">Start a document</Link> and it
                will appear here even if you leave halfway.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="mt-[38px]">
        <h2 className="text-[clamp(20px,2vw,25px)] text-navy">Completed documents</h2>
        <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[13px]">
          {done.map((d) => (
            <div key={d.slug} className="rounded-[13px] border border-[#DDE5F4] bg-white p-[18px]">
              <h3 className="text-[17.5px] leading-[1.3] text-navy">{d.name}</h3>
              <p className="mt-1.5 text-sm text-[#5B6B86]">Completed {fmt(d.at)}</p>
              <div className="mt-3.5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => router.push(`/create/${d.slug}`)}
                  className="h-10 rounded-[10px] border border-brand bg-[#EEF3FC] px-[15px] text-[14.5px] font-bold text-brand"
                >
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/esign/${d.slug}`)}
                  className="h-10 rounded-[10px] border border-[#DCE4F3] bg-white px-[15px] text-[14.5px] font-bold text-navy"
                >
                  E-sign
                </button>
              </div>
            </div>
          ))}
          {done.length === 0 && (
            <div className="rounded-[13px] border border-dashed border-[#C8D5EC] bg-white p-[22px] text-center">
              <p className="text-base text-[#5B6B86]">Nothing completed yet.</p>
            </div>
          )}
        </div>
      </section>

      <section className="mt-[38px] grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
        <div>
          <h2 className="text-[clamp(20px,2vw,25px)] text-navy">Subscription status</h2>
          <div className="mt-4 flex flex-col gap-3">
            {store.entitlements.packs.map((pid) => {
              const p = PACKS.find((x) => x.id === pid);
              const used = store.downloads.length;
              return (
                <div key={pid} className="rounded-[14px] bg-navy p-5 text-white">
                  <p className="text-[12.5px] font-bold uppercase tracking-[.07em] text-[#7FD69B]">Active pack</p>
                  <h3 className="mt-[7px] text-[19px]">{p?.name ?? pid}</h3>
                  <p className="mt-1.5 text-[15px] text-[#D7E2F6]">
                    {p ? packDocCount(p) : 0} documents &middot; Valid until{" "}
                    {fmt(Date.now() + 365 * 864e5)}
                  </p>
                  <div className="mt-[13px] h-[7px] overflow-hidden rounded bg-[#1E3868]">
                    <div className="h-full rounded bg-brand" style={{ width: `${Math.min(100, (used / 50) * 100)}%` }} />
                  </div>
                  <p className="mt-[7px] text-sm text-[#9EB5DC]">{used} of 50 downloads used</p>
                </div>
              );
            })}
            {store.entitlements.packs.length === 0 && (
              <div className="rounded-[13px] border border-dashed border-[#C8D5EC] bg-white p-[22px]">
                <p className="text-base text-[#5B6B86]">
                  No active subscription.{" "}
                  <Link href="/packs" className="text-brand">Compare the five packs</Link> &mdash;
                  most users save more than they spend on the first two documents.
                </p>
              </div>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-[clamp(20px,2vw,25px)] text-navy">Payment history</h2>
          <div className="mt-4 overflow-hidden rounded-[13px] border border-[#DDE5F4] bg-white">
            {store.purchases.slice().reverse().map((p, i) => (
              <div key={i} className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F2F5FB] px-[17px] py-3.5">
                <div>
                  <p className="font-display text-base font-bold text-navy">{p.name}</p>
                  <p className="text-[13.5px] text-[#5B6B86]">
                    {p.kind === "pack" ? "Subscription pack" : "Single document"} &middot; {fmt(p.at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-extrabold text-navy">{money(p.amount)}</p>
                  <span className="text-[13.5px] text-brand">Invoice</span>
                </div>
              </div>
            ))}
            {store.purchases.length === 0 && (
              <p className="p-[22px] text-center text-base text-[#5B6B86]">No payments yet.</p>
            )}
          </div>
          {store.entitlements.docs.length > 0 && (
            <div className="mt-4">
              <h3 className="text-[17px] text-navy">Individually purchased documents</h3>
              <div className="mt-[11px] flex flex-col gap-[9px]">
                {store.entitlements.docs.map((s) => (
                  <div key={s} className="flex flex-wrap items-center justify-between gap-2.5 rounded-[11px] border border-[#DDE5F4] bg-white px-[15px] py-[13px]">
                    <span className="text-[15.5px] font-semibold text-navy">
                      {DOC_BY_SLUG[s]?.name ?? s}
                    </span>
                    <span className="flex gap-[7px]">
                      <button
                        type="button"
                        onClick={() => router.push(`/create/${s}`)}
                        className="h-9 rounded-[9px] border border-brand bg-[#EEF3FC] px-[13px] text-sm font-bold text-brand"
                      >
                        Open
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push(`/esign/${s}`)}
                        className="h-9 rounded-[9px] border border-[#DCE4F3] bg-white px-[13px] text-sm font-bold text-navy"
                      >
                        E-sign
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
