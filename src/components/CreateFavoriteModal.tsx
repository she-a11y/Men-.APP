import React, { useState, useMemo } from 'react';
import { X, Star, Check, Sparkles } from 'lucide-react';
import { FavoriteMeal, Product } from '../types';
import { FARINACIS, PROTEINES, VERDURES, GREIXOS } from '../data/products';
import {
  CATEGORIES_PLATS,
  getDishCategory,
  getDishShortTitle,
} from '../utils/dishVisuals';

interface CreateFavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fav: Omit<FavoriteMeal, 'id' | 'createdAt'>) => void;
  products?: Product[];
}

export const CreateFavoriteModal: React.FC<CreateFavoriteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  products,
}) => {
  if (!isOpen) return null;

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

  const [nom, setNom] = useState('');
  const [desc, setDesc] = useState('');
  const [farinaci, setFarinaci] = useState(() => farinacisList[0]?.nom || 'Arròs');
  const [proteines, setProteines] = useState<string[]>(() => [proteinesList[0]?.nom || 'Pit de pollastre']);
  const [verdures, setVerdures] = useState<string[]>(() => [verduresList[0]?.nom || 'Carbassó']);
  const [greix, setGreix] = useState(() => greixosList[0]?.nom || 'Oli d’oliva verge');

  const autoCategory = getDishCategory({ farinaci, proteines, verdures, greix });
  const suggestedTitle = getDishShortTitle({ farinaci, proteines, verdures, greix });

  const handleToggleProtein = (pName: string) => {
    if (proteines.includes(pName)) {
      if (proteines.length > 1) {
        setProteines(proteines.filter((p) => p !== pName));
      }
    } else {
      if (proteines.length >= 2) {
        setProteines([proteines[0], pName]);
      } else {
        setProteines([...proteines, pName]);
      }
    }
  };

  const handleToggleVerdura = (vName: string) => {
    if (verdures.includes(vName)) {
      if (verdures.length > 1) {
        setVerdures(verdures.filter((v) => v !== vName));
      }
    } else {
      if (verdures.length >= 2) {
        setVerdures([verdures[0], vName]);
      } else {
        setVerdures([...verdures, vName]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalNom = nom.trim() || suggestedTitle;
    onSave({
      nom: finalNom,
      desc: desc.trim() || undefined,
      categoria: autoCategory.id,
      farinaci,
      proteines,
      verdures,
      greix,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-amber-100 rounded-2xl text-amber-800">
              <Star className="w-5 h-5 fill-amber-500 text-amber-600" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">Afegir Nou Plat a Favorits</h2>
              <p className="text-xs text-slate-500">
                Crea una combinació a mida que podràs aplicar a qualsevol dia de la setmana.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Previsualització neta de la targeta (sense imatges) */}
        <div className="mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-2xl shrink-0">
            {autoCategory.icona}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${autoCategory.colorBg} ${autoCategory.colorBorder} ${autoCategory.colorText}`}>
                {autoCategory.nom}
              </span>
              <span className="text-[10px] text-slate-400">Classificació automàtica</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 truncate">
              {nom.trim() || suggestedTitle}
            </h4>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              🍞 {farinaci} + 🍗 {proteines.join(', ')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Nom del plat */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">
                Títol curt del plat *
              </label>
              <button
                type="button"
                onClick={() => setNom(suggestedTitle)}
                className="text-[11px] font-medium text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                Usar suggerit: &quot;{suggestedTitle}&quot;
              </button>
            </div>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder={`Ex: ${suggestedTitle}`}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden font-medium"
            />
          </div>

          {/* Farinaci */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">🍞 Farinaci (1)</label>
            <select
              value={farinaci}
              onChange={(e) => setFarinaci(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium outline-hidden"
            >
              {farinacisList.map((f) => (
                <option key={f.nom} value={f.nom}>
                  {f.nom} ({f.racio_g}{f.unitat}) · {f.calories_per_100g} kcal/100g
                </option>
              ))}
            </select>
          </div>

          {/* Proteïnes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              🍗 Proteïnes (tria 1 o 2)
            </label>
            <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto p-1.5 bg-slate-50 border border-slate-200 rounded-xl">
              {proteinesList.map((p) => {
                const selected = proteines.includes(p.nom);
                return (
                  <button
                    key={p.nom}
                    type="button"
                    onClick={() => handleToggleProtein(p.nom)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
                      selected
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {selected && <Check className="w-2.5 h-2.5" />}
                    {p.nom}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Verdures */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              🥬 Verdures (tria 1 o 2)
            </label>
            <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto p-1.5 bg-slate-50 border border-slate-200 rounded-xl">
              {verduresList.map((v) => {
                const selected = verdures.includes(v.nom);
                return (
                  <button
                    key={v.nom}
                    type="button"
                    onClick={() => handleToggleVerdura(v.nom)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
                      selected
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
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
          <div>
            <label className="block font-semibold text-slate-700 mb-1">🥑 Greix saludable (1)</label>
            <select
              value={greix}
              onChange={(e) => setGreix(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium outline-hidden"
            >
              {greixosList.map((g) => (
                <option key={g.nom} value={g.nom}>
                  {g.nom} ({g.racio_g}{g.unitat})
                </option>
              ))}
            </select>
          </div>

          {/* Descripció opcional */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Descripció o consell de preparació (Opcional)
            </label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Ex: Servir calent amb un pessic d'orenga o llimona"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden"
            />
          </div>

          {/* Submit buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
            >
              Cancel·lar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Star className="w-4 h-4 fill-white" />
              Guardar a Favorits
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
