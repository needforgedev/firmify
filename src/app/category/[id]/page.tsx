import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, PACKS, docsFor, money } from "@/data/firmify-data";
import { pageFaqList } from "@/data/firmify-faqs";
import { DocCard } from "@/components/DocCard";
import { FaqList } from "@/components/FaqList";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/category/[id]">) {
  const { id } = await params;
  const cat = CATEGORIES.find((c) => c.id === id);
  return { title: `${cat?.name ?? "Category"} — Firmify`, description: cat?.blurb };
}

export default async function CategoryPage({ params }: PageProps<"/category/[id]">) {
  const { id } = await params;
  const cat = CATEGORIES.find((c) => c.id === id);
  if (!cat) notFound();

  const docs = docsFor(cat.id).slice().sort((a, b) => a.rank - b.rank);
  const pack = PACKS.find((p) => p.cats.includes(cat.id) && p.id !== "all-documents-pack");

  return (
    <div>
      <div className="border-b border-[#E4EAF6] bg-white">
        <div className="mx-auto max-w-7xl px-[clamp(16px,4vw,26px)] pb-[30px] pt-5">
          <nav aria-label="Breadcrumb" className="mb-3.5 text-sm text-[#5B6B86]">
            <Link href="/" className="text-brand">Home</Link> &nbsp;/&nbsp;{" "}
            <Link href="/all-documents" className="text-brand">All Documents</Link> &nbsp;/&nbsp; {cat.name}
          </nav>
          <h1 className="text-[clamp(28px,3.4vw,44px)] text-navy">{cat.name}</h1>
          <p className="mt-3 max-w-[80ch] text-[clamp(17px,1.3vw,19px)] text-[#3A465C]">{cat.blurb}</p>
          <p className="mt-3.5 text-[15px] font-bold text-brand">{docs.length} documents in this category</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-[clamp(16px,4vw,26px)] pb-[clamp(40px,5vw,64px)] pt-[clamp(26px,3vw,40px)]">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(262px,1fr))] gap-[13px]">
          {docs.map((d) => (
            <DocCard key={d.slug} doc={d} compact />
          ))}
        </div>

        <div className="mt-[clamp(22px,3vw,36px)] grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] items-center gap-[22px] rounded-2xl bg-navy p-[clamp(24px,3vw,34px)] text-white">
          <div>
            <h2 className="text-[clamp(21px,2.2vw,27px)]">Need several of these?</h2>
            <p className="mt-2.5 text-[16.5px] text-[#D7E2F6]">
              The {pack?.name ?? "All Documents Pack"} covers this category and its neighbours for{" "}
              {money(pack?.price ?? 9999)} &mdash; up to 50 downloads.
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-2.5">
            <Link
              href="/packs"
              className="grid h-[50px] place-items-center rounded-[11px] bg-white px-6 font-display text-[16.5px] font-extrabold text-navy no-underline"
            >
              Compare packs
            </Link>
          </div>
        </div>

        <div className="mt-[clamp(30px,4vw,48px)] w-full max-w-[900px]">
          <h2 className="text-[clamp(23px,2.4vw,31px)] text-navy">
            {cat.name} &mdash; frequently asked questions
          </h2>
          <div className="mt-5">
            <FaqList faqs={pageFaqList(cat.id)} />
          </div>
          <h3 className="mt-[34px] text-lg text-navy">Other categories</h3>
          <div className="mt-3 flex flex-wrap gap-[9px]">
            {CATEGORIES.filter((c) => c.id !== cat.id).map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.id}`}
                className="whitespace-nowrap rounded-full border border-[#C8D5EC] bg-white px-3.5 py-2 text-[14.5px] font-semibold text-inherit no-underline hover:border-brand"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
