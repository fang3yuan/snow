import type { SourceConfig } from '../types';
import { MadaraProvider } from './madara';

export function makeProvider(c: SourceConfig){
  switch (c.sExt) {
    case 'MAD': return new MadaraProvider(c);
    default: return new MadaraProvider(c);
  }
}
