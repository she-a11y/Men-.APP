import { Product } from '../types';
import {
  PRODUCTS_LIST,
  PRODUCTS_MAP,
  FARINACIS,
  PROTEINES,
  VERDURES,
  GREIXOS,
  INTERCANVIS,
} from '../data/products';

export interface PersonIntercanvis {
  calories: number;
  Dinar: { Farinacis: number; Proteïnes: number; Verdures: number; Greixos: number };
  Sopar: { Farinacis: number; Proteïnes: number; Verdures: number; Greixos: number };
}

export interface IntercanvisConfig {
  Sheila: PersonIntercanvis;
  Marc: PersonIntercanvis;
}

export const STORAGE_PRODUCTS_KEY = 'aliments_personalitzats_parella';
export const STORAGE_INTERCANVIS_KEY = 'intercanvis_nutricionals_parella';

export function getInitialProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_PRODUCTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error llegint aliments personalitzats:', err);
  }
  return [...PRODUCTS_LIST];
}

export function getInitialIntercanvis(): IntercanvisConfig {
  try {
    const raw = localStorage.getItem(STORAGE_INTERCANVIS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.Sheila && parsed?.Marc) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error llegint intercanvis nutricionals:', err);
  }
  return JSON.parse(JSON.stringify(INTERCANVIS));
}

/**
 * Sincronitza les estructures en memòria perquè tot el codi existent
 * utilitzi immediatament els productes i pautes actualitzades.
 */
export function syncGlobalProductsState(
  products: Product[],
  intercanvis: IntercanvisConfig
) {
  // 1. Sincronitzar PRODUCTS_MAP
  PRODUCTS_MAP.clear();
  for (const p of products) {
    PRODUCTS_MAP.set(p.nom, p);
  }

  // 2. Sincronitzar arrays de grups in-place
  FARINACIS.length = 0;
  FARINACIS.push(...products.filter((p) => p.grup === 'Farinacis'));

  PROTEINES.length = 0;
  PROTEINES.push(...products.filter((p) => p.grup === 'Proteïnes'));

  VERDURES.length = 0;
  VERDURES.push(...products.filter((p) => p.grup === 'Verdures'));

  GREIXOS.length = 0;
  GREIXOS.push(...products.filter((p) => p.grup === 'Greixos'));

  // 3. Sincronitzar INTERCANVIS
  Object.assign(INTERCANVIS.Sheila, intercanvis.Sheila);
  Object.assign(INTERCANVIS.Marc, intercanvis.Marc);
}
