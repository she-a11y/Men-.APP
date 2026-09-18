import { Season, SeasonInfo, SeasonalDish, DayOfWeek, MealType, WeeklyMenuState, FavoriteMeal } from '../types';
import { DIES_SETMANA } from './products';

// Determina l'estació actual segons el mes de l'any a la nostra zona (clima temperat / mediterrani)
export function getCurrentSeason(): Season {
  const month = new Date().getMonth(); // 0 = Gener ... 11 = Desembre
  // Primavera: Març (2), Abril (3), Maig (4)
  // Estiu: Juny (5), Juliol (6), Agost (7)
  // Tardor: Setembre (8), Octubre (9), Novembre (10)
  // Hivern: Desembre (11), Gener (0), Febrer (1)
  if (month >= 2 && month <= 4) return 'Primavera';
  if (month >= 5 && month <= 7) return 'Estiu';
  if (month >= 8 && month <= 10) return 'Tardor';
  return 'Hivern';
}

export const SEASONS_INFO: Record<Season, SeasonInfo> = {
  Tardor: {
    id: 'Tardor',
    nom: 'Tardor',
    mesos: 'Setembre, Octubre i Novembre',
    icona: '🍁',
    descripcio: 'Plats calents i temperats: moniatos, carbassa, bolets xampinyons, tubercles, verdures cuites al forn, llegums i peix ric en omega-3.',
    ingredientsEstrella: ['Moniato', 'Carbassa a daus / fresca', 'Xampinyons laminats frescos', 'Espinacs frescos', 'Llenties de pot Hacendado', 'Nous naturals', 'Lloms de salmó congelat Hacendado'],
    desaconsellats: ['Gaspatxo Hacendado (sopa freda d\'estiu)'],
  },
  Hivern: {
    id: 'Hivern',
    nom: 'Hivern',
    mesos: 'Desembre, Gener i Febrer',
    icona: '❄️',
    descripcio: 'Plats de cullera, estofats calents, bacallà, orada, carxofes, porro, peix al forn i llegums.',
    ingredientsEstrella: ['Llenties de pot Hacendado', 'Mongetes blanques de pot', 'Bacallà congelat', 'Filets d\'orada o llobarro congelats', 'Porro', 'Cors de carxofa en conserva Hacendado', 'Patata'],
    desaconsellats: ['Gaspatxo Hacendado', 'Cogombre cru en excés'],
  },
  Primavera: {
    id: 'Primavera',
    nom: 'Primavera',
    mesos: 'Març, Abril i Maig',
    icona: '🌸',
    descripcio: 'Espàrrecs verds, pèsols fins, tofu marinat, peix fresc, amanides temperades i quinoa.',
    ingredientsEstrella: ['Espàrrecs verds', 'Pèsols fins congelats Hacendado', 'Tofu ferm natural Hacendado', 'Filets d\'orada o llobarro congelats', 'Quinoa', 'Tahini 100% sèsam Hacendado'],
    desaconsellats: ['Guisats massa feixucs'],
  },
  Estiu: {
    id: 'Estiu',
    nom: 'Estiu',
    mesos: 'Juny, Juliol i Agost',
    icona: '☀️',
    descripcio: 'Gaspatxo fresc, amanides fredes completes, fajitas, proteïnes vegetals lleugeres i plats ràpids sense focs.',
    ingredientsEstrella: ['Gaspatxo Hacendado', 'Tomàquet amanida', 'Tomàquet xerri', 'Cogombre', 'Tonyina clara al natural Hacendado', 'Alvocat', 'Remolatxa cuita pelada'],
    desaconsellats: ['Plats de cullera bullents'],
  },
};

