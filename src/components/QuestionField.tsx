"use client";

import type { Answers, Question, RepeatItem } from "@/lib/types";

function Tooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex align-middle">
      <span className="ml-1.5 inline-flex h-4.5 w-4.5 cursor-help items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700">
        i
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 rounded-lg bg-slate-900 p-3 text-xs font-normal leading-5 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {text}
      </span>
    </span>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100";

export function QuestionField({
  question,
  answers,
  invalid,
  onChange,
}: {
  question: Question;
  answers: Answers;
  invalid: boolean;
  onChange: (id: string, value: Answers[string]) => void;
}) {
  const value = answers[question.id];

  const label = (
    <label className="mb-1.5 block text-[15px] font-semibold text-slate-900">
      {question.label}
      {question.required && <span className="text-red-500"> *</span>}
      {question.tooltip && <Tooltip text={question.tooltip} />}
    </label>
  );

  const errorRing = invalid ? " border-red-400 ring-2 ring-red-100" : "";

  if (question.type === "yes_no") {
    return (
      <div>
        {label}
        <div className="flex gap-3">
          {(["yes", "no"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onChange(question.id, v)}
              className={`flex-1 rounded-lg border px-4 py-3 text-base font-semibold capitalize transition-colors ${
                value === v
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-blue-400" + errorRing
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        {invalid && <p className="mt-1 text-sm text-red-600">Please choose an option.</p>}
      </div>
    );
  }

  if (question.type === "choice") {
    return (
      <div>
        {label}
        <div className="space-y-2">
          {question.options?.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(question.id, opt.value)}
              className={`block w-full rounded-lg border px-4 py-3 text-left text-[15px] transition-colors ${
                value === opt.value
                  ? "border-blue-600 bg-blue-50 font-semibold text-blue-900"
                  : "border-slate-300 bg-white text-slate-700 hover:border-blue-400" + errorRing
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {invalid && <p className="mt-1 text-sm text-red-600">Please choose an option.</p>}
      </div>
    );
  }

  if (question.type === "repeat_group") {
    const items: RepeatItem[] = Array.isArray(value) ? value : [];
    const setItems = (next: RepeatItem[]) => onChange(question.id, next);
    return (
      <div>
        {label}
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">
                  {question.itemLabel ?? "Item"} {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => setItems(items.filter((_, i) => i !== idx))}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-3">
                {question.fields?.map((f) => (
                  <input
                    key={f.id}
                    className={inputClass}
                    placeholder={f.label}
                    value={item[f.id] ?? ""}
                    onChange={(e) =>
                      setItems(
                        items.map((it, i) => (i === idx ? { ...it, [f.id]: e.target.value } : it))
                      )
                    }
                  />
                ))}
              </div>
            </div>
          ))}
          {items.length < (question.max ?? 99) && (
            <button
              type="button"
              onClick={() => setItems([...items, {}])}
              className="w-full rounded-lg border-2 border-dashed border-blue-300 px-4 py-3 text-[15px] font-semibold text-blue-700 hover:bg-blue-50"
            >
              + Add {question.itemLabel ?? "item"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {label}
      <input
        type={question.type === "number" ? "number" : question.type === "date" ? "date" : "text"}
        className={inputClass + errorRing}
        placeholder={question.placeholder}
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(question.id, e.target.value)}
      />
      {invalid && <p className="mt-1 text-sm text-red-600">This field is required.</p>}
    </div>
  );
}
