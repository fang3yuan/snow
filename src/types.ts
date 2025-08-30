export type SourceConfig = {
  id: string;
  name: string;
  baseUrl: string;
  sExt: 'MAD' | 'Them' | string;
  headers?: Record<string, string>;
  sorts?: string[];
  sortUrls?: string[];
  genre?: string[];
  genreUrls?: string[];
  listUrl?: string;
  tagPrefix?: string;
  paraWithoutAjax?: boolean;
};

export type MangaTile = { id: string; title: string; cover: string; url: string; altTitle?: string };
