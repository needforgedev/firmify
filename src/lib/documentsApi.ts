"use client";

// Drafts & documents persistence on Supabase. Every call runs with the
// signed-in user's JWT — RLS owner policies on `documents` do the scoping,
// no service key involved.

import { createClient } from "@/lib/supabase/client";
import type { Answers } from "@/lib/types";
import type { Draft } from "@/lib/store";

interface DocumentRow {
  id: string;
  title: string;
  answers: Answers;
  progress: number;
  status: "draft" | "completed";
  updated_at: string;
  templates: { slug: string } | null;
}

/** All of the signed-in user's documents, newest first. */
export async function fetchDocuments(): Promise<Draft[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("id, title, answers, progress, status, updated_at, templates(slug)")
    .order("updated_at", { ascending: false });
  if (error) {
    console.error("fetchDocuments failed", error.message);
    return [];
  }
  return (data as unknown as DocumentRow[]).map((row) => ({
    id: row.id,
    slug: row.templates?.slug ?? "",
    name: row.title,
    pct: row.progress,
    answers: row.answers ?? {},
    at: Date.parse(row.updated_at),
  }));
}

/**
 * Create or update the user's document for a template. Pins the template's
 * published version on first save. Returns false when the template has no
 * published questionnaire yet (caller keeps the draft local).
 */
export async function upsertDocument(
  userId: string,
  slug: string,
  name: string,
  pct: number,
  answers: Answers
): Promise<boolean> {
  const supabase = createClient();

  const { data: tpl, error: tplError } = await supabase
    .from("templates")
    .select("id, published_version_id")
    .eq("slug", slug)
    .maybeSingle();
  if (tplError || !tpl?.published_version_id) return false;

  const status = pct >= 100 ? "completed" : "draft";

  const { data: existing } = await supabase
    .from("documents")
    .select("id")
    .eq("template_id", tpl.id)
    .order("updated_at", { ascending: false })
    .limit(1);

  if (existing && existing.length > 0) {
    const { error } = await supabase
      .from("documents")
      .update({ title: name, answers, progress: pct, status, updated_at: new Date().toISOString() })
      .eq("id", existing[0].id);
    if (error) console.error("document update failed", error.message);
    return !error;
  }

  const { error } = await supabase.from("documents").insert({
    user_id: userId,
    template_id: tpl.id,
    template_version_id: tpl.published_version_id,
    title: name,
    answers,
    progress: pct,
    status,
  });
  if (error) console.error("document insert failed", error.message);
  return !error;
}

export async function deleteDocument(id: string): Promise<boolean> {
  const { error } = await createClient().from("documents").delete().eq("id", id);
  if (error) console.error("document delete failed", error.message);
  return !error;
}
