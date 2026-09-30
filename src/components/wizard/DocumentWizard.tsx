"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Template, Answers } from "@/lib/types";
import { clauseText, conditionHolds, missingRequired, progress, renderDocument } from "@/lib/render";
import { QuestionField } from "@/components/QuestionField";
import { DocumentPreview } from "@/components/DocumentPreview";
import { DOC_BY_SLUG, PACKS, money } from "@/data/firmify-data";
import { useStore } from "@/lib/store";

type Mode = "wizard" | "preview";

export function DocumentWizard({ slug, template }: { slug: string; template: Template }) {
  const router = useRouter();
  const { store, ready, entitledTo, upsertDraft, recordDownload } = useStore();
  const doc = DOC_BY_SLUG[slug];
  const pack = doc
    ? PACKS.find((p) => p.id !== "all-documents-pack" && p.cats.some((c) => doc.cats.includes(c)))
    : undefined;

  const [answers, setAnswers] = useState<Answers>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("wizard");
  const [invalidIds, setInvalidIds] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [mobilePreview, setMobilePreview] = useState(false);
  const loaded = useRef(false);

  const unlocked = ready && entitledTo(slug);
  const title = doc?.name ?? template.title;

  // Resume draft once the store has hydrated.
  useEffect(() => {
    if (!ready || loaded.current) return;
    const draft = store.drafts.find((d) => d.slug === slug);
    if (draft) {
      setAnswers(draft.answers);
      if (draft.pct >= 100) setMode("preview");
    }
    loaded.current = true;
  }, [ready, store.drafts, slug]);

  const rendered = useMemo(() => renderDocument(template, answers), [template, answers]);
  const pct = progress(template, answers);
  const step = template.steps[stepIndex];

  const stepQuestions = useMemo(
    () =>
      step.questionIds
        .map((id) => template.questions.find((q) => q.id === id)!)
        .filter((q) => conditionHolds(q.showIf, answers)),
    [template, step, answers]
  );

  // Autosave to the shared store (mirrors the future Supabase drafts table).
  useEffect(() => {
    if (!loaded.current) return;
    upsertDraft(slug, title, mode === "preview" ? 100 : pct, answers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, mode]);

  function setAnswer(id: string, value: Answers[string]) {
    setInvalidIds((prev) => prev.filter((x) => x !== id));
    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      for (const q of template.questions) {
        if (q.showIf && !conditionHolds(q.showIf, next) && next[q.id] !== undefined) {
          delete next[q.id];
        }
      }
      return next;
    });
  }

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function next() {
    const missing = missingRequired(template, answers, step.questionIds).map((q) => q.id);
    setInvalidIds(missing);
    if (missing.length > 0) return;
    if (stepIndex < template.steps.length - 1) {
      setStepIndex(stepIndex + 1);
      window.scrollTo({ top: 0 });
    } else {
      const missingAll = missingRequired(template, answers);
      if (missingAll.length > 0) {
        flash(`Missing required: ${missingAll.map((q) => q.label).join(", ")}`);
        return;
      }
      setMode("preview");
      window.scrollTo({ top: 0 });
    }
  }

  function downloadDocx() {
    const html = `<html><head><meta charset="utf-8"><title>${title}</title></head>
      <body style="font-family: Georgia, serif; line-height: 1.6;">
      <h2 style="text-align:center">${title.toUpperCase()}</h2>
      ${rendered
        .map(
          (c) =>
            `${c.heading ? `<h3>${c.number != null ? c.number + ". " : ""}${c.heading}</h3>` : ""}
             ${clauseText(c).split("\n\n").map((p) => `<p>${p}</p>`).join("")}`
        )
        .join("")}
      </body></html>`;
    const blob = new Blob([html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    recordDownload(slug);
  }

  return (
    <div className="bg-background">
      {/* Progress bar */}
      <div className="sticky top-[62px] z-30 border-b border-[#DCE4F3] bg-white px-4 py-3 print:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <div className="font-display text-sm font-bold text-navy">
            {mode === "wizard" ? (
              <>Step {stepIndex + 1} of {template.steps.length}: {step.title}</>
            ) : (
              <>Preview</>
            )}
          </div>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#E9EEF8]">
            <div
              className="h-full rounded-full bg-brand transition-all duration-300"
              style={{ width: `${mode === "preview" ? 100 : pct}%` }}
            />
          </div>
          <div className="text-sm font-bold text-brand">{mode === "preview" ? 100 : pct}%</div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-navy px-5 py-3 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-[clamp(16px,4vw,26px)] py-8">
        {mode === "wizard" ? (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
            <div>
              <div className="rounded-2xl border border-[#DDE5F4] bg-white p-6 shadow-sm">
                <h1 className="text-xl text-navy">{step.title}</h1>
                {step.description && <p className="mt-1 text-sm text-[#5B6B86]">{step.description}</p>}
                <div className="mt-6 space-y-6">
                  {stepQuestions.map((q) => (
                    <QuestionField
                      key={q.id}
                      question={q}
                      answers={answers}
                      invalid={invalidIds.includes(q.id)}
                      onChange={setAnswer}
                    />
                  ))}
                </div>
                <div className="mt-8 flex items-center justify-between gap-3">
                  <button
                    onClick={() => stepIndex > 0 && setStepIndex(stepIndex - 1)}
                    disabled={stepIndex === 0}
                    className="rounded-lg border border-[#C8D5EC] px-5 py-2.5 text-sm font-semibold text-[#3A465C] disabled:opacity-40"
                  >
                    ← Previous
                  </button>
                  <button onClick={() => flash("Draft saved — find it in your Dashboard.")} className="text-sm font-semibold text-brand hover:underline">
                    Save draft
                  </button>
                  <button
                    onClick={next}
                    className="rounded-lg bg-brand px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
                  >
                    {stepIndex === template.steps.length - 1 ? "Go to preview" : "Next →"}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setMobilePreview((v) => !v)}
                className="mt-4 w-full rounded-lg border border-[#C8D5EC] bg-white px-4 py-3 text-sm font-semibold text-brand lg:hidden"
              >
                {mobilePreview ? "Hide" : "Show"} live preview
              </button>
            </div>

            <div className={`${mobilePreview ? "" : "hidden"} lg:block`}>
              <div className="lg:sticky lg:top-36 lg:max-h-[calc(100vh-11rem)] lg:overflow-y-auto">
                <div className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-[#5B6B86]">
                  Live preview — updates as you answer
                </div>
                <DocumentPreview title={title} clauses={rendered} locked={false} />
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl">
            {!unlocked && doc && (
              <div className="mb-6 rounded-2xl border-2 border-brand bg-white p-6 shadow-sm print:hidden">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="font-display text-lg font-extrabold text-navy">
                      Your document is ready to unlock
                    </h1>
                    <p className="mt-1 text-sm text-[#5B6B86]">
                      One-time purchase — download in Word &amp; PDF, valid for 1 week.
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl font-extrabold text-navy">{money(doc.price)}</div>
                    <button
                      onClick={() => router.push(`/checkout/document/${slug}`)}
                      className="mt-2 rounded-lg bg-brand px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
                    >
                      Pay &amp; unlock
                    </button>
                  </div>
                </div>
                {pack && (
                  <div className="mt-4 rounded-lg bg-background p-3 text-sm text-[#3A465C]">
                    💡 <span className="font-semibold">Better value:</span> the {pack.name} gives
                    you this + more for {money(pack.price)} (6 months, 50 downloads).{" "}
                    <Link href="/packs" className="font-bold text-brand">Compare packs</Link>
                  </div>
                )}
              </div>
            )}

            {unlocked && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#BBE3C8] bg-[#EFFAF2] p-4 print:hidden">
                <div className="text-sm font-semibold text-[#116430]">
                  ✅ Unlocked — download or e-sign your document
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      recordDownload(slug);
                      window.print();
                    }}
                    className="rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={downloadDocx}
                    className="rounded-lg border border-brand bg-white px-4 py-2 text-sm font-bold text-brand hover:bg-[#EEF3FC]"
                  >
                    Download Word
                  </button>
                  <button
                    onClick={() => router.push(`/esign/${slug}`)}
                    className="rounded-lg border border-[#C8D5EC] bg-white px-4 py-2 text-sm font-bold text-[#3A465C] hover:bg-background"
                  >
                    E-sign ✍️
                  </button>
                </div>
              </div>
            )}

            <DocumentPreview title={title} clauses={rendered} locked={!unlocked} />

            <div className="mt-6 flex justify-between print:hidden">
              <button
                onClick={() => setMode("wizard")}
                className="rounded-lg border border-[#C8D5EC] bg-white px-5 py-2.5 text-sm font-semibold text-[#3A465C]"
              >
                ← Back to questions
              </button>
              <Link
                href="/dashboard"
                className="rounded-lg border border-[#C8D5EC] bg-white px-5 py-2.5 text-sm font-semibold text-[#3A465C] no-underline"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
