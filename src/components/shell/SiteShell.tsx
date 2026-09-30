"use client";

import { usePathname } from "next/navigation";
import { TopBanner } from "./TopBanner";
import { MainNav } from "./MainNav";
import { SiteFooter } from "./SiteFooter";
import { ChatWidget } from "./ChatWidget";
import { DraftFloat } from "./DraftFloat";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <main className="flex-1">{children}</main>;

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <TopBanner />
      <MainNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <DraftFloat />
      <ChatWidget />
    </div>
  );
}
