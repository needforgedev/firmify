import Link from "next/link";
import { DOC_BY_SLUG } from "@/data/firmify-data";

const label = "mt-3 block text-sm font-bold text-navy";
const input =
  "mt-1.5 h-[46px] w-full rounded-[10px] border border-[#C8D5EC] px-3 font-normal outline-none focus:border-brand";

export default async function EsignPage({ params }: PageProps<"/esign/[slug]">) {
  const { slug } = await params;
  const doc = DOC_BY_SLUG[slug];

  const stepChip = (n: number, text: string, state: "done" | "active" | "todo") => (
    <span
      className={`flex items-center gap-[9px] text-[15.5px] font-bold ${
        state === "done" ? "text-leaf" : state === "active" ? "text-brand" : "text-[#8A97AD]"
      }`}
    >
      <span
        className={`grid h-[26px] w-[26px] place-items-center rounded-full text-sm ${
          state === "done"
            ? "bg-leaf text-white"
            : state === "active"
              ? "bg-brand text-white"
              : "bg-[#E4EAF6] text-[#5B6B86]"
        }`}
      >
        {n}
      </span>
      {text}
    </span>
  );

  return (
    <div className="mx-auto max-w-[900px] px-[clamp(16px,4vw,26px)] pb-[clamp(44px,5vw,70px)] pt-[26px]">
      <nav aria-label="Breadcrumb" className="mb-3.5 text-sm text-[#5B6B86]">
        <Link href="/dashboard" className="text-brand">Dashboard</Link> &nbsp;/&nbsp; E-sign
      </nav>
      <h1 className="text-[clamp(26px,3vw,38px)] text-navy">E-sign &amp; send</h1>
      <p className="mt-2.5 text-[17.5px] text-[#3A465C]">{doc?.name ?? slug}</p>

      <div className="mt-6 rounded-2xl border border-[#DDE5F4] bg-white p-[clamp(22px,3vw,30px)]">
        <div className="mb-6 flex flex-wrap gap-[18px]">
          {stepChip(1, "Document ready", "done")}
          {stepChip(2, "Sign", "active")}
          {stepChip(3, "Send to other party", "todo")}
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-[18px]">
          <div>
            <h2 className="text-[17px] text-navy">Your signature</h2>
            <div className="mt-[11px] grid h-[130px] place-items-center rounded-xl border-2 border-dashed border-[#C8D5EC] bg-[#FAFCFF] p-4 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[.06em] text-[#8A97AD]">
                Draw, type or upload signature
                <br />
                (e-signature provider integration)
              </p>
            </div>
            <label className={label}>
              Signatory name
              <input type="text" placeholder="Authorised signatory" className={input} />
            </label>
            <label className={label}>
              Designation
              <input type="text" placeholder="Director / HR Head" className={input} />
            </label>
          </div>
          <div>
            <h2 className="text-[17px] text-navy">Send to the other party</h2>
            <label className={label}>
              Their email
              <input type="email" placeholder="counterparty@email.com" className={input} />
            </label>
            <label className={label}>
              Message
              <textarea
                rows={4}
                placeholder="Please review and sign the attached."
                className="mt-1.5 w-full resize-y rounded-[10px] border border-[#C8D5EC] px-3 py-2.5 font-normal outline-none focus:border-brand"
              />
            </label>
            <div className="mt-4 rounded-[11px] border border-[#E4EAF6] bg-background p-3.5">
              <p className="text-[14.5px] text-[#3A465C]">
                Both parties receive a signed PDF with an audit trail. Electronic signatures are
                legally valid in most cases under Indian law.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <Link href="/dashboard" className="grid h-[50px] place-items-center rounded-[11px] bg-brand px-6 font-display text-[16.5px] font-extrabold text-white no-underline hover:bg-brand-dark">
            Sign &amp; send
          </Link>
          <Link href="/dashboard" className="grid h-[50px] place-items-center rounded-[11px] border-[1.5px] border-[#C8D5EC] bg-white px-[22px] text-base font-bold text-navy no-underline">
            Sign only, download PDF
          </Link>
        </div>
      </div>
    </div>
  );
}
