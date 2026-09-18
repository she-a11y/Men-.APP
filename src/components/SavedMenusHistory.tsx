import React, { useState } from 'react';
import {
  Bookmark,
  Calendar,
  Clock,
  Trash2,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  Plus,
  Sparkles,
  Edit2,
  Copy,
} from 'lucide-react';
import { SavedWeeklyMenu, WeeklyMenuState, DayOfWeek, MealType } from '../types';
import { DIES_SETMANA } from '../data/products';
import { getDishShortTitle } from '../utils/dishVisuals';

interface SavedMenusHistoryProps {
  currentMenu: WeeklyMenuState;
  savedMenus: SavedWeeklyMenu[];
  onSaveCurrentMenu: (name: string, notes?: string) => void;
  onLoadSavedMenu: (menu: WeeklyMenuState) => void;
  onDeleteSavedMenu: (id: string) => void;
  onRenameSavedMenu: (id: string, newName: string) => void;
}

export const SavedMenusHistory: React.FC<SavedMenusHistoryProps> = ({
  currentMenu,
  savedMenus,
  onSaveCurrentMenu,
  onLoadSavedMenu,
  onDeleteSavedMenu,
  onRenameSavedMenu,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuName, setMenuName] = useState('');
  const [notes, setNotes] = useState('');
  const [previewMenuId, setPreviewMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [loadedSuccessId, setLoadedSuccessId] = useState<string | null>(null);

  // Genera un nom per defecte basat en la data actual
  const handleOpenSaveModal = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('ca-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    setMenuName(`Menú setmanal - ${formattedDate}`);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleConfirmSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuName.trim()) return;
    onSaveCurrentMenu(menuName.trim(), notes.trim() || undefined);
    setIsModalOpen(false);
  };

  const handleLoad = (saved: SavedWeeklyMenu) => {
    if (window.confirm(`Vols carregar el menú "${saved.nom}" al teu calendari setmanal actual?`)) {
      onLoadSavedMenu(saved.menu);
      setLoadedSuccessId(saved.id);
      setTimeout(() => setLoadedSuccessId(null), 3000);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStartRename = (saved: SavedWeeklyMenu) => {
    setEditingId(saved.id);
    setEditName(saved.nom);
  };

  const handleSaveRename = (id: string) => {
    if (editName.trim()) {
      onRenameSavedMenu(id, editName.trim());
    }
    setEditingId(null);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ca-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-12 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
      {/* Capçalera de la secció */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-800 shrink-0">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Els meus menús
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Historial de les teves planificacions setmanals. Guarda el menú d&apos;aquesta setmana i recupera&apos;l quan vulguis.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenSaveModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Guardar aquest menú a l&apos;historial
        </button>
      </div>

      {/* Llistat d'historial */}
      <div className="mt-6">
        {savedMenus.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 sm:p-10 text-center">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">Encara no has guardat cap menú setmanal</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
              Quan tinguis una setmana que t&apos;agradi especialment, fes clic a &quot;Guardar aquest menú a l&apos;historial&quot; per conservar-lo i carregar-lo en futures setmanes.
            </p>
            <button
              onClick={handleOpenSaveModal}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              Guardar menú actual ara
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {savedMenus.map((item) => {
              const isPreviewing = previewMenuId === item.id;
              const isLoaded = loadedSuccessId === item.id;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-2xs hover:shadow-xs flex flex-col justify-between ${
                    isLoaded ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-slate-200 hover:border-emerald-200'
                  }`}
                >
                  <div>
                    {/* Header Card */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        {editingId === item.id ? (
                          <div className="flex items-center gap-1.5 mb-1">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="text-sm font-bold text-slate-900 border border-emerald-400 rounded-lg px-2 py-1 w-full outline-hidden"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveRename(item.id)}
                              className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900 leading-snug">
                              {item.nom}
                            </h3>
                            <button
                              onClick={() => handleStartRename(item)}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                              title="Canviar el nom"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {formatDate(item.dataCreacio)}
                          </span>
                          <span>·</span>
                          <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            14 àpats complets
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteSavedMenu(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                        title="Eliminar aquest menú de l'historial"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100 mb-3">
                        &quot;{item.notes}&quot;
                      </p>
                    )}

                    {/* Resum textual ràpid d'àpats destacats d'aquest menú (sense imatges) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3">
                      {(['Dilluns', 'Dimecres', 'Divendres', 'Diumenge'] as DayOfWeek[]).map((day) => {
                        const meal = item.menu[day].Dinar;
                        const title = getDishShortTitle(meal);

                        return (
                          <div
                            key={day}
                            className="rounded-xl border border-slate-200 bg-slate-50/90 p-2.5 flex flex-col justify-between"
                          >
                            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                              ☀️ {day.substring(0, 3)}
                            </span>
                            <p className="text-[11px] font-bold text-slate-800 line-clamp-2 mt-1 leading-snug">
                              {title}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Accions */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => setPreviewMenuId(isPreviewing ? null : item.id)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      {isPreviewing ? 'Tancar vista' : 'Previsualitzar els 7 dies'}
                      {isPreviewing ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => handleLoad(item)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        isLoaded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white border border-emerald-200'
                      }`}
                    >
                      {isLoaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                      {isLoaded ? 'Carregat al calendari!' : 'Carregar al calendari'}
                    </button>
                  </div>

                  {/* Preview completa dels 7 dies */}
                  {isPreviewing && (
                    <div className="mt-4 pt-3 border-t border-slate-200 bg-slate-50 -mx-5 -mb-5 p-4 rounded-b-2xl">
                      <h4 className="text-xs font-bold text-slate-700 mb-2">
                        Resum complet dels 7 dies:
                      </h4>
                      <div className="space-y-1.5 text-[11px]">
                        {DIES_SETMANA.map((day) => {
                          const dinar = item.menu[day].Dinar;
                          const sopar = item.menu[day].Sopar;
                          return (
                            <div key={day} className="flex items-start justify-between gap-2 p-1.5 rounded bg-white border border-slate-200">
                              <span className="font-bold text-slate-800 w-20 shrink-0">
                                {day}:
                              </span>
                              <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-slate-600">
                                <span>☀️ <b>Dinar:</b> {getDishShortTitle(dinar)}</span>
                                <span>🌙 <b>Sopar:</b> {getDishShortTitle(sopar)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal per guardar el menú actual */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 mb-4">
              <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-800">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Guardar menú setmanal a l&apos;historial
                </h3>
                <p className="text-xs text-slate-500">
                  Podràs consultar-lo i carregar-lo sempre que vulguis.
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nom o títol del menú *
                </label>
                <input
                  type="text"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  placeholder="Ex: Menú de tardor ric en peix i verdures"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden"
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Notes o comentaris (opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Va funcionar genial el batch cooking de dimarts i els sopars de fajitas."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 text-xs focus:ring-1 focus:ring-emerald-500 outline-hidden resize-none"
                />
              </div>

              <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-100 text-[11px] text-emerald-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Es guardaran els 14 àpats exactes que tens actualment al planificador setmanal.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel·lar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Guardar a l&apos;historial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
