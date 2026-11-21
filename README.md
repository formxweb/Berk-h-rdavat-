# Berk Spot Hırdavat e-ticaret sitesi

Bursa Yıldırım'daki Berk Spot Hırdavat'ın online mağazası. Next.js ile yazıldı, Vercel'de yayınlanır, veritabanı Supabase (Postgres). Kartla ödeme **Shopier** ile alınır; kart bilgisi siteye hiç gelmez.

## Neler var

**Mağaza**
- Ana sayfa: asılı fiyat etiketinde haftanın fırsatı, sayaçlı "Sadece bu hafta sonu" kampanyası, kategoriler, öne çıkanlar, mağaza adresi ve harita
- Kategori, arama, sıralama; ürün sayfasında seçenek (ör. tek/çift akülü, 15/25 m) ve seçeneğe göre fiyat ve stok
- Sepet, indirim kodu, ücretsiz kargo sınırı
- Shopier güvenli ödeme sayfası (3D Secure, taksit)
- Misafir veya üye olarak sipariş, sipariş takibi (Alındı → Hazırlanıyor → Kargoda → Teslim edildi), iptal/iade talebi
- Ön bilgilendirme formu, mesafeli satış sözleşmesi, KVKK, iade, teslimat sayfaları
- Telefonda alt çubuk: Ara, WhatsApp, Sepet

**Yönetim paneli** (`/yonetim`)
- Özet, siparişler (durum, kargo firması ve takip no, iptal/iade), ürünler (fotoğraf yükleme, seçenek, stok, fiyat), kategoriler, indirim kodları, müşteriler, ayarlar

## Kurulu hâli

- Site: Vercel, `formxweb` takımı, proje `berkspot-hirdavat`
- Veritabanı: Supabase projesi `berkspot-hirdavat` (Frankfurt). Uygulama `berkapp` veritabanı kullanıcısıyla bağlanır.
- Her derlemede `scripts/setup.ts` çalışır: tabloları günceller, boş mağazaya 18 örnek ürün ve 6 kategori ekler, `ADMIN_EMAIL` ile yöneticiyi açar.

## Shopier ile kartlı ödemeyi açmak

1. [shopier.com](https://www.shopier.com)'da satıcı hesabı aç ve onaylanmasını bekle.
2. Shopier panelinde **Entegrasyonlar → Modül Yönetimi → Modül Ayarları**:
   - **Kayıtlı Alan Adları**: sitenin adresi
   - **Geri Dönüş URL**: `https://siteadresi/api/odeme/shopier/geri-donus`
3. Aynı sayfadaki **API kullanıcı** ve **API şifre**yi sitede `/yonetim` → **Ayarlar → Shopier ile kartla ödeme** bölümüne yapıştır.
4. Shopier'de deneme modu yok: kendi kartınla küçük bir sipariş verip siparişin "Ödendi" olduğunu kontrol et, sonra iptal edip Shopier panelinden iade et.

Ödeme bağlanana kadar site katalog olarak çalışır; sepette "Online ödeme henüz aktif değil" yazar.

## Mağazayı hazırla

1. `/yonetim` → **Ayarlar → Satıcı bilgileri**: unvan, adres, vergi dairesi ve numarası (sözleşmelerde ve altbilgide görünür, yasal olarak zorunlu).
2. **Ayarlar → Mağaza**: telefon, WhatsApp, çalışma saatleri, kargo ücreti ve ücretsiz kargo sınırı.
3. **Ürünler**: örnek ürünlerin fiyat ve stoklarını güncelle, çizimleri gerçek fotoğraflarla değiştir.
4. Bir ürünün **Etiket** alanına `Sadece bu hafta sonu` yazarsan ürün ana sayfada pazar 19:00'a kadar sayaçlı kampanya olarak çıkar. Ana sayfadaki asılı etikette öne çıkan ve indirimli ilk ürün gösterilir.
5. Ana sayfaya mağaza videosu koymak için videoyu `public/video/` klasörüne ekle ve `src/app/(shop)/page.tsx` içindeki `HERO_VIDEO` değerine yolunu yaz.
6. Mağaza adresi, yol tarifi ve harita `src/lib/store-info.ts` dosyasında.
7. **ETBİS kaydı**: internetten satış yapan herkes için zorunlu (etbis.ticaret.gov.tr).

## Ortam değişkenleri

`.env.example` dosyasına bak. Vercel'de girilenler: `APP_URL`, `DATABASE_URL`, `DIRECT_DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CRON_SECRET`. İsteğe bağlı: `SHOPIER_*` (panel yerine), `SMTP_*` (sipariş e-postaları), `SUPABASE_URL` + `SUPABASE_SECRET_KEY` (fotoğraflar Supabase Storage'a; girilmezse veritabanında saklanır).

## Sınırlar

- Kargo firmasıyla otomatik entegrasyon yok, takip numarası elle girilir.
- Fatura otomatik kesilmez.
- Shopier'in iade bağlantısı yok; iadeyi Shopier panelinden yaparsın, site tutarı kaydeder ve müşteriye bildirir.
- SMTP girilmezse e-postalar gönderilmez, panelde **E-postalar** sayfasında görünür.
- Yasal metinler şablondur; yayına almadan önce bir mali müşavire veya avukata göz attır.

## Geliştirme

```bash
npm install
cp .env.example .env    # değerleri doldur
npm run db:setup        # tabloları ve örnek verileri kurar
npm run dev             # http://localhost:3000
```

Tasarım ve geliştirme: [Aleyta Stüdyo](https://www.instagram.com/aleyta_studio/)
