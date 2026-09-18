import {
  MealConfig,
  MealType,
  NutritionBreakdown,
  MealNutrition,
  WeeklyMenuState,
  DayOfWeek,
  Product,
} from '../types';
import { PRODUCTS_MAP, INTERCANVIS, DIES_SETMANA } from '../data/products';
import { IntercanvisConfig } from './productStorage';

export function calculateItemNutrition(
  nom: string,
  userExchanges: number,
  customProductsMap?: Map<string, Product>
): NutritionBreakdown {
  const map = customProductsMap || PRODUCTS_MAP;
  const p = map.get(nom);
  if (!p) {
    return { calories: 0, proteines: 0, carbs: 0, greixos: 0 };
  }

  const rawAmount = userExchanges * p.racio_g;
  // If unit is 'unitat' (e.g. Ous), 1 egg weighs ~55g for macro calculation
  const gramsEquivalent = p.unitat === 'unitat' ? rawAmount * 55 : rawAmount;
  const factor = gramsEquivalent / 100;

  return {
    calories: Math.round(p.calories_per_100g * factor),
    proteines: Math.round(p.proteines_per_100g * factor * 10) / 10,
    carbs: Math.round(p.carbs_per_100g * factor * 10) / 10,
    greixos: Math.round(p.greixos_per_100g * factor * 10) / 10,
  };
}

export function calculateMealNutrition(
  meal: MealConfig,
  mealType: MealType,
  customIntercanvis?: IntercanvisConfig,
  customProductsMap?: Map<string, Product>
): MealNutrition {
  const config = customIntercanvis || INTERCANVIS;
  const map = customProductsMap || PRODUCTS_MAP;

  const calcForUser = (user: 'Sheila' | 'Marc'): NutritionBreakdown => {
    let totalKcal = 0;
    let totalProt = 0;
    let totalCarbs = 0;
    let totalGreix = 0;

    const addNutrients = (nb: NutritionBreakdown) => {
      totalKcal += nb.calories;
      totalProt += nb.proteines;
      totalCarbs += nb.carbs;
      totalGreix += nb.greixos;
    };

    // 1. Farinaci
    if (meal.farinaci) {
      const ex = config[user][mealType].Farinacis;
      addNutrients(calculateItemNutrition(meal.farinaci, ex, map));
    }

    // 2. Proteïnes (split among chosen)
    if (meal.proteines && meal.proteines.length > 0) {
      const div = meal.proteines.length;
      const ex = config[user][mealType].Proteïnes / div;
      for (const prot of meal.proteines) {
        addNutrients(calculateItemNutrition(prot, ex, map));
      }
    }

    // 3. Verdures (split among chosen)
    if (meal.verdures && meal.verdures.length > 0) {
      const div = meal.verdures.length;
      const ex = config[user][mealType].Verdures / div;
      for (const verd of meal.verdures) {
        addNutrients(calculateItemNutrition(verd, ex, map));
      }
    }

    // 4. Greixos
    if (meal.greix) {
      const ex = config[user][mealType].Greixos;
      addNutrients(calculateItemNutrition(meal.greix, ex, map));
    }

    return {
      calories: Math.round(totalKcal),
      proteines: Math.round(totalProt * 10) / 10,
      carbs: Math.round(totalCarbs * 10) / 10,
      greixos: Math.round(totalGreix * 10) / 10,
    };
  };

  return {
    sheila: calcForUser('Sheila'),
    marc: calcForUser('Marc'),
  };
}

export interface WeeklyUserNutrition {
  total: NutritionBreakdown;
  dailyAvg: NutritionBreakdown;
  targetDailyCalories: number;
}

export function calculateWeeklyNutrition(menu: WeeklyMenuState): {
  sheila: WeeklyUserNutrition;
  marc: WeeklyUserNutrition;
} {
  const sumUser = (user: 'Sheila' | 'Marc'): WeeklyUserNutrition => {
    let totKcal = 0;
    let totProt = 0;
    let totCarbs = 0;
    let totGreix = 0;

    for (const day of DIES_SETMANA) {
      const dayMeals = menu[day];
      if (!dayMeals) continue;

      for (const mealType of ['Dinar', 'Sopar'] as MealType[]) {
        const meal = dayMeals[mealType];
        if (meal) {
          const nut = calculateMealNutrition(meal, mealType);
          totKcal += nut[user.toLowerCase() as 'sheila' | 'marc'].calories;
          totProt += nut[user.toLowerCase() as 'sheila' | 'marc'].proteines;
          totCarbs += nut[user.toLowerCase() as 'sheila' | 'marc'].carbs;
          totGreix += nut[user.toLowerCase() as 'sheila' | 'marc'].greixos;
        }
      }
    }

    return {
      total: {
        calories: Math.round(totKcal),
        proteines: Math.round(totProt),
        carbs: Math.round(totCarbs),
        greixos: Math.round(totGreix),
      },
      dailyAvg: {
        calories: Math.round(totKcal / 7),
        proteines: Math.round((totProt / 7) * 10) / 10,
        carbs: Math.round((totCarbs / 7) * 10) / 10,
        greixos: Math.round((totGreix / 7) * 10) / 10,
      },
      targetDailyCalories: INTERCANVIS[user].calories,
    };
  };

  return {
    sheila: sumUser('Sheila'),
    marc: sumUser('Marc'),
  };
}
