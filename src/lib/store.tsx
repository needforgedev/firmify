"use client";

// Client-side stand-in for the future Supabase tables (entitlements, documents,
// purchases). Shapes intentionally mirror that schema. Persisted to
// localStorage under the same key as the approved design prototype.

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DOC_BY_SLUG, PACKS } from "@/data/firmify-data";
import type { Answers } from "@/lib/types";

export interface Draft {
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

export interface StoreState {
  entitlements: { packs: string[]; docs: string[] };
  drafts: Draft[];
  purchases: Purchase[];
  downloads: string[];
  signedIn: boolean;
  user: User | null;
}

const EMPTY: StoreState = {
  entitlements: { packs: [], docs: [] },
  drafts: [],
  purchases: [],
  downloads: [],
  signedIn: false,
  user: null,
};

const KEY = "firmify.store.v1";

interface StoreApi {
  store: StoreState;
  ready: boolean;
  entitledTo: (slug: string) => boolean;
  activeDraft: () => Draft | null;
  upsertDraft: (slug: string, name: string, pct: number, answers: Answers) => void;
  completePurchase: (kind: "pack" | "document", id: string) => void;
  recordDownload: (slug: string) => void;
  completeAuth: (user: User) => void;
  logOut: () => void;
  reset: () => void;
}

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<StoreState>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setStore({ ...EMPTY, ...JSON.parse(raw) });
    } catch {
      // corrupt store — start fresh
    }
    setReady(true);
  }, []);

  const save = useCallback((next: Partial<StoreState>) => {
    setStore((prev) => {
      const merged = { ...prev, ...next };
      try {
        localStorage.setItem(KEY, JSON.stringify(merged));
      } catch {
        // storage unavailable — keep in-memory state
      }
      return merged;
    });
  }, []);

  const entitledTo = useCallback(
    (slug: string) => {
      if (store.entitlements.docs.includes(slug)) return true;
      const doc = DOC_BY_SLUG[slug];
      if (!doc) return false;
      if (doc.price === 0) return true;
      return store.entitlements.packs.some((pid) => {
        const pack = PACKS.find((p) => p.id === pid);
        return !!pack && pack.cats.some((c) => doc.cats.includes(c));
      });
    },
    [store]
  );

  const activeDraft = useCallback(() => {
    return (
      store.drafts
        .filter((d) => d.pct < 100)
        .sort((a, b) => b.at - a.at)[0] || null
    );
  }, [store]);

  const upsertDraft = useCallback(
    (slug: string, name: string, pct: number, answers: Answers) => {
      setStore((prev) => {
        const drafts = prev.drafts.filter((d) => d.slug !== slug);
        drafts.push({ slug, name, pct, answers, at: Date.now() });
        const merged = { ...prev, drafts };
        try {
          localStorage.setItem(KEY, JSON.stringify(merged));
        } catch {}
        return merged;
      });
    },
    []
  );

  const completePurchase = useCallback(
    (kind: "pack" | "document", id: string) => {
      setStore((prev) => {
        const ent = {
          packs: [...prev.entitlements.packs],
          docs: [...prev.entitlements.docs],
        };
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
        const merged = { ...prev, entitlements: ent, purchases, signedIn: true };
        try {
          localStorage.setItem(KEY, JSON.stringify(merged));
        } catch {}
        return merged;
      });
    },
    []
  );

  const recordDownload = useCallback((slug: string) => {
    setStore((prev) => {
      const merged = { ...prev, downloads: [...prev.downloads, slug] };
      try {
        localStorage.setItem(KEY, JSON.stringify(merged));
      } catch {}
      return merged;
    });
  }, []);

  const completeAuth = useCallback(
    (user: User) => save({ signedIn: true, user }),
    [save]
  );

  const logOut = useCallback(() => save({ signedIn: false, user: null }), [save]);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {}
    setStore(EMPTY);
  }, []);

  return (
    <StoreContext.Provider
      value={{ store, ready, entitledTo, activeDraft, upsertDraft, completePurchase, recordDownload, completeAuth, logOut, reset }}
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
