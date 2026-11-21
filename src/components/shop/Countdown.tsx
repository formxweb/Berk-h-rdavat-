'use client';

import { useEffect, useState } from 'react';

/** Bu haftanın pazar günü 19:00'a (Türkiye saati) kalan süre. */
function nextSundayEvening(now: Date) {
  const tr = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
  const offset = tr.getTime() - now.getTime();
  const t = new Date(tr);
  t.setDate(tr.getDate() + ((7 - tr.getDay()) % 7));
  t.setHours(19, 0, 0, 0);
  if (t <= tr) t.setDate(t.getDate() + 7);
  return t.getTime() - offset;
}

const pad = (n: number) => String(n).padStart(2, '0');

export function Countdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const end = nextSundayEvening(new Date());
    const tick = () => setLeft(Math.max(0, Math.floor((end - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const s = left ?? 0;
  const parts: [string, string][] = [
    [String(Math.floor(s / 86400)), 'gün'],
    [pad(Math.floor((s % 86400) / 3600)), 'saat'],
    [pad(Math.floor((s % 3600) / 60)), 'dakika'],
    [pad(s % 60), 'saniye'],
  ];
  return (
    <div className="timer" role="timer" aria-label="Kampanyanın bitmesine kalan süre">
      {parts.map(([v, l]) => (
        <div key={l}>
          <b>{left === null ? '–' : v}</b>
          <span>{l}</span>
        </div>
      ))}
    </div>
  );
}
