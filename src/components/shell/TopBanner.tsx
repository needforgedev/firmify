import Link from "next/link";
import Image from "next/image";

export function TopBanner() {
  return (
    <div className="bg-navy text-white print:hidden">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-[clamp(16px,4vw,26px)] py-[11px]">
        <div className="flex max-w-3xl items-start gap-[11px]">
          <span className="mt-px grid h-[26px] w-[26px] flex-none place-items-center rounded-full bg-brand text-sm font-bold text-white">
            ✓
          </span>
          <p className="text-[14.5px] leading-[1.45] text-[#D7E2F6]">
            Affordable &amp; legally enforceable law firm drafted contracts &amp; policies in
            India. Fill and download in less than 10 minutes, with step-by-step guidance &amp;
            tips &ndash; peace of mind
          </p>
        </div>
        <Link href="/" className="flex items-center gap-[11px] text-white no-underline">
          <Image src="/assets/logo-mark.png" alt="Firmify logo" width={26} height={36} className="h-9 w-auto" />
          <span className="font-display text-[27px] font-extrabold tracking-[-0.03em]">Firmify</span>
          <span className="whitespace-nowrap text-[14.5px] text-[#9EB5DC]">&ndash; Peace of mind</span>
        </Link>
      </div>
    </div>
  );
}
