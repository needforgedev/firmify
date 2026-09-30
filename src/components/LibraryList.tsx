"use client";

import { useState } from "react";
import { CATEGORIES, DOCUMENTS, type CatalogDocument } from "@/data/firmify-data";
import { DocRow } from "@/components/DocCard";
import { useStore } from "@/lib/store";

const TYPES = ["all", "Contract", "Policy", "Letter / Notice", "Form", "Deed"];

export function LibraryList({ fixedTerm }: { fixedTerm?: string }) {
  const { entitledTo, ready } = useStore();
  const [libQ, setLibQ] = useState("");
  const [libCat, setLibCat] = useState("all");
  const [libType, setLibType] = useState("all");
  const [sort, setSort] = useState("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const term = (fixedTerm ?? libQ).trim().toLowerCase();
  let list: CatalogDocument[] = DOCUMENTS.slice();
  if (term) list = list.filter((d) => d.name.toLowerCase().includes(term));
  if (libCat !== "all") list = list.filter((d) => d.cats.includes(libCat));
  if (libType !== "all") list = list.filter((d) => d.type === libType);
  list.sort((a, b) =>
    sort === "az" ? a.name.localeCompare(b.name) : sort === "price" ? a.price - b.price : a.rank - b.rank
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-[#DDE5F4] bg-white">
      <div className="flex flex-wrap items-center gap-3 border-b border-[#EEF2F9] px-5 py-[18px]">
        {fixedTerm === undefined && (
          <div className="relative min-w-[210px] flex-1">
            <input
              value={libQ}
              onChange={(e) => setLibQ(e.target.value)}
              type="search"
              placeholder="Filter this list…"
              aria-label="Filter documents"
              className="h-[46px] w-full rounded-[10px] border border-[#C8D5EC] bg-background pl-10 pr-3.5 outline-none focus:border-brand focus:bg-white"
            />
            <span className="absolute left-3.5 top-3 text-lg text-[#5B6B86]">⚲</span>
          </div>
        )}
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          className="h-[46px] rounded-[10px] border border-[#C8D5EC] bg-white px-[18px] text-[15px] font-bold text-navy"
        >
          Filters
        </button>
        <span className="text-[15px] font-semibold text-[#5B6B86]">{list.length} documents</span>
      </div>

      {filtersOpen && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] items-end gap-3.5 border-b border-[#EEF2F9] bg-background px-5 py-[18px]">
          <label className="block text-sm font-bold text-navy">
            Category
            <select
              value={libCat}
              onChange={(e) => setLibCat(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-[9px] border border-[#C8D5EC] bg-white px-2.5 font-normal"
            >
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-bold text-navy">
            Document type
            <select
              value={libType}
              onChange={(e) => setLibType(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-[9px] border border-[#C8D5EC] bg-white px-2.5 font-normal"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-bold text-navy">
            Sort by
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-[9px] border border-[#C8D5EC] bg-white px-2.5 font-normal"
            >
              <option value="popular">Most downloaded</option>
              <option value="az">A to Z</option>
              <option value="price">Price</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => {
              setLibCat("all");
              setLibType("all");
              setLibQ("");
              setSort("popular");
            }}
            className="h-11 rounded-[9px] border border-[#C8D5EC] bg-white text-[15px] font-bold text-brand"
          >
            Clear filters
          </button>
        </div>
      )}

      <div>
        {list.slice(0, 120).map((d) => (
          <DocRow key={d.slug} doc={d} ownedLabel={ready && entitledTo(d.slug) && d.price > 0 ? "Included in your pack" : undefined} />
        ))}
      </div>
      {list.length > 120 && (
        <p className="px-5 py-4 text-[15px] text-[#5B6B86]">
          Showing the first 120 of {list.length} matches — narrow the filters to see more.
        </p>
      )}
    </div>
  );
}
