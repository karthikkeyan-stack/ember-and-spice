import type { Metadata } from "next";
import PageHero from "@/components/site/page-hero";
import MenuBrowser from "@/components/menu/menu-browser";
import { getMenuData } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Browse the EMBER & SPICE menu — breakfasts, dosas, Chettinad starters, biryani and filter coffee. Sample dishes and prices for the demo.",
};

export default async function MenuPage() {
  const { categories, items } = await getMenuData();

  return (
    <>
      <PageHero
        eyebrow="The menu"
        image="/images/food/masala-dosa.jpg"
        title={
          <>
            Everything worth <span className="it text-ember">ordering twice</span>
          </>
        }
        sub="Breakfasts through biryani, ground fresh and made to order. Prices shown are sample figures for this demo menu."
      />
      <section className="bg-cream pb-24 md:pb-32 pt-4">
        <MenuBrowser categories={categories} items={items} />
      </section>
    </>
  );
}
