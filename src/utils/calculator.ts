import * as XLSX from 'xlsx';
import {
  WeeklyMenuState,
  ShoppingItem,
  DayOfWeek,
  MealType,
  GroupType,
} from '../types';
import {
  PRODUCTS_MAP,
  INTERCANVIS,
  DIES_SETMANA,
  GUIA_TEMATICA,
} from '../data/products';

export function calculateShoppingList(
  menu: WeeklyMenuState,
  rebost: Set<string>,
  customQuantities: Record<string, number> = {}
): ShoppingItem[] {
  const aggregated = new Map<string, number>();

  for (const day of DIES_SETMANA) {
    const dayMeals = menu[day];
    if (!dayMeals) continue;

    for (const mealType of ['Dinar', 'Sopar'] as MealType[]) {
      const meal = dayMeals[mealType];
      if (!meal) continue;

      // Farinaci (1)
      if (meal.farinaci) {
        const p = PRODUCTS_MAP.get(meal.farinaci);
        if (p) {
          const sh_ex = INTERCANVIS.Sheila[mealType].Farinacis;
          const mc_ex = INTERCANVIS.Marc[mealType].Farinacis;
          const needed = (sh_ex + mc_ex) * p.racio_g;
          aggregated.set(p.nom, (aggregated.get(p.nom) || 0) + needed);
        }
      }

      // Proteïnes (fins a 2)
      if (meal.proteines && meal.proteines.length > 0) {
        const div = meal.proteines.length;
        for (const protName of meal.proteines) {
          const p = PRODUCTS_MAP.get(protName);
          if (p) {
            const sh_ex = INTERCANVIS.Sheila[mealType].Proteïnes / div;
            const mc_ex = INTERCANVIS.Marc[mealType].Proteïnes / div;
            const needed = (sh_ex + mc_ex) * p.racio_g;
            aggregated.set(p.nom, (aggregated.get(p.nom) || 0) + needed);
          }
        }
      }

      // Verdures (fins a 2)
      if (meal.verdures && meal.verdures.length > 0) {
        const div = meal.verdures.length;
        for (const verdName of meal.verdures) {
          const p = PRODUCTS_MAP.get(verdName);
          if (p) {
            const sh_ex = INTERCANVIS.Sheila[mealType].Verdures / div;
            const mc_ex = INTERCANVIS.Marc[mealType].Verdures / div;
            const needed = (sh_ex + mc_ex) * p.racio_g;
            aggregated.set(p.nom, (aggregated.get(p.nom) || 0) + needed);
          }
        }
      }

      // Greix (1)
      if (meal.greix) {
        const p = PRODUCTS_MAP.get(meal.greix);
        if (p) {
          const sh_ex = INTERCANVIS.Sheila[mealType].Greixos;
          const mc_ex = INTERCANVIS.Marc[mealType].Greixos;
          const needed = (sh_ex + mc_ex) * p.racio_g;
          aggregated.set(p.nom, (aggregated.get(p.nom) || 0) + needed);
        }
      }
    }
  }

  const result: ShoppingItem[] = [];

  for (const [nom, totalNeeded] of aggregated.entries()) {
    const p = PRODUCTS_MAP.get(nom);
    if (!p) continue;

    const inPantry = rebost.has(nom);
    const calculatedPackages = inPantry ? 0 : Math.ceil(totalNeeded / p.format_compra);
    const isCustomPackages = nom in customQuantities;
    const packages = isCustomPackages
      ? Math.max(0, customQuantities[nom])
      : calculatedPackages;
    const preu_format = p.preu_format || 0;
    const total_preu = Math.round(packages * preu_format * 100) / 100;

    result.push({
      nom: p.nom,
      grup: p.grup as GroupType,
      seccio: p.seccio,
      totalNeeded: Math.round(totalNeeded * 10) / 10,
      unitat: p.unitat,
      format_compra: p.format_compra,
      format_unitat: p.format_unitat,
      packages,
      calculatedPackages,
      isCustomPackages,
      inPantry,
      preu_format,
      total_preu,
    });
  }

  // Ordenar per secció i nom
  return result.sort((a, b) => {
    if (a.seccio !== b.seccio) {
      return a.seccio.localeCompare(b.seccio);
    }
    return a.nom.localeCompare(b.nom);
  });
}

export function exportToExcel(menu: WeeklyMenuState, shoppingList: ShoppingItem[]) {
  const wb = XLSX.utils.book_new();

  // Pestanya 1: Menú Setmanal
  const menuData: Record<string, unknown>[] = [];
  for (const day of DIES_SETMANA) {
    for (const mealType of ['Dinar', 'Sopar'] as MealType[]) {
      const meal = menu[day][mealType];
      const desc = GUIA_TEMATICA[day][mealType].desc;
      menuData.push({
        Dia: day,
        Àpat: mealType,
        Temàtica: desc,
        Farinaci: meal.farinaci,
        Proteïnes: meal.proteines.join(' + '),
        Verdures: meal.verdures.join(' + '),
        Greix: meal.greix,
        Bloquejat: meal.locked ? 'Sí' : 'No',
      });
    }
  }
  const wsMenu = XLSX.utils.json_to_sheet(menuData);
  XLSX.utils.book_append_sheet(wb, wsMenu, 'Menú Setmanal');

  // Pestanya 2: Compra
  const shopData = shoppingList.map((item) => ({
    'Secció Supermercat': item.seccio,
    Producte: item.nom,
    Grup: item.grup,
    'Quantitat Neta Requerida': `${item.totalNeeded} ${item.unitat}`,
    'Format Venda Mercadona': `${item.format_compra} ${item.format_unitat}`,
    'Preu Format (€)': `${item.preu_format.toFixed(2)} €`,
    'Paquets a Comprar': item.packages,
    'Cost Total (€)': `${item.total_preu.toFixed(2)} €`,
    'Al Rebost': item.inPantry ? 'Sí (Descomptat)' : 'No',
  }));
  const wsShop = XLSX.utils.json_to_sheet(shopData);
  XLSX.utils.book_append_sheet(wb, wsShop, 'Compra');

  // Descarregar fitxer
  XLSX.writeFile(wb, 'Menu_Setmanal_i_Compra_Parella.xlsx');
}
