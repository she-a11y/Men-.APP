import { Product, DayOfWeek, MealType, WeeklyMenuState, MealConfig, FavoriteMeal } from '../types';
import { getCurrentSeason } from './seasonalDishes';

export const PRODUCTS_LIST: Product[] = [
  // FARINACIS
  { nom: 'Arròs integral Hacendado', grup: 'Farinacis', supermercat: 'Mercadona', racio_g: 20, unitat: 'g', format_compra: 1000, format_unitat: 'g', seccio: 'Rebost', preu_format: 1.35, calories_per_100g: 350, proteines_per_100g: 7.5, carbs_per_100g: 74.0, greixos_per_100g: 2.5 },
  { nom: 'Arròs basmati Hacendado', grup: 'Farinacis', supermercat: 'Mercadona', racio_g: 20, unitat: 'g', format_compra: 1000, format_unitat: 'g', seccio: 'Rebost', preu_format: 1.75, calories_per_100g: 350, proteines_per_100g: 8.5, carbs_per_100g: 77.0, greixos_per_100g: 0.8 },
  { nom: 'Pasta integral', grup: 'Farinacis', supermercat: 'Mercadona', racio_g: 20, unitat: 'g', format_compra: 500, format_unitat: 'g', seccio: 'Rebost', preu_format: 1.05, calories_per_100g: 348, proteines_per_100g: 13.0, carbs_per_100g: 65.0, greixos_per_100g: 2.5 },
  { nom: 'Cuscús', grup: 'Farinacis', supermercat: 'Mercadona', racio_g: 20, unitat: 'g', format_compra: 500, format_unitat: 'g', seccio: 'Rebost', preu_format: 1.45, calories_per_100g: 355, proteines_per_100g: 12.0, carbs_per_100g: 72.0, greixos_per_100g: 1.5 },
  { nom: 'Quinoa', grup: 'Farinacis', supermercat: 'Mercadona', racio_g: 20, unitat: 'g', format_compra: 500, format_unitat: 'g', seccio: 'Rebost', preu_format: 2.20, calories_per_100g: 368, proteines_per_100g: 14.0, carbs_per_100g: 64.0, greixos_per_100g: 6.0 },
  { nom: 'Gnocchi de patata Hacendado', grup: 'Farinacis', supermercat: 'Mercadona', racio_g: 50, unitat: 'g', format_compra: 500, format_unitat: 'g', seccio: 'Rebost', preu_format: 1.35, calories_per_100g: 160, proteines_per_100g: 3.5, carbs_per_100g: 34.0, greixos_per_100g: 0.8 },
  { nom: 'Fideus d\'arròs orientals', grup: 'Farinacis', supermercat: 'Mercadona', racio_g: 20, unitat: 'g', format_compra: 200, format_unitat: 'g', seccio: 'Rebost', preu_format: 1.45, calories_per_100g: 355, proteines_per_100g: 7.0, carbs_per_100g: 80.0, greixos_per_100g: 0.5 },
  { nom: 'Cigrons de pot Hacendado', grup: 'Farinacis', supermercat: 'Mercadona', racio_g: 80, unitat: 'g', format_compra: 400, format_unitat: 'g', seccio: 'Rebost', preu_format: 0.85, calories_per_100g: 115, proteines_per_100g: 6.5, carbs_per_100g: 14.5, greixos_per_100g: 2.5 },
  { nom: 'Llenties de pot Hacendado', grup: 'Farinacis', supermercat: 'Mercadona', racio_g: 80, unitat: 'g', format_compra: 400, format_unitat: 'g', seccio: 'Rebost', preu_format: 0.85, calories_per_100g: 95, proteines_per_100g: 7.5, carbs_per_100g: 12.5, greixos_per_100g: 0.8 },
  { nom: 'Mongetes blanques de pot', grup: 'Farinacis', supermercat: 'Mercadona', racio_g: 80, unitat: 'g', format_compra: 400, format_unitat: 'g', seccio: 'Rebost', preu_format: 0.85, calories_per_100g: 85, proteines_per_100g: 6.0, carbs_per_100g: 12.0, greixos_per_100g: 0.5 },
  { nom: 'Pèsols fins congelats Hacendado', grup: 'Farinacis', supermercat: 'Mercadona', racio_g: 100, unitat: 'g', format_compra: 1000, format_unitat: 'g', seccio: 'Peixateria i Congelats', preu_format: 1.45, calories_per_100g: 78, proteines_per_100g: 5.5, carbs_per_100g: 11.5, greixos_per_100g: 0.5 },
  { nom: 'Blat de moro dolç llauna Hacendado', grup: 'Farinacis', supermercat: 'Mercadona', racio_g: 50, unitat: 'g', format_compra: 420, format_unitat: 'g', seccio: 'Rebost', preu_format: 1.65, calories_per_100g: 82, proteines_per_100g: 2.8, carbs_per_100g: 14.5, greixos_per_100g: 1.2 },
  { nom: 'Edamame', grup: 'Farinacis', supermercat: 'Mercadona', racio_g: 80, unitat: 'g', format_compra: 500, format_unitat: 'g', seccio: 'Peixateria i Congelats', preu_format: 2.49, calories_per_100g: 122, proteines_per_100g: 11.0, carbs_per_100g: 10.0, greixos_per_100g: 5.0 },
  { nom: 'Pa integral 100%', grup: 'Farinacis', supermercat: 'Mercadona', racio_g: 30, unitat: 'g', format_compra: 500, format_unitat: 'g', seccio: 'Forn i Pa', preu_format: 1.30, calories_per_100g: 240, proteines_per_100g: 9.0, carbs_per_100g: 44.0, greixos_per_100g: 2.0 },
  { nom: 'Fajitas integrals', grup: 'Farinacis', supermercat: 'Mercadona', racio_g: 30, unitat: 'g', format_compra: 360, format_unitat: 'g', seccio: 'Rebost', preu_format: 1.40, calories_per_100g: 295, proteines_per_100g: 9.0, carbs_per_100g: 48.0, greixos_per_100g: 6.5 },
  { nom: 'Tortitas d\'arròs i blat de moro', grup: 'Farinacis', supermercat: 'Mercadona', racio_g: 25, unitat: 'g', format_compra: 130, format_unitat: 'g', seccio: 'Rebost', preu_format: 1.15, calories_per_100g: 380, proteines_per_100g: 8.0, carbs_per_100g: 81.0, greixos_per_100g: 2.2 },
  { nom: 'Flocs de civada integrals (Avena) Hacendado', grup: 'Farinacis', supermercat: 'Mercadona', racio_g: 20, unitat: 'g', format_compra: 500, format_unitat: 'g', seccio: 'Rebost', preu_format: 1.00, calories_per_100g: 375, proteines_per_100g: 13.5, carbs_per_100g: 59.0, greixos_per_100g: 7.0 },
  { nom: 'Patata', grup: 'Farinacis', supermercat: 'Mercadona', racio_g: 100, unitat: 'g', format_compra: 2000, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 2.75, calories_per_100g: 77, proteines_per_100g: 2.0, carbs_per_100g: 17.0, greixos_per_100g: 0.1 },
  { nom: 'Moniato', grup: 'Farinacis', supermercat: 'Mercadona', racio_g: 100, unitat: 'g', format_compra: 1000, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 1.95, calories_per_100g: 86, proteines_per_100g: 1.6, carbs_per_100g: 20.0, greixos_per_100g: 0.1 },

  // PROTEÏNES (Animals, Peix/Marisc i Proteïnes Vegetals)
  { nom: 'Tonyina clara al natural Hacendado', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 30, unitat: 'g', format_compra: 180, format_unitat: 'g', seccio: 'Rebost', preu_format: 2.40, calories_per_100g: 101, proteines_per_100g: 24.0, carbs_per_100g: 0.0, greixos_per_100g: 0.6 },
  { nom: 'Bonítol del nord en conserva de vidre', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 30, unitat: 'g', format_compra: 190, format_unitat: 'g', seccio: 'Rebost', preu_format: 3.10, calories_per_100g: 140, proteines_per_100g: 25.0, carbs_per_100g: 0.0, greixos_per_100g: 4.5 },
  { nom: 'Sardinetes en oli d\'oliva llauna Hacendado', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 30, unitat: 'g', format_compra: 120, format_unitat: 'g', seccio: 'Rebost', preu_format: 1.45, calories_per_100g: 190, proteines_per_100g: 22.0, carbs_per_100g: 0.0, greixos_per_100g: 11.0 },
  { nom: 'Ous', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 1, unitat: 'unitat', format_compra: 12, format_unitat: 'unitat', seccio: 'Rebost', preu_format: 2.45, calories_per_100g: 143, proteines_per_100g: 12.5, carbs_per_100g: 0.7, greixos_per_100g: 9.5 },
  { nom: 'Clares d\'ou pasteuritzades Hacendado', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 40, unitat: 'g', format_compra: 300, format_unitat: 'ml', seccio: 'Rebost', preu_format: 1.95, calories_per_100g: 50, proteines_per_100g: 11.0, carbs_per_100g: 0.7, greixos_per_100g: 0.2 },
  { nom: 'Pit de pollastre', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 30, unitat: 'g', format_compra: 500, format_unitat: 'g', seccio: 'Carnisseria i Embotits', preu_format: 3.65, calories_per_100g: 110, proteines_per_100g: 23.0, carbs_per_100g: 0.0, greixos_per_100g: 1.5 },
  { nom: 'Tires de pollastre al forn Hacendado', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 30, unitat: 'g', format_compra: 140, format_unitat: 'g', seccio: 'Carnisseria i Embotits', preu_format: 1.95, calories_per_100g: 135, proteines_per_100g: 26.0, carbs_per_100g: 1.5, greixos_per_100g: 2.5 },
  { nom: 'Gall dindi embotit >85%', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 40, unitat: 'g', format_compra: 200, format_unitat: 'g', seccio: 'Carnisseria i Embotits', preu_format: 2.25, calories_per_100g: 92, proteines_per_100g: 18.0, carbs_per_100g: 1.5, greixos_per_100g: 1.2 },
  { nom: 'Pernil salat ibèric', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 30, unitat: 'g', format_compra: 120, format_unitat: 'g', seccio: 'Carnisseria i Embotits', preu_format: 4.50, calories_per_100g: 250, proteines_per_100g: 31.0, carbs_per_100g: 0.5, greixos_per_100g: 14.0 },
  { nom: 'Formatge fresc Burgos Hacendado', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 40, unitat: 'g', format_compra: 250, format_unitat: 'g', seccio: 'Làctics i Formatges', preu_format: 1.60, calories_per_100g: 96, proteines_per_100g: 10.0, carbs_per_100g: 3.5, greixos_per_100g: 4.5 },
  { nom: 'Formatge Feta', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 40, unitat: 'g', format_compra: 200, format_unitat: 'g', seccio: 'Làctics i Formatges', preu_format: 2.25, calories_per_100g: 264, proteines_per_100g: 14.0, carbs_per_100g: 1.0, greixos_per_100g: 21.0 },
  { nom: 'Formatge cottage Hacendado', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 40, unitat: 'g', format_compra: 200, format_unitat: 'g', seccio: 'Làctics i Formatges', preu_format: 1.25, calories_per_100g: 90, proteines_per_100g: 13.0, carbs_per_100g: 3.0, greixos_per_100g: 2.8 },
  { nom: 'Lluç congelat', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 30, unitat: 'g', format_compra: 400, format_unitat: 'g', seccio: 'Peixateria i Congelats', preu_format: 3.75, calories_per_100g: 75, proteines_per_100g: 16.5, carbs_per_100g: 0.0, greixos_per_100g: 0.8 },
  { nom: 'Bacallà congelat', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 30, unitat: 'g', format_compra: 400, format_unitat: 'g', seccio: 'Peixateria i Congelats', preu_format: 4.20, calories_per_100g: 82, proteines_per_100g: 18.0, carbs_per_100g: 0.0, greixos_per_100g: 0.7 },
  { nom: 'Filets d\'orada o llobarro congelats', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 30, unitat: 'g', format_compra: 400, format_unitat: 'g', seccio: 'Peixateria i Congelats', preu_format: 4.80, calories_per_100g: 95, proteines_per_100g: 19.5, carbs_per_100g: 0.0, greixos_per_100g: 1.8 },
  { nom: 'Lloms de salmó congelat Hacendado', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 30, unitat: 'g', format_compra: 400, format_unitat: 'g', seccio: 'Peixateria i Congelats', preu_format: 6.95, calories_per_100g: 208, proteines_per_100g: 20.0, carbs_per_100g: 0.0, greixos_per_100g: 13.5 },
  { nom: 'Salmó fumat', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 30, unitat: 'g', format_compra: 100, format_unitat: 'g', seccio: 'Peixateria i Congelats', preu_format: 3.45, calories_per_100g: 180, proteines_per_100g: 20.0, carbs_per_100g: 0.5, greixos_per_100g: 11.0 },
  { nom: 'Musclos al natural llauna', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 30, unitat: 'g', format_compra: 70, format_unitat: 'g', seccio: 'Rebost', preu_format: 1.65, calories_per_100g: 86, proteines_per_100g: 14.5, carbs_per_100g: 3.0, greixos_per_100g: 1.8 },
  { nom: 'Llagostins cuits congelats', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 30, unitat: 'g', format_compra: 400, format_unitat: 'g', seccio: 'Peixateria i Congelats', preu_format: 4.95, calories_per_100g: 90, proteines_per_100g: 20.0, carbs_per_100g: 0.5, greixos_per_100g: 1.0 },
  { nom: 'Calamars a rodanxes congelats', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 35, unitat: 'g', format_compra: 400, format_unitat: 'g', seccio: 'Peixateria i Congelats', preu_format: 4.35, calories_per_100g: 80, proteines_per_100g: 16.0, carbs_per_100g: 1.0, greixos_per_100g: 1.2 },
  { nom: 'Pop cuit a rodanxes Hacendado', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 30, unitat: 'g', format_compra: 200, format_unitat: 'g', seccio: 'Peixateria i Congelats', preu_format: 5.95, calories_per_100g: 85, proteines_per_100g: 18.0, carbs_per_100g: 0.5, greixos_per_100g: 1.0 },
  { nom: 'Vedella magra', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 30, unitat: 'g', format_compra: 400, format_unitat: 'g', seccio: 'Carnisseria i Embotits', preu_format: 4.80, calories_per_100g: 125, proteines_per_100g: 21.5, carbs_per_100g: 0.0, greixos_per_100g: 4.0 },
  { nom: 'Llom de porc', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 30, unitat: 'g', format_compra: 500, format_unitat: 'g', seccio: 'Carnisseria i Embotits', preu_format: 3.50, calories_per_100g: 130, proteines_per_100g: 22.0, carbs_per_100g: 0.0, greixos_per_100g: 4.5 },
  // Proteïnes Vegetals
  { nom: 'Tofu ferm natural Hacendado', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 40, unitat: 'g', format_compra: 400, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 1.90, calories_per_100g: 125, proteines_per_100g: 13.0, carbs_per_100g: 2.0, greixos_per_100g: 7.0 },
  { nom: 'Bocados vegetals estil pollastre (Heura / Hacendado)', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 35, unitat: 'g', format_compra: 180, format_unitat: 'g', seccio: 'Carnisseria i Embotits', preu_format: 2.80, calories_per_100g: 135, proteines_per_100g: 19.0, carbs_per_100g: 3.5, greixos_per_100g: 4.0 },
  { nom: 'Soja texturitzada fina Hacendado', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 20, unitat: 'g', format_compra: 250, format_unitat: 'g', seccio: 'Rebost', preu_format: 1.65, calories_per_100g: 345, proteines_per_100g: 50.0, carbs_per_100g: 28.0, greixos_per_100g: 1.5 },
  { nom: 'Seitan fresc Hacendado', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 35, unitat: 'g', format_compra: 250, format_unitat: 'g', seccio: 'Carnisseria i Embotits', preu_format: 2.50, calories_per_100g: 130, proteines_per_100g: 24.0, carbs_per_100g: 4.0, greixos_per_100g: 1.5 },
  { nom: 'Tempeh de soja', grup: 'Proteïnes', supermercat: 'Mercadona', racio_g: 35, unitat: 'g', format_compra: 200, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 2.30, calories_per_100g: 170, proteines_per_100g: 18.5, carbs_per_100g: 4.5, greixos_per_100g: 8.5 },

  // VERDURES (Sense bròquil, brocoli ni coliflor!)
  { nom: 'Bossa Canonges', grup: 'Verdures', supermercat: 'Mercadona', racio_g: 150, unitat: 'g', format_compra: 150, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 1.15, calories_per_100g: 21, proteines_per_100g: 2.0, carbs_per_100g: 2.5, greixos_per_100g: 0.4 },
  { nom: 'Bossa Ruca', grup: 'Verdures', supermercat: 'Mercadona', racio_g: 150, unitat: 'g', format_compra: 100, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 0.99, calories_per_100g: 25, proteines_per_100g: 2.6, carbs_per_100g: 3.6, greixos_per_100g: 0.7 },
  { nom: 'Bossa Mesclum', grup: 'Verdures', supermercat: 'Mercadona', racio_g: 150, unitat: 'g', format_compra: 175, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 1.19, calories_per_100g: 20, proteines_per_100g: 1.8, carbs_per_100g: 2.8, greixos_per_100g: 0.3 },
  { nom: 'Bossa Enciam iceberg', grup: 'Verdures', supermercat: 'Mercadona', racio_g: 150, unitat: 'g', format_compra: 200, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 1.05, calories_per_100g: 16, proteines_per_100g: 1.2, carbs_per_100g: 2.5, greixos_per_100g: 0.2 },
  { nom: 'Tomàquet amanida', grup: 'Verdures', supermercat: 'Mercadona', racio_g: 150, unitat: 'g', format_compra: 1000, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 2.10, calories_per_100g: 18, proteines_per_100g: 0.9, carbs_per_100g: 3.5, greixos_per_100g: 0.2 },
  { nom: 'Tomàquet xerri', grup: 'Verdures', supermercat: 'Mercadona', racio_g: 150, unitat: 'g', format_compra: 500, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 1.75, calories_per_100g: 22, proteines_per_100g: 1.0, carbs_per_100g: 4.2, greixos_per_100g: 0.2 },
  { nom: 'Cogombre', grup: 'Verdures', supermercat: 'Mercadona', racio_g: 150, unitat: 'g', format_compra: 500, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 1.10, calories_per_100g: 15, proteines_per_100g: 0.7, carbs_per_100g: 3.0, greixos_per_100g: 0.1 },
  { nom: 'Pastanaga', grup: 'Verdures', supermercat: 'Mercadona', racio_g: 150, unitat: 'g', format_compra: 1000, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 0.95, calories_per_100g: 41, proteines_per_100g: 0.9, carbs_per_100g: 9.6, greixos_per_100g: 0.2 },
  { nom: 'Pebrot vermell/verd', grup: 'Verdures', supermercat: 'Mercadona', racio_g: 150, unitat: 'g', format_compra: 500, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 1.55, calories_per_100g: 26, proteines_per_100g: 1.0, carbs_per_100g: 5.0, greixos_per_100g: 0.3 },
  { nom: 'Pebrot del piquillo', grup: 'Verdures', supermercat: 'Mercadona', racio_g: 150, unitat: 'g', format_compra: 250, format_unitat: 'g', seccio: 'Rebost', preu_format: 1.35, calories_per_100g: 32, proteines_per_100g: 1.2, carbs_per_100g: 5.5, greixos_per_100g: 0.4 },
  { nom: 'Ceba', grup: 'Verdures', supermercat: 'Mercadona', racio_g: 150, unitat: 'g', format_compra: 1000, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 1.45, calories_per_100g: 40, proteines_per_100g: 1.1, carbs_per_100g: 9.0, greixos_per_100g: 0.1 },
  { nom: 'Carbassó', grup: 'Verdures', supermercat: 'Mercadona', racio_g: 150, unitat: 'g', format_compra: 1000, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 1.60, calories_per_100g: 17, proteines_per_100g: 1.2, carbs_per_100g: 3.1, greixos_per_100g: 0.3 },
  { nom: 'Albergínia', grup: 'Verdures', supermercat: 'Mercadona', racio_g: 150, unitat: 'g', format_compra: 1000, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 1.65, calories_per_100g: 25, proteines_per_100g: 1.0, carbs_per_100g: 5.5, greixos_per_100g: 0.2 },
  { nom: 'Carbassa a daus / fresca', grup: 'Verdures', supermercat: 'Mercadona', racio_g: 150, unitat: 'g', format_compra: 500, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 1.50, calories_per_100g: 26, proteines_per_100g: 1.0, carbs_per_100g: 6.0, greixos_per_100g: 0.1 },
  { nom: 'Xampinyons laminats frescos', grup: 'Verdures', supermercat: 'Mercadona', racio_g: 150, unitat: 'g', format_compra: 250, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 1.35, calories_per_100g: 22, proteines_per_100g: 3.1, carbs_per_100g: 3.3, greixos_per_100g: 0.3 },
  { nom: 'Mongeta tendra rodona', grup: 'Verdures', supermercat: 'Mercadona', racio_g: 150, unitat: 'g', format_compra: 500, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 1.60, calories_per_100g: 31, proteines_per_100g: 1.8, carbs_per_100g: 7.0, greixos_per_100g: 0.2 },
  { nom: 'Cors de carxofa en conserva Hacendado', grup: 'Verdures', supermercat: 'Mercadona', racio_g: 150, unitat: 'g', format_compra: 400, format_unitat: 'g', seccio: 'Rebost', preu_format: 2.10, calories_per_100g: 30, proteines_per_100g: 2.4, carbs_per_100g: 4.5, greixos_per_100g: 0.3 },
  { nom: 'Porro', grup: 'Verdures', supermercat: 'Mercadona', racio_g: 150, unitat: 'g', format_compra: 500, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 1.40, calories_per_100g: 32, proteines_per_100g: 1.5, carbs_per_100g: 6.5, greixos_per_100g: 0.2 },
  { nom: 'Remolatxa cuita pelada', grup: 'Verdures', supermercat: 'Mercadona', racio_g: 150, unitat: 'g', format_compra: 500, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 1.15, calories_per_100g: 43, proteines_per_100g: 1.6, carbs_per_100g: 9.6, greixos_per_100g: 0.2 },
  { nom: 'Api fresc', grup: 'Verdures', supermercat: 'Mercadona', racio_g: 150, unitat: 'g', format_compra: 500, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 1.25, calories_per_100g: 14, proteines_per_100g: 0.7, carbs_per_100g: 2.9, greixos_per_100g: 0.1 },
  { nom: 'Espàrrecs verds', grup: 'Verdures', supermercat: 'Mercadona', racio_g: 150, unitat: 'g', format_compra: 250, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 2.35, calories_per_100g: 20, proteines_per_100g: 2.2, carbs_per_100g: 2.0, greixos_per_100g: 0.2 },
  { nom: 'Espinacs frescos', grup: 'Verdures', supermercat: 'Mercadona', racio_g: 150, unitat: 'g', format_compra: 300, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 1.45, calories_per_100g: 23, proteines_per_100g: 2.9, carbs_per_100g: 3.6, greixos_per_100g: 0.4 },
  { nom: 'Verdures saltejades congelades (pastanaga, ceba, carbassó, pebrot)', grup: 'Verdures', supermercat: 'Mercadona', racio_g: 150, unitat: 'g', format_compra: 600, format_unitat: 'g', seccio: 'Peixateria i Congelats', preu_format: 1.45, calories_per_100g: 28, proteines_per_100g: 1.3, carbs_per_100g: 5.2, greixos_per_100g: 0.2 },
  { nom: 'Gaspatxo Hacendado', grup: 'Verdures', supermercat: 'Mercadona', racio_g: 200, unitat: 'ml', format_compra: 1000, format_unitat: 'ml', seccio: 'Fruiteria i Verdura', preu_format: 1.60, calories_per_100g: 35, proteines_per_100g: 0.8, carbs_per_100g: 3.2, greixos_per_100g: 2.0 },

  // GREIXOS
  { nom: 'Oli d\'oliva verge extra', grup: 'Greixos', supermercat: 'Mercadona', racio_g: 10, unitat: 'g', format_compra: 1000, format_unitat: 'ml', seccio: 'Olis i Fruits Secs', preu_format: 8.95, calories_per_100g: 884, proteines_per_100g: 0.0, carbs_per_100g: 0.0, greixos_per_100g: 100.0 },
  { nom: 'Guacamole Hacendado 95%', grup: 'Greixos', supermercat: 'Mercadona', racio_g: 50, unitat: 'g', format_compra: 200, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 1.75, calories_per_100g: 165, proteines_per_100g: 1.8, carbs_per_100g: 4.5, greixos_per_100g: 15.0 },
  { nom: 'Alvocat', grup: 'Greixos', supermercat: 'Mercadona', racio_g: 50, unitat: 'g', format_compra: 500, format_unitat: 'g', seccio: 'Fruiteria i Verdura', preu_format: 2.40, calories_per_100g: 160, proteines_per_100g: 2.0, carbs_per_100g: 8.5, greixos_per_100g: 14.5 },
  { nom: 'Nous naturals', grup: 'Greixos', supermercat: 'Mercadona', racio_g: 15, unitat: 'g', format_compra: 200, format_unitat: 'g', seccio: 'Olis i Fruits Secs', preu_format: 2.60, calories_per_100g: 654, proteines_per_100g: 15.2, carbs_per_100g: 13.7, greixos_per_100g: 65.2 },
  { nom: 'Ametlles naturals', grup: 'Greixos', supermercat: 'Mercadona', racio_g: 15, unitat: 'g', format_compra: 200, format_unitat: 'g', seccio: 'Olis i Fruits Secs', preu_format: 2.70, calories_per_100g: 579, proteines_per_100g: 21.2, carbs_per_100g: 21.6, greixos_per_100g: 49.9 },
  { nom: 'Anacards naturals', grup: 'Greixos', supermercat: 'Mercadona', racio_g: 15, unitat: 'g', format_compra: 200, format_unitat: 'g', seccio: 'Olis i Fruits Secs', preu_format: 2.85, calories_per_100g: 580, proteines_per_100g: 18.0, carbs_per_100g: 30.0, greixos_per_100g: 44.0 },
  { nom: 'Pistatxos naturals torrats', grup: 'Greixos', supermercat: 'Mercadona', racio_g: 15, unitat: 'g', format_compra: 200, format_unitat: 'g', seccio: 'Olis i Fruits Secs', preu_format: 3.10, calories_per_100g: 565, proteines_per_100g: 20.0, carbs_per_100g: 28.0, greixos_per_100g: 45.0 },
  { nom: 'Crema de cacauet 100% Hacendado', grup: 'Greixos', supermercat: 'Mercadona', racio_g: 15, unitat: 'g', format_compra: 500, format_unitat: 'g', seccio: 'Olis i Fruits Secs', preu_format: 2.95, calories_per_100g: 618, proteines_per_100g: 30.0, carbs_per_100g: 7.0, greixos_per_100g: 50.0 },
  { nom: 'Tahini 100% sèsam Hacendado', grup: 'Greixos', supermercat: 'Mercadona', racio_g: 15, unitat: 'g', format_compra: 200, format_unitat: 'g', seccio: 'Olis i Fruits Secs', preu_format: 2.80, calories_per_100g: 645, proteines_per_100g: 22.0, carbs_per_100g: 8.0, greixos_per_100g: 57.0 },
  { nom: 'Barreja de llavors (xia, carbassa, gira-sol)', grup: 'Greixos', supermercat: 'Mercadona', racio_g: 15, unitat: 'g', format_compra: 200, format_unitat: 'g', seccio: 'Olis i Fruits Secs', preu_format: 1.55, calories_per_100g: 535, proteines_per_100g: 21.0, carbs_per_100g: 12.0, greixos_per_100g: 43.0 },
  { nom: 'Olives', grup: 'Greixos', supermercat: 'Mercadona', racio_g: 30, unitat: 'g', format_compra: 150, format_unitat: 'g', seccio: 'Rebost', preu_format: 1.20, calories_per_100g: 145, proteines_per_100g: 1.0, carbs_per_100g: 3.5, greixos_per_100g: 14.5 },
  { nom: 'Hummus de cigrons Hacendado', grup: 'Greixos', supermercat: 'Mercadona', racio_g: 40, unitat: 'g', format_compra: 240, format_unitat: 'g', seccio: 'Rebost', preu_format: 1.40, calories_per_100g: 210, proteines_per_100g: 6.5, carbs_per_100g: 14.0, greixos_per_100g: 14.5 },
  { nom: 'Formatge d\'untar lleuger Hacendado', grup: 'Greixos', supermercat: 'Mercadona', racio_g: 30, unitat: 'g', format_compra: 300, format_unitat: 'g', seccio: 'Làctics i Formatges', preu_format: 1.35, calories_per_100g: 160, proteines_per_100g: 9.0, carbs_per_100g: 5.5, greixos_per_100g: 11.0 },
];

