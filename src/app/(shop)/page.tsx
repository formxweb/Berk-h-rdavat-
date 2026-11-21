import Link from 'next/link';
import { IconCard, IconClock, IconPhone, IconStore, IconTruck, IconWhatsApp } from '@/components/icons';
import { Countdown } from '@/components/shop/Countdown';
import { ProductCard } from '@/components/shop/ProductCard';
import { activeCategories, listProducts } from '@/lib/catalog';
import { discountPercent, formatTL } from '@/lib/money';
import { getSettings } from '@/lib/settings';
import { STORE_INFO, waLink } from '@/lib/store-info';

/* Ana sayfa arka plan videosu: işletmenin kendi videosunu public/video/ klasörüne koyup yolunu yazın, ör. '/video/magaza.mp4' */
const HERO_VIDEO = '';
/* Ürünün "Etiket" alanına bu yazı girilirse ürün ana sayfada sayaçlı kampanya olarak çıkar. */
const WEEKEND_BADGE = 'Sadece bu hafta sonu';

function splitTL(kurus: number) {
  const s = formatTL(kurus);
  return s.replace(/\s*(TL|₺)\s*/g, '').trim();
}

export default async function HomePage() {
  const [settings, cats] = await Promise.all([getSettings(), activeCategories()]);
  const visibleCats = cats.filter((c) => c.count > 0);
  const [featured, tiles, all] = await Promise.all([
    listProducts({ featuredOnly: true, limit: 8 }).then(async (r) => (r.items.length ? r : listProducts({ limit: 8 }))),
    Promise.all(visibleCats.map(async (c) => ({ cat: c, first: (await listProducts({ category: c.slug, limit: 1 })).items[0] }))),
    listProducts({ limit: 60 }),
  ]);
  const campaign = all.items.find((p) => p.badge.trim().toLocaleLowerCase('tr') === WEEKEND_BADGE.toLocaleLowerCase('tr') && !p.soldOut);
  const heroProduct = featured.items.find((p) => p.compareAtPrice && p.id !== campaign?.id && !p.soldOut) ?? featured.items[0];
  const phoneHref = `tel:${settings.contactPhone.replace(/\s/g, '')}`;

  return (
    <>
      <section className="bhero peg" aria-labelledby="hero-h">
        {HERO_VIDEO ? (
          <div className="bhero-video" aria-hidden="true">
            <video src={HERO_VIDEO} autoPlay muted loop playsInline preload="metadata" />
          </div>
        ) : null}
        <div className="wrap bhero-in">
          <div>
            <h1 id="hero-h">
              Tüm hırdavat,
              <br />
              spot fiyatlarla.
            </h1>
            <p className="lead">
              Bursa Yıldırım'daki mağazamızın ürünleri artık sitede. Kartla güvenle ödeyin, kargoyla gönderelim ya da mağazadan teslim alın.
            </p>
            <div className="cta-row">
              <Link className="btn btn-primary btn-lg" href="/urunler">
                Ürünlere göz atın
              </Link>
              {settings.whatsapp ? (
                <a className="btn btn-glass btn-lg" href={waLink(settings.whatsapp)} target="_blank" rel="noopener noreferrer">
                  <IconWhatsApp size={20} />
                  WhatsApp'tan yazın
                </a>
              ) : null}
            </div>
            <ul className="facts">
              <li>
                <IconCard size={18} />
                Kartla güvenli ödeme
              </li>
              <li>
                <IconTruck size={18} />
                {settings.freeShippingThreshold > 0 ? `${formatTL(settings.freeShippingThreshold)} üzeri kargo ücretsiz` : 'Türkiye geneline kargo'}
              </li>
              <li>
                <IconStore size={18} />
                Mağazadan teslim
              </li>
            </ul>
          </div>
          {heroProduct ? (
            <div className="hang">
              <span className="pin" aria-hidden="true" />
              <div className="swing">
                <div className="ptag">
                  <p className="ptag-k">{heroProduct.badge || 'Haftanın fırsatı'}</p>
                  <h2 className="ptag-name">{heroProduct.name}</h2>
                  {heroProduct.summary ? <p className="ptag-spec">{heroProduct.summary}</p> : null}
                  <p className="ptag-price">
                    {splitTL(heroProduct.price)}
                    <small>TL</small>
                  </p>
                  {heroProduct.compareAtPrice && discountPercent(heroProduct.price, heroProduct.compareAtPrice) > 0 ? (
                    <p className="ptag-old">
                      <s>{formatTL(heroProduct.compareAtPrice)}</s> yerine
                    </p>
                  ) : null}
                  <Link className="btn btn-ink full" href={`/urun/${heroProduct.slug}`}>
                    Ürünü incele
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {campaign ? (
        <section className="camp" aria-labelledby="camp-h">
          <div className="wrap camp-in">
            <Link href={`/urun/${campaign.slug}`} className="camp-media" aria-label={`${campaign.name} ürün sayfası`}>
              {campaign.thumbUrl ? <img src={campaign.thumbUrl} alt="" width={600} height={750} loading="lazy" /> : null}
              <span className="sticker">{WEEKEND_BADGE}</span>
            </Link>
            <div className="camp-text">
              <h2 id="camp-h">{campaign.name}</h2>
              <p>{campaign.summary ? `${campaign.summary}. ` : ''}Kampanya pazar akşamı 19:00'da bitiyor.</p>
              <Countdown />
            </div>
            <div className="camp-buy">
              <div className="shelf shelf-big">
                <span className="shelf-amt">
                  {splitTL(campaign.price)}
                  <small>TL</small>
                </span>
                {campaign.compareAtPrice ? <s>{formatTL(campaign.compareAtPrice)}</s> : null}
              </div>
              <Link className="btn btn-primary" href={`/urun/${campaign.slug}`}>
                Ürünü incele
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {tiles.length ? (
        <section className="wrap sec" aria-labelledby="kat-h">
          <div className="sec-head">
            <h2 id="kat-h" className="sec-title">
              Kategoriler
            </h2>
            <Link href="/urunler" className="more">
              Tüm ürünler
            </Link>
          </div>
          <div className="tiles">
            {tiles.map(({ cat, first }) => (
              <Link key={cat.slug} href={`/urunler?kategori=${cat.slug}`} className="tile">
                {first?.thumbUrl ? <img src={first.thumbUrl} alt="" width={600} height={750} loading="lazy" /> : null}
                <span className="tile-label">
                  <span className="tile-name">{cat.name}</span>
                  <span className="tile-count">{cat.count} ürün</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="wrap sec" aria-labelledby="one-cikan-h">
        <div className="sec-head">
          <h2 id="one-cikan-h" className="sec-title">
            Öne çıkanlar
          </h2>
          <Link href="/urunler" className="more">
            Tüm ürünler
          </Link>
        </div>
        <div className="grid">
          {featured.items.map((p, i) => (
            <ProductCard key={p.id} p={p} priority={i < 4} />
          ))}
        </div>
        <p className="ask-line">
          Aradığınız ürün sitede yoksa sorun, çoğu zaman rafta vardır.{' '}
          {settings.whatsapp ? (
            <a href={waLink(settings.whatsapp, 'Merhaba, bir ürün arıyorum: ')} target="_blank" rel="noopener noreferrer">
              WhatsApp'tan sorun
            </a>
          ) : null}
        </p>
      </section>

      <section className="how" aria-labelledby="how-h">
        <div className="wrap">
          <h2 id="how-h" className="sec-title">
            Siparişiniz üç adımda yolda
          </h2>
          <ol className="bsteps">
            <li>
              <b>1</b>
              <h3>Sepete ekleyin</h3>
              <p>Ürünleri ve adetleri seçin. Üye olmadan da sipariş verebilirsiniz.</p>
            </li>
            <li>
              <b>2</b>
              <h3>Kartla ödeyin</h3>
              <p>Ödeme güvenli ödeme sayfasında 3D Secure ile alınır, kart bilgileriniz sitemize gelmez.</p>
            </li>
            <li>
              <b>3</b>
              <h3>Kargoyla gelsin ya da gelip alın</h3>
              <p>
                Kargo takip numarası sipariş sayfanızda görünür. Mağazadan teslim almak isterseniz sipariş notuna yazın.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="store peg" id="magaza" aria-labelledby="store-h">
        <div className="wrap store-in">
          <div>
            <h2 id="store-h" className="sec-title">
              Mağazamız
            </h2>
            <address>
              {STORE_INFO.address}
              <br />
              {STORE_INFO.district}
            </address>
            <p className="near">{STORE_INFO.landmark}.</p>
            {settings.workingHours ? (
              <p className="hours">
                <IconClock size={20} />
                <span>{settings.workingHours}</span>
              </p>
            ) : null}
            <div className="cta-row">
              <a className="btn btn-primary" href={STORE_INFO.mapsUrl} target="_blank" rel="noopener noreferrer">
                Yol tarifi alın
              </a>
              {settings.contactPhone ? (
                <a className="btn btn-glass" href={phoneHref}>
                  <IconPhone size={20} />
                  {settings.contactPhone}
                </a>
              ) : null}
              {settings.whatsapp ? (
                <a className="btn btn-wa" href={waLink(settings.whatsapp)} target="_blank" rel="noopener noreferrer">
                  <IconWhatsApp size={20} />
                  WhatsApp
                </a>
              ) : null}
            </div>
            {settings.instagram ? (
              <p className="ig">
                Instagram'da yeni gelen ürünleri ve hafta sonu fırsatlarını paylaşıyoruz:{' '}
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer">
                  @{settings.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '')}
                </a>
              </p>
            ) : null}
          </div>
          <div className="map">
            <iframe title={`${settings.storeName} konumu`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={STORE_INFO.mapEmbed} />
          </div>
        </div>
      </section>
    </>
  );
}
