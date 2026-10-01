// Firmify database schema (Supabase Postgres, managed with Drizzle).
//
// Conventions:
// - All money is stored in PAISE (integer) — Rs. 999 = 99900 — matching Razorpay.
// - `template_versions` is append-only; a user document pins the exact version
//   it was generated from, so later template edits never change purchased docs.
// - RLS: tables that carry a pgPolicy get RLS enabled automatically by Drizzle;
//   tables with `.enableRLS()` and no policies are unreachable from the app
//   entirely (the app holds no service-role key — every query runs under the
//   user's JWT). Only migrations/seeding touch them, over DATABASE_URL.
//   Paid clause text lives in `template_versions`, which has NO client
//   policies — gated rendering will expose it via entitlement-checked
//   policies or SECURITY DEFINER functions in a later phase.

import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgPolicy,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { anonRole, authenticatedRole, authUsers } from "drizzle-orm/supabase";

/** `using` clause for owner-scoped row access. */
const isOwner = (col: AnyPgColumn) => sql`(select auth.uid()) = ${col}`;

const publicRead = (name: string) =>
  pgPolicy(`${name}_public_read`, {
    for: "select",
    to: [anonRole, authenticatedRole],
    using: sql`true`,
  });

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const userRole = pgEnum("user_role", ["customer", "editor", "admin"]);
export const templateStatus = pgEnum("template_status", ["draft", "published", "archived"]);
export const documentStatus = pgEnum("document_status", ["draft", "completed"]);
export const entitlementKind = pgEnum("entitlement_kind", ["document", "pack"]);
export const orderKind = pgEnum("order_kind", ["document", "pack"]);
export const orderStatus = pgEnum("order_status", ["created", "paid", "failed", "refunded"]);
export const fileFormat = pgEnum("file_format", ["docx", "pdf"]);
export const discountType = pgEnum("discount_type", ["percent", "flat"]);
export const commissionStatus = pgEnum("commission_status", ["pending", "approved", "paid"]);
export const esignStatus = pgEnum("esign_status", ["created", "sent", "signed", "declined", "expired"]);

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

/**
 * One row per Supabase auth user. Created by a DB trigger on auth.users insert
 * (added in a follow-up SQL migration).
 */
export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id")
      .primaryKey()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    fullName: text("full_name"),
    email: text("email"),
    phone: text("phone"),
    role: userRole("role").notNull().default("customer"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    pgPolicy("profiles_select_own", { for: "select", to: authenticatedRole, using: isOwner(t.id) }),
    pgPolicy("profiles_update_own", {
      for: "update",
      to: authenticatedRole,
      using: isOwner(t.id),
      withCheck: isOwner(t.id),
    }),
  ]
);

// ---------------------------------------------------------------------------
// Catalog: categories, templates, versions, packs
// ---------------------------------------------------------------------------

export const categories = pgTable(
  "categories",
  {
    id: text("id").primaryKey(), // slug, e.g. "employment-hr"
    name: text("name").notNull(),
    blurb: text("blurb").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  () => [publicRead("categories")]
);

export const templates = pgTable(
  "templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    /** "Contract" | "Policy" | "Letter / Notice" | "Form" | "Deed" */
    type: text("type").notNull().default("Contract"),
    description: text("description").notNull().default(""),
    pricePaise: integer("price_paise").notNull().default(0),
    strikePricePaise: integer("strike_price_paise"),
    status: templateStatus("status").notNull().default("draft"),
    /** Download-probability rank; lower = more popular. */
    popularityRank: integer("popularity_rank").notNull().default(999),
    /** The version served to new documents. Null until first publish. */
    publishedVersion: integer("published_version"),
    /**
     * UUID of the published template_versions row. Public-readable (this table
     * has a public SELECT policy) so the client can pin a version on a new
     * document WITHOUT being able to read the version's clause text.
     */
    publishedVersionId: uuid("published_version_id").references(
      (): AnyPgColumn => templateVersions.id,
      { onDelete: "set null" }
    ),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("templates_slug_idx").on(t.slug),
    index("templates_status_idx").on(t.status),
    // Public catalogue metadata (title, price, description) is world-readable.
    publicRead("templates"),
  ]
);

export const templateCategories = pgTable(
  "template_categories",
  {
    templateId: uuid("template_id")
      .notNull()
      .references(() => templates.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.templateId, t.categoryId] }), publicRead("template_categories")]
);

/**
 * Append-only. Holds the questionnaire + clause tree.
 *
 * Read access: only the row a published template points at via
 * published_version_id is readable (decision 2026-10-01: the document renders
 * fully in the live preview, so published clause content is public —
 * protection applies at download/checkout, not at reading). Draft and
 * historical versions stay unreadable from the app.
 */
