"use client";

import type { RenderedClause } from "@/lib/render";

// Renders the resolved clause list as the "paper" preview.
// `locked` redacts everything after the first two clauses — in production this
// redaction happens server-side so paid text never reaches the browser.

const LOCKED_VISIBLE_CLAUSES = 2;

function Paragraphs({ clause, redacted }: { clause: RenderedClause; redacted: boolean }) {
  return (
    <div
      className={
        redacted
          ? "select-none space-y-3 blur-[5px]"
          : "space-y-3"
      }
      aria-hidden={redacted}
    >
      {clause.paragraphs.map((p, i) => (
        <p key={i} className="text-[15px] leading-7 text-slate-800">
          {p.runs.map((run, j) =>
            run.kind === "static" ? (
              <span key={j}>{run.text}</span>
            ) : run.kind === "filled" ? (
              <span key={j} className="rounded bg-blue-50 px-0.5 font-semibold text-blue-900">
                {run.text}
              </span>
            ) : (
              <span key={j} className="rounded bg-amber-100 px-0.5 tracking-widest text-amber-700">
                {run.text}
              </span>
            )
          )}
        </p>
      ))}
    </div>
  );
}

export function DocumentPreview({
  title,
  clauses,
  locked,
}: {
  title: string;
  clauses: RenderedClause[];
  locked: boolean;
}) {
  return (
    <div
      id="document-preview"
      className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 print:border-0 print:p-0 print:shadow-none"
    >
      {locked && (
        <div className="pointer-events-none absolute inset-0 z-10 flex select-none items-center justify-center">
          <span className="-rotate-30 text-4xl font-black uppercase tracking-widest text-slate-200 sm:text-6xl">
            Firmify Preview
          </span>
        </div>
      )}
      <h2 className="text-center text-lg font-bold uppercase tracking-wide text-slate-900">
        {title}
      </h2>
      <div className="mt-6 space-y-6">
        {clauses.map((clause, idx) => {
          const redacted = locked && idx >= LOCKED_VISIBLE_CLAUSES;
          return (
            <section key={clause.id}>
              {clause.heading && (
                <h3 className="mb-1.5 text-[15px] font-bold text-slate-900">
                  {clause.number != null && `${clause.number}. `}
                  {clause.heading}
                </h3>
              )}
              <Paragraphs clause={clause} redacted={redacted} />
            </section>
          );
        })}
      </div>
      {locked && (
        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4 text-center text-sm text-blue-900 print:hidden">
          This is a restricted preview. Unlock to view, download and e-sign the full document.
          <div className="mt-1 text-xs text-blue-700">
            (In production, redacted text is stripped on the server — it never reaches the
            browser.)
          </div>
        </div>
      )}
    </div>
  );
}
