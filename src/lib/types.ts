// Core template model: a document template is a questionnaire + a clause tree.
// The final document is always render(template, answers) — never hand-assembled.

export type QuestionType =
  | "text"
  | "number"
  | "date"
  | "yes_no"
  | "choice"
  | "repeat_group";

export interface ChoiceOption {
  value: string;
  label: string;
}

/** Simple equality condition on a previous answer. */
export interface Condition {
  questionId: string;
  equals: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  tooltip?: string;
  required?: boolean;
  placeholder?: string;
  /** For type "choice". */
  options?: ChoiceOption[];
  /** Question only shown when the condition holds. */
  showIf?: Condition;
  /** For type "repeat_group": the sub-fields of each repeated item. */
  fields?: Question[];
  min?: number;
  max?: number;
  /** Label for one repeated item, e.g. "Witness". */
  itemLabel?: string;
}

export interface Clause {
  id: string;
  heading?: string;
  /** Static text with {{placeholders}}. Ignored when `variants` is set. */
  body?: string;
  /** Clause included only when the condition holds. */
  includeIf?: Condition;
  /** Alternative wordings; the answer to `variantKey` picks one. */
  variants?: Record<string, string>;
  variantKey?: string;
  /** Repeat this clause's body once per item of a repeat_group answer. */
  repeatOver?: string;
  /** Preamble / signature blocks are not numbered. */
  unnumbered?: boolean;
}

export interface Step {
  id: string;
  title: string;
  description?: string;
  questionIds: string[];
}

export interface Template {
  slug: string;
  title: string;
  version: number;
  category: string;
  description: string;
  /** One-off price in INR (demo values). */
  price: number;
  strikePrice?: number;
  steps: Step[];
  questions: Question[];
  clauses: Clause[];
}

export type RepeatItem = Record<string, string>;
export type AnswerValue = string | RepeatItem[];
export type Answers = Record<string, AnswerValue>;
