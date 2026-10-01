"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useStore } from "@/lib/store";

const inputClass =
  "mt-1.5 h-[46px] w-full rounded-[10px] border border-[#C8D5EC] bg-[#FAFCFF] px-[13px] text-[15.5px] outline-none focus:border-brand focus:bg-white";

export function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { store, logOut } = useStore();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  if (!open) return null;

  const isSignup = mode === "signup";

  const submit = async () => {
    const trimmed = email.trim();
    setNotice("");
    if (isSignup && !name.trim()) return setError("Please enter your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return setError("Please enter a valid email address.");
    if (isSignup && phone.replace(/\D/g, "").length < 10) return setError("Please enter a 10-digit mobile number.");
    if (pass.length < 8) return setError("Password must be at least 8 characters.");

    setError("");
    setBusy(true);
    const supabase = createClient();
    try {
      if (isSignup) {
        const { data, error: err } = await supabase.auth.signUp({
          email: trimmed,
          password: pass,
          options: {
            data: { full_name: name.trim(), phone },
            emailRedirectTo: `${location.origin}/auth/callback`,
          },
        });
        if (err) return setError(err.message);
        if (!data.session) {
          // Email confirmation is on — no session until the link is clicked.
          setConfirmSent(true);
          return;
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: trimmed,
          password: pass,
        });
        if (err) return setError(err.message);
      }
      setPass("");
      onClose();
    } finally {
      setBusy(false);
    }
  };

  const googleSignIn = async () => {
    setError("");
    const { error: err } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (err) setError(err.message);
  };

  const tab = (on: boolean) =>
    `h-[38px] rounded-[9px] font-display text-[14.5px] font-extrabold ${
      on ? "bg-white text-brand shadow-[0_2px_8px_rgba(10,30,70,.10)]" : "bg-transparent text-[#5B6B86]"
    }`;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-[95] bg-[rgba(8,18,40,.45)]" />
      <div
        role="dialog"
        aria-label="My Profile"
        className="fm-fade fixed left-1/2 top-1/2 z-[96] max-h-[calc(100vh-48px)] w-[min(420px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-2xl bg-white shadow-[0_30px_70px_rgba(8,18,40,.35)]"
      >
        {store.signedIn ? (
          <>
            <div className="flex items-center gap-[13px] border-b border-[#EEF2F9] px-[22px] pb-2.5 pt-[22px]">
              <span className="grid h-[46px] w-[46px] flex-none place-items-center rounded-full bg-brand font-display text-[19px] font-extrabold text-white">
                {store.user?.name?.trim().charAt(0).toUpperCase() || "F"}
              </span>
              <div className="min-w-0">
                <p className="font-display text-lg font-extrabold text-navy">{store.user?.name || "Firmify user"}</p>
                <p className="overflow-hidden text-ellipsis text-sm text-[#5B6B86]">{store.user?.email}</p>
              </div>
            </div>
            <div className="flex flex-col gap-0.5 p-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push("/dashboard");
                }}
                className="rounded-[10px] px-3.5 py-[13px] text-left text-base font-bold text-[#0B1F4B] hover:bg-[#EEF3FC]"
              >
                My dashboard
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push("/help/firmify-basics-general-faqs");
                }}
                className="rounded-[10px] px-3.5 py-[13px] text-left text-base font-bold text-[#0B1F4B] hover:bg-[#EEF3FC]"
              >
                Help Center
              </button>
              <button
                type="button"
                onClick={async () => {
                  await logOut();
                  setMode("login");
                  setPass("");
                  onClose();
                }}
                className="rounded-[10px] px-3.5 py-[13px] text-left text-base font-bold text-[#B42318] hover:bg-[#FEF3F2]"
              >
                Log out
              </button>
            </div>
          </>
        ) : confirmSent ? (
          <div className="px-[22px] py-7 text-center">
            <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-[#EFFAF2] text-2xl">
              ✉️
            </span>
            <h2 className="font-display text-[22px] font-extrabold text-navy">Confirm your email</h2>
            <p className="mt-2.5 text-[15px] leading-[1.55] text-[#5B6B86]">
              We&rsquo;ve sent a confirmation link to{" "}
              <strong className="text-navy">{email.trim()}</strong>. Click it to activate your
              account, then log in.
            </p>
            <button
              type="button"
              onClick={() => {
                setConfirmSent(false);
                setMode("login");
                setPass("");
              }}
              className="mt-5 h-12 w-full rounded-[11px] bg-brand font-display text-base font-extrabold text-white hover:bg-brand-dark"
            >
              Back to log in
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3 px-[22px] pt-5">
              <div>
                <h2 className="font-display text-[22px] font-extrabold text-navy">
                  {isSignup ? "Create your Firmify account" : "Welcome back"}
                </h2>
                <p className="mt-[5px] text-[14.5px] text-[#5B6B86]">
                  {isSignup
                    ? "Save drafts, re-download documents and track e-signatures."
                    : "Log in to reach your drafts, purchases and downloads."}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="h-8 w-8 flex-none rounded-[9px] border border-[#E4EAF6] bg-white text-base text-[#5B6B86] hover:bg-background"
              >
                ✕
              </button>
            </div>

            <div className="mx-[22px] mt-4 grid grid-cols-2 gap-1 rounded-[11px] bg-[#F1F5FC] p-1">
              <button type="button" onClick={() => { setMode("login"); setError(""); }} className={tab(!isSignup)}>
                Log in
              </button>
              <button type="button" onClick={() => { setMode("signup"); setError(""); }} className={tab(isSignup)}>
                Sign up
              </button>
            </div>

            <div className="flex flex-col gap-[13px] px-[22px] pb-[22px] pt-[18px]">
              {isSignup && (
                <label className="block">
                  <span className="block text-[13.5px] font-bold text-[#3A465C]">Full name</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Ananya Sharma" className={inputClass} />
                </label>
              )}
              <label className="block">
                <span className="block text-[13.5px] font-bold text-[#3A465C]">Work email</span>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@company.in" className={inputClass} />
              </label>
              {isSignup && (
                <label className="block">
                  <span className="block text-[13.5px] font-bold text-[#3A465C]">Mobile number</span>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="+91 98xxx xxxxx" className={inputClass} />
                </label>
              )}
              <label className="block">
                <span className="block text-[13.5px] font-bold text-[#3A465C]">Password</span>
                <input
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !busy && submit()}
                  type="password"
                  placeholder="At least 8 characters"
                  className={inputClass}
                />
              </label>
              {error && (
                <p className="rounded-[9px] border border-[#FBD5D0] bg-[#FEF3F2] px-3 py-2.5 text-sm text-[#B42318]">{error}</p>
              )}
              {notice && (
                <p className="rounded-[9px] border border-[#D6E0F2] bg-[#EEF3FC] px-3 py-2.5 text-sm text-[#14307F]">{notice}</p>
              )}
              <button
                type="button"
                onClick={submit}
                disabled={busy}
                className="h-[50px] rounded-[11px] bg-brand font-display text-[16.5px] font-extrabold text-white hover:bg-brand-dark disabled:opacity-60"
              >
                {busy ? "Please wait…" : isSignup ? "Create account" : "Log in"}
              </button>
              <div className="flex items-center gap-2.5">
                <span className="h-px flex-1 bg-[#E4EAF6]" />
                <span className="text-[12.5px] text-[#8A97AD]">or continue with</span>
                <span className="h-px flex-1 bg-[#E4EAF6]" />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={googleSignIn}
                  className="h-[46px] rounded-[10px] border border-[#D6E0F2] bg-white text-[15px] font-bold text-[#0B1F4B] hover:bg-background"
                >
                  Google
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setNotice("Mobile OTP sign-in will be enabled once an SMS provider is configured in Supabase.")
                  }
                  className="h-[46px] rounded-[10px] border border-[#D6E0F2] bg-white text-[15px] font-bold text-[#0B1F4B] hover:bg-background"
                >
                  Mobile OTP
                </button>
              </div>
              <p className="text-[12.5px] leading-[1.5] text-[#8A97AD]">
                By continuing you agree to Firmify&rsquo;s{" "}
                <a href="/legal/terms-of-use" className="text-brand">Terms of Use</a> and{" "}
                <a href="/legal/privacy-policy" className="text-brand">Privacy Policy</a>.
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
