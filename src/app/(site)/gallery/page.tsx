import type { Metadata } from "next";
import PageHero from "@/components/site/page-hero";
import GalleryGrid from "@/components/gallery/gallery-grid";
import { getGalleryImages } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Inside EMBER & SPICE — the food, the room and the details, photographed in Coimbatore.",
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        image="/images/interior.jpg"
        title={
          <>
            The room, the food, <span className="it text-ember">the details</span>
          </>
        }
        sub="A look inside Ember & Spice — shot between breakfast and dinner service."
      />
      <section className="bg-cream py-16 md:py-24">
        <GalleryGrid images={images} />
      </section>
    </>
  );
}
