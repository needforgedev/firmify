// Server-side loader for published questionnaires. The database is the only
// source of templates the app renders — the files in src/lib/templates/ are
// authoring sources consumed solely by scripts/seed.ts.
//
// RLS: `template_versions` is readable only for the row a published template
// points at (template_versions_published_read policy), so this works with the
// anon key and never exposes draft or historical versions.

import { createClient } from "@/lib/supabase/server";
import type { Clause, Question, Step, Template } from "@/lib/types";

/** The published questionnaire for a catalogue slug, or null if none exists. */
export async function fetchPublishedTemplate(slug: string): Promise<Template | null> {
  const supabase = await createClient();

  const { data: tpl } = await supabase
    .from("templates")
    .select("slug, title, description, price_paise, strike_price_paise, published_version_id")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (!tpl?.published_version_id) return null;

  const { data: ver } = await supabase
    .from("template_versions")
    .select("version, steps, questions, clauses")
    .eq("id", tpl.published_version_id)
    .maybeSingle();
  if (!ver) return null;

  return {
    slug: tpl.slug,
    title: tpl.title,
    version: ver.version,
    category: "",
    description: tpl.description ?? "",
    price: Math.round((tpl.price_paise ?? 0) / 100),
    strikePrice: tpl.strike_price_paise ? Math.round(tpl.strike_price_paise / 100) : undefined,
    steps: ver.steps as Step[],
    questions: ver.questions as Question[],
    clauses: ver.clauses as Clause[],
  };
}

/** Slugs/titles of every template with a live questionnaire (for fallbacks). */
export async function listPublishedTemplates(): Promise<{ slug: string; title: string }[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("templates")
    .select("slug, title")
    .eq("status", "published")
    .not("published_version_id", "is", null)
    .order("title");
  return data ?? [];
}
