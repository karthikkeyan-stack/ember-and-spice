import type { ReactNode } from "react";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import { getOpenStatus, getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();
  const status = getOpenStatus(settings.hours);

  return (
    <>
      <Navbar status={status} />
      <main id="main">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
