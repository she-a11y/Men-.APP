import React, { useState, useMemo } from 'react';
import {
  Lock,
  Unlock,
  RotateCw,
  Check,
  Star,
  Flame,
  User,
  Users,
} from 'lucide-react';
import { MealConfig, DayOfWeek, MealType, FavoriteMeal, Product } from '../types';
import {
  FARINACIS,
  PROTEINES,
  VERDURES,
  GREIXOS,
  PRODUCTS_MAP,
  INTERCANVIS,
  GUIA_TEMATICA,
  generateSingleMeal,
} from '../data/products';
import { calculateMealNutrition } from '../utils/nutrition';
import { IntercanvisConfig } from '../utils/productStorage';
import { getDishShortTitle, getDishImage, getDishCategory } from '../utils/dishVisuals';

interface MealCardProps {
  day: DayOfWeek;
  mealType: MealType;
  meal: MealConfig;
  onUpdate: (updated: MealConfig) => void;
  onSaveFavorite?: (fav: Omit<FavoriteMeal, 'id' | 'createdAt'>) => void;
  isFavorite?: boolean;
  products?: Product[];
  intercanvis?: IntercanvisConfig;
}

export const MealCard: React.FC<MealCardProps> = ({
  day,
  mealType,
  meal,
  onUpdate,
  onSaveFavorite,
  isFavorite = false,
  products,
  intercanvis,
}) => {
  const theme = GUIA_TEMATICA[day][mealType];
  const activeFav = meal.isFavorite || isFavorite;

  // Estat per triar la perspectiva de visualització de les etiquetes de macronutrients:
  // 'both' (mostra Sheila | Marc), 'sheila' o 'marc'
  const [macroView, setMacroView] = useState<'both' | 'sheila' | 'marc'>('both');

  // Mapa de productes actualitzat amb qualsevol aliment personalitzat
  const productsMap = useMemo(() => {
    if (!products || products.length === 0) return PRODUCTS_MAP;
    const map = new Map<string, Product>();
    for (const p of products) {
      map.set(p.nom, p);
    }
    return map;
  }, [products]);

  // Llistes d'aliments reactives segons els productes afegits o modificats
  const farinacisList = useMemo(
    () => (products && products.length > 0 ? products.filter((p) => p.grup === 'Farinacis') : FARINACIS),
    [products]
  );
  const proteinesList = useMemo(
    () => (products && products.length > 0 ? products.filter((p) => p.grup === 'Proteïnes') : PROTEINES),
    [products]
  );
  const verduresList = useMemo(
    () => (products && products.length > 0 ? products.filter((p) => p.grup === 'Verdures') : VERDURES),
    [products]
  );
  const greixosList = useMemo(
    () => (products && products.length > 0 ? products.filter((p) => p.grup === 'Greixos') : GREIXOS),
    [products]
  );

  // Càlcul reactiu de nutrients segons pautes actuals i aliments seleccionats
  const nutrition = useMemo(
    () => calculateMealNutrition(meal, mealType, intercanvis, productsMap),
    [meal, mealType, intercanvis, productsMap]
  );

  // Càlcul de proporció de macronutrients per a la barra visual
  const macroRatio = useMemo(() => {
    const s = nutrition.sheila;
    const calFromProt = s.proteines * 4;
    const calFromCarbs = s.carbs * 4;
    const calFromFat = s.greixos * 9;
    const sum = calFromProt + calFromCarbs + calFromFat || 1;
    return {
      protPct: Math.round((calFromProt / sum) * 100),
      carbsPct: Math.round((calFromCarbs / sum) * 100),
      fatPct: Math.round((calFromFat / sum) * 100),
    };
  }, [nutrition]);

  const handleToggleLock = () => {
    onUpdate({ ...meal, locked: !meal.locked });
  };

  const handleRegenerate = () => {
    const fresh = generateSingleMeal(day, mealType);
    onUpdate({ ...fresh, locked: false });
  };

  const handleToggleFavorite = () => {
    const nextState = !meal.isFavorite;
    onUpdate({ ...meal, isFavorite: nextState });

    if (nextState && onSaveFavorite) {
      const shortTitle = getDishShortTitle(meal);
      const dishImg = getDishImage(meal);
      const categoryInfo = getDishCategory(meal);

      onSaveFavorite({
        nom: shortTitle,
        desc: `${meal.farinaci} amb ${meal.proteines.join(' i ')}, ${meal.verdures.join(' i ')} i ${meal.greix}`,
        categoria: categoryInfo.id,
        imageUrl: dishImg,
        farinaci: meal.farinaci,
        proteines: [...meal.proteines],
        verdures: [...meal.verdures],
        greix: meal.greix,
      });
    }
  };

  const handleSelectFarinaci = (nom: string) => {
    onUpdate({ ...meal, farinaci: nom });
  };

  const handleToggleProtein = (nom: string) => {
    let next = [...meal.proteines];
    if (next.includes(nom)) {
      if (next.length > 1) {
        next = next.filter((p) => p !== nom);
      }
    } else {
      if (next.length >= 2) {
        next = [next[0], nom];
      } else {
        next.push(nom);
      }
    }
    onUpdate({ ...meal, proteines: next });
  };

  const handleToggleVerdura = (nom: string) => {
    let next = [...meal.verdures];
    if (next.includes(nom)) {
      if (next.length > 1) {
        next = next.filter((v) => v !== nom);
      }
    } else {
      if (next.length >= 2) {
        next = [next[0], nom];
      } else {
        next.push(nom);
      }
    }
    onUpdate({ ...meal, verdures: next });
  };

  const handleSelectGreix = (nom: string) => {
    onUpdate({ ...meal, greix: nom });
  };

  // Helper format gramatges reactiu amb pautes de nutricionista
  const formatQuantity = (
    user: 'Sheila' | 'Marc',
    category: 'Farinacis' | 'Proteïnes' | 'Verdures' | 'Greixos',
    itemNom: string,
    divider: number
  ) => {
    const p = productsMap.get(itemNom);
    if (!p) return '-';
    const config = intercanvis || INTERCANVIS;
    const rawEx = config[user][mealType][category];
    const userEx = rawEx / divider;
    const amount = userEx * p.racio_g;
    if (p.unitat === 'unitat') {
      return `${amount % 1 === 0 ? amount : amount.toFixed(1)} u`;
    }
    return `${Math.round(amount)}${p.unitat}`;
  };

  const shFar = formatQuantity('Sheila', 'Farinacis', meal.farinaci, 1);
  const mcFar = formatQuantity('Marc', 'Farinacis', meal.farinaci, 1);

  const shProts = meal.proteines.map((p) => `${p.split(' ')[0]}: ${formatQuantity('Sheila', 'Proteïnes', p, meal.proteines.length)}`).join(' + ');
  const mcProts = meal.proteines.map((p) => `${p.split(' ')[0]}: ${formatQuantity('Marc', 'Proteïnes', p, meal.proteines.length)}`).join(' + ');

  const shVerds = meal.verdures.map((v) => `${v.split(' ')[0]}: ${formatQuantity('Sheila', 'Verdures', v, meal.verdures.length)}`).join(' + ');
  const mcVerds = meal.verdures.map((v) => `${v.split(' ')[0]}: ${formatQuantity('Marc', 'Verdures', v, meal.verdures.length)}`).join(' + ');

  const shGreix = formatQuantity('Sheila', 'Greixos', meal.greix, 1);
  const mcGreix = formatQuantity('Marc', 'Greixos', meal.greix, 1);

  return (
    <div
      className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between ${
        meal.locked
          ? 'border-amber-300 ring-1 ring-amber-200'
          : activeFav
          ? 'border-amber-300/80 bg-amber-50/10'
          : 'border-slate-200 hover:border-emerald-300'
      }`}
    >
      <div>
        {/* Top Header: Meal Badge + Quick Actions */}
        <div className="p-3.5 pb-2.5 flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span>{mealType === 'Dinar' ? '☀️' : '🌙'}</span>
              <span>{mealType}</span>
            </span>

            <span className="text-xs text-slate-500 font-medium">
              {theme.desc}
            </span>

            {meal.locked && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                <Lock className="w-2.5 h-2.5 text-amber-700" />
                Fixat
              </span>
            )}

            {activeFav && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100/90 text-amber-900 border border-amber-300">
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-600" />
                Favorit
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleToggleFavorite}
              className={`p-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                activeFav
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-amber-600 hover:bg-amber-50'
              }`}
              title={activeFav ? 'Desmarcar de favorits' : 'Guardar com a favorit'}
            >
              <Star className={`w-3.5 h-3.5 ${activeFav ? 'fill-amber-500 text-amber-600' : ''}`} />
            </button>

            <button
              onClick={handleToggleLock}
              className={`p-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                meal.locked
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title={meal.locked ? 'Desbloquejar àpat' : 'Bloquejar àpat (evita canvis en regenerar)'}
            >
              {meal.locked ? <Lock className="w-3.5 h-3.5 text-amber-700" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleRegenerate}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-xs font-medium transition-colors cursor-pointer"
              title="Regenerar només aquest àpat"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ETIQUETES DE MACRONUTRIENTS AMB CODI DE COLORS (Lectura visual ràpida) */}
        <div className="px-3.5 pt-2.5 pb-2 bg-gradient-to-b from-slate-50/50 to-white border-b border-slate-100">
          <div className="flex items-center justify-between gap-1.5 mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              Perfil Nutricional
            </span>

            {/* Selector de perspectiva (Sheila / Marc / Ambdós) */}
            <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-md text-[10px] font-medium text-slate-600">
              <button
                type="button"
                onClick={() => setMacroView('both')}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer flex items-center gap-0.5 ${
                  macroView === 'both' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'hover:text-slate-900'
                }`}
                title="Veure dades de Sheila i Marc"
              >
                <Users className="w-2.5 h-2.5" />
                <span>Parella</span>
              </button>
              <button
                type="button"
                onClick={() => setMacroView('sheila')}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer flex items-center gap-0.5 ${
                  macroView === 'sheila' ? 'bg-white text-emerald-800 font-bold shadow-2xs' : 'hover:text-slate-900'
                }`}
                title="Veure només Sheila"
              >
                <User className="w-2.5 h-2.5 text-emerald-600" />
                <span>Sheila</span>
              </button>
              <button
                type="button"
                onClick={() => setMacroView('marc')}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer flex items-center gap-0.5 ${
                  macroView === 'marc' ? 'bg-white text-teal-800 font-bold shadow-2xs' : 'hover:text-slate-900'
                }`}
                title="Veure només Marc"
              >
                <User className="w-2.5 h-2.5 text-teal-600" />
                <span>Marc</span>
              </button>
            </div>
          </div>

          {/* Barra d'etiquetes petites amb codi de colors */}
          <div className="grid grid-cols-4 gap-1.5 text-center">
            {/* 1. PROTEÏNES (Coral / Rosa) */}
            <div
              className="px-1.5 py-1 rounded-lg bg-rose-50 border border-rose-200/90 text-rose-900 transition-all hover:bg-rose-100/60"
              title="Proteïnes (en grams)"
            >
              <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-rose-700 uppercase tracking-tight">
                <span>🍗</span>
                <span>Prot</span>
              </div>
              <div className="font-extrabold text-xs text-rose-950 mt-0.5 leading-none">
                {macroView === 'both' ? (
                  <span>
                    {nutrition.sheila.proteines}g <span className="text-[10px] text-rose-600/80 font-normal">/ {nutrition.marc.proteines}g</span>
                  </span>
                ) : macroView === 'sheila' ? (
                  <span>{nutrition.sheila.proteines}g</span>
                ) : (
                  <span>{nutrition.marc.proteines}g</span>
                )}
              </div>
            </div>

            {/* 2. HIDRATS DE CARBONI (Ambre / Daurat) */}
            <div
              className="px-1.5 py-1 rounded-lg bg-amber-50 border border-amber-200/90 text-amber-900 transition-all hover:bg-amber-100/60"
              title="Hidrats de carboni (en grams)"
            >
              <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-amber-700 uppercase tracking-tight">
                <span>🍞</span>
                <span>Carbs</span>
              </div>
              <div className="font-extrabold text-xs text-amber-950 mt-0.5 leading-none">
                {macroView === 'both' ? (
                  <span>
                    {nutrition.sheila.carbs}g <span className="text-[10px] text-amber-600/80 font-normal">/ {nutrition.marc.carbs}g</span>
                  </span>
                ) : macroView === 'sheila' ? (
                  <span>{nutrition.sheila.carbs}g</span>
                ) : (
                  <span>{nutrition.marc.carbs}g</span>
                )}
              </div>
            </div>

            {/* 3. GREIXOS SALUDABLES (Maragda / Menta) */}
            <div
              className="px-1.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/90 text-emerald-900 transition-all hover:bg-emerald-100/60"
              title="Greixos saludables (en grams)"
            >
              <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-700 uppercase tracking-tight">
                <span>🥑</span>
                <span>Greix</span>
              </div>
              <div className="font-extrabold text-xs text-emerald-950 mt-0.5 leading-none">
                {macroView === 'both' ? (
                  <span>
                    {nutrition.sheila.greixos}g <span className="text-[10px] text-emerald-600/80 font-normal">/ {nutrition.marc.greixos}g</span>
                  </span>
                ) : macroView === 'sheila' ? (
                  <span>{nutrition.sheila.greixos}g</span>
                ) : (
                  <span>{nutrition.marc.greixos}g</span>
                )}
              </div>
            </div>

            {/* 4. CALORIES TOTALS (Gris pissarra amb icona de flama) */}
            <div
              className="px-1.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 transition-all hover:bg-slate-200/60"
              title="Calories totals estimades"
            >
              <div className="flex items-center justify-center gap-0.5 text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                <Flame className="w-2.5 h-2.5 text-amber-600 fill-amber-500" />
                <span>Kcal</span>
              </div>
              <div className="font-extrabold text-xs text-slate-900 mt-0.5 leading-none">
                {macroView === 'both' ? (
                  <span>
                    {nutrition.sheila.calories} <span className="text-[10px] text-slate-500 font-normal">/ {nutrition.marc.calories}</span>
                  </span>
                ) : macroView === 'sheila' ? (
                  <span>{nutrition.sheila.calories}</span>
                ) : (
                  <span>{nutrition.marc.calories}</span>
                )}
              </div>
            </div>
          </div>

          {/* Mini indicador visual de perfil calòric (% proteïnes / hidrats / greixos) */}
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden flex bg-slate-200">
              <div
                style={{ width: `${macroRatio.protPct}%` }}
                className="bg-rose-500 h-full"
                title={`Proteïna: ${macroRatio.protPct}% de les calories`}
              />
              <div
                style={{ width: `${macroRatio.carbsPct}%` }}
                className="bg-amber-500 h-full"
                title={`Carbohidrats: ${macroRatio.carbsPct}% de les calories`}
              />
              <div
                style={{ width: `${macroRatio.fatPct}%` }}
                className="bg-emerald-500 h-full"
                title={`Greixos: ${macroRatio.fatPct}% de les calories`}
              />
            </div>
            <span className="shrink-0 text-[9px] font-mono text-slate-400">
              {macroRatio.protPct}%P · {macroRatio.carbsPct}%C · {macroRatio.fatPct}%G
            </span>
          </div>
        </div>

        {/* Direct Ingredients Selectors */}
        <div className="p-3.5 space-y-3">
          {/* Farinaci */}
          <div className="border-l-2 border-amber-400 pl-2">
            <label className="block font-semibold text-slate-800 text-xs mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1 text-amber-900">
                <span>🍞</span> Farinaci (1)
              </span>
              <span className="text-[10px] font-normal text-slate-400">Font d&apos;energia</span>
            </label>
            <select
              value={meal.farinaci}
              onChange={(e) => handleSelectFarinaci(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs font-medium focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
            >
              {farinacisList.map((f) => (
                <option key={f.nom} value={f.nom}>
                  {f.nom} ({f.racio_g}{f.unitat}/r) · {f.calories_per_100g} kcal/100g
                </option>
              ))}
            </select>
          </div>

          {/* Proteïnes (Fins a 2) */}
          <div className="border-l-2 border-rose-400 pl-2">
            <label className="block font-semibold text-slate-800 text-xs mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1 text-rose-900">
                <span>🍗</span> Proteïnes (tria 1 o 2)
              </span>
              <span className="text-[10px] font-normal text-slate-400">Recuperació i sacietat</span>
            </label>
            <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto p-1.5 bg-slate-50 border border-slate-200 rounded-lg">
              {proteinesList.map((p) => {
                const selected = meal.proteines.includes(p.nom);
                return (
                  <button
                    key={p.nom}
                    type="button"
                    onClick={() => handleToggleProtein(p.nom)}
                    className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
                      selected
                        ? 'bg-rose-600 text-white shadow-2xs font-semibold'
                        : 'bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-900 border border-slate-200'
                    }`}
                  >
                    {selected && <Check className="w-2.5 h-2.5" />}
                    {p.nom}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Verdures (Fins a 2) */}
          <div className="border-l-2 border-emerald-400 pl-2">
            <label className="block font-semibold text-slate-800 text-xs mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1 text-emerald-900">
                <span>🥬</span> Verdures (tria 1 o 2)
              </span>
              <span className="text-[10px] font-normal text-slate-400">Fibra i micronutrients</span>
            </label>
            <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto p-1.5 bg-slate-50 border border-slate-200 rounded-lg">
              {verduresList.map((v) => {
                const selected = meal.verdures.includes(v.nom);
                return (
                  <button
                    key={v.nom}
                    type="button"
                    onClick={() => handleToggleVerdura(v.nom)}
                    className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
                      selected
                        ? 'bg-emerald-600 text-white shadow-2xs font-semibold'
                        : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200'
                    }`}
                  >
                    {selected && <Check className="w-2.5 h-2.5" />}
                    {v.nom}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Greix */}
          <div className="border-l-2 border-teal-400 pl-2">
            <label className="block font-semibold text-slate-800 text-xs mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1 text-teal-900">
                <span>🥑</span> Greix saludable (1)
              </span>
              <span className="text-[10px] font-normal text-slate-400">Absorció de vitamines</span>
            </label>
            <select
              value={meal.greix}
              onChange={(e) => handleSelectGreix(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs font-medium focus:ring-1 focus:ring-teal-500 focus:border-teal-500 outline-hidden"
            >
              {greixosList.map((g) => (
                <option key={g.nom} value={g.nom}>
                  {g.nom} ({g.racio_g}{g.unitat}/r)
                </option>
              ))}
            </select>
          </div>

          {/* Gramatges exactes per a Sheila i Marc amb pautes nutricionals sincronitzades */}
          <div className="pt-2 border-t border-slate-200 space-y-2 text-[11px]">
            <div className="bg-emerald-50 text-emerald-950 p-2.5 rounded-lg border border-emerald-200/60">
              <div className="font-bold flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-emerald-700" />
                  👩 Sheila ({nutrition.sheila.calories} kcal):
                </span>
                <span className="text-[10px] text-emerald-800 font-mono">
                  P:{nutrition.sheila.proteines}g | C:{nutrition.sheila.carbs}g | G:{nutrition.sheila.greixos}g
                </span>
              </div>
              <div className="mt-1 text-slate-700">
                <b>🍞</b> {shFar} | <b>🍗</b> {shProts} | <b>🥬</b> {shVerds} | <b>🥑</b> {shGreix}
              </div>
            </div>

            <div className="bg-teal-50 text-teal-950 p-2.5 rounded-lg border border-teal-200/60">
              <div className="font-bold flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-teal-700" />
                  👨 Marc ({nutrition.marc.calories} kcal):
                </span>
                <span className="text-[10px] text-teal-800 font-mono">
                  P:{nutrition.marc.proteines}g | C:{nutrition.marc.carbs}g | G:{nutrition.marc.greixos}g
                </span>
              </div>
              <div className="mt-1 text-slate-700">
                <b>🍞</b> {mcFar} | <b>🍗</b> {mcProts} | <b>🥬</b> {mcVerds} | <b>🥑</b> {mcGreix}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
