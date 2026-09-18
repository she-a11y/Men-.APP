import React, { useState } from 'react';
import {
  Sparkles,
  RotateCw,
  CheckCircle2,
  ChefHat,
  RefreshCcw,
  Calendar,
  Plus,
  Leaf,
  Check,
} from 'lucide-react';
import {
  WeeklyMenuState,
  DayOfWeek,
  MealType,
  FavoriteMeal,
  Season,
  SeasonalDish,
} from '../types';
import {
  DIES_SETMANA,
  generateSingleMeal,
  generateInitialWeeklyMenu,
  GUIA_TEMATICA,
} from '../data/products';
import {
  getCurrentSeason,
  SEASONS_INFO,
  SEASONAL_DISHES,
  generateSeasonalWeeklyMenu,
} from '../data/seasonalDishes';
import { calculateMealNutrition, calculateWeeklyNutrition } from '../utils/nutrition';

interface ProposalsViewProps {
  onApplyProposal: (menu: WeeklyMenuState) => void;
  favorites: FavoriteMeal[];
  onApplySeasonalDish?: (dish: SeasonalDish, day: DayOfWeek, mealType: MealType) => void;
}

interface ProposalThemePreset {
  id: string;
  title: string;
  badge: string;
  desc: string;
  icon: string;
  menu: WeeklyMenuState;
}

