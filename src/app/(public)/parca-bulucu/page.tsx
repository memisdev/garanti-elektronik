import type { Metadata } from "next";
import PartFinder from "@/views/PartFinder";
import { getPartFinderMeta } from "@/lib/metadata";

const meta = getPartFinderMeta();
export const metadata: Metadata = {
  title: "TV Parça Bulucu",
  description: meta.description,
};

export default function PartFinderPage() {
  return <PartFinder />;
}