export const templateVersions = pgTable(
  "template_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    templateId: uuid("template_id")
      .notNull()
      .references(() => templates.id, { onDelete: "cascade" }),
    version: integer("version").notNull(),
    /** Step[] — wizard step grouping (src/lib/types.ts). */
    steps: jsonb("steps").notNull().default([]),
    /** Question[] — the questionnaire definition. */
    questions: jsonb("questions").notNull().default([]),
    /** Clause[] — the clause tree with conditions/variants/repeats. */
    clauses: jsonb("clauses").notNull().default([]),
    changelog: text("changelog"),
    createdBy: uuid("created_by").references(() => profiles.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("template_versions_unique_idx").on(t.templateId, t.version),
    pgPolicy("template_versions_published_read", {
      for: "select",
      to: [anonRole, authenticatedRole],
      using: sql`exists (
        select 1 from public.templates tp
        where tp.published_version_id = ${t.id} and tp.status = 'published'
      )`,
    }),
  ]
);

export const packs = pgTable(
  "packs",
  {
    id: text("id").primaryKey(), // slug, e.g. "hr-employment-pack"
    name: text("name").notNull(),
    blurb: text("blurb").notNull().default(""),
    pricePaise: integer("price_paise").notNull(),
    strikePricePaise: integer("strike_price_paise"),
    validityMonths: integer("validity_months").notNull().default(12),
    downloadLimit: integer("download_limit").notNull().default(50),
    best: boolean("best").notNull().default(false),
    active: boolean("active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  () => [publicRead("packs")]
);

export const packCategories = pgTable(
  "pack_categories",
  {
    packId: text("pack_id")
      .notNull()
      .references(() => packs.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.packId, t.categoryId] }), publicRead("pack_categories")]
);

// ---------------------------------------------------------------------------
// User documents (instances) and generated files
// ---------------------------------------------------------------------------

/**
 * One row per filled document instance: template + pinned version + answers.
 * Drafts and completed documents are the same row (status flips).
 */
export const documents = pgTable(
  "documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    templateId: uuid("template_id")
      .notNull()
      .references(() => templates.id, { onDelete: "restrict" }),
    templateVersionId: uuid("template_version_id")
      .notNull()
      .references(() => templateVersions.id, { onDelete: "restrict" }),
    title: text("title").notNull(),
    /** Answers keyed by question id (repeat groups: arrays of records). */
    answers: jsonb("answers").notNull().default({}),
    status: documentStatus("status").notNull().default("draft"),
    /** 0–100, drives resume prompts and reminder emails. */
    progress: integer("progress").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("documents_user_idx").on(t.userId, t.updatedAt),
    pgPolicy("documents_select_own", { for: "select", to: authenticatedRole, using: isOwner(t.userId) }),
    pgPolicy("documents_insert_own", { for: "insert", to: authenticatedRole, withCheck: isOwner(t.userId) }),
    pgPolicy("documents_update_own", {
      for: "update",
      to: authenticatedRole,
      using: isOwner(t.userId),
      withCheck: isOwner(t.userId),
    }),
    pgPolicy("documents_delete_own", { for: "delete", to: authenticatedRole, using: isOwner(t.userId) }),
  ]
);

/**
 * DOCX/PDF renders in the private Storage bucket. Written server-side after
 * generation; users fetch via short-lived signed URLs.
 */
export const generatedFiles = pgTable(
  "generated_files",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    documentId: uuid("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    templateVersionId: uuid("template_version_id")
      .notNull()
      .references(() => templateVersions.id, { onDelete: "restrict" }),
    format: fileFormat("format").notNull(),
    storagePath: text("storage_path").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("generated_files_document_idx").on(t.documentId),
    pgPolicy("generated_files_select_own", { for: "select", to: authenticatedRole, using: isOwner(t.userId) }),
  ]
);

// ---------------------------------------------------------------------------
// Commerce: orders, entitlements, downloads, coupons, referrals
// ---------------------------------------------------------------------------

/**
 * One row per checkout attempt. Written server-side (order creation endpoint),
 * transitioned to `paid` by the Razorpay webhook — never by the client.
 */