export const PRODUCTS_MAP = new Map<string, Product>(
  PRODUCTS_LIST.map((p) => [p.nom, p])
);

export const FARINACIS = PRODUCTS_LIST.filter((p) => p.grup === 'Farinacis');
export const PROTEINES = PRODUCTS_LIST.filter((p) => p.grup === 'Proteïnes');
export const VERDURES = PRODUCTS_LIST.filter((p) => p.grup === 'Verdures');
export const GREIXOS = PRODUCTS_LIST.filter((p) => p.grup === 'Greixos');

export const INTERCANVIS = {
  Sheila: {
    calories: 1745,
    Dinar: { Farinacis: 3.0, Proteïnes: 4.0, Verdures: 2.0, Greixos: 3.0 },
    Sopar: { Farinacis: 2.0, Proteïnes: 5.0, Verdures: 2.0, Greixos: 3.0 },
  },
  Marc: {
    calories: 2275,
    Dinar: { Farinacis: 4.0, Proteïnes: 5.0, Verdures: 2.5, Greixos: 4.0 },
    Sopar: { Farinacis: 2.0, Proteïnes: 4.0, Verdures: 2.5, Greixos: 3.0 },
  },
};

export const DIES_SETMANA: DayOfWeek[] = [
  'Dilluns',
  'Dimarts',
  'Dimecres',
  'Dijous',
  'Divendres',
  'Dissabte',
  'Diumenge',
];

