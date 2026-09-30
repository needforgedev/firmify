import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CATEGORIES, MAIN_PAGES, PACKS, docsFor, money, packDocCount } from "@/data/firmify-data";
import { pageFaqList } from "@/data/firmify-faqs";
import { DocCard } from "@/components/DocCard";
import { FaqList } from "@/components/FaqList";

export function generateStaticParams() {
  return MAIN_PAGES.map((mp) => ({ id: mp.id }));
}

export async function generateMetadata({ params }: PageProps<"/page/[id]">) {
  const { id } = await params;
  const mp = MAIN_PAGES.find((m) => m.id === id);
  return { title: `${mp?.name ?? "Documents"} — Firmify`, description: mp?.lede };
}

export default async function MainPageRoute({ params }: PageProps<"/page/[id]">) {
  const { id } = await params;
  const mp = MAIN_PAGES.find((m) => m.id === id);
  if (!mp) notFound();

  const pack = PACKS.find((p) => p.id === mp.pack);
  const count = packDocCount(pack ?? { cats: mp.subCats });

  return (
    <div>
      <div className="bg-navy text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-[repeat(auto-fit,minmax(290px,1fr))] items-center gap-[clamp(24px,4vw,48px)] px-[clamp(16px,4vw,26px)] pb-[clamp(30px,4vw,48px)] pt-[22px]">
          <div className="min-w-0">
            <nav aria-label="Breadcrumb" className="mb-4 text-sm text-[#9EB5DC]">
              <Link href="/" className="text-[#9EB5DC]">Home</Link> &nbsp;/&nbsp; {mp.name}
            </nav>
            <p className="text-[13px] font-bold uppercase tracking-[.08em] text-[#7FD69B]">{mp.kicker}</p>
            <h1 className="mt-3 text-[clamp(29px,3.6vw,48px)]">{mp.name}</h1>
            <p className="mt-4 max-w-[62ch] text-[clamp(17px,1.3vw,19.5px)] text-[#D7E2F6]">{mp.lede}</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <span className="whitespace-nowrap rounded-full border border-[#2E4C7D] px-[15px] py-2 text-[14.5px] text-[#D7E2F6]">
                {count} documents
              </span>
              <span className="whitespace-nowrap rounded-full border border-[#2E4C7D] px-[15px] py-2 text-[14.5px] text-[#D7E2F6]">
                Included in the {pack?.name}
              </span>
            </div>
          </div>
          <div className="min-w-0">
            <Image
              src={mp.photo}
              alt={mp.kicker}
              width={620}
              height={330}
              className="block max-h-[330px] w-full rounded-2xl object-cover object-[center_18%]"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-[clamp(16px,4vw,26px)] py-[clamp(30px,4vw,52px)]">
        {mp.subCats.map((cid) => {
          const c = CATEGORIES.find((x) => x.id === cid)!;
          const docs = docsFor(cid).slice().sort((a, b) => a.rank - b.rank).slice(0, 9);
          return (
            <section key={cid} className="mb-[clamp(30px,4vw,48px)]">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3.5">
                <h2 className="text-[clamp(22px,2.3vw,30px)] text-navy">{c.name}</h2>
                <Link href={`/category/${c.id}`} className="whitespace-nowrap text-[15px] font-bold text-brand no-underline hover:underline">
                  All {c.docs.length} →
                </Link>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(258px,1fr))] gap-[13px]">
                {docs.map((d) => (
                  <DocCard key={d.slug} doc={d} compact />
                ))}
              </div>
            </section>
          );
        })}

        {pack && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] items-center gap-6 rounded-2xl border-2 border-brand bg-[#EEF3FC] p-[clamp(24px,3vw,34px)]">
            <div>
              <h2 className="text-[clamp(21px,2.2vw,28px)] text-navy">{pack.name}</h2>
              <p className="mt-2.5 text-[16.5px] text-[#3A465C]">
                {pack.blurb} All {count} documents on this page, up to 50 downloads.
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-baseline justify-end gap-2.5">
                <span className="font-display text-[34px] font-extrabold text-navy">{money(pack.price)}</span>
                <span className="text-[17px] text-[#8A97AD] line-through">{money(pack.was)}</span>
              </div>
              <Link
                href={`/checkout/pack/${pack.id}`}
                className="mt-3.5 inline-grid h-[52px] place-items-center rounded-[11px] bg-brand px-7 font-display text-[17px] font-extrabold text-white no-underline hover:bg-brand-dark"
              >
                Buy this pack
              </Link>
            </div>
          </div>
        )}

        <div className="mx-auto mt-[clamp(40px,5vw,64px)] max-w-[900px]">
          <h2 className="text-[clamp(23px,2.4vw,31px)] text-navy">Frequently asked questions</h2>
          <div className="mt-5">
            <FaqList faqs={pageFaqList(mp.id)} />
          </div>
        </div>
      </div>
    </div>
  );
}
