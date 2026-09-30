"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { DOC_BY_SLUG, PACKS, money, packDocCount } from "@/data/firmify-data";
import { useStore } from "@/lib/store";

const label = "block text-sm font-bold text-navy";
const input =
  "mt-1.5 h-[46px] w-full rounded-[10px] border border-[#C8D5EC] px-3 font-normal outline-none focus:border-brand";

export default function CheckoutPage({ params }: PageProps<"/checkout/[kind]/[id]">) {
  const { kind, id } = use(params);
  const router = useRouter();
  const { completePurchase } = useStore();
  const [coupon, setCoupon] = useState<string | null>(null);

  const isPack = kind === "pack";
  const pack = isPack ? PACKS.find((p) => p.id === id) : undefined;
  const doc = !isPack ? DOC_BY_SLUG[id] : undefined;
  const upgrade = doc
    ? PACKS.find((p) => p.id !== "all-documents-pack" && p.cats.some((c) => doc.cats.includes(c)))
    : undefined;
  const amount = isPack ? pack?.price ?? 0 : doc?.price ?? 0;
  const gst = Math.round(amount * 0.18);
  const name = isPack ? pack?.name : doc?.name;

  const pay = () => {
    completePurchase(isPack ? "pack" : "document", id);
    router.push(`/success/${kind}/${id}`);
  };

  return (
    <div className="mx-auto max-w-[980px] px-[clamp(16px,4vw,26px)] pb-[clamp(44px,5vw,70px)] pt-[26px]">
      <button
        type="button"
        onClick={() => router.push(isPack ? "/packs" : `/document/${id}`)}
        className="mb-4 text-[15px] font-bold text-brand"
      >
        ← Back
      </button>
      <h1 className="text-[clamp(26px,3vw,38px)] text-navy">Checkout</h1>
      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-5">
        <div className="rounded-2xl border border-[#DDE5F4] bg-white p-6">
          <h2 className="text-lg text-navy">Order summary</h2>
          <div className="mt-4 border-b border-[#EEF2F9] pb-3.5">
            <p className="font-display text-[17px] font-bold text-navy">{name}</p>
            <p className="mt-[3px] text-[14.5px] text-[#5B6B86]">
              {isPack
                ? `${pack ? packDocCount(pack) : 0} documents · 50 downloads · 1 year`
                : "Single document · Word + PDF · available for 1 week"}
            </p>
          </div>
          <div className="mt-3.5 flex flex-col gap-[9px] text-base text-[#3A465C]">
            <span className="flex justify-between">
              <span>Platform fee</span>
              <strong className="text-navy">{money(amount)}</strong>
            </span>
            <span className="flex justify-between">
              <span>GST (18%)</span>
              <strong className="text-navy">{money(gst)}</strong>
            </span>
          </div>
          <div className="mt-3.5 flex items-baseline justify-between border-t border-[#EEF2F9] pt-3.5">
            <span className="font-display text-[17px] font-extrabold text-navy">Total</span>
            <span className="font-display text-[26px] font-extrabold text-navy">{money(amount + gst)}</span>
          </div>
          <button
            type="button"
            onClick={() => setCoupon("FIRMIFY10")}
            className="mt-4 h-11 w-full rounded-[10px] border border-dashed border-[#C8D5EC] bg-background text-[15px] font-semibold text-brand"
          >
            {coupon ? `Coupon ${coupon} applied` : "Have a coupon or referral code?"}
          </button>
          <div className="mt-[18px] flex flex-col gap-2.5">
            <label className={label}>
              Card number
              <input type="text" placeholder="4242 4242 4242 4242" className={input} />
            </label>
            <div className="flex gap-2.5">
              <label className={`${label} flex-1`}>
                Expiry
                <input type="text" placeholder="MM/YY" className={input} />
              </label>
              <label className={`${label} flex-1`}>
                CVV
                <input type="text" placeholder="123" className={input} />
              </label>
            </div>
          </div>
          <button
            type="button"
            onClick={pay}
            className="mt-5 h-[54px] w-full rounded-xl bg-leaf font-display text-[17.5px] font-extrabold text-white hover:bg-[#116430]"
          >
            Pay {money(amount + gst)}
          </button>
          <p className="mt-3 text-[13.5px] text-[#5B6B86]">
            Payment gateway placeholder &mdash; no card details are captured or transmitted in
            this prototype. Invoice and receipt are generated on success.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {upgrade && (
            <div className="rounded-2xl border-2 border-brand bg-[#EEF3FC] p-[22px]">
              <p className="text-[12.5px] font-bold uppercase tracking-[.07em] text-leaf">Upgrade and save</p>
              <h2 className="mt-2 text-xl text-navy">{upgrade.name}</h2>
              <p className="mt-[9px] text-[15.5px] text-[#3A465C]">
                Get {packDocCount(upgrade)} documents instead of one, for {money(upgrade.price)}.
                Bought individually that would cost around{" "}
                {money(Math.max(0, packDocCount(upgrade) * 999 - upgrade.price))} more.
              </p>
              <button
                type="button"
                onClick={() => router.push(`/checkout/pack/${upgrade.id}`)}
                className="mt-[15px] h-12 w-full rounded-[11px] bg-brand font-display text-base font-extrabold text-white hover:bg-brand-dark"
              >
                Switch to the pack
              </button>
            </div>
          )}
          <div className="rounded-2xl border border-[#DDE5F4] bg-white p-[22px]">
            <h3 className="text-[17px] text-navy">What happens after payment</h3>
            <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-[15.5px] text-[#3A465C]">
              <li>Your document unlocks immediately &mdash; no watermark, no blur.</li>
              <li>Download in Word and PDF, or e-sign and send to the other party.</li>
              <li>Invoice and receipt are emailed and saved to your dashboard.</li>
              <li>Single documents stay downloadable for 1 week; pack documents for the full subscription period.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
