import Link from "next/link";

export const metadata = { title: "Admin CMS — Firmify" };

export default function AdminStub() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-[12.5px] font-bold uppercase tracking-[.08em] text-[#5B6B86]">Firmify</p>
      <h1 className="mt-2 text-3xl text-navy">Admin CMS</h1>
      <p className="mt-4 text-[17px] text-[#3A465C]">
        The administrator panel (documents, template versions, questionnaire builder, pricing,
        coupons, users and audit trail) has its own approved design &mdash;{" "}
        <code className="rounded bg-[#EEF3FC] px-1.5 py-0.5 text-[15px]">AdminPanel.dc.html</code>{" "}
        in the design project &mdash; and is implemented in a later phase, on real
        authentication.
      </p>
      <Link href="/" className="mt-8 inline-block rounded-lg border border-[#C8D5EC] bg-white px-5 py-2.5 text-sm font-semibold text-[#3A465C] no-underline">
        ← Back to the website
      </Link>
    </div>
  );
}
