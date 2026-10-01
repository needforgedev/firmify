// Seed the Supabase catalog from src/data + the demo questionnaires.
// Idempotent — safe to re-run after editing data or templates.
//
// Runs over DATABASE_URL (same admin context as migrations); the app itself
// never uses this connection. Usage: npm run db:seed

import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"] });

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as t from "../src/db/schema";
import { CATEGORIES, DOCUMENTS, PACKS } from "../src/data/firmify-data";
import { employmentAgreement } from "../src/lib/templates/employment-agreement";
import { vendorAgreement } from "../src/lib/templates/vendor-agreement";
import { foundersAgreement } from "../src/lib/templates/founders-agreement";
import { rentAgreement } from "../src/lib/templates/rent-agreement";
import type { Template } from "../src/lib/types";

// Catalog slug → authored questionnaire (mirrors src/app/create/[slug]/page.tsx).
const DEMO_TEMPLATES: Record<string, Template> = {
  "employment-contract-india": employmentAgreement,
  "vendor-agreement": vendorAgreement,
  "founders-agreement": foundersAgreement,
  "residential-rent-agreement-india": rentAgreement,
};

async function main() {
  const client = postgres(process.env.DATABASE_URL!, { prepare: false, max: 1 });
  const db = drizzle(client);

  // -- categories -----------------------------------------------------------
  await db
    .insert(t.categories)
    .values(CATEGORIES.map((c, i) => ({ id: c.id, name: c.name, blurb: c.blurb, sortOrder: i })))
    .onConflictDoUpdate({
      target: t.categories.id,
      set: {
        name: sql`excluded.name`,
        blurb: sql`excluded.blurb`,
        sortOrder: sql`excluded.sort_order`,
      },
    });

  // -- packs ----------------------------------------------------------------
  await db
    .insert(t.packs)
    .values(
      PACKS.map((p, i) => ({
        id: p.id,
        name: p.name,
        blurb: p.blurb,
        pricePaise: p.price * 100,
        strikePricePaise: p.was * 100,
        best: !!p.best,
        sortOrder: i,
      }))
    )
    .onConflictDoUpdate({
      target: t.packs.id,
      set: {
        name: sql`excluded.name`,
        blurb: sql`excluded.blurb`,
        pricePaise: sql`excluded.price_paise`,
        strikePricePaise: sql`excluded.strike_price_paise`,
        best: sql`excluded.best`,
        sortOrder: sql`excluded.sort_order`,
      },
    });

  await db
    .insert(t.packCategories)
    .values(PACKS.flatMap((p) => p.cats.map((c) => ({ packId: p.id, categoryId: c }))))
    .onConflictDoNothing();

  // -- templates (catalogue metadata for every document) --------------------
  const rows = await db
    .insert(t.templates)
    .values(
      DOCUMENTS.map((d) => ({
        slug: d.slug,
        title: d.name,
        type: d.type,
        pricePaise: d.price * 100,
        popularityRank: d.rank,
        status: "published" as const,
      }))
    )
    .onConflictDoUpdate({
      target: t.templates.slug,
      set: {
        title: sql`excluded.title`,
        type: sql`excluded.type`,
        pricePaise: sql`excluded.price_paise`,
        popularityRank: sql`excluded.popularity_rank`,
        status: sql`excluded.status`,
        updatedAt: sql`now()`,
      },
    })
    .returning({ id: t.templates.id, slug: t.templates.slug });

  const idBySlug = new Map(rows.map((r) => [r.slug, r.id]));

  await db
    .insert(t.templateCategories)
    .values(
      DOCUMENTS.flatMap((d) =>
        d.cats.map((c) => ({ templateId: idBySlug.get(d.slug)!, categoryId: c }))
      )
    )
    .onConflictDoNothing();

  // -- demo questionnaire versions ------------------------------------------
  for (const [slug, template] of Object.entries(DEMO_TEMPLATES)) {
    const templateId = idBySlug.get(slug);
    if (!templateId) throw new Error(`catalogue has no template for slug ${slug}`);

    const [version] = await db
      .insert(t.templateVersions)
      .values({
        templateId,
        version: template.version,
        steps: template.steps,
        questions: template.questions,
        clauses: template.clauses,
        changelog: "Seeded from the authored demo template",
        publishedAt: sql`now()` as unknown as Date,
      })
      .onConflictDoUpdate({
        target: [t.templateVersions.templateId, t.templateVersions.version],
        set: {
          steps: sql`excluded.steps`,
          questions: sql`excluded.questions`,
          clauses: sql`excluded.clauses`,
        },
      })
      .returning({ id: t.templateVersions.id });

    await db
      .update(t.templates)
      .set({
        publishedVersion: template.version,
        publishedVersionId: version.id,
        description: template.description,
      })
      .where(sql`${t.templates.id} = ${templateId}`);
  }

  // -- report ---------------------------------------------------------------
  const [counts] = await client`
    select
      (select count(*)::int from categories) as categories,
      (select count(*)::int from packs) as packs,
      (select count(*)::int from templates) as templates,
      (select count(*)::int from template_categories) as template_categories,
      (select count(*)::int from template_versions) as versions,
      (select count(*)::int from templates where published_version_id is not null) as with_questionnaire
  `;
  console.log("Seed complete:", counts);
  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
