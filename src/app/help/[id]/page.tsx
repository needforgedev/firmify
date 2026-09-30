import Link from "next/link";
import { notFound } from "next/navigation";
import { HELP_CENTRES } from "@/data/firmify-data";
import { HELP_CENTRE_CONTENT } from "@/data/firmify-faqs";
import { FaqList } from "@/components/FaqList";

export function generateStaticParams() {
  return HELP_CENTRES.map((h) => ({ id: h.id }));
}

export async function generateMetadata({ params }: PageProps<"/help/[id]">) {
  const { id } = await params;
  const centre = HELP_CENTRES.find((h) => h.id === id);
  return { title: `${centre?.name ?? "Help Center"} — Firmify` };
}

export default async function HelpCentrePage({ params }: PageProps<"/help/[id]">) {
  const { id } = await params;
  const centre = HELP_CENTRES.find((h) => h.id === id);
  if (!centre) notFound();
  const content = HELP_CENTRE_CONTENT[centre.id];

  return (
    <div className="mx-auto max-w-[900px] px-[clamp(16px,4vw,26px)] pb-[clamp(44px,5vw,70px)] pt-[26px]">
      <nav aria-label="Breadcrumb" className="mb-3.5 text-sm text-[#5B6B86]">
        <Link href="/" className="text-brand">Home</Link> &nbsp;/&nbsp;{" "}
        <Link href="/resources" className="text-brand">Resources</Link> &nbsp;/&nbsp; Help Center
      </nav>
      <h1 className="text-[clamp(26px,3.1vw,40px)] text-navy [text-wrap:balance]">{centre.name}</h1>
      <p className="mt-3 text-[clamp(17px,1.3vw,19px)] text-[#3A465C]">{content?.intro}</p>
      <div className="mt-[26px]">
        <FaqList faqs={content?.faqs ?? []} />
      </div>
      <h2 className="mt-9 text-xl text-navy">Other help centres</h2>
      <div className="mt-[13px] flex flex-col gap-[9px]">
        {HELP_CENTRES.filter((h) => h.id !== centre.id).map((h) => (
          <Link
            key={h.id}
            href={`/help/${h.id}`}
            className="flex justify-between gap-2.5 rounded-[11px] border border-[#DDE5F4] bg-white px-4 py-3.5 text-base font-semibold text-navy no-underline hover:border-brand"
          >
            <span>{h.name}</span>
            <span className="text-brand">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
