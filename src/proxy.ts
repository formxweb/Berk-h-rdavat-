import { NextResponse, type NextRequest } from 'next/server';

/*
 * Bozuk kopyalanmış bağlantıları düzeltir: adreste ters eğik çizgi (\ veya %5C) ya da
 * sonda fazladan eğik çizgi varsa doğru sayfaya yönlendirir. Next.js bu adreslerde hata veriyordu.
 */
export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (!/%5c|\\/i.test(path)) return NextResponse.next();
  const url = req.nextUrl.clone();
  const clean = path
    .replace(/%5c|\\/gi, '/')
    .replace(/\/{2,}/g, '/')
    .replace(/(.)\/+$/, '$1');
  url.pathname = clean || '/';
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|ornek/|favicon).*)'],
};
