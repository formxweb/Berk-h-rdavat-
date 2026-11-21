/* Mağazanın fiziksel konumu ve harita bağlantıları. Telefon, WhatsApp ve çalışma saatleri yönetim panelindeki Ayarlar'dan gelir. */

export const STORE_INFO = {
  address: 'Bağlaraltı Mah. 410. Sok. No:6',
  district: 'Yıldırım / Bursa',
  landmark: 'Fidyekızık top sahasının hemen yanında',
  mapsUrl: 'https://maps.app.goo.gl/ZuFJjAwWyJC9wQNeA',
  mapEmbed: 'https://www.google.com/maps?q=Berk%20Spot%20H%C4%B1rdavat%2C%20Ba%C4%9Flaralt%C4%B1%2C%20Y%C4%B1ld%C4%B1r%C4%B1m%2C%20Bursa&output=embed',
  instagramSecond: 'https://www.instagram.com/berk_spot16/',
};

export function waLink(phone: string, text?: string) {
  const n = phone.replace(/\D/g, '');
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}
