import React, { useState } from 'react';
import { CheckSquare, Square, Search, X } from 'lucide-react';
import { PRODUCTS_LIST } from '../data/products';
import { GroupType } from '../types';

interface PantrySidebarProps {
  rebost: Set<string>;
  onToggleItem: (nom: string) => void;
  onClearAll: () => void;
  onSetBasics: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const PantrySidebar: React.FC<PantrySidebarProps> = ({
  rebost,
  onToggleItem,
  onClearAll,
  onSetBasics,
  isOpen,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState<GroupType | 'Tots'>('Tots');

  const groups: (GroupType | 'Tots')[] = ['Tots', 'Farinacis', 'Proteïnes', 'Verdures', 'Greixos'];

  const filteredProducts = PRODUCTS_LIST.filter((p) => {
    const matchesSearch = p.nom.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = activeGroup === 'Tots' || p.grup === activeGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 right-0 h-full lg:h-auto z-40 w-80 sm:w-96 bg-white border-l border-slate-200 shadow-xl lg:shadow-none flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🥫</span>
              <h2 className="font-bold text-slate-800 text-base">
                El Teu Rebost
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                {rebost.size} a casa
              </span>
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md lg:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Marca el que ja tens al rebost/nevera. Es descomptarà automàticament de la llista de la compra.
          </p>

          {/* Quick Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              onClick={onSetBasics}
              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              Marcar bàsics
            </button>
            <button
              onClick={onClearAll}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              Desmarcar tot
            </button>
          </div>

          {/* Search */}
          <div className="relative mt-3">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cerca ingredient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Group Filter Chips */}
          <div className="flex gap-1 overflow-x-auto mt-2.5 pb-1">
            {groups.map((grp) => (
              <button
                key={grp}
                onClick={() => setActiveGroup(grp)}
                className={`px-2 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  activeGroup === grp
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {grp}
              </button>
            ))}
          </div>
        </div>

        {/* Product list */}
        <div className="flex-1 overflow-y-auto p-3 divide-y divide-slate-100 max-h-[calc(100vh-250px)] lg:max-h-[calc(100vh-210px)]">
          {filteredProducts.map((p) => {
            const isChecked = rebost.has(p.nom);
            return (
              <div
                key={p.nom}
                onClick={() => onToggleItem(p.nom)}
                className={`py-2 px-2 rounded-lg flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                  isChecked ? 'bg-emerald-50/60' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-medium truncate ${
                        isChecked ? 'text-emerald-950 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      {p.nom}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {p.grup} · Format: {p.format_compra} {p.format_unitat}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600 shrink-0">
                  {p.seccio.split(' ')[0]}
                </span>
              </div>
            );
          })}

          {filteredProducts.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No s&apos;han trobat productes
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
