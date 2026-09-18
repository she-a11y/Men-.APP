import React from 'react';
import { WeeklyMenuState } from '../types';
import { calculateWeeklyNutrition } from '../utils/nutrition';
import { Activity, Flame, Dumbbell, Wheat, Droplet } from 'lucide-react';

interface NutritionSummaryProps {
  menu: WeeklyMenuState;
}

export const NutritionSummary: React.FC<NutritionSummaryProps> = ({ menu }) => {
  const nutrition = calculateWeeklyNutrition(menu);

  const renderUserBlock = (
    name: string,
    avatar: string,
    data: typeof nutrition.sheila,
    accentColor: string,
    badgeBg: string
  ) => {
    const dailyKcal = data.dailyAvg.calories;
    const targetKcal = data.targetDailyCalories;
    // Main meals (dinar + sopar) percentage of daily total
    const percentTarget = Math.round((dailyKcal / targetKcal) * 100);

    const totalMacroGrams =
      data.dailyAvg.proteines + data.dailyAvg.carbs + data.dailyAvg.greixos || 1;
    const protPct = Math.round((data.dailyAvg.proteines / totalMacroGrams) * 100);
    const carbsPct = Math.round((data.dailyAvg.carbs / totalMacroGrams) * 100);
    const greixPct = Math.round((data.dailyAvg.greixos / totalMacroGrams) * 100);

    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{avatar}</span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{name}</h3>
              <p className="text-[11px] text-slate-500">Objectiu total: {targetKcal} kcal/dia</p>
            </div>
          </div>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${badgeBg}`}>
            {dailyKcal} kcal/dia (Dinar + Sopar)
          </span>
        </div>

        {/* Macros Daily Average */}
        <div className="grid grid-cols-4 gap-2 text-center py-2 bg-slate-50 rounded-lg border border-slate-100 mb-3">
          <div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 font-medium">
              <Flame className="w-3 h-3 text-amber-500" />
              Kcal
            </div>
            <div className="text-sm font-bold text-slate-900">{dailyKcal}</div>
            <div className="text-[10px] text-slate-400">{data.total.calories} tot.</div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-700 font-medium">
              <Dumbbell className="w-3 h-3 text-emerald-600" />
              Prot
            </div>
            <div className="text-sm font-bold text-emerald-950">{data.dailyAvg.proteines}g</div>
            <div className="text-[10px] text-emerald-600/70">{protPct}%</div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-sky-700 font-medium">
              <Wheat className="w-3 h-3 text-sky-600" />
              Carbs
            </div>
            <div className="text-sm font-bold text-sky-950">{data.dailyAvg.carbs}g</div>
            <div className="text-[10px] text-sky-600/70">{carbsPct}%</div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-[11px] text-amber-700 font-medium">
              <Droplet className="w-3 h-3 text-amber-600" />
              Greixos
            </div>
            <div className="text-sm font-bold text-amber-950">{data.dailyAvg.greixos}g</div>
            <div className="text-[10px] text-amber-600/70">{greixPct}%</div>
          </div>
        </div>

        {/* Caloric distribution bar */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
            <span>Aportació d&apos;àpats principals</span>
            <span className="font-semibold text-slate-700">{percentTarget}% del requeriment diari</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
            <div
              className={`h-full ${accentColor} transition-all duration-500`}
              style={{ width: `${Math.min(100, percentTarget)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            * El restant ({100 - percentTarget}%) correspon a esmorzar, berenar o snacks d&apos;intercanvi lliure.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-emerald-50/40 rounded-2xl border border-emerald-100 p-4 sm:p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-700" />
          <h2 className="text-sm sm:text-base font-bold text-emerald-950">
            Resum Nutricional i Balanç de Calories
          </h2>
        </div>
        <span className="text-xs text-emerald-700 font-medium bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
          Càlcul matemàtic exacte per racions
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderUserBlock(
          'Sheila',
          '👩',
          nutrition.sheila,
          'bg-emerald-600',
          'bg-emerald-100 text-emerald-800'
        )}
        {renderUserBlock(
          'Marc',
          '👨',
          nutrition.marc,
          'bg-teal-600',
          'bg-teal-100 text-teal-800'
        )}
      </div>
    </div>
  );
};
