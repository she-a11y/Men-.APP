import { MealConfig, FavoriteMeal, SeasonalDish } from '../types';

export interface DishCategoryInfo {
  id: string;
  nom: string;
  icona: string;
  descripcio: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
}

export const CATEGORIES_PLATS: DishCategoryInfo[] = [
  {
    id: 'peix-marisc',
    nom: 'Peix i Marisc',
    icona: '🐟',
    descripcio: 'Salmó, orada, bacallà, lluç, bonítol, tonyina, llagostins i marisc fresc.',
    colorBg: 'bg-sky-50',
    colorBorder: 'border-sky-200',
    colorText: 'text-sky-800',
  },
  {
    id: 'llegums-amanides',
    nom: 'Llegums i Amanides',
    icona: '🥗',
    descripcio: 'Cigrons, llenties, mongetes blanques, bols temperats i sopes fredes.',
    colorBg: 'bg-emerald-50',
    colorBorder: 'border-emerald-200',
    colorText: 'text-emerald-800',
  },
  {
    id: 'arrossos-pasta',
    nom: 'Arrossos, Pasta i Cereals',
    icona: '🍚',
    descripcio: 'Arròs basmati o integral, quinoa, cuscús, pasta integral i gnocchi.',
    colorBg: 'bg-amber-50',
    colorBorder: 'border-amber-200',
    colorText: 'text-amber-800',
  },
  {
    id: 'wraps-sopars-rapids',
    nom: 'Wraps, Fajitas i Sopars Ràpids',
    icona: '🌯',
    descripcio: 'Fajitas integrals, bikinis gourmet, torrades completes i bols ràpids.',
    colorBg: 'bg-orange-50',
    colorBorder: 'border-orange-200',
    colorText: 'text-orange-800',
  },
  {
    id: 'ous-truites',
    nom: 'Ous i Truites',
    icona: '🍳',
    descripcio: 'Truites franceses, ous remenats, al plat o cuits combinats amb verdures.',
    colorBg: 'bg-yellow-50',
    colorBorder: 'border-yellow-200',
    colorText: 'text-yellow-800',
  },
  {
    id: 'vegetal-vegan',
    nom: '100% Proteïna Vegetal',
    icona: '🌱',
    descripcio: 'Tofu marcat, bocados estil Heura, tempeh, seitan, edamame i soja texturitzada.',
    colorBg: 'bg-teal-50',
    colorBorder: 'border-teal-200',
    colorText: 'text-teal-800',
  },
  {
    id: 'carns-magres',
    nom: 'Carns Magres',
    icona: '🥩',
    descripcio: 'Pit de pollastre, gall dindi, filet de vedella magra o llom a la planxa.',
    colorBg: 'bg-rose-50',
    colorBorder: 'border-rose-200',
    colorText: 'text-rose-800',
  },
  {
    id: 'tubercles-forn',
    nom: 'Tubercles i Rostits',
    icona: '🍠',
    descripcio: 'Patata campera, moniato rostit al forn i combinacions reconfortants.',
    colorBg: 'bg-purple-50',
    colorBorder: 'border-purple-200',
    colorText: 'text-purple-800',
  },
];

// Imatges d'alta qualitat d'Unsplash especialitzades en gastronomia saludable
export const CURATED_FOOD_IMAGES: Record<string, string> = {
  salmo: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=700&q=80',
  peixBlanc: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=700&q=80',
  marisc: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=700&q=80',
  tonyinaConserva: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80',
  cigronsAmanida: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80',
  llenties: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80',
  mongetesBlanques: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80',
  arrosPollastre: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=700&q=80',
  arrosBasmati: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=700&q=80',
  quinoaBowl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80',
  pastaVerdures: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281788?auto=format&fit=crop&w=700&q=80',
  gnocchi: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=700&q=80',
  fajitas: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=700&q=80',
  torrades: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=700&q=80',
  ousTruita: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=700&q=80',
  ousPlat: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?auto=format&fit=crop&w=700&q=80',
  tofuBowl: 'https://images.unsplash.com/photo-1546069901-d7f457ffad0c?auto=format&fit=crop&w=700&q=80',
  heuraVegetal: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=700&q=80',
  pollastrePlanxa: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=700&q=80',
  vedellaPlanxa: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=700&q=80',
  gaspatxo: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=700&q=80',
  patataCarbassa: 'https://images.unsplash.com/photo-1592417817098-8f3d69104a49?auto=format&fit=crop&w=700&q=80',
  hummusPicaPica: 'https://images.unsplash.com/photo-1577906096429-f73c2c312435?auto=format&fit=crop&w=700&q=80',
};

