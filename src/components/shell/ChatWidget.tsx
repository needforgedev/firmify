"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function ChatWidget() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [greetHidden, setGreetHidden] = useState(false);

  const chip =
    "rounded-full border border-[#C8D5EC] bg-white px-3 py-[7px] text-[13.5px] font-semibold text-brand";

  return (
    <div className="fixed bottom-[18px] right-4 z-[75] flex flex-col items-end gap-2.5 print:hidden">
      {open && (
        <div className="fm-fade w-[min(320px,calc(100vw-32px))] overflow-hidden rounded-[15px] border border-[#C8D5EC] bg-white shadow-[0_22px_50px_rgba(10,30,70,.24)]">
          <div className="flex items-center gap-[11px] bg-navy px-4 py-3.5">
            <Image
              src="/assets/photo-primary.png"
              alt="Firmify support"
              width={42}
              height={42}
              className="h-[42px] w-[42px] rounded-full border-2 border-white object-cover object-[center_18%]"
            />
            <div>
              <p className="font-display text-[15.5px] font-extrabold text-white">Priya from Firmify</p>
              <p className="text-[13px] text-[#9EB5DC]">Usually replies in 2 minutes</p>
            </div>
          </div>
          <div className="p-4">
            <p className="rounded-[11px] bg-[#EEF3FC] px-[13px] py-[11px] text-[15px] text-[#1A2438]">
              Hi! Tell me what you&rsquo;re trying to do &mdash; hiring someone, renting out a
              flat, signing a vendor &mdash; and I&rsquo;ll point you to the right document.
            </p>
            <div className="mt-3 flex flex-wrap gap-[7px]">
              <button type="button" onClick={() => router.push("/all-documents")} className={chip}>
                I&rsquo;m hiring
              </button>
              <button type="button" onClick={() => router.push("/all-documents")} className={chip}>
                Renting property
              </button>
              <button type="button" onClick={() => router.push("/packs")} className={chip}>
                Which pack?
              </button>
            </div>
            <input
              type="text"
              placeholder="Type your question…"
              aria-label="Message Firmify support"
              className="mt-[13px] h-11 w-full rounded-[10px] border border-[#C8D5EC] px-3 outline-none focus:border-brand"
            />
          </div>
        </div>
      )}
      <div className="flex items-center gap-2.5">
        {!greetHidden && !open && (
          <>
            <button
              type="button"
              onClick={() => setGreetHidden(true)}
              aria-label="Dismiss message"
              className="grid h-7 w-7 flex-none place-items-center rounded-full border border-[#D6E0F2] bg-white text-sm leading-none text-[#5B6B86] shadow-[0_3px_10px_rgba(10,30,70,.10)] hover:border-brand hover:text-brand"
            >
              ×
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="fm-fade max-w-[min(230px,calc(100vw-130px))] flex-none rounded-[14px] border border-[#E4EAF6] bg-white px-4 py-[13px] text-left text-[14.5px] leading-[1.4] text-[#1A2438] shadow-[0_6px_20px_rgba(10,30,70,.12)] hover:border-[#C8D5EC]"
            >
              Hello! Any questions I can help with?
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => {
            setOpen((v) => !v);
            setGreetHidden(true);
          }}
          aria-label="Chat with Firmify support"
          className="h-[60px] w-[60px] flex-none overflow-hidden rounded-full border-[3px] border-white bg-navy p-0 shadow-[0_14px_32px_rgba(10,30,70,.32)]"
        >
          <Image
            src="/assets/photo-primary.png"
            alt="Firmify support"
            width={60}
            height={60}
            className="block h-full w-full object-cover object-[center_16%]"
          />
        </button>
      </div>
    </div>
  );
}
