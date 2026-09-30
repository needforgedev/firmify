import { DOC_BY_SLUG } from "@/data/firmify-data";
import { DocumentLanding } from "./DocumentLanding";

export async function generateMetadata({ params }: PageProps<"/document/[slug]">) {
  const { slug } = await params;
  const doc = DOC_BY_SLUG[slug];
  return {
    title: doc ? `${doc.name} — Firmify` : "Document — Firmify",
    description: doc
      ? `${doc.name}: law-firm drafted, India-specific ${doc.type.toLowerCase()}. Fill guided questions and download in Word or PDF.`
      : undefined,
  };
}

export default async function DocumentPage({ params }: PageProps<"/document/[slug]">) {
  const { slug } = await params;
  return <DocumentLanding slug={slug} />;
}