export interface MealThemeInfo {
  desc: string;
  preferits: {
    Farinacis?: string[];
    Proteïnes?: string[];
    Verdures?: string[];
    Greixos?: string[];
  };
}

export const GUIA_TEMATICA: Record<DayOfWeek, Record<MealType, MealThemeInfo>> = {
  Dilluns: {
    Dinar: {
      desc: 'Llegum o Proteïna vegetal en amanida',
      preferits: {
        Farinacis: ['Cigrons de pot Hacendado', 'Llenties de pot Hacendado', 'Mongetes blanques de pot', 'Edamame', 'Blat de moro dolç llauna Hacendado'],
        Proteïnes: ['Tofu ferm natural Hacendado', 'Tonyina clara al natural Hacendado', 'Ous'],
        Verdures: ['Tomàquet xerri', 'Bossa Canonges', 'Cogombre', 'Remolatxa cuita pelada'],
        Greixos: ['Tahini 100% sèsam Hacendado', 'Nous naturals', 'Oli d\'oliva verge extra'],
      },
    },
    Sopar: {
      desc: 'Sopar lleuger + Peix o Conserva',
      preferits: {
        Verdures: ['Gaspatxo Hacendado', 'Bossa Mesclum', 'Tomàquet amanida'],
        Proteïnes: ['Tonyina clara al natural Hacendado', 'Sardinetes en oli d\'oliva llauna Hacendado', 'Musclos al natural llauna'],
        Farinacis: ['Pa integral 100%', 'Fajitas integrals', 'Tortitas d\'arròs i blat de moro'],
        Greixos: ['Alvocat', 'Olives', 'Oli d\'oliva verge extra'],
      },
    },
  },
  Dimarts: {
    Dinar: {
      desc: 'Cereal cuinat en Batch Cooking (Arròs/Pasta/Cuscús/Gnocchi)',
      preferits: {
        Farinacis: ['Arròs basmati Hacendado', 'Arròs integral Hacendado', 'Pasta integral', 'Cuscús', 'Gnocchi de patata Hacendado'],
        Proteïnes: ['Tires de pollastre al forn Hacendado', 'Pit de pollastre', 'Bocados vegetals estil pollastre (Heura / Hacendado)'],
        Verdures: ['Xampinyons laminats frescos', 'Carbassó', 'Pebrot vermell/verd'],
      },
    },
    Sopar: {
      desc: 'Peix blanc o blau al forn/planxa',
      preferits: {
        Proteïnes: ['Filets d\'orada o llobarro congelats', 'Lloms de salmó congelat Hacendado', 'Lluç congelat', 'Bacallà congelat'],
        Verdures: ['Espàrrecs verds', 'Carbassó', 'Mongeta tendra rodona'],
        Farinacis: ['Patata', 'Pa integral 100%', 'Pèsols fins congelats Hacendado'],
        Greixos: ['Oli d\'oliva verge extra', 'Nous naturals'],
      },
    },
  },
  Dimecres: {
    Dinar: {
      desc: 'Llegum, Pèsols o Patata campera',
      preferits: {
        Farinacis: ['Patata', 'Pèsols fins congelats Hacendado', 'Mongetes blanques de pot', 'Cigrons de pot Hacendado'],
        Proteïnes: ['Tonyina clara al natural Hacendado', 'Bonítol del nord en conserva de vidre', 'Ous'],
        Verdures: ['Mongeta tendra rodona', 'Pastanaga', 'Ceba'],
      },
    },
    Sopar: {
      desc: "Dia de l'Ou o Remenat vegetal",
      preferits: {
        Proteïnes: ['Ous', 'Clares d\'ou pasteuritzades Hacendado', 'Tofu ferm natural Hacendado'],
        Verdures: ['Espinacs frescos', 'Xampinyons laminats frescos', 'Carbassó'],
        Farinacis: ['Pa integral 100%', 'Tortitas d\'arròs i blat de moro'],
        Greixos: ['Oli d\'oliva verge extra', 'Barreja de llavors (xia, carbassa, gira-sol)'],
      },
    },
  },
  Dijous: {
    Dinar: {
      desc: 'Cereal, Quinoa o Fideus amb Proteïna vegetal / Peix',
      preferits: {
        Farinacis: ['Quinoa', 'Fideus d\'arròs orientals', 'Cuscús', 'Arròs basmati Hacendado'],
        Proteïnes: ['Tofu ferm natural Hacendado', 'Salmó fumat', 'Lloms de salmó congelat Hacendado', 'Formatge Feta'],
        Verdures: ['Albergínia', 'Pebrot vermell/verd', 'Pastanaga'],
        Greixos: ['Crema de cacauet 100% Hacendado', 'Tahini 100% sèsam Hacendado', 'Anacards naturals'],
      },
    },
    Sopar: {
      desc: 'Farcits: Wraps, Fajitas o Bowls ràpids',
      preferits: {
        Farinacis: ['Fajitas integrals'],
        Proteïnes: ['Bocados vegetals estil pollastre (Heura / Hacendado)', 'Tires de pollastre al forn Hacendado', 'Tonyina clara al natural Hacendado'],
        Verdures: ['Bossa Ruca', 'Bossa Enciam iceberg', 'Pebrot vermell/verd', 'Tomàquet xerri'],
        Greixos: ['Guacamole Hacendado 95%', 'Alvocat', 'Hummus de cigrons Hacendado'],
      },
    },
  },
  Divendres: {
    Dinar: {
      desc: 'Carn magra o Seitan a la planxa + Guarnició',
      preferits: {
        Proteïnes: ['Pit de pollastre', 'Seitan fresc Hacendado', 'Llom de porc', 'Vedella magra'],
        Farinacis: ['Patata', 'Moniato', 'Arròs integral Hacendado'],
        Verdures: ['Espàrrecs verds', 'Pastanaga', 'Cors de carxofa en conserva Hacendado'],
      },
    },
    Sopar: {
      desc: 'Sopar ràpid de torrades completes o pizza saludable',
      preferits: {
        Farinacis: ['Pa integral 100%', 'Fajitas integrals'],
        Proteïnes: ['Pernil salat ibèric', 'Formatge fresc Burgos Hacendado', 'Formatge cottage Hacendado', 'Sardinetes en oli d\'oliva llauna Hacendado'],
        Verdures: ['Tomàquet amanida', 'Albergínia', 'Bossa Canonges'],
        Greixos: ['Oli d\'oliva verge extra', 'Formatge d\'untar lleuger Hacendado'],
      },
    },
  },
  Dissabte: {
    Dinar: {
      desc: 'Plat Únic complet / Arrossos o Guisats',
      preferits: {
        Farinacis: ['Arròs basmati Hacendado', 'Arròs integral Hacendado', 'Quinoa'],
        Proteïnes: ['Vedella magra', 'Llagostins cuits congelats', 'Calamars a rodanxes congelats', 'Soja texturitzada fina Hacendado'],
        Verdures: ['Pebrot vermell/verd', 'Ceba', 'Porro', 'Xampinyons laminats frescos'],
      },
    },
    Sopar: {
      desc: 'Pica-pica sa: Marisc, Pop, Hummus i dips',
      preferits: {
        Proteïnes: ['Pop cuit a rodanxes Hacendado', 'Llagostins cuits congelats', 'Musclos al natural llauna', 'Bonítol del nord en conserva de vidre'],
        Farinacis: ['Fajitas integrals', 'Pa integral 100%', 'Tortitas d\'arròs i blat de moro'],
        Greixos: ['Hummus de cigrons Hacendado', 'Alvocat', 'Olives', 'Pistatxos naturals torrats'],
        Verdures: ['Cogombre', 'Tomàquet xerri', 'Pastanaga'],
      },
    },
  },
  Diumenge: {
    Dinar: {
      desc: 'Plat especial de diumenge: Salmó, Peix al forn o Gnocchi',
      preferits: {
        Farinacis: ['Gnocchi de patata Hacendado', 'Arròs integral Hacendado', 'Cuscús'],
        Proteïnes: ['Lloms de salmó congelat Hacendado', 'Filets d\'orada o llobarro congelats', 'Pit de pollastre', 'Tempeh de soja'],
        Verdures: ['Carbassa a daus / fresca', 'Espàrrecs verds', 'Carbassó'],
        Greixos: ['Ametlles naturals', 'Anacards naturals', 'Oli d\'oliva verge extra'],
      },
    },
    Sopar: {
      desc: 'Bikinis integrals, Sandwich vegetal o Crema de verdures',
      preferits: {
        Farinacis: ['Pa integral 100%'],
        Proteïnes: ['Gall dindi embotit >85%', 'Formatge fresc Burgos Hacendado', 'Formatge cottage Hacendado'],
        Verdures: ['Gaspatxo Hacendado', 'Bossa Mesclum', 'Tomàquet xerri'],
        Greixos: ['Oli d\'oliva verge extra', 'Crema de cacauet 100% Hacendado'],
      },
    },
  },
};

