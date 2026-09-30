"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DOCUMENTS, TOTAL_DOCS } from "@/data/firmify-data";
import { DocRow } from "@/components/DocCard";

function SearchResults() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const term = q.trim().toLowerCase();
  const list = term
    ? DOCUMENTS.filter((d) => d.name.toLowerCase().includes(term)).sort((a, b) => a.rank - b.rank)
    : [];

  return (
    <div className="mx-auto max-w-7xl px-[clamp(16px,4vw,26px)] pb-[clamp(40px,5vw,64px)] pt-[26px]">
      <nav aria-label="Breadcrumb" className="mb-3.5 text-sm text-[#5B6B86]">
        <Link href="/" className="text-brand">Home</Link> &nbsp;/&nbsp; Search
      </nav>
      <h1 className="text-[clamp(26px,3vw,38px)] text-navy">
        {list.length} results for &ldquo;{q}&rdquo;
      </h1>
      <div className="mt-[22px] overflow-hidden rounded-2xl border border-[#DDE5F4] bg-white">
        {list.map((d) => (
          <DocRow key={d.slug} doc={d} />
        ))}
        {list.length === 0 && (
          <p className="p-6 text-[16px] text-[#5B6B86]">No documents match this search.</p>
        )}
      </div>
      <p className="mt-5 text-base text-[#4A5468]">
        Not finding it?{" "}
        <Link href="/all-documents" className="text-brand">Browse all {TOTAL_DOCS} documents</Link>{" "}
        or ask the support chat in the corner.
      </p>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
