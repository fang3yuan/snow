import { load } from 'cheerio';
import type { SourceConfig, MangaTile } from '../types';

function pickImg($el: any): string {
  return $el.attr('data-src') || $el.attr('data-lazy-src') || $el.attr('src') || '';
}

export class MadaraProvider {
  id: string; name: string; config: SourceConfig;
  constructor(config: SourceConfig){ this.config = config; this.id = config.id; this.name = config.name; }

  private async $get(path: string): Promise<string> {
    const url = path.startsWith('http') ? path : `${this.config.baseUrl}${path}`;
    const res = await fetch(url, { headers: this.config.headers });
    if (!res.ok) throw new Error('HTTP ' + res.status + ' on ' + url);
    return await res.text();
  }

  async list(page: number = 1): Promise<MangaTile[]> {
    const order = '';
    const join = order ? '&' : '?';
    const html = await this.$get(`/manga/${order}${join}page=${page}`);
    const $ = load(html);
    const out: MangaTile[] = [];
    $('div.page-item-detail, div.c-tabs-item__content').each((_, el) => {
      const a = $(el).find('a').first();
      const url = a.attr('href') || '';
      const id = url;
      const title = a.attr('title') || $(el).find('.h5 a, .post-title a').first().text().trim() || a.text().trim();
      const cover = pickImg($(el).find('img'));
      if (url && title) out.push({ id, title, cover, url });
    });
    return out;
  }

  async search(q: string, page: number = 1): Promise<MangaTile[]> {
    const html = await this.$get(`/?s=${encodeURIComponent(q)}&post_type=wp-manga&page=${page}`);
    const $ = load(html);
    const out: MangaTile[] = [];
    $('div.page-item-detail, div.c-tabs-item__content, div.row div.item-summary, div.bsx').each((_, el) => {
      const a = $(el).find('a').first();
      const url = a.attr('href') || '';
      const id = url;
      const title = a.attr('title') || a.text().trim();
      const cover = pickImg($(el).find('img'));
      if (url && title) out.push({ id, title, cover, url });
    });
    return out;
  }
}
