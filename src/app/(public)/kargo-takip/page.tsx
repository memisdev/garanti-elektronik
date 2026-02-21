import type { Metadata } from "next";
import CargoTracking from "@/views/CargoTracking";
import { getCargoTrackingMeta } from "@/lib/metadata";

const meta = getCargoTrackingMeta();
export const metadata: Metadata = {
  title: "Kargo Takip",
  description: meta.description,
};

export default function CargoTrackingPage() {
  return <CargoTracking />;
}
