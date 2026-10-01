"use client";

// App-wide client state.
//
// Auth: real Supabase session (RLS everywhere, no service key).
// Drafts/documents: stored in the Supabase `documents` table when signed in
// (owner-scoped by RLS); localStorage only as the anonymous fallback. Local
// drafts migrate to the DB once on sign-in.
// Entitlements/purchases/downloads: still localStorage stand-ins until the
// payments phase lands.

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { fetchDocuments, upsertDocument } from "@/lib/documentsApi";
import { DOC_BY_SLUG, PACKS } from "@/data/firmify-data";
import type { Answers } from "@/lib/types";

export interface Draft {
  /** Supabase documents.id — absent for anonymous local drafts. */
  id?: string;
  slug: string;
  name: string;
  pct: number;
  answers: Answers;
  at: number;
}

export interface Purchase {
  kind: "pack" | "document";
  id: string;
  name: string;
  amount: number;
  at: number;
}

export interface User {
  name: string;
  email: string;
  phone?: string;
}

interface LocalState {
  entitlements: { packs: string[]; docs: string[] };
  drafts: Draft[];
  purchases: Purchase[];
  downloads: string[];
}

export interface StoreState extends LocalState {
  signedIn: boolean;
  user: User | null;
}

const EMPTY_LOCAL: LocalState = {
  entitlements: { packs: [], docs: [] },
  drafts: [],
  purchases: [],
  downloads: [],
};

const KEY = "firmify.store.v1";
const SAVE_DEBOUNCE_MS = 900;

function sessionUser(session: Session | null): User | null {
  if (!session?.user) return null;
  const meta = session.user.user_metadata ?? {};
  return {
    name:
      (meta.full_name as string) ||
      (meta.name as string) ||
      session.user.email?.split("@")[0] ||
      "Firmify user",
    email: session.user.email ?? "",
    phone: (meta.phone as string) || session.user.phone || undefined,
  };
}

