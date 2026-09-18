import React, { useState } from 'react';
import {
  Star,
  Plus,
  Trash2,
  CalendarPlus,
  Flame,
  Check,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  Utensils,
} from 'lucide-react';
import { FavoriteMeal, DayOfWeek, MealType, MealConfig } from '../types';
import { DIES_SETMANA } from '../data/products';
import { calculateMealNutrition } from '../utils/nutrition';
import {
  CATEGORIES_PLATS,
  DishCategoryInfo,
  getDishCategory,
  getDishShortTitle,
} from '../utils/dishVisuals';

interface FavoritesViewProps {
  favorites: FavoriteMeal[];
  onDeleteFavorite: (id: string) => void;
  onApplyFavoriteToMenu: (day: DayOfWeek, mealType: MealType, fav: FavoriteMeal) => void;
  onOpenCreateFavorite: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  onDeleteFavorite,
  onApplyFavoriteToMenu,
  onOpenCreateFavorite,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [expandedDishId, setExpandedDishId] = useState<string | null>(null);

  // Per aplicar al calendari
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Dilluns');
  const [selectedMealType, setSelectedMealType] = useState<MealType>('Dinar');
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  const handleApply = (fav: FavoriteMeal) => {
    onApplyFavoriteToMenu(selectedDay, selectedMealType, fav);
    setApplyingId(null);
    setAppliedNotification(`Aplicat a ${selectedDay} (${selectedMealType})!`);
    setTimeout(() => setAppliedNotification(null), 3500);
  };

  const toggleExpand = (id: string) => {
    setExpandedDishId(expandedDishId === id ? null : id);
  };

  // Filtrar favorits per cerca i categoria
  const filteredFavorites = favorites.filter((fav) => {
    const title = getDishShortTitle(fav).toLowerCase();
    const far = (fav.farinaci || '').toLowerCase();
    const prots = (fav.proteines || []).join(' ').toLowerCase();
    const verds = (fav.verdures || []).join(' ').toLowerCase();
    const desc = (fav.desc || '').toLowerCase();
    const q = search.toLowerCase();

    const matchesSearch =
      title.includes(q) || far.includes(q) || prots.includes(q) || verds.includes(q) || desc.includes(q);

    if (!matchesSearch) return false;

    if (selectedCategoryFilter === 'all') return true;

    const cat = getDishCategory(fav);
    return cat.id === selectedCategoryFilter;
  });

  // Agrupar els favorits per les temàtiques/categories
  const categorizedFavorites: { category: DishCategoryInfo; dishes: FavoriteMeal[] }[] = [];

  CATEGORIES_PLATS.forEach((cat) => {
    const dishes = filteredFavorites.filter((fav) => {
      const favCat = getDishCategory(fav);
      return favCat.id === cat.id;
    });
    if (dishes.length > 0) {
      categorizedFavorites.push({ category: cat, dishes });
    }
  });

  return (
    <div className="space-y-8">
      {/* Notificació d'èxit en aplicar */}
      {appliedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{appliedNotification}</span>
        </div>
      )}

      {/* Capçalera de la secció "Favorits" */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-2xl text-amber-800 shrink-0">
              <Star className="w-6 h-6 fill-amber-500 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Favorits
                </h1>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  {favorites.length} plats guardats
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                La teva col·lecció personal de plats preferits, categoritzats automàticament per temàtica amb fotos, ingredients i nutrició.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCreateFavorite}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Afegir nou plat favorit
          </button>
        </div>

        {/* Barra de cerca i filtres de categoria */}
        <div className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cercar per nom, ingredient o paraula clau..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-amber-500 outline-hidden"
              />
            </div>
          </div>