// Classifica automàticament qualsevol plat segons els seus ingredients i característiques
export function getDishCategory(dish: {
  nom?: string;
  categoria?: string;
  farinaci: string;
  proteines: string[];
  verdures?: string[];
  greix?: string;
}): DishCategoryInfo {
  if (dish.categoria) {
    const found = CATEGORIES_PLATS.find((c) => c.id === dish.categoria || c.nom.toLowerCase() === dish.categoria?.toLowerCase());
    if (found) return found;
  }

  const farinaci = (dish.farinaci || '').toLowerCase();
  const prots = (dish.proteines || []).map((p) => p.toLowerCase());
  const verds = (dish.verdures || []).map((v) => v.toLowerCase());
  const protsStr = prots.join(' ');

  // 1. Vegetals purs (Heura, tofu, tempeh, seitan, soja) sense peix ni carn
  const hasVegProteins = prots.some((p) =>
    p.includes('tofu') || p.includes('bocados vegetals') || p.includes('heura') ||
    p.includes('tempeh') || p.includes('seitan') || p.includes('soja')
  );
  const hasAnimal = prots.some((p) =>
    p.includes('pollastre') || p.includes('vedella') || p.includes('llom') ||
    p.includes('salmó') || p.includes('orada') || p.includes('bacallà') ||
    p.includes('lluç') || p.includes('tonyina') || p.includes('pernil') || p.includes('gall dindi')
  );
  if (hasVegProteins && !hasAnimal) {
    return CATEGORIES_PLATS.find((c) => c.id === 'vegetal-vegan')!;
  }

  // 2. Peix i Marisc
  const isFishOrSeafood = prots.some((p) =>
    p.includes('salmó') || p.includes('orada') || p.includes('llobarro') ||
    p.includes('bacallà') || p.includes('lluç') || p.includes('tonyina') ||
    p.includes('bonítol') || p.includes('sardina') || p.includes('marisc') ||
    p.includes('llagostí') || p.includes('musclo') || p.includes('pop') || p.includes('calamar')
  );
  if (isFishOrSeafood) {
    return CATEGORIES_PLATS.find((c) => c.id === 'peix-marisc')!;
  }

  // 3. Ous i Truites
  const isEgg = prots.some((p) => p.includes('ou') || p.includes('clares'));
  if (isEgg && !hasAnimal) {
    return CATEGORIES_PLATS.find((c) => c.id === 'ous-truites')!;
  }

  // 4. Wraps, Fajitas i Sopars ràpids
  if (farinaci.includes('fajita') || farinaci.includes('pa integral') || farinaci.includes('tortitas')) {
    return CATEGORIES_PLATS.find((c) => c.id === 'wraps-sopars-rapids')!;
  }

  // 5. Llegums i Amanides fredes
  if (
    farinaci.includes('cigro') || farinaci.includes('llenti') || farinaci.includes('mongeta blanca') ||
    verds.some((v) => v.includes('gaspatxo'))
  ) {
    return CATEGORIES_PLATS.find((c) => c.id === 'llegums-amanides')!;
  }

  // 6. Arrossos, Pasta, Gnocchi i Cereals
  if (
    farinaci.includes('arròs') || farinaci.includes('pasta') || farinaci.includes('gnocchi') ||
    farinaci.includes('cuscús') || farinaci.includes('quinoa') || farinaci.includes('fideus')
  ) {
    return CATEGORIES_PLATS.find((c) => c.id === 'arrossos-pasta')!;
  }

  // 7. Carns Magres
  if (prots.some((p) => p.includes('pollastre') || p.includes('vedella') || p.includes('llom') || p.includes('gall dindi') || p.includes('pernil'))) {
    return CATEGORIES_PLATS.find((c) => c.id === 'carns-magres')!;
  }

  // 8. Tubercles
  if (farinaci.includes('patata') || farinaci.includes('moniato')) {
    return CATEGORIES_PLATS.find((c) => c.id === 'tubercles-forn')!;
  }

  return CATEGORIES_PLATS[0];
}