export const INITIAL_FAVORITES: FavoriteMeal[] = [
  {
    id: 'fav-1',
    nom: 'Amanida fresca de cigrons i tonyina',
    categoria: 'llegums-amanides',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80',
    desc: 'Cigrons amb tonyina al natural, tomàquet xerri, canonges i alvocat',
    farinaci: 'Cigrons de pot Hacendado',
    proteines: ['Tonyina clara al natural Hacendado', 'Ous'],
    verdures: ['Tomàquet xerri', 'Bossa Canonges'],
    greix: 'Alvocat',
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'fav-2',
    nom: 'Lloms de salmó al forn amb carbassa i espinacs',
    categoria: 'peix-marisc',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=700&q=80',
    desc: 'Salmó sucós al forn acompanyat de carbassa rostida i espinacs frescos',
    farinaci: 'Moniato',
    proteines: ['Lloms de salmó congelat Hacendado'],
    verdures: ['Carbassa a daus / fresca', 'Espinacs frescos'],
    greix: 'Nous naturals',
    createdAt: Date.now() - 5400000,
  },
  {
    id: 'fav-3',
    nom: 'Fajita ràpida de pollastre i guacamole',
    categoria: 'wraps-sopars-rapids',
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=700&q=80',
    desc: 'Fajita integral amb tires de pollastre, ruca, pebrot i guacamole 95%',
    farinaci: 'Fajitas integrals',
    proteines: ['Tires de pollastre al forn Hacendado'],
    verdures: ['Bossa Ruca', 'Pebrot vermell/verd'],
    greix: 'Guacamole Hacendado 95%',
    createdAt: Date.now() - 7200000,
  },
  {
    id: 'fav-4',
    nom: 'Bowl d\'arròs basmati amb tofu i edamame',
    categoria: 'vegetal-vegan',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-d7f457ffad0c?auto=format&fit=crop&w=700&q=80',
    desc: 'Arròs aromàtic amb daus de tofu marcat, edamame, cogombre i salsa de sèsam tahini',
    farinaci: 'Arròs basmati Hacendado',
    proteines: ['Tofu ferm natural Hacendado', 'Edamame'],
    verdures: ['Cogombre', 'Tomàquet xerri'],
    greix: 'Tahini 100% sèsam Hacendado',
    createdAt: Date.now() - 9000000,
  },
  {
    id: 'fav-5',
    nom: 'Poke bowl casolà de salmó i formatge feta',
    categoria: 'arrossos-pasta',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80',
    desc: 'Arròs integral amb salmó fumat, feta, cogombre i ametlles',
    farinaci: 'Arròs integral Hacendado',
    proteines: ['Salmó fumat', 'Formatge Feta'],
    verdures: ['Cogombre', 'Tomàquet xerri'],
    greix: 'Ametlles naturals',
    createdAt: Date.now() - 10800000,
  },
  {
    id: 'fav-6',
    nom: 'Bikini integral gourmet amb formatge fresc i gaspatxo',
    categoria: 'wraps-sopars-rapids',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=700&q=80',
    desc: 'Pa integral 100% amb gall dindi, formatge fresc i gaspatxo d\'acompanyament',
    farinaci: 'Pa integral 100%',
    proteines: ['Gall dindi embotit >85%', 'Formatge fresc Burgos Hacendado'],
    verdures: ['Gaspatxo Hacendado', 'Bossa Mesclum'],
    greix: "Oli d'oliva verge extra",
    createdAt: Date.now() - 14400000,
  },
];