export const SEASONAL_DISHES: SeasonalDish[] = [
  // =========================================================================
  // TARDOR (Setembre - Novembre) - ZERO GASPATXO
  // =========================================================================
  {
    id: 'tardor-1',
    nom: 'Moniato rostit amb vedella magra i espinacs saltejats',
    estacio: 'Tardor',
    desc: 'Dolçor del moniato al forn combinat amb proteïna càlida i verdures temperades.',
    context: 'El moniato és el tubercle estrella de la tardor: saciant, nutritiu i càlid.',
    tipus: 'Dinar',
    farinaci: 'Moniato',
    proteines: ['Vedella magra'],
    verdures: ['Espinacs frescos', 'Pebrot vermell/verd'],
    greix: "Oli d'oliva verge extra",
    destacat: true,
  },
  {
    id: 'tardor-2',
    nom: 'Llenties estofades ràpides amb pollastre i pebrot del piquillo',
    estacio: 'Tardor',
    desc: 'Plat calent reconfortant de tardor, fet en 10 minuts amb pot de llegum i tires de pollastre sofregides.',
    context: 'Quan comença a refrescar, les llenties amb pebrots aporten calidesa, ferro i energia.',
    tipus: 'Dinar',
    farinaci: 'Llenties de pot Hacendado',
    proteines: ['Tires de pollastre al forn Hacendado'],
    verdures: ['Pebrot del piquillo', 'Pastanaga'],
    greix: "Oli d'oliva verge extra",
    destacat: true,
  },
  {
    id: 'tardor-3',
    nom: 'Lluç al forn amb patata daurada i carbassó temperat',
    estacio: 'Tardor',
    desc: 'Peix blanc suau al forn amb patates fines i carbassó cuit, aromàtic i baix en greix.',
    context: 'Peix blanc preparat al forn quan la calor de l\'estiu ja ha marxat.',
    tipus: 'Sopar',
    farinaci: 'Patata',
    proteines: ['Lluç congelat', 'Formatge fresc Burgos Hacendado'],
    verdures: ['Carbassó', 'Ceba'],
    greix: 'Nous naturals',
    destacat: false,
  },
  {
    id: 'tardor-4',
    nom: 'Arròs integral de tardor amb llom i pastanaga sofregida',
    estacio: 'Tardor',
    desc: 'Arròs sec i aromàtic amb daus de llom de porc magre, pastanaga i ceba sofregida.',
    context: 'Arròs reconfortant amb carns magres i sofregit de ceba i pastanaga.',
    tipus: 'Dinar',
    farinaci: 'Arròs integral Hacendado',
    proteines: ['Llom de porc'],
    verdures: ['Ceba', 'Pastanaga'],
    greix: "Oli d'oliva verge extra",
    destacat: false,
  },
  {
    id: 'tardor-5',
    nom: 'Torrada integral de tardor amb pernil ibèric i espinacs saltejats',
    estacio: 'Tardor',
    desc: 'Sopar ràpid i càlid: espinacs passats per la paella amb oli verge, servits sobre pa integral amb pernil salat ibèric.',
    context: 'Espinacs saltejats càlids i confortables per a les nits fresques.',
    tipus: 'Sopar',
    farinaci: 'Pa integral 100%',
    proteines: ['Pernil salat ibèric', 'Ous'],
    verdures: ['Espinacs frescos', 'Pebrot del piquillo'],
    greix: 'Nous naturals',
    destacat: true,
  },
  {
    id: 'tardor-6',
    nom: 'Lloms de salmó al forn amb carbassa a daus i espinacs',
    estacio: 'Tardor',
    desc: 'Peix blau ric en omega-3 rostit al forn juntament amb daus de carbassa dolça i espinacs tendres.',
    context: 'El salmó i la carbassa configuren una unió de tardor reconfortant i nutritiva.',
    tipus: 'Dinar',
    farinaci: 'Moniato',
    proteines: ['Lloms de salmó congelat Hacendado'],
    verdures: ['Carbassa a daus / fresca', 'Espinacs frescos'],
    greix: 'Nous naturals',
    destacat: true,
  },
  {
    id: 'tardor-7',
    nom: 'Saltejat calent de tofu amb xampinyons i cuscús',
    estacio: 'Tardor',
    desc: 'Daus de tofu daurats a la paella amb xampinyons frescos laminats, albergínia i cuscús suau.',
    context: 'Proteïna vegetal càlida amb els bolets xampinyons típics de la tardor.',
    tipus: 'Ambdós',
    farinaci: 'Cuscús',
    proteines: ['Tofu ferm natural Hacendado'],
    verdures: ['Xampinyons laminats frescos', 'Albergínia'],
    greix: 'Tahini 100% sèsam Hacendado',
    destacat: false,
  },

  // =========================================================================
  // HIVERN (Desembre - Febrer) - CALIDESA I CULLERA
  // =========================================================================
  {
    id: 'hivern-1',
    nom: 'Suquet ràpid de bacallà amb patates i sofregit de ceba',
    estacio: 'Hivern',
    desc: 'Bacallà tradicional d\'hivern cuit sobre un llit de patates i ceba sofregida amb oli verge.',
    context: 'El bacallà és l\'ingredient rei de l\'hivern per a plats de cullera càlids.',
    tipus: 'Dinar',
    farinaci: 'Patata',
    proteines: ['Bacallà congelat'],
    verdures: ['Ceba', 'Pebrot vermell/verd'],
    greix: "Oli d'oliva verge extra",
    destacat: true,
  },
  {
    id: 'hivern-2',
    nom: 'Cigrons calents amb espinacs i ou dur',
    estacio: 'Hivern',
    desc: 'Plat tradicional calent de cigrons amb espinacs, llest en 8 minuts.',
    context: 'Aporta sacietat màxima contra els dies més freds.',
    tipus: 'Dinar',
    farinaci: 'Cigrons de pot Hacendado',
    proteines: ['Ous', 'Tonyina clara al natural Hacendado'],
    verdures: ['Espinacs frescos', 'Ceba'],
    greix: "Oli d'oliva verge extra",
    destacat: true,
  },
  {
    id: 'hivern-3',
    nom: 'Mongetes blanques estofades amb llom de porc',
    estacio: 'Hivern',
    desc: 'Mongetes blanques de pot amb daus de llom daurat a la paella i pastanaga.',
    context: 'Guisat ràpid amb llegums i carns magres.',
    tipus: 'Dinar',
    farinaci: 'Mongetes blanques de pot',
    proteines: ['Llom de porc'],
    verdures: ['Pastanaga', 'Pebrot del piquillo'],
    greix: "Oli d'oliva verge extra",
    destacat: false,
  },
  {
    id: 'hivern-4',
    nom: 'Pit de pollastre al forn amb moniato i carbassó daurat',
    estacio: 'Hivern',
    desc: 'Sopar calent que no requereix atenció: tot al forn amb espècies mediterrànies.',
    context: 'Plat al forn per a nits fredes d\'hivern.',
    tipus: 'Sopar',
    farinaci: 'Moniato',
    proteines: ['Pit de pollastre', 'Formatge fresc Burgos Hacendado'],
    verdures: ['Carbassó', 'Pebrot vermell/verd'],
    greix: 'Ametlles naturals',
    destacat: false,
  },
  {
    id: 'hivern-5',
    nom: 'Orada al forn amb patates i cors de carxofa',
    estacio: 'Hivern',
    desc: 'Filets d\'orada suaus sobre rodanxes de patata i carxofes tendres cuites al vapor o forn.',
    context: 'Plat de peix blanc d\'hivern amb la carxofa com a verdura estrella de temporada.',
    tipus: 'Sopar',
    farinaci: 'Patata',
    proteines: ['Filets d\'orada o llobarro congelats'],
    verdures: ['Cors de carxofa en conserva Hacendado', 'Porro'],
    greix: "Oli d'oliva verge extra",
    destacat: true,
  },
  {
    id: 'hivern-6',
    nom: 'Estofat vegetal de llenties amb soja texturitzada i porro',
    estacio: 'Hivern',
    desc: 'Plat de cullera 100% vegetal ple de proteïna: llenties amb soja texturitzada fina i sofregit de porro i pastanaga.',
    context: 'Alternativa vegetal molt reconfortant i altament proteica per a l\'hivern.',
    tipus: 'Dinar',
    farinaci: 'Llenties de pot Hacendado',
    proteines: ['Soja texturitzada fina Hacendado'],
    verdures: ['Porro', 'Pastanaga'],
    greix: "Oli d'oliva verge extra",
    destacat: false,
  },

  // =========================================================================
  // PRIMAVERA (Març - Maig) - ESPÀRRECS I FRESCOR TEMPERADA
  // =========================================================================
  {
    id: 'primavera-1',
    nom: 'Espàrrecs verds a la planxa amb pit de pollastre i quinoa',
    estacio: 'Primavera',
    desc: 'Espàrrecs cruixents de temporada fets a foc viu amb pit de pollastre suculent i quinoa.',
    context: 'Temps d\'espàrrecs verds: depuratius, lleugers i plens de sabor.',
    tipus: 'Dinar',
    farinaci: 'Quinoa',
    proteines: ['Pit de pollastre'],
    verdures: ['Espàrrecs verds', 'Pastanaga'],
    greix: "Oli d'oliva verge extra",
    destacat: true,
  },
  {
    id: 'primavera-2',
    nom: 'Truita d\'espàrrecs verds amb pa integral i tomàquet',
    estacio: 'Primavera',
    desc: 'Truita d\'ous amb espàrrecs tendres acompanyada de pa integral amb tomàquet.',
    context: 'Truita d\'espàrrecs de primavera: sopar ràpid, saborós i saciant.',
    tipus: 'Sopar',
    farinaci: 'Pa integral 100%',
    proteines: ['Ous', 'Formatge fresc Burgos Hacendado'],
    verdures: ['Espàrrecs verds', 'Tomàquet amanida'],
    greix: "Oli d'oliva verge extra",
    destacat: true,
  },
  {
    id: 'primavera-3',
    nom: 'Cuscús primaveral amb llagostins i pastanaga ratllada',
    estacio: 'Primavera',
    desc: 'Cuscús lleuger i hidratat amb llagostins cuits, carbassó saltejat i pastanaga.',
    context: 'Plat de transició fresca cap al bon temps, ràpid de preparar.',
    tipus: 'Dinar',
    farinaci: 'Cuscús',
    proteines: ['Llagostins cuits congelats', 'Formatge Feta'],
    verdures: ['Carbassó', 'Pastanaga'],
    greix: 'Ametlles naturals',
    destacat: false,
  },
  {
    id: 'primavera-4',
    nom: 'Pèsols saltejats amb bocados vegetals estil Heura i pastanaga',
    estacio: 'Primavera',
    desc: 'Pèsols fins dolços saltejats amb proteïna vegetal saborosa i dauets de pastanaga tendra.',
    context: 'Els pèsols són una joia de la primavera: aporten fibra, carbohidrats complexos i proteïna.',
    tipus: 'Dinar',
    farinaci: 'Pèsols fins congelats Hacendado',
    proteines: ['Bocados vegetals estil pollastre (Heura / Hacendado)'],
    verdures: ['Pastanaga', 'Ceba'],
    greix: "Oli d'oliva verge extra",
    destacat: true,
  },
  {
    id: 'primavera-5',
    nom: 'Filet d\'orada a la planxa amb espàrrecs i arròs basmati',
    estacio: 'Primavera',
    desc: 'Peix blanc daurat a foc viu amb espàrrecs cruixents i arròs basmati aromàtic.',
    context: 'Plat primaveral net, digestiu i molt equilibrat.',
    tipus: 'Ambdós',
    farinaci: 'Arròs basmati Hacendado',
    proteines: ['Filets d\'orada o llobarro congelats'],
    verdures: ['Espàrrecs verds', 'Carbassó'],
    greix: 'Barreja de llavors (xia, carbassa, gira-sol)',
    destacat: false,
  },

  // =========================================================================
  // ESTIU (Juny - Agost) - AQUÍ SÍ: GASPATXO I FRESCOR!
  // =========================================================================
  {
    id: 'estiu-1',
    nom: 'Bikini integral amb gaspatxo fresc Hacendado',
    estacio: 'Estiu',
    desc: 'El rei de l\'estiu: bikini calent d\'indi i formatge acompanyat d\'un bon got de gaspatxo ben fred.',
    context: 'El gaspatxo refresca de la calor de l\'estiu i aporta hidratació sense esforç.',
    tipus: 'Sopar',
    farinaci: 'Pa integral 100%',
    proteines: ['Gall dindi embotit >85%', 'Formatge fresc Burgos Hacendado'],
    verdures: ['Gaspatxo Hacendado', 'Bossa Mesclum'],
    greix: "Oli d'oliva verge extra",
    destacat: true,
  },
  {
    id: 'estiu-2',
    nom: 'Amanida freda de cigrons amb tomàquet xerri, tonyina i alvocat',
    estacio: 'Estiu',
    desc: 'Plat únic fresquíssim de cigrons escorreguts, tonyina al natural, xerri i cremós d\'alvocat.',
    context: 'Els llegums en fred són la millor solució per menjar sa a l\'estiu sense encendre focs.',
    tipus: 'Dinar',
    farinaci: 'Cigrons de pot Hacendado',
    proteines: ['Tonyina clara al natural Hacendado', 'Ous'],
    verdures: ['Tomàquet xerri', 'Cogombre'],
    greix: 'Alvocat',
    destacat: true,
  },
  {
    id: 'estiu-3',
    nom: 'Fajita freda de tires de pollastre amb ruca i guacamole',
    estacio: 'Estiu',
    desc: 'Wrap fresc i cruixent llest en 3 minuts sense cuinar.',
    context: 'Ideal per a sopars d\'estiu després d\'un dia calorós.',
    tipus: 'Sopar',
    farinaci: 'Fajitas integrals',
    proteines: ['Tires de pollastre al forn Hacendado'],
    verdures: ['Bossa Ruca', 'Tomàquet amanida'],
    greix: 'Guacamole Hacendado 95%',
    destacat: false,
  },
  {
    id: 'estiu-4',
    nom: 'Bowl fresc d\'arròs basmati amb tofu, edamame i salsa tahini',
    estacio: 'Estiu',
    desc: 'Poke bowl 100% vegetal refrescant amb edamame cruixent, dauets de tofu marcat, cogombre i amanit amb tahini.',
    context: 'Dinar estival lleuger, fresc i molt ric en proteïnes vegetals.',
    tipus: 'Dinar',
    farinaci: 'Arròs basmati Hacendado',
    proteines: ['Tofu ferm natural Hacendado', 'Edamame'],
    verdures: ['Cogombre', 'Tomàquet xerri'],
    greix: 'Tahini 100% sèsam Hacendado',
    destacat: true,
  },
  {
    id: 'estiu-5',
    nom: 'Amanida campera de patata, bonítol del nord i remolatxa',
    estacio: 'Estiu',
    desc: 'Amanida freda de patata cuita amb bonítol del nord en conserva, remolatxa i canonges.',
    context: 'Plat típic d\'estiu complet que es pot deixar preparat a la nevera.',
    tipus: 'Ambdós',
    farinaci: 'Patata',
    proteines: ['Bonítol del nord en conserva de vidre', 'Ous'],
    verdures: ['Remolatxa cuita pelada', 'Bossa Canonges'],
    greix: "Oli d'oliva verge extra",
    destacat: false,
  },
];

