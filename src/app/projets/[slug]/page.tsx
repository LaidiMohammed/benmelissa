import { notFound } from "next/navigation";
import { getBiens, getSettings } from "@/lib/store";
import FicheClient from "@/components/FicheClient";

export default async function Fiche({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ tab?: string }> }) {
  const { slug } = await params;
  const sp = await searchParams;
  const [biens, settings] = await Promise.all([getBiens(), getSettings()]);
  const bien = biens.find((b) => b.slug === slug);
  if (!bien) notFound();
  const tab = sp.tab === "plan" || sp.tab === "3d" || sp.tab === "video" ? sp.tab : "photos";
  return <FicheClient bien={bien} settings={settings} initialTab={tab} />;
}
