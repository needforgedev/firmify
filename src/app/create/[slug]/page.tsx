import Link from "next/link";
import { DOC_BY_SLUG } from "@/data/firmify-data";
import { employmentContractIndia } from "@/lib/templates/employment-contract-india";
import { vendorAgreement } from "@/lib/templates/vendor-agreement";
import { foundersAgreement } from "@/lib/templates/founders-agreement";
import { rentAgreement } from "@/lib/templates/rent-agreement";
import type { Template } from "@/lib/types";
import { DocumentWizard } from "@/components/wizard/DocumentWizard";

// Questionnaire templates authored so far — one demo document per main-page
// category, keyed by catalogue slug. Every catalogue document eventually gets
// one of these, built via the future admin CMS. Keep in sync with
// scripts/seed.ts (DEMO_TEMPLATES).
const TEMPLATES: Record<string, Template> = {
  "employment-contract-india": employmentContractIndia, // HR & Employment
  "vendor-agreement": vendorAgreement, // Company Contracts & Policies
  "founders-agreement": foundersAgreement, // Startup & Fundraising
  "residential-rent-agreement-india": rentAgreement, // Property & Personal
};

export async function generateMetadata({ params }: PageProps<"/create/[slug]">) {
  const { slug } = await params;
  const doc = DOC_BY_SLUG[slug];
  return { title: `Create: ${doc?.name ?? slug} — Firmify` };
}

export default async function CreatePage({ params }: PageProps<"/create/[slug]">) {
  const { slug } = await params;
  const template = TEMPLATES[slug];
  const doc = DOC_BY_SLUG[slug];

  if (!template) {
    return (
      <div className="mx-auto max-w-3xl px-[clamp(16px,4vw,26px)] py-14">
        <nav aria-label="Breadcrumb" className="mb-3.5 text-sm text-[#5B6B86]">
          <Link href="/" className="text-brand">Home</Link> &nbsp;/&nbsp;{" "}
          <Link href={`/document/${slug}`} className="text-brand">{doc?.name ?? slug}</Link>{" "}
          &nbsp;/&nbsp; Create
        </nav>
        <h1 className="text-[clamp(26px,3vw,38px)] text-navy">{doc?.name ?? "Document"}</h1>
        <div className="mt-5 rounded-xl border border-dashed border-[#E7C980] bg-[#FFF7E6] px-[22px] py-5">
          <h2 className="text-xl text-[#7A5400]">Questionnaire being authored</h2>
          <p className="mt-2.5 text-base text-[#7A5400]">
            Each of the 224 documents gets its own guided questionnaire with conditional logic,
            clause options and guidance notes, authored in the admin CMS from the law firm&rsquo;s
            draft. Four demo questionnaires are live &mdash; one per category:{" "}
            <Link href="/create/employment-contract-india" className="font-bold text-brand">
              Employment Contract &ndash; India
            </Link>
            ,{" "}
            <Link href="/create/vendor-agreement" className="font-bold text-brand">
              Vendor Agreement
            </Link>
            ,{" "}
            <Link href="/create/founders-agreement" className="font-bold text-brand">
              Founders&rsquo; Agreement
            </Link>{" "}
            and{" "}
            <Link href="/create/residential-rent-agreement-india" className="font-bold text-brand">
              Residential Rent Agreement &ndash; India
            </Link>{" "}
            &mdash; try any of them to see the full flow: guided questions, live preview,
            restricted preview, payment unlock, Word/PDF download and e-sign.
          </p>
        </div>
        <Link
          href={`/document/${slug}`}
          className="mt-6 inline-block rounded-lg border border-[#C8D5EC] bg-white px-5 py-2.5 text-sm font-semibold text-[#3A465C] no-underline"
        >
          ← Back to the document page
        </Link>
      </div>
    );
  }

  return <DocumentWizard slug={slug} template={template} />;
}
