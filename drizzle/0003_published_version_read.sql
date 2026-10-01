ALTER TABLE "template_versions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "template_versions_published_read" ON "template_versions" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (exists (
        select 1 from public.templates tp
        where tp.published_version_id = "template_versions"."id" and tp.status = 'published'
      ));