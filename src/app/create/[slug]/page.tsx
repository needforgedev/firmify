import Link from "next/link";
import { DOC_BY_SLUG } from "@/data/firmify-data";
import { fetchPublishedTemplate, listPublishedTemplates } from "@/lib/templatesApi";
import { DocumentWizard } from "@/components/wizard/DocumentWizard";

// The questionnaire comes from the database (templates + the published
// template_versions row) — nothing here imports the authored template files,
// so clause content stays out of the client bundle and the admin CMS can
// publish new questionnaires without a deploy.

export async function generateMetadata({ params }: PageProps<"/create/[slug]">) {
  const { slug } = await params;
  const doc = DOC_BY_SLUG[slug];
  return { title: `Create: ${doc?.name ?? slug} — Firmify` };
}

export default async function CreatePage({ params }: PageProps<"/create/[slug]">) {
  const { slug } = await params;
  const doc = DOC_BY_SLUG[slug];
  const template = await fetchPublishedTemplate(slug);

  if (!template) {
    const demos = await listPublishedTemplates();
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
            draft. {demos.length > 0 && "These questionnaires are live today:"}
          </p>
          {demos.length > 0 && (
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-base">
              {demos.map((d) => (
                <li key={d.slug}>
                  <Link href={`/create/${d.slug}`} className="font-bold text-brand">
                    {d.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-base text-[#7A5400]">
            Try any of them to see the full flow: guided questions, live preview, restricted
            preview, payment unlock, Word/PDF download and e-sign.
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
