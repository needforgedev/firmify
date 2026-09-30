import Link from "next/link";
import { notFound } from "next/navigation";
import { LEGAL_PAGES } from "@/data/firmify-data";

export function generateStaticParams() {
  return LEGAL_PAGES.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: PageProps<"/legal/[id]">) {
  const { id } = await params;
  const page = LEGAL_PAGES.find((l) => l.id === id);
  return { title: `${page?.name ?? "Legal"} — Firmify` };
}

const bciRows = [
  { rule: "Rule 36, Section IV, BCI Rules (Standards of Professional Conduct and Etiquette)", concern: "Restricts advocates from soliciting work or advertising their services.", comply: "Firmify is not a law firm and does not employ advocates. No advocate is advertising their services on the platform." },
  { rule: "Rule 49, Section VII, BCI Rules", concern: "Prohibits advocates from being in full-time non-legal employment.", comply: "Firmify does not employ practicing advocates. All legal drafting is outsourced to independent law firms who maintain autonomy." },
  { rule: "Section 35 of the Advocates Act, 1961", concern: "Professional misconduct by advocates is punishable.", comply: "Firmify ensures that no practicing advocate engages in prohibited promotional or advisory conduct through the platform." },
  { rule: "BCI Rule 2 under Section 49(1)(c) of the Advocates Act, 1961", concern: "Prohibits sharing legal fees with non-advocates.", comply: "Firmify charges a separate platform/technology fee. It does not share legal fees or receive a commission from law firms." },
  { rule: "Section 29 of the Advocates Act, 1961", concern: "Only advocates enrolled with BCI can practice law in India.", comply: 'Firmify does not "practice law" — it only distributes content created by licensed law firms and offers no legal advice.' },
  { rule: "Rule 17, Chapter II, Part VI, BCI Rules", concern: "Only advocates can establish an attorney-client relationship.", comply: "No attorney-client relationship is created. Firmify is a self-help platform and does not facilitate legal consultation." },
];

const label = "mt-3.5 block text-sm font-bold text-navy";
const input =
  "mt-1.5 h-[46px] w-full rounded-[10px] border border-[#C8D5EC] px-3 font-normal outline-none focus:border-brand";

export default async function LegalPage({ params }: PageProps<"/legal/[id]">) {
  const { id } = await params;
  const page = LEGAL_PAGES.find((l) => l.id === id);
  if (!page) notFound();

  const isBci = page.id === "bci-compliance-note";
  const isContact = page.id === "contact-support";

  return (
    <div className="mx-auto max-w-[940px] px-[clamp(16px,4vw,26px)] pb-[clamp(44px,5vw,70px)] pt-[26px]">
      <nav aria-label="Breadcrumb" className="mb-3.5 text-sm text-[#5B6B86]">
        <Link href="/" className="text-brand">Home</Link> &nbsp;/&nbsp; {page.name}
      </nav>
      <h1 className="text-[clamp(26px,3.1vw,40px)] text-navy">{page.name}</h1>

      {isBci && (
        <div>
          <p className="mt-4 text-[clamp(17px,1.3vw,19px)] text-[#3A465C]">
            Firmify is a technology-driven platform that provides consumers with access to
            professionally drafted legal contracts and agreements. We operate in strict
            compliance with the Bar Council of India (BCI) Rules, particularly those governing
            legal practice, advertising, and professional conduct of advocates.
          </p>
          <h2 className="mt-8 text-[clamp(21px,2.2vw,28px)] text-navy">
            Key BCI regulations &amp; Firmify&rsquo;s compliance
          </h2>
          <div className="mt-[18px] flex flex-col gap-3">
            {bciRows.map((r) => (
              <div key={r.rule} className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4 rounded-[14px] border border-[#DDE5F4] bg-white p-5">
                <div>
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-[.07em] text-[#5B6B86]">BCI rule / regulation</p>
                  <p className="font-display text-[15.5px] font-bold leading-[1.4] text-navy">{r.rule}</p>
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-[.07em] text-[#5B6B86]">Potential concern</p>
                  <p className="text-[15.5px] text-[#3A465C]">{r.concern}</p>
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-[.07em] text-leaf">Firmify&rsquo;s compliance assurance</p>
                  <p className="text-[15.5px] text-[#3A465C]">{r.comply}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[13px] border border-[#D6E0F2] bg-[#EEF3FC] p-5">
            <p className="text-[16.5px] text-[#1A2438]">
              <strong>Final note:</strong> Firmify is committed to maintaining the highest
              standards of compliance with BCI regulations while making legal documents
              accessible to consumers in a transparent and ethical manner.
            </p>
          </div>
        </div>
      )}

      {isContact && (
        <div className="mt-[22px] grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-start gap-5">
          <div className="rounded-[15px] border border-[#DDE5F4] bg-white p-6">
            <h2 className="text-[19px] text-navy">Send us a message</h2>
            <label className={label}>Your name<input type="text" className={input} /></label>
            <label className={label}>Email<input type="email" className={input} /></label>
            <label className={label}>
              How can we help?
              <textarea rows={5} className="mt-1.5 w-full resize-y rounded-[10px] border border-[#C8D5EC] px-3 py-2.5 font-normal outline-none focus:border-brand" />
            </label>
            <button type="button" className="mt-4 h-[50px] rounded-[11px] bg-brand px-6 font-display text-[16.5px] font-extrabold text-white hover:bg-brand-dark">
              Send message
            </button>
          </div>
          <div className="flex flex-col gap-3.5">
            <div className="rounded-[15px] border border-[#DDE5F4] bg-white p-[22px]">
              <h2 className="text-lg text-navy">Support</h2>
              <p className="mt-[9px] text-base text-[#3A465C]">
                support@firmify.in
                <br />
                Mon&ndash;Sat, 10am&ndash;7pm IST
              </p>
            </div>
            <div className="rounded-[15px] border border-[#DDE5F4] bg-white p-[22px]">
              <h2 className="text-lg text-navy">Before you write in</h2>
              <p className="mt-[9px] text-base text-[#3A465C]">
                Most questions are answered in the{" "}
                <Link href="/help/firmify-basics-general-faqs" className="text-brand">
                  Firmify Basics &amp; General FAQs
                </Link>
                . Firmify does not provide legal advice.
              </p>
            </div>
          </div>
        </div>
      )}

      {!isBci && !isContact && (
        <>
          <div className="mt-[18px] rounded-xl border border-dashed border-[#E7C980] bg-[#FFF7E6] px-[22px] py-5">
            <p className="text-base text-[#7A5400]">
              Page shell ready. Per your brief, the text for {page.name} has been prepared
              separately and will be dropped in here &mdash; heading hierarchy, crawlable body
              and last-updated stamp are already in place.
            </p>
          </div>
          <div className="mt-6 rounded-[14px] border border-[#DDE5F4] bg-white p-6">
            <p className="text-[13px] font-bold uppercase tracking-[.07em] text-[#5B6B86]">Last updated</p>
            <p className="mt-[5px] text-[16.5px] text-[#3A465C]">To be set on publish</p>
            <div className="mt-[18px] flex flex-col gap-[11px]">
              <div className="h-[11px] w-[86%] rounded bg-[#EEF2FA]" />
              <div className="h-[11px] rounded bg-[#EEF2FA]" />
              <div className="h-[11px] w-[74%] rounded bg-[#EEF2FA]" />
              <div className="h-[11px] w-[92%] rounded bg-[#EEF2FA]" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
