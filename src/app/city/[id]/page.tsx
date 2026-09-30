import Link from "next/link";
import { notFound } from "next/navigation";
import { CITIES, DOCUMENTS, money, slugify } from "@/data/firmify-data";

export function generateStaticParams() {
  return CITIES.map((c) => ({ id: slugify(c) }));
}

export async function generateMetadata({ params }: PageProps<"/city/[id]">) {
  const { id } = await params;
  const city = CITIES.find((c) => slugify(c) === id);
  return { title: `Legal contract drafting in ${city ?? "your city"} — Firmify` };
}

export default async function CityPage({ params }: PageProps<"/city/[id]">) {
  const { id } = await params;
  const city = CITIES.find((c) => slugify(c) === id);
  if (!city) notFound();

  const docs = DOCUMENTS.slice().sort((a, b) => a.rank - b.rank).slice(0, 9);

  return (
    <div className="mx-auto max-w-[1080px] px-[clamp(16px,4vw,26px)] pb-[clamp(44px,5vw,70px)] pt-[26px]">
      <nav aria-label="Breadcrumb" className="mb-3.5 text-sm text-[#5B6B86]">
        <Link href="/" className="text-brand">Home</Link> &nbsp;/&nbsp; Legal contract drafting in {city}
      </nav>
      <h1 className="text-[clamp(27px,3.2vw,42px)] text-navy">Legal contract drafting in {city}</h1>
      <div className="mt-[18px] rounded-xl border border-dashed border-[#E7C980] bg-[#FFF7E6] px-[18px] py-4">
        <p className="text-[15.5px] text-[#7A5400]">
          Cluster page shell. Per your brief, the text and layout for all twenty city pages will
          be prepared from the keywords Navin&rsquo;s team shares &mdash; the structure,
          breadcrumbs, document grid and internal links are in place and ready for that copy.
        </p>
      </div>
      <h2 className="mt-[34px] text-[clamp(21px,2.2vw,28px)] text-navy">
        Most downloaded documents in {city}
      </h2>
      <div className="mt-[18px] grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[13px]">
        {docs.map((d) => (
          <Link
            key={d.slug}
            href={`/document/${d.slug}`}
            className="block rounded-[13px] border border-[#DDE5F4] bg-white p-[17px] text-inherit no-underline hover:border-brand"
          >
            <span className="block text-xs font-bold uppercase tracking-[.07em] text-[#5B6B86]">{d.type}</span>
            <span className="mt-[7px] block font-display text-[17px] font-bold leading-[1.28] text-navy">{d.name}</span>
            <span className="mt-2.5 block text-base font-extrabold text-navy">{money(d.price)}</span>
          </Link>
        ))}
      </div>
      <h3 className="mt-[34px] text-lg text-navy">Other cities</h3>
      <div className="mt-3 flex flex-wrap gap-[9px]">
        {CITIES.filter((c) => c !== city).slice(0, 12).map((c) => (
          <Link
            key={c}
            href={`/city/${slugify(c)}`}
            className="whitespace-nowrap rounded-full border border-[#C8D5EC] bg-white px-3.5 py-2 text-[14.5px] font-semibold text-inherit no-underline hover:border-brand"
          >
            {c}
          </Link>
        ))}
      </div>
    </div>
  );
}