// Genera un menú setmanal complet (14 àpats) rigorosament adaptat a l'estació escollida
export function generateSeasonalWeeklyMenu(
  season: Season,
  favoritesList: FavoriteMeal[] = []
): WeeklyMenuState {
  const menu = {} as WeeklyMenuState;
  const seasonDishes = SEASONAL_DISHES.filter((d) => d.estacio === season);

  let dishIndex = 0;

  for (const day of DIES_SETMANA) {
    const dinarCandidates = seasonDishes.filter((d) => d.tipus === 'Dinar' || d.tipus === 'Ambdós');
    const dinarPreset = dinarCandidates.length > 0 
      ? dinarCandidates[dishIndex % dinarCandidates.length] 
      : seasonDishes[0];

    const soparCandidates = seasonDishes.filter((d) => d.tipus === 'Sopar' || d.tipus === 'Ambdós');
    const soparPreset = soparCandidates.length > 0 
      ? soparCandidates[(dishIndex + 1) % soparCandidates.length] 
      : seasonDishes[1 % seasonDishes.length];

    dishIndex++;

    menu[day] = {
      Dinar: {
        farinaci: dinarPreset.farinaci,
        proteines: [...dinarPreset.proteines],
        verdures: [...dinarPreset.verdures],
        greix: dinarPreset.greix,
        locked: false,
        isFavorite: false,
      },
      Sopar: {
        farinaci: soparPreset.farinaci,
        proteines: [...soparPreset.proteines],
        verdures: [...soparPreset.verdures],
        greix: soparPreset.greix,
        locked: false,
        isFavorite: false,
      },
    };
  }

  return menu;
}