          {/* Filtres de categoria per xips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-colors cursor-pointer ${
                selectedCategoryFilter === 'all'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tots els favorits ({favorites.length})
            </button>
            {CATEGORIES_PLATS.map((cat) => {
              const count = favorites.filter((f) => getDishCategory(f).id === cat.id).length;
              if (count === 0 && selectedCategoryFilter !== cat.id) return null;
              const isSelected = selectedCategoryFilter === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.icona}</span>
                  <span>{cat.nom}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/30 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Llistat categoritzat */}
      {categorizedFavorites.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No s&apos;han trobat plats favorits</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            {search
              ? 'Cap plat favorit coincideix amb la teva cerca. Prova de canviar els termes.'
              : 'Encara no tens cap plat en aquesta categoria. Afegeix-ne un de nou o guarda els teus àpats preferits des del menú setmanal.'}
          </p>
          <button
            onClick={onOpenCreateFavorite}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            Afegir nou plat ara
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {categorizedFavorites.map(({ category, dishes }) => (
            <div key={category.id} className="space-y-4">
              {/* Apartat de la temàtica */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{category.icona}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        {category.nom}
                      </h2>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${category.colorBg} ${category.colorBorder} ${category.colorText}`}>
                        {dishes.length} {dishes.length === 1 ? 'plat' : 'plats'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 hidden sm:block">
                      {category.descripcio}
                    </p>
                  </div>
                </div>
              </div>

              {/* Graella de targetes netes sense imatges */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {dishes.map((fav) => {
                  const isExpanded = expandedDishId === fav.id;
                  const shortTitle = getDishShortTitle(fav);

                  // Crea un MealConfig sintètic per al càlcul nutricional
                  const mealConfig: MealConfig = {
                    farinaci: fav.farinaci,
                    proteines: fav.proteines,
                    verdures: fav.verdures,
                    greix: fav.greix,
                    locked: false,
                  };
                  const nutrition = calculateMealNutrition(mealConfig, 'Dinar');

                  return (
                    <div
                      key={fav.id}
                      className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-sm p-4 sm:p-5 ${
                        isExpanded
                          ? 'border-amber-400 ring-2 ring-amber-100'
                          : 'border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      <div>
                        {/* Capçalera del plat */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-xl">{category.icona}</span>
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 uppercase tracking-wider flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                                Favorit
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-slate-900 leading-snug">
                              {shortTitle}
                            </h3>
                          </div>

                          <button
                            onClick={() => {
                              if (window.confirm(`Segur que vols eliminar "${shortTitle}" de favorits?`)) {
                                onDeleteFavorite(fav.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                            title="Eliminar de favorits"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Resum net d'ingredients */}
                        <div className="space-y-1 py-2.5 border-y border-slate-100 text-xs">
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="text-slate-500 font-medium">🍞 Farinaci:</span>
                            <span className="font-semibold text-right truncate max-w-[65%]">{fav.farinaci}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="text-slate-500 font-medium">🍗 Proteïna:</span>
                            <span className="font-semibold text-right truncate max-w-[65%]">{fav.proteines.join(' + ')}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="text-slate-500 font-medium">🥬 Verdura:</span>
                            <span className="font-semibold text-right truncate max-w-[65%]">{fav.verdures.join(' + ')}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="text-slate-500 font-medium">🥑 Greix:</span>
                            <span className="font-semibold text-right truncate max-w-[65%]">{fav.greix}</span>
                          </div>
                        </div>

                        {/* Kcal bar */}
                        <div className="mt-3 flex items-center justify-between text-[11px] bg-amber-50/70 border border-amber-100 rounded-lg px-2.5 py-1.5 text-amber-950">
                          <span className="flex items-center gap-1 font-semibold">
                            <Flame className="w-3.5 h-3.5 text-amber-600" />
                            Sheila: <b>{nutrition.sheila.calories}</b> kcal
                          </span>
                          <span className="font-semibold text-teal-900">
                            Marc: <b>{nutrition.marc.calories}</b> kcal
                          </span>
                        </div>

                        {/* Desglòs detallat (Ingredients i Valor Nutricional) */}
                        {isExpanded && (
                          <div className="mt-3 p-3 border border-slate-200 rounded-xl space-y-3 bg-slate-50/80 animate-in fade-in duration-200 text-xs">
                            {fav.desc && (
                              <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-200">
                                &quot;{fav.desc}&quot;
                              </p>
                            )}

                            {/* Desglòs complet d'ingredients */}
                            <div className="space-y-1.5 text-xs">
                              <div className="font-bold text-slate-800 flex items-center gap-1">
                                <Utensils className="w-3.5 h-3.5 text-amber-600" />
                                <span>Ingredients del plat:</span>
                              </div>
                              <ul className="text-slate-700 space-y-1 pl-1 text-[11px]">
                                <li><b>🍞 Farinaci:</b> {fav.farinaci}</li>
                                <li><b>🍗 Proteïna:</b> {fav.proteines.join(' i ')}</li>
                                <li><b>🥬 Verdura:</b> {fav.verdures.join(' i ')}</li>
                                <li><b>🥑 Greix:</b> {fav.greix}</li>
                              </ul>
                            </div>

                            {/* Valor Nutricional Complet */}
                            <div className="space-y-2 pt-2 border-t border-slate-200">
                              <div className="font-bold text-slate-800 text-xs flex items-center gap-1">
                                <Info className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Valor nutricional calculat:</span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-[11px]">
                                <div className="bg-emerald-50 text-emerald-950 p-2.5 rounded-xl border border-emerald-100">
                                  <div className="font-bold">👩 Sheila ({nutrition.sheila.calories} kcal)</div>
                                  <div className="text-[10px] text-slate-600 mt-1 space-y-0.5">
                                    <div>Proteïnes: <b>{nutrition.sheila.proteines}g</b></div>
                                    <div>Carbohidrats: <b>{nutrition.sheila.carbs}g</b></div>
                                    <div>Greixos: <b>{nutrition.sheila.greixos}g</b></div>
                                  </div>
                                </div>

                                <div className="bg-teal-50 text-teal-950 p-2.5 rounded-xl border border-teal-100">
                                  <div className="font-bold">👨 Marc ({nutrition.marc.calories} kcal)</div>
                                  <div className="text-[10px] text-slate-600 mt-1 space-y-0.5">
                                    <div>Proteïnes: <b>{nutrition.marc.proteines}g</b></div>
                                    <div>Carbohidrats: <b>{nutrition.marc.carbs}g</b></div>
                                    <div>Greixos: <b>{nutrition.marc.greixos}g</b></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Botons d'acció: Expandir + Aplicar al calendari */}
                      <div className="p-3 border-t border-slate-100 bg-white space-y-2">
                        <button
                          onClick={() => toggleExpand(fav.id)}
                          className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-600 hover:text-amber-800 hover:bg-amber-50/70 border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-3.5 h-3.5 text-amber-600" />
                              <span>Amagar desglòs</span>
                            </>
                          ) : (
                            <>
                              <Utensils className="w-3.5 h-3.5 text-amber-600" />
                              <span>Veure ingredients i nutrició</span>
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            </>
                          )}
                        </button>

                        {/* Aplicar al calendari setmanal */}
                        {applyingId === fav.id ? (
                          <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200 space-y-2 text-xs">
                            <div className="font-bold text-amber-950 text-[11px]">
                              Tria quin àpat vols substituir:
                            </div>
                            <div className="flex gap-1.5">
                              <select
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
                                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 font-medium flex-1 outline-hidden"
                              >
                                {DIES_SETMANA.map((d) => (
                                  <option key={d} value={d}>
                                    {d}
                                  </option>
                                ))}
                              </select>

                              <select
                                value={selectedMealType}
                                onChange={(e) => setSelectedMealType(e.target.value as MealType)}
                                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 font-medium outline-hidden"
                              >
                                <option value="Dinar">☀️ Dinar</option>
                                <option value="Sopar">🌙 Sopar</option>
                              </select>
                            </div>

                            <div className="flex items-center justify-end gap-1.5 pt-1">
                              <button
                                onClick={() => setApplyingId(null)}
                                className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 rounded-lg text-xs cursor-pointer font-medium"
                              >
                                Cancel·lar
                              </button>
                              <button
                                onClick={() => handleApply(fav)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                Aplicar ara
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setApplyingId(fav.id)}
                            className="w-full py-1.5 px-3 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-200/80 rounded-lg text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <CalendarPlus className="w-3.5 h-3.5" />
                            Aplicar al calendari setmanal
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