export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "restrict" }),
    kind: orderKind("kind").notNull(),
    /** Set when kind = document. */
    documentId: uuid("document_id").references(() => documents.id, { onDelete: "set null" }),
    templateId: uuid("template_id").references(() => templates.id, { onDelete: "set null" }),
    /** Set when kind = pack. */
    packId: text("pack_id").references(() => packs.id, { onDelete: "set null" }),
    amountPaise: integer("amount_paise").notNull(),
    discountPaise: integer("discount_paise").notNull().default(0),
    gstPaise: integer("gst_paise").notNull(),
    totalPaise: integer("total_paise").notNull(),
    currency: text("currency").notNull().default("INR"),
    couponCode: text("coupon_code"),
    referralCode: text("referral_code"),
    status: orderStatus("status").notNull().default("created"),
    razorpayOrderId: text("razorpay_order_id"),
    razorpayPaymentId: text("razorpay_payment_id"),
    invoiceNumber: text("invoice_number"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("orders_razorpay_order_idx").on(t.razorpayOrderId),
    index("orders_user_idx").on(t.userId, t.createdAt),
    pgPolicy("orders_select_own", { for: "select", to: authenticatedRole, using: isOwner(t.userId) }),
  ]
);

/**
 * The single gate for access. kind = "document": scoped to one filled
 * instance, expires ~1 week after purchase. kind = "pack": template access via
 * pack categories, expires per pack validity, capped by downloadLimit.
 * Written only by the payment webhook (service role).
 */
export const entitlements = pgTable(
  "entitlements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    kind: entitlementKind("kind").notNull(),
    orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
    documentId: uuid("document_id").references(() => documents.id, { onDelete: "cascade" }),
    packId: text("pack_id").references(() => packs.id, { onDelete: "restrict" }),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    downloadLimit: integer("download_limit"),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("entitlements_user_idx").on(t.userId, t.expiresAt),
    pgPolicy("entitlements_select_own", { for: "select", to: authenticatedRole, using: isOwner(t.userId) }),
  ]
);

/**
 * One row per download event; the ledger the 50-download pack cap is enforced
 * against. Written server-side when a signed URL is issued.
 */
export const downloads = pgTable(
  "downloads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    documentId: uuid("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    entitlementId: uuid("entitlement_id").references(() => entitlements.id, { onDelete: "set null" }),
    format: fileFormat("format").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("downloads_entitlement_idx").on(t.entitlementId),
    index("downloads_user_idx").on(t.userId, t.createdAt),
    pgPolicy("downloads_select_own", { for: "select", to: authenticatedRole, using: isOwner(t.userId) }),
  ]
);

export const coupons = pgTable("coupons", {
  code: text("code").primaryKey(),
  discountType: discountType("discount_type").notNull(),
  /** percent: 0–100; flat: paise. */
  value: integer("value").notNull(),
  maxRedemptions: integer("max_redemptions"),
  redeemedCount: integer("redeemed_count").notNull().default(0),
  active: boolean("active").notNull().default(true),
  validFrom: timestamp("valid_from", { withTimezone: true }),
  validUntil: timestamp("valid_until", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}).enableRLS(); // validated server-side only

export const referralCodes = pgTable("referral_codes", {
  code: text("code").primaryKey(),
  influencerName: text("influencer_name").notNull(),
  influencerUserId: uuid("influencer_user_id").references(() => profiles.id, { onDelete: "set null" }),
  commissionPercent: integer("commission_percent").notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}).enableRLS();

export const commissionLedger = pgTable(
  "commission_ledger",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    referralCode: text("referral_code")
      .notNull()
      .references(() => referralCodes.code, { onDelete: "restrict" }),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "restrict" }),
    amountPaise: integer("amount_paise").notNull(),
    status: commissionStatus("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    paidAt: timestamp("paid_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("commission_order_idx").on(t.orderId)]
).enableRLS();

// ---------------------------------------------------------------------------
// E-sign, newsletter, audit
// ---------------------------------------------------------------------------

export const esignRequests = pgTable(
  "esign_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    documentId: uuid("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    /** "leegality" | "digio" | … — provider decided at integration time. */
    provider: text("provider").notNull(),
    providerRequestId: text("provider_request_id"),
    counterpartyEmail: text("counterparty_email"),
    status: esignStatus("status").notNull().default("created"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("esign_user_idx").on(t.userId),
    pgPolicy("esign_select_own", { for: "select", to: authenticatedRole, using: isOwner(t.userId) }),
  ]
);

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}).enableRLS();

/** Admin CMS audit trail (brief §12.i). Written server-side on admin actions. */
export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorId: uuid("actor_id").references(() => profiles.id, { onDelete: "set null" }),
    action: text("action").notNull(), // e.g. "template.publish"
    entity: text("entity").notNull(), // e.g. "template"
    entityId: text("entity_id"),
    meta: jsonb("meta").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("audit_log_entity_idx").on(t.entity, t.entityId)]
).enableRLS();
