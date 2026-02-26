import type { StaticImageData } from "next/image";

import productPowerBoard from "@/assets/product-power-board-nobg.png";
import productMainBoard from "@/assets/product-main-board.jpg";
import productTconBoard from "@/assets/product-tcon-board.jpg";
import productInverterBoard from "@/assets/product-inverter-board.jpg";
import productPowerSupply from "@/assets/product-power-supply.jpg";

export interface StaticProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: "tv-parca" | "anakart";
  code?: string;
  images: (string | StaticImageData)[];
  specs: Record<string, string>;
  compatibility: string;
}

export const products: StaticProduct[] = [
  {
    id: "1", slug: "samsung-bn44-00932b", name: "Samsung BN44-00932B Power Board",
    brand: "Samsung", category: "tv-parca", code: "BN44-00932B",
    images: [productPowerBoard], specs: { "Tip": "Power Board", "Uyumlu Model": "UE55NU7100", "Voltaj": "220V" },
    compatibility: "Samsung NU7100 serisi ile uyumludur.",
  },
  {
    id: "2", slug: "lg-eay64948701", name: "LG EAY64948701 Power Supply",
    brand: "LG", category: "tv-parca", code: "EAY64948701",
    images: [productPowerSupply], specs: { "Tip": "Power Supply", "Uyumlu Model": "49UK6300", "Voltaj": "220V" },
    compatibility: "LG UK6300 serisi ile uyumludur.",
  },
  {
    id: "3", slug: "samsung-bn94-12925a", name: "Samsung BN94-12925A Ana Kart",
    brand: "Samsung", category: "anakart", code: "BN94-12925A",
    images: [productMainBoard], specs: { "Tip": "Main Board", "Uyumlu Model": "UE49NU7100", "Çip": "MSD6886" },
    compatibility: "Samsung NU7100 49 inç modeli ile uyumludur.",
  },
  {
    id: "4", slug: "lg-ebt65195502", name: "LG EBT65195502 Main Board",
    brand: "LG", category: "anakart", code: "EBT65195502",
    images: [productMainBoard], specs: { "Tip": "Main Board", "Uyumlu Model": "43LK5900", "Çip": "LM18A" },
    compatibility: "LG LK5900 serisi ile uyumludur.",
  },
  {
    id: "5", slug: "vestel-17ips72", name: "Vestel 17IPS72 Power Board",
    brand: "Vestel", category: "tv-parca", code: "17IPS72",
    images: [productPowerBoard], specs: { "Tip": "Power Board", "Uyumlu Model": "Vestel 4K Serisi", "Voltaj": "220V" },
    compatibility: "Vestel 4K serisi TV'ler ile uyumludur.",
  },
  {
    id: "6", slug: "philips-715g9309", name: "Philips 715G9309 Power Board",
    brand: "Philips", category: "tv-parca", code: "715G9309",
    images: [productPowerSupply], specs: { "Tip": "Power Board", "Uyumlu Model": "50PUS6162", "Voltaj": "220V" },
    compatibility: "Philips 6162 serisi ile uyumludur.",
  },
  {
    id: "7", slug: "samsung-bn44-00876a", name: "Samsung BN44-00876A Power Board",
    brand: "Samsung", category: "tv-parca", code: "BN44-00876A",
    images: [productPowerSupply], specs: { "Tip": "Power Board", "Uyumlu Model": "UE55KU7000", "Voltaj": "220V" },
    compatibility: "Samsung KU7000 serisi ile uyumludur.",
  },
  {
    id: "8", slug: "lg-ebt64439816", name: "LG EBT64439816 Main Board",
    brand: "LG", category: "anakart", code: "EBT64439816",
    images: [productMainBoard], specs: { "Tip": "Main Board", "Uyumlu Model": "55UJ630V", "Çip": "LC560DGG" },
    compatibility: "LG UJ630V serisi ile uyumludur.",
  },
  {
    id: "9", slug: "vestel-17mb130t", name: "Vestel 17MB130T Ana Kart",
    brand: "Vestel", category: "anakart", code: "17MB130T",
    images: [productMainBoard], specs: { "Tip": "Main Board", "Uyumlu Model": "Vestel Smart 4K", "Çip": "MStar" },
    compatibility: "Vestel Smart 4K serisi ile uyumludur.",
  },
  {
    id: "10", slug: "philips-715ga075", name: "Philips 715GA075 Main Board",
    brand: "Philips", category: "anakart", code: "715GA075",
    images: [productMainBoard], specs: { "Tip": "Main Board", "Uyumlu Model": "55PUS7304", "Çip": "MT5659" },
    compatibility: "Philips 7304 serisi ile uyumludur.",
  },
  {
    id: "11", slug: "samsung-bn96-39891a", name: "Samsung BN96-39891A T-Con Board",
    brand: "Samsung", category: "tv-parca", code: "BN96-39891A",
    images: [productTconBoard], specs: { "Tip": "T-Con Board", "Uyumlu Model": "UE55MU6100", "Panel": "CY-GK055HGLV1H" },
    compatibility: "Samsung MU6100 55 inç modeli ile uyumludur.",
  },
  {
    id: "12", slug: "lg-6871l-5283a", name: "LG 6871L-5283A T-Con Board",
    brand: "LG", category: "tv-parca", code: "6871L-5283A",
    images: [productTconBoard], specs: { "Tip": "T-Con Board", "Uyumlu Model": "55UH6150", "Panel": "LC550EGE" },
    compatibility: "LG UH6150 serisi ile uyumludur.",
  },
  {
    id: "13", slug: "arcelik-zuk7850", name: "Arçelik ZUK7850 Ana Kart",
    brand: "Arçelik", category: "anakart", code: "ZUK7850",
    images: [productMainBoard], specs: { "Tip": "Main Board", "Uyumlu Model": "A55L 8752 5S", "Çip": "MStar" },
    compatibility: "Arçelik A55L serisi ile uyumludur.",
  },
  {
    id: "14", slug: "sony-1-981-926-12", name: "Sony 1-981-926-12 Main Board",
    brand: "Sony", category: "anakart", code: "1-981-926-12",
    images: [productMainBoard], specs: { "Tip": "Main Board", "Uyumlu Model": "KD-55XE8096", "Çip": "MT5893" },
    compatibility: "Sony XE8096 serisi ile uyumludur.",
  },
  {
    id: "15", slug: "toshiba-v28a001525a1", name: "Toshiba V28A001525A1 Power Board",
    brand: "Toshiba", category: "tv-parca", code: "V28A001525A1",
    images: [productPowerBoard], specs: { "Tip": "Power Board", "Uyumlu Model": "49U6763", "Voltaj": "220V" },
    compatibility: "Toshiba U6763 serisi ile uyumludur.",
  },
  {
    id: "16", slug: "samsung-bn44-00878a", name: "Samsung BN44-00878A Power Board",
    brand: "Samsung", category: "tv-parca", code: "BN44-00878A",
    images: [productPowerBoard], specs: { "Tip": "Power Board", "Uyumlu Model": "UE65MU7000", "Voltaj": "220V" },
    compatibility: "Samsung MU7000 65 inç modeli ile uyumludur.",
  },
  {
    id: "17", slug: "lg-eay64928801", name: "LG EAY64928801 Power Supply",
    brand: "LG", category: "tv-parca", code: "EAY64928801",
    images: [productPowerSupply], specs: { "Tip": "Power Supply", "Uyumlu Model": "55SK8500", "Voltaj": "220V" },
    compatibility: "LG SK8500 serisi ile uyumludur.",
  },
  {
    id: "18", slug: "vestel-17ips62r4", name: "Vestel 17IPS62R4 Inverter Board",
    brand: "Vestel", category: "tv-parca", code: "17IPS62R4",
    images: [productInverterBoard], specs: { "Tip": "Inverter Board", "Uyumlu Model": "Vestel LED Serisi", "Voltaj": "220V" },
    compatibility: "Vestel LED TV'ler ile uyumludur.",
  },
  {
    id: "19", slug: "arcelik-main-a49l8752", name: "Arçelik A49L 8752 Ana Kart",
    brand: "Arçelik", category: "anakart", code: "A49L-8752-MB",
    images: [productMainBoard], specs: { "Tip": "Main Board", "Uyumlu Model": "A49L 8752 5S", "Çip": "MSD6886" },
    compatibility: "Arçelik A49L 8752 modeli ile uyumludur.",
  },
  {
    id: "20", slug: "sony-aps-395", name: "Sony APS-395 Power Supply",
    brand: "Sony", category: "tv-parca", code: "APS-395",
    images: [productPowerSupply], specs: { "Tip": "Power Supply", "Uyumlu Model": "KD-49XF7096", "Voltaj": "220V" },
    compatibility: "Sony XF7096 serisi ile uyumludur.",
  },
];
