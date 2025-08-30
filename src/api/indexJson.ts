import type { SourceConfig } from '../types';
import { INDEX_JSON_URL } from '../constants';

export async function fetchSources(): Promise<SourceConfig[]> {
  const res = await fetch(INDEX_JSON_URL);
  if (!res.ok) throw new Error('فشل تحميل قائمة المصادر');
  const data = await res.json();
  return (data as any[]).map((x) => ({
    id: String(x.id || x.name || Math.random()),
    name: String(x.name || 'المصدر'),
    baseUrl: String(x.baseUrl || '').replace(/\/$/, ''),
    sExt: String(x.sExt || 'MAD'),
    headers: x.headers || {},
    sorts: x.sorts || [],
    sortUrls: x.sortUrls || [],
    genre: x.genre || [],
    genreUrls: x.genreUrls || [],
    listUrl: x.listUrl,
    tagPrefix: x.tagPrefix,
    paraWithoutAjax: x.paraWithoutAjax,
  }));
}