export const ProposalsView: React.FC<ProposalsViewProps> = ({
  onApplyProposal,
  favorites,
  onApplySeasonalDish,
}) => {
  const currentSeason = getCurrentSeason();
  const [selectedSeason, setSelectedSeason] = useState<Season>(currentSeason);

  // Selector inline per afegir un plat de temporada a un dia/àpat concret
  const [targetDishForAdd, setTargetDishForAdd] = useState<SeasonalDish | null>(null);
  const [targetDay, setTargetDay] = useState<DayOfWeek>('Dilluns');
  const [targetMealType, setTargetMealType] = useState<MealType>('Dinar');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Propostes per temàtiques clares
  const [proposals, setProposals] = useState<ProposalThemePreset[]>(() => [
    {
      id: 'prop-batch',
      title: 'Batch Cooking',
      badge: 'Fàcil conservació',
      desc: 'Ideal per cuinar cereals, carns i llegums amb antelació el cap de setmana i gaudir-ne tota la setmana sense complicacions.',
      icon: '🍱',
      menu: generateInitialWeeklyMenu(favorites, true, currentSeason),
    },
    {
      id: 'prop-proteina',
      title: 'Alt en proteïnes',
      badge: 'Sacietat màxima',
      desc: 'Combinacions d\'alta biodisponibilitat proteica amb carns magres, peix blanc/blau, ous i làctics proteics.',
      icon: '💪',
      menu: generateInitialWeeklyMenu(favorites, false, currentSeason),
    },
    {
      id: 'prop-estacions',
      title: "Estacions de l'any",
      badge: `Temporada (${SEASONS_INFO[currentSeason].nom})`,
      desc: `Adaptat a la temporada actual (${SEASONS_INFO[currentSeason].nom}), prioritzant aliments de temporada i evitant plats fora d'època.`,
      icon: SEASONS_INFO[currentSeason].icona,
      menu: generateSeasonalWeeklyMenu(currentSeason, favorites),
    },
    {
      id: 'prop-rapida',
      title: 'Super ràpida (10 min)',
      badge: 'Menys temps a la cuina',
      desc: 'Basada en pots de llegums, conserves de qualitat, wraps i combinacions ràpides sense complicacions.',
      icon: '⚡',
      menu: generateInitialWeeklyMenu(favorites, false, currentSeason),
    },
  ]);

  const [activeProposalId, setActiveProposalId] = useState<string>('prop-batch');
  const [activeDay, setActiveDay] = useState<DayOfWeek>('Dilluns');
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  const currentProposal = proposals.find((p) => p.id === activeProposalId) || proposals[0];

  // Canviar o regenerar un àpat individual
  const handleSwapMeal = (day: DayOfWeek, mealType: MealType) => {
    setProposals((prev) =>
      prev.map((prop) => {
        if (prop.id !== activeProposalId) return prop;
        const freshMeal = generateSingleMeal(day, mealType, favorites, false, currentSeason);
        return {
          ...prop,
          menu: {
            ...prop.menu,
            [day]: {
              ...prop.menu[day],
              [mealType]: freshMeal,
            },
          },
        };
      })
    );
  };

  // Regenerar tota la proposta temàtica activa
  const handleRegenerateProposal = (propId: string) => {
    setProposals((prev) =>
      prev.map((prop) => {
        if (prop.id !== propId) return prop;
        if (prop.id === 'prop-estacions') {
          return {
            ...prop,
            menu: generateSeasonalWeeklyMenu(selectedSeason, favorites),
          };
        }
        return {
          ...prop,
          menu: generateInitialWeeklyMenu(favorites, prop.id === 'prop-batch', currentSeason),
        };
      })
    );
  };

  const handleApplyToActive = () => {
    onApplyProposal(currentProposal.menu);
    setAppliedNotice(currentProposal.title);
    setTimeout(() => setAppliedNotice(null), 4000);
  };

  const handleApplyEntireSeasonMenu = (season: Season) => {
    const seasonMenu = generateSeasonalWeeklyMenu(season, favorites);
    onApplyProposal(seasonMenu);
    // També actualitzem la proposta d'estacions si està seleccionada
    setProposals((prev) =>
      prev.map((p) =>
        p.id === 'prop-estacions'
          ? {
              ...p,
              badge: `Temporada (${SEASONS_INFO[season].nom})`,
              icon: SEASONS_INFO[season].icona,
              desc: `Adaptat a ${SEASONS_INFO[season].nom}, prioritzant aliments de temporada i evitant plats fora d'època.`,
              menu: seasonMenu,
            }
          : p
      )
    );
    setAppliedNotice(`Menú complet de ${SEASONS_INFO[season].nom}`);
    setTimeout(() => setAppliedNotice(null), 4000);
  };

  const handleConfirmAddDish = () => {
    if (!targetDishForAdd) return;
    if (onApplySeasonalDish) {
      onApplySeasonalDish(targetDishForAdd, targetDay, targetMealType);
    }
    setAddedNotice(`S'ha afegit "${targetDishForAdd.nom}" al ${targetMealType} de ${targetDay}!`);
    setTargetDishForAdd(null);
    setTimeout(() => setAddedNotice(null), 4000);
  };

  const weeklyNut = calculateWeeklyNutrition(currentProposal.menu);
  const currentSeasonInfo = SEASONS_INFO[selectedSeason];
  const seasonalDishesList = SEASONAL_DISHES.filter((d) => d.estacio === selectedSeason);

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-5 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 bg-emerald-700/80 rounded-lg text-emerald-200">
                <ChefHat className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold">Propostes automàtiques per temàtica</h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
              Tria entre menús complets pensats per a cada necessitat: <b>Batch cooking</b>, <b>Alt en proteïnes</b>, <b>Estacions de l&apos;any</b> (amb productes de temporada) o <b>Super ràpida</b>.
            </p>
          </div>

          <button
            onClick={handleApplyToActive}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            Aplicar aquesta proposta al calendari
          </button>
        </div>

        {appliedNotice && (
          <div className="mt-3 py-2 px-3 bg-emerald-600/90 text-white text-xs font-semibold rounded-lg flex items-center gap-2 border border-emerald-400/40">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            S&apos;ha aplicat amb èxit &quot;{appliedNotice}&quot; al teu pla setmanal actiu!
          </div>
        )}

        {addedNotice && (
          <div className="mt-3 py-2 px-3 bg-teal-600/90 text-white text-xs font-semibold rounded-lg flex items-center gap-2 border border-teal-400/40">
            <Check className="w-4 h-4 text-teal-200" />
            {addedNotice}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SELECTOR DE TEMÀTIQUES PRINCIPALS */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>🍱</span>
            Temàtiques disponibles
          </h3>
          <span className="text-xs text-slate-500">
            Fes clic a qualsevol per explorar-ne el menú dia a dia
          </span>
        </div>

        {/* 4 Cards de temàtiques: Batch cooking, Alt en proteïnes, Estacions de l'any, Super ràpida */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {proposals.map((prop) => {
            const isActive = prop.id === activeProposalId;
            return (
              <button
                key={prop.id}
                onClick={() => setActiveProposalId(prop.id)}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-2xl">{prop.icon}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {prop.badge}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1 leading-snug">{prop.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">{prop.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SI L'USUARI TRIA "ESTACIONS DE L'ANY", MOSTREM EL SELECTOR D'ESTACIONS */}
      {/* ========================================================================= */}
      {activeProposalId === 'prop-estacions' && (
        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold mb-1.5">
                <Leaf className="w-3.5 h-3.5 text-amber-700" />
                Aliments i receptes de temporada
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Temàtica: Estacions de l&apos;any
              </h3>
              <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
                La generació té present quins aliments són propis de cada època de l&apos;any (tardor, hivern, primavera i estiu), adequant cada àpat i evitant plats fora de temporada.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl self-start md:self-auto">
              <span className="text-xs text-emerald-900">
                Estació actual: <b>{SEASONS_INFO[currentSeason].nom} {SEASONS_INFO[currentSeason].icona}</b>
              </span>
            </div>
          </div>

          {/* Selector de les 4 estacions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['Tardor', 'Hivern', 'Primavera', 'Estiu'] as Season[]).map((season) => {
              const isSelected = selectedSeason === season;
              const isActual = currentSeason === season;
              const info = SEASONS_INFO[season];

              return (
                <button
                  key={season}
                  onClick={() => {
                    setSelectedSeason(season);
                    const newMenu = generateSeasonalWeeklyMenu(season, favorites);
                    setProposals((prev) =>
                      prev.map((p) =>
                        p.id === 'prop-estacions'
                          ? {
                              ...p,
                              badge: `Temporada (${info.nom})`,
                              icon: info.icona,
                              desc: `Adaptat a ${info.nom}, prioritzant aliments de temporada i evitant plats fora d'època.`,
                              menu: newMenu,
                            }
                          : p
                      )
                    );
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-2xl">{info.icona}</span>
                    {isActual && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        Actual
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-xs sm:text-sm">{info.nom}</div>
                  <div
                    className={`text-[10px] ${
                      isSelected ? 'text-emerald-200' : 'text-slate-500'
                    }`}
                  >
                    {info.mesos}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Resum de l'estació seleccionada */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentSeasonInfo.icona}</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {currentSeasonInfo.nom} ({currentSeasonInfo.mesos})
                  </h4>
                  <p className="text-xs text-slate-600">{currentSeasonInfo.descripcio}</p>
                </div>
              </div>

              <button
                onClick={() => handleApplyEntireSeasonMenu(selectedSeason)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer shrink-0"
              >
                <Calendar className="w-3.5 h-3.5" />
                Aplicar menú de {currentSeasonInfo.nom} al calendari
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
              <div className="bg-white/90 p-3 rounded-lg border border-emerald-200">
                <span className="font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  Aliments de temporada:
                </span>
                <p className="text-slate-600">
                  {currentSeasonInfo.ingredientsEstrella.join(', ')}
                </p>
              </div>

              <div className="bg-white/90 p-3 rounded-lg border border-rose-200">
                <span className="font-bold text-rose-800 flex items-center gap-1.5 mb-1">
                  ⚠️ Evitats en aquesta època:
                </span>
                <p className="text-slate-600">
                  {currentSeasonInfo.desaconsellats.join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Llistat de plats individuals de l'estació amb opció d'afegir-los */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Plats de referència per a {currentSeasonInfo.nom}
              </h4>
              <span className="text-[11px] text-slate-400">
                Pots afegir qualsevol plat al dia que vulguis
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {seasonalDishesList.map((dish) => (
                <div
                  key={dish.id}
                  className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {dish.tipus === 'Dinar' ? '☀️ Dinar' : dish.tipus === 'Sopar' ? '🌙 Sopar' : '🍽️ Dinar / Sopar'}
                      </span>
                      {dish.destacat && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          Recomanat
                        </span>
                      )}
                    </div>

                    <h5 className="font-bold text-slate-900 text-xs sm:text-sm mb-1 leading-snug">
                      {dish.nom}
                    </h5>

                    <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                      {dish.desc}
                    </p>

                    <div className="space-y-0.5 text-[11px] text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 mb-2">
                      <div><b>🍞 Farinaci:</b> {dish.farinaci}</div>
                      <div><b>🍗 Proteïna:</b> {dish.proteines.join(' + ')}</div>
                      <div><b>🥬 Verdura:</b> {dish.verdures.join(' + ')}</div>
                      <div><b>🥑 Greix:</b> {dish.greix}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    {targetDishForAdd?.id === dish.id ? (
                      <div className="space-y-2 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                        <div className="text-[11px] font-bold text-emerald-900">
                          A quin àpat el vols afegir?
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <select
                            value={targetDay}
                            onChange={(e) => setTargetDay(e.target.value as DayOfWeek)}
                            className="text-xs bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
                          >
                            {DIES_SETMANA.map((d) => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                          <select
                            value={targetMealType}
                            onChange={(e) => setTargetMealType(e.target.value as MealType)}
                            className="text-xs bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
                          >
                            <option value="Dinar">Dinar</option>
                            <option value="Sopar">Sopar</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            onClick={handleConfirmAddDish}
                            className="flex-1 px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded cursor-pointer transition-colors"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => setTargetDishForAdd(null)}
                            className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded cursor-pointer"
                          >
                            Cancel·lar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setTargetDishForAdd(dish);
                          setTargetMealType(dish.tipus === 'Sopar' ? 'Sopar' : 'Dinar');
                        }}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Afegir al meu menú actiu
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Barra de controls de la proposta seleccionada */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span>{currentProposal.icon}</span>
              Proposta: {currentProposal.title}
            </h4>
            <span className="text-xs text-slate-400">· 14 àpats</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-600 mt-1">
            <span>
              Mitjana Sheila:{' '}
              <b className="text-emerald-700">{weeklyNut.sheila.dailyAvg.calories} kcal/dia</b>
            </span>
            <span>
              Mitjana Marc:{' '}
              <b className="text-teal-700">{weeklyNut.marc.dailyAvg.calories} kcal/dia</b>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRegenerateProposal(currentProposal.id)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Regenerar proposta
          </button>
          <button
            onClick={handleApplyToActive}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Utilitzar aquest menú
          </button>
        </div>
      </div>

      {/* Pestanyes de dies de la setmana */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-200">
        {DIES_SETMANA.map((day) => {
          const isActive = day === activeDay;
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-3.5 py-2 text-xs font-bold rounded-t-lg transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Vista dels àpats del dia per a la proposta */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(['Dinar', 'Sopar'] as MealType[]).map((mealType) => {
          const meal = currentProposal.menu[activeDay][mealType];
          const theme = GUIA_TEMATICA[activeDay][mealType];
          const nut = calculateMealNutrition(meal, mealType);

          return (
            <div
              key={mealType}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">
                      {mealType === 'Dinar' ? '☀️ Dinar' : '🌙 Sopar'} ({activeDay})
                    </h5>
                    <span className="text-[11px] text-emerald-700 font-medium">
                      💡 {theme.desc}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSwapMeal(activeDay, mealType)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    title="Canviar aquest plat per una altra opció"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-amber-700" />
                    Canviar plat
                  </button>
                </div>

                {/* Llistat d'ingredients */}
                <div className="space-y-1 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-3">
                  <div>
                    <b>🍞 Farinaci:</b> {meal.farinaci}
                  </div>
                  <div>
                    <b>🍗 Proteïna:</b> {meal.proteines.join(' + ')}
                  </div>
                  <div>
                    <b>🥬 Verdura:</b> {meal.verdures.join(' + ')}
                  </div>
                  <div>
                    <b>🥑 Greix:</b> {meal.greix}
                  </div>
                </div>
              </div>

              {/* Informació nutricional */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="text-emerald-800 font-semibold">
                  👩 Sheila: {nut.sheila.calories} kcal ({nut.sheila.proteines}g P · {nut.sheila.carbs}g C)
                </span>
                <span className="text-teal-800 font-semibold">
                  👨 Marc: {nut.marc.calories} kcal ({nut.marc.proteines}g P · {nut.marc.carbs}g C)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