interface StoreApi {
  store: StoreState;
  ready: boolean;
  /** True once drafts for the current auth state (anon or user) are loaded. */
  draftsReady: boolean;
  entitledTo: (slug: string) => boolean;
  activeDraft: () => Draft | null;
  upsertDraft: (slug: string, name: string, pct: number, answers: Answers) => void;
  completePurchase: (kind: "pack" | "document", id: string) => void;
  recordDownload: (slug: string) => void;
  logOut: () => Promise<void>;
  reset: () => void;
}

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [local, setLocal] = useState<LocalState>(EMPTY_LOCAL);
  const [session, setSession] = useState<Session | null>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [dbDrafts, setDbDrafts] = useState<Draft[]>([]);
  const [dbReady, setDbReady] = useState(false);
  const [ready, setReady] = useState(false);

  const localRef = useRef(local);
  localRef.current = local;
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const migratedFor = useRef<string | null>(null);

  // Hydrate local (non-auth) state.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<LocalState>;
        setLocal({
          entitlements: parsed.entitlements ?? EMPTY_LOCAL.entitlements,
          drafts: parsed.drafts ?? [],
          purchases: parsed.purchases ?? [],
          downloads: parsed.downloads ?? [],
        });
      }
    } catch {
      // corrupt store — start fresh
    }
    setReady(true);
  }, []);

  // Subscribe to the Supabase session.
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthResolved(true);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setAuthResolved(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const saveLocal = useCallback((updater: (prev: LocalState) => LocalState) => {
    setLocal((prev) => {
      const merged = updater(prev);
      try {
        localStorage.setItem(KEY, JSON.stringify(merged));
      } catch {
        // storage unavailable — keep in-memory state
      }
      return merged;
    });
  }, []);

  // On sign-in: migrate any local drafts into the DB, then load DB documents.
  useEffect(() => {
    const uid = session?.user.id;
    if (!uid || !ready) {
      if (!uid) {
        setDbDrafts([]);
        setDbReady(false);
        migratedFor.current = null;
      }
      return;
    }
    if (migratedFor.current === uid) return;
    migratedFor.current = uid;

    let cancelled = false;
    (async () => {
      const localDrafts = localRef.current.drafts;
      const migrated: string[] = [];
      for (const d of localDrafts) {
        if (await upsertDocument(uid, d.slug, d.name, d.pct, d.answers)) migrated.push(d.slug);
      }
      if (migrated.length > 0) {
        saveLocal((prev) => ({
          ...prev,
          drafts: prev.drafts.filter((d) => !migrated.includes(d.slug)),
        }));
      }
      const docs = await fetchDocuments();
      if (!cancelled) {
        setDbDrafts(docs);
        setDbReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [session?.user.id, ready, saveLocal]);

  const entitledTo = useCallback(
    (slug: string) => {
      if (local.entitlements.docs.includes(slug)) return true;
      const doc = DOC_BY_SLUG[slug];
      if (!doc) return false;
      if (doc.price === 0) return true;
      return local.entitlements.packs.some((pid) => {
        const pack = PACKS.find((p) => p.id === pid);
        return !!pack && pack.cats.some((c) => doc.cats.includes(c));
      });
    },
    [local]
  );

  const drafts = session ? dbDrafts : local.drafts;

  const activeDraft = useCallback(() => {
    return drafts.filter((d) => d.pct < 100).sort((a, b) => b.at - a.at)[0] || null;
  }, [drafts]);

  const upsertDraft = useCallback(
    (slug: string, name: string, pct: number, answers: Answers) => {
      const entry: Draft = { slug, name, pct, answers, at: Date.now() };
      const uid = sessionRef.current?.user.id;

      if (!uid) {
        saveLocal((prev) => ({
          ...prev,
          drafts: [...prev.drafts.filter((d) => d.slug !== slug), entry],
        }));
        return;
      }

      // Optimistic in-memory update; debounced DB write (immediate when the
      // document is completed so the final state is never lost).
      setDbDrafts((prev) => {
        const old = prev.find((d) => d.slug === slug);
        return [...prev.filter((d) => d.slug !== slug), { ...entry, id: old?.id }];
      });
      clearTimeout(saveTimers.current[slug]);
      const write = () => {
        delete saveTimers.current[slug];
        void upsertDocument(uid, slug, name, pct, answers);
      };
      if (pct >= 100) write();
      else saveTimers.current[slug] = setTimeout(write, SAVE_DEBOUNCE_MS);
    },
    [saveLocal]
  );

  const completePurchase = useCallback(
    (kind: "pack" | "document", id: string) => {
      saveLocal((prev) => {
        const ent = { packs: [...prev.entitlements.packs], docs: [...prev.entitlements.docs] };
        const purchases = [...prev.purchases];
        if (kind === "pack") {
          if (!ent.packs.includes(id)) ent.packs.push(id);
          const p = PACKS.find((x) => x.id === id);
          purchases.push({ kind, id, name: p?.name ?? id, amount: p?.price ?? 0, at: Date.now() });
        } else {
          if (!ent.docs.includes(id)) ent.docs.push(id);
          const d = DOC_BY_SLUG[id];
          purchases.push({ kind, id, name: d?.name ?? id, amount: d?.price ?? 0, at: Date.now() });
        }
        return { ...prev, entitlements: ent, purchases };
      });
    },
    [saveLocal]
  );

  const recordDownload = useCallback(
    (slug: string) => {
      saveLocal((prev) => ({ ...prev, downloads: [...prev.downloads, slug] }));
    },
    [saveLocal]
  );

  const logOut = useCallback(async () => {
    await createClient().auth.signOut();
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {}
    setLocal(EMPTY_LOCAL);
  }, []);

  const store: StoreState = {
    ...local,
    drafts,
    signedIn: !!session,
    user: sessionUser(session),
  };

  const draftsReady = ready && authResolved && (!session || dbReady);

  return (
    <StoreContext.Provider
      value={{
        store,
        ready,
        draftsReady,
        entitledTo,
        activeDraft,
        upsertDraft,
        completePurchase,
        recordDownload,
        logOut,
        reset,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
