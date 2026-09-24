"use client";
import { usePathname } from "next/navigation";

export default function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <main className={`flex-1 ${isHome ? "" : "pt-[calc(76px+env(safe-area-inset-top))] md:pt-[calc(108px+env(safe-area-inset-top))]"}`}>{children}</main>
  );
}