// Genera un títol curt, apetitós i concís per al plat
// Genera un títol curt, apetitós i concís per al plat adaptat als ingredients que porta
export function getDishShortTitle(
  dish: {
    nom?: string;
    farinaci: string;
    proteines: string[];
    verdures?: string[];
    greix?: string;
  },
  forceIngredientsMatch: boolean = false
): string {
  if (!forceIngredientsMatch && dish.nom && dish.nom.trim().length > 0 && !dish.nom.startsWith('Dinar ') && !dish.nom.startsWith('Sopar ')) {
    return dish.nom;
  }

  const far = dish.farinaci || '';
  const prots = dish.proteines || [];
  const verds = dish.verdures || [];

  const mainProt = prots[0] || '';
  const mainVerd = verds[0] || '';

  // Neteja noms de marques per a un títol net
  const clean = (str: string) =>
    str
      .replace(/\s*Hacendado\s*/gi, '')
      .replace(/\s*\(.*?\)\s*/gi, '')
      .replace(/\s*congelat\s*/gi, '')
      .replace(/\s*de pot\s*/gi, '')
      .replace(/\s*al forn\s*/gi, '')
      .replace(/\s*al natural\s*/gi, '')
      .replace(/\s*en conserva.*$/gi, '')
      .replace(/\s*frescos\s*/gi, '')
      .replace(/\s*fresca\s*/gi, '')
      .replace(/\s*bossa\s*/gi, '')
      .trim();

  const cProt = clean(mainProt);
  const cFar = clean(far);
  const cVerd = clean(mainVerd);

  const lProt = cProt.toLowerCase();
  const lFar = cFar.toLowerCase();

  // Fajitas i wraps
  if (lFar.includes('fajita') || lFar.includes('tortita')) {
    return `Fajita de ${lProt || 'verdures'}`;
  }

  // Pa integral / Torrades
  if (lFar.includes('pa integral')) {
    return `Torrades de ${lProt || 'pa'}`;
  }

  // Salmó
  if (lProt.includes('salmó')) {
    if (lFar.includes('arròs')) return 'Bowl de salmó amb arròs basmati';
    return `Salmó al forn amb ${lFar}`;
  }

  // Peix blanc (orada, llobarro, bacallà, lluç)
  if (lProt.includes('orada') || lProt.includes('llobarro')) {
    return `Orada al forn amb ${lFar}`;
  }
  if (lProt.includes('bacallà') || lProt.includes('lluç')) {
    return `${cProt} a la planxa amb ${lFar}`;
  }
  if (lProt.includes('pop') || lProt.includes('llagostí') || lProt.includes('calamar')) {
    return `Saltejat de ${lProt} amb ${lFar}`;
  }
  if (lProt.includes('tonyina') || lProt.includes('bonítol')) {
    return `Amanida de ${lFar} amb tonyina`;
  }

  // Ous
  if (lProt.includes('ou') || lProt.includes('clares')) {
    return `Truita o remenat amb ${lFar}`;
  }

  // Vegetals (tofu, heura)
  if (lProt.includes('tofu')) {
    return `Saltejat de tofu amb ${lFar}`;
  }
  if (lProt.includes('bocados') || lProt.includes('heura') || lProt.includes('seitan') || lProt.includes('soja')) {
    return `Saltejat estil Heura amb ${lFar}`;
  }

  // Carns
  if (lProt.includes('pollastre') || lProt.includes('gall dindi')) {
    return `Pollastre daurat amb ${lFar}`;
  }
  if (lProt.includes('vedella') || lProt.includes('llom')) {
    return `Vedella a la planxa amb ${lFar}`;
  }

  // Llegums
  if (lFar.includes('cigro')) {
    return `Amanida de cigrons i ${lProt || cVerd.toLowerCase()}`;
  }
  if (lFar.includes('llenti')) {
    return `Estofat de llenties amb ${lProt || cVerd.toLowerCase()}`;
  }
  if (lFar.includes('mongeta')) {
    return `Mongetes blanques amb ${lProt || cVerd.toLowerCase()}`;
  }

  // Cereals
  if (lFar.includes('gnocchi')) {
    return `Gnocchi saltejats amb ${lProt}`;
  }
  if (lFar.includes('pasta')) {
    return `Pasta integral amb ${lProt || cVerd.toLowerCase()}`;
  }
  if (lFar.includes('quinoa')) {
    return `Bowl de quinoa amb ${lProt || cVerd.toLowerCase()}`;
  }
  if (lFar.includes('arròs basmati')) {
    return `Arròs basmati amb ${lProt || cVerd.toLowerCase()}`;
  }
  if (lFar.includes('arròs')) {
    return `Arròs saltejat amb ${lProt || cVerd.toLowerCase()}`;
  }

  // Tubercles
  if (lFar.includes('patata') || lFar.includes('moniato')) {
    return `${cFar} amb ${lProt || cVerd.toLowerCase()}`;
  }

  if (cProt && cFar) {
    return `${cProt} amb ${lFar}`;
  }

  return cFar || 'Plat equilibrat';
}

