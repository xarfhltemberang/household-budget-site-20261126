// Format angka dan tanggal dalam Bahasa Indonesia.
const rupiahFormat = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const plainFormat = new Intl.NumberFormat('id-ID');

export function rupiah(n) {
  return rupiahFormat.format(n);
}

export function rupiahShort(n) {
  if (n >= 1000000) return 'Rp' + (n / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' jt';
  if (n >= 1000) return 'Rp' + Math.round(n / 1000) + ' rb';
  return rupiah(n);
}

export function plain(n) {
  return plainFormat.format(n);
}

export function pct(n) {
  return n.toLocaleString('id-ID', { maximumFractionDigits: 1 }) + '%';
}

const dateFormat = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

export function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return Number.isNaN(d.getTime()) ? iso : dateFormat.format(d);
}

export function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
