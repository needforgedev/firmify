import type {
  Answers,
  Clause,
  Condition,
  Question,
  RepeatItem,
  Template,
} from "./types";

// ---------- rendered output ----------

/** A run is a span of text: static clause text, a filled answer, or a blank. */
export interface RenderedRun {
  text: string;
  kind: "static" | "filled" | "blank";
}

export interface RenderedParagraph {
  runs: RenderedRun[];
}

export interface RenderedClause {
  id: string;
  /** Assigned after conditional exclusions, so removals renumber cleanly. */
  number?: number;
  heading?: string;
  paragraphs: RenderedParagraph[];
}

// ---------- helpers ----------

export function conditionHolds(cond: Condition | undefined, answers: Answers): boolean {
  if (!cond) return true;
  return answers[cond.questionId] === cond.equals;
}

/** Questions currently visible given the answers (drives progress + validation). */
export function visibleQuestions(template: Template, answers: Answers): Question[] {
  return template.questions.filter((q) => conditionHolds(q.showIf, answers));
}

export function isAnswered(q: Question, answers: Answers): boolean {
  const v = answers[q.id];
  if (q.type === "repeat_group") return Array.isArray(v) && v.length > 0;
  return typeof v === "string" && v.trim() !== "";
}

/** Missing required (and visible) questions among the given ids. */
export function missingRequired(
  template: Template,
  answers: Answers,
  questionIds?: string[]
): Question[] {
  const scope = visibleQuestions(template, answers).filter(
    (q) => !questionIds || questionIds.includes(q.id)
  );
  return scope.filter((q) => q.required && !isAnswered(q, answers));
}

export function progress(template: Template, answers: Answers): number {
  const visible = visibleQuestions(template, answers).filter((q) => q.type !== "repeat_group");
  if (visible.length === 0) return 0;
  const answered = visible.filter((q) => isAnswered(q, answers)).length;
  return Math.round((answered / visible.length) * 100);
}

// ---------- placeholder substitution ----------

const PLACEHOLDER = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

function formatValue(id: string, value: string, template: Template): string {
  const q =
    template.questions.find((x) => x.id === id) ??
    template.questions
      .flatMap((x) => x.fields ?? [])
      .find((x) => x.id === id);
  if (q?.type === "number" && /^\d+(\.\d+)?$/.test(value)) {
    return Number(value).toLocaleString("en-IN");
  }
  return value;
}

function substitute(
  body: string,
  template: Template,
  answers: Answers,
  scope?: RepeatItem
): RenderedParagraph[] {
  return body.split("\n\n").map((para) => {
    const runs: RenderedRun[] = [];
    let last = 0;
    for (const m of para.matchAll(PLACEHOLDER)) {
      if (m.index! > last) runs.push({ text: para.slice(last, m.index), kind: "static" });
      const id = m[1];
      const raw = scope?.[id] ?? answers[id];
      if (typeof raw === "string" && raw.trim() !== "") {
        runs.push({ text: formatValue(id, raw.trim(), template), kind: "filled" });
      } else {
        runs.push({ text: "________", kind: "blank" });
      }
      last = m.index! + m[0].length;
    }
    if (last < para.length) runs.push({ text: para.slice(last), kind: "static" });
    return { runs };
  });
}

// ---------- the core function ----------

/**
 * The heart of the platform: template + answers -> resolved, numbered clauses.
 * Consumed by the live preview, the gated preview, DOCX and PDF generation.
 */
export function renderDocument(template: Template, answers: Answers): RenderedClause[] {
  const out: RenderedClause[] = [];
  let number = 0;

  for (const clause of template.clauses) {
    if (!conditionHolds(clause.includeIf, answers)) continue;

    let body = clause.body ?? "";
    if (clause.variants && clause.variantKey) {
      const key = answers[clause.variantKey];
      body =
        (typeof key === "string" && clause.variants[key]) ||
        "[Option to be selected in the questionnaire]";
    }

    let paragraphs: RenderedParagraph[];
    if (clause.repeatOver) {
      const items = answers[clause.repeatOver];
      if (!Array.isArray(items) || items.length === 0) continue;
      paragraphs = items.flatMap((item, i) =>
        substitute(body.replaceAll("{{index}}", String(i + 1)), template, answers, item)
      );
    } else {
      paragraphs = substitute(body, template, answers);
    }

    const rendered: RenderedClause = { id: clause.id, heading: clause.heading, paragraphs };
    if (clause.heading && !clause.unnumbered) {
      number += 1;
      rendered.number = number;
    }
    out.push(rendered);
  }

  return out;
}

/** Plain-text projection, used for the demo DOCX download. */
export function clauseText(c: RenderedClause): string {
  return c.paragraphs.map((p) => p.runs.map((r) => r.text).join("")).join("\n\n");
}