// Retorna la millor foto gastronòmica regenerada automàticament en funció dels ingredients del plat
export function getDishImage(
  dish: {
    imageUrl?: string;
    nom?: string;
    farinaci: string;
    proteines: string[];
    verdures?: string[];
    greix?: string;
  },
  forceIngredientsMatch: boolean = false
): string {
  if (!forceIngredientsMatch && dish.imageUrl && dish.imageUrl.startsWith('http')) {
    return dish.imageUrl;
  }

  const far = (dish.farinaci || '').toLowerCase();
  const prots = (dish.proteines || []).join(' ').toLowerCase();
  const verds = (dish.verdures || []).join(' ').toLowerCase();

  // 1. Fajitas i wraps tenen la màxima identitat visual de forma
  if (far.includes('fajita') || far.includes('tortita')) {
    return CURATED_FOOD_IMAGES.fajitas;
  }

  // 2. Torrades / pa integral
  if (far.includes('pa integral')) {
    return CURATED_FOOD_IMAGES.torrades;
  }

  // 3. Peix i marisc
  if (prots.includes('salmó')) return CURATED_FOOD_IMAGES.salmo;
  if (prots.includes('orada') || prots.includes('llobarro') || prots.includes('bacallà') || prots.includes('lluç')) {
    return CURATED_FOOD_IMAGES.peixBlanc;
  }
  if (prots.includes('pop') || prots.includes('llagostí') || prots.includes('musclo') || prots.includes('calamar')) {
    return CURATED_FOOD_IMAGES.marisc;
  }
  if (prots.includes('tonyina') || prots.includes('bonítol') || prots.includes('sardina')) {
    return CURATED_FOOD_IMAGES.tonyinaConserva;
  }

  // 4. Ous
  if (prots.includes('ou') || prots.includes('clares')) {
    return CURATED_FOOD_IMAGES.ousTruita;
  }

  // 5. Vegetals
  if (prots.includes('tofu') || prots.includes('tempeh') || far.includes('edamame')) {
    return CURATED_FOOD_IMAGES.tofuBowl;
  }
  if (prots.includes('bocados') || prots.includes('heura') || prots.includes('seitan') || prots.includes('soja')) {
    return CURATED_FOOD_IMAGES.heuraVegetal;
  }

  // 6. Carns
  if (prots.includes('pollastre') || prots.includes('gall dindi')) {
    return CURATED_FOOD_IMAGES.pollastrePlanxa;
  }
  if (prots.includes('vedella') || prots.includes('llom')) {
    return CURATED_FOOD_IMAGES.vedellaPlanxa;
  }

  // 7. Gaspatxo
  if (verds.includes('gaspatxo')) {
    return CURATED_FOOD_IMAGES.gaspatxo;
  }

  // 8. Llegums
  if (far.includes('cigro')) return CURATED_FOOD_IMAGES.cigronsAmanida;
  if (far.includes('llenti')) return CURATED_FOOD_IMAGES.llenties;
  if (far.includes('mongeta')) return CURATED_FOOD_IMAGES.mongetesBlanques;

  // 9. Cereals
  if (far.includes('gnocchi')) return CURATED_FOOD_IMAGES.gnocchi;
  if (far.includes('pasta')) return CURATED_FOOD_IMAGES.pastaVerdures;
  if (far.includes('quinoa')) return CURATED_FOOD_IMAGES.quinoaBowl;
  if (far.includes('arròs basmati')) return CURATED_FOOD_IMAGES.arrosBasmati;
  if (far.includes('arròs')) return CURATED_FOOD_IMAGES.arrosPollastre;

  // 10. Tubercles
  if (far.includes('patata') || far.includes('moniato')) return CURATED_FOOD_IMAGES.patataCarbassa;

  return CURATED_FOOD_IMAGES.arrosBasmati;
}
