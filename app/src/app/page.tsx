import { getBiens, getSettings } from "@/lib/store";
import HomeClient from "@/components/HomeClient";

export default async function Home() {
  const [biens, settings] = await Promise.all([getBiens(), getSettings()]);
  return <HomeClient biens={biens} settings={settings} />;
}