export function generateSingleMeal(
  day: DayOfWeek,
  mealType: MealType,
  favoritesList: FavoriteMeal[] = [],
  preferFavorites = false,
  season = getCurrentSeason()
): MealConfig {
  // If preference to favorites is active and we have favorites matching
  if (preferFavorites && favoritesList.length > 0 && Math.random() < 0.45) {
    // Si no és estiu, evitar recomanar favorits que tinguin gaspatxo a l'octubre/tardor/hivern
    const filteredFavs = season === 'Estiu'
      ? favoritesList
      : favoritesList.filter((f) => !f.verdures.includes('Gaspatxo Hacendado'));

    if (filteredFavs.length > 0) {
      const fav = filteredFavs[Math.floor(Math.random() * filteredFavs.length)];
      return {
        farinaci: fav.farinaci,
        proteines: [...fav.proteines],
        verdures: [...fav.verdures],
        greix: fav.greix,
        locked: false,
        isFavorite: true,
      };
    }
  }

  const theme = GUIA_TEMATICA[day][mealType];
  const prefs = theme.preferits;

  // Farinaci
  let farinaci = FARINACIS[0].nom;
  if (prefs.Farinacis && prefs.Farinacis.length > 0) {
    farinaci = prefs.Farinacis[Math.floor(Math.random() * prefs.Farinacis.length)];
  } else {
    farinaci = FARINACIS[Math.floor(Math.random() * FARINACIS.length)].nom;
  }

  // Proteïnes (1 o 2)
  const numProts = Math.random() < 0.65 ? 2 : 1;
  let proteines: string[] = [];
  if (prefs.Proteïnes && prefs.Proteïnes.length > 0) {
    proteines.push(prefs.Proteïnes[Math.floor(Math.random() * prefs.Proteïnes.length)]);
    if (numProts === 2) {
      const remaining = PROTEINES.filter((p) => p.nom !== proteines[0]);
      proteines.push(remaining[Math.floor(Math.random() * remaining.length)].nom);
    }
  } else {
    const shuffled = [...PROTEINES].sort(() => 0.5 - Math.random());
    proteines = shuffled.slice(0, numProts).map((p) => p.nom);
  }

  // Verdures (1 o 2) - Regla de temporada a Catalunya: Gaspatxo només a l'estiu!
  const availableVerdures = season === 'Estiu'
    ? VERDURES
    : VERDURES.filter((v) => v.nom !== 'Gaspatxo Hacendado');

  const prefVerdures = prefs.Verdures && prefs.Verdures.length > 0
    ? (season === 'Estiu' ? prefs.Verdures : prefs.Verdures.filter((v) => v !== 'Gaspatxo Hacendado'))
    : [];

  const numVerds = Math.random() < 0.7 ? 2 : 1;
  let verdures: string[] = [];
  if (prefVerdures.length > 0) {
    verdures.push(prefVerdures[Math.floor(Math.random() * prefVerdures.length)]);
    if (numVerds === 2) {
      const remaining = availableVerdures.filter((v) => v.nom !== verdures[0]);
      verdures.push(remaining[Math.floor(Math.random() * remaining.length)].nom);
    }
  } else {
    const shuffled = [...availableVerdures].sort(() => 0.5 - Math.random());
    verdures = shuffled.slice(0, numVerds).map((v) => v.nom);
  }

  // Greix
  let greix = GREIXOS[0].nom;
  if (prefs.Greixos && prefs.Greixos.length > 0) {
    greix = prefs.Greixos[Math.floor(Math.random() * prefs.Greixos.length)];
  } else {
    greix = GREIXOS[Math.floor(Math.random() * GREIXOS.length)].nom;
  }

  return {
    farinaci,
    proteines,
    verdures,
    greix,
    locked: false,
    isFavorite: false,
  };
}

export function generateInitialWeeklyMenu(
  favoritesList: FavoriteMeal[] = [],
  preferFavorites = false,
  season = getCurrentSeason()
): WeeklyMenuState {
  const menu = {} as WeeklyMenuState;
  for (const day of DIES_SETMANA) {
    menu[day] = {
      Dinar: generateSingleMeal(day, 'Dinar', favoritesList, preferFavorites, season),
      Sopar: generateSingleMeal(day, 'Sopar', favoritesList, preferFavorites, season),
    };
  }
  return menu;
}
