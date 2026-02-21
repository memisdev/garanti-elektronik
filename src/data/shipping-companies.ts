export interface ShippingCompany {
  id: string;
  name: string;
  trackingUrl: string; // {code} will be replaced with actual tracking code
}

export const shippingCompanies: ShippingCompany[] = [
  { id: "yurtici", name: "Yurtiçi Kargo", trackingUrl: "https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code={code}" },
  { id: "aras", name: "Aras Kargo", trackingUrl: "https://kargotakip.araskargo.com.tr/mainpage.aspx?code={code}" },
  { id: "mng", name: "MNG Kargo", trackingUrl: "https://www.mngkargo.com.tr/gonderi-takip/?code={code}" },
  { id: "ptt", name: "PTT Kargo", trackingUrl: "https://gonderitakip.ptt.gov.tr/Track/Verify?q={code}" },
  { id: "surat", name: "Sürat Kargo", trackingUrl: "https://www.suratkargo.com.tr/kargo-takibi?code={code}" },
  { id: "ups", name: "UPS", trackingUrl: "https://www.ups.com/track?tracknum={code}" },
];
