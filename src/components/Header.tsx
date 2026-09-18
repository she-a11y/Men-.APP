import React from 'react';
import {
  Sparkles,
  RotateCcw,
  FileSpreadsheet,
  Code,
  ShoppingCart,
  Star,
  ChefHat,
  HeartHandshake,
  Image as ImageIcon,
  Apple,
  Save,
  HardDriveDownload,
  Settings,
} from 'lucide-react';
import { IntercanvisConfig } from '../utils/productStorage';

interface HeaderProps {
  onGenerate: () => void;
  onReset: () => void;
  onExportExcel: () => void;
  onOpenCode: () => void;
  onOpenFoodManager: () => void;
  onOpenBackup: () => void;
  intercanvis: IntercanvisConfig;
  activeTab: 'menu' | 'image' | 'proposals' | 'favorites' | 'compra';
  setActiveTab: (tab: 'menu' | 'image' | 'proposals' | 'favorites' | 'compra') => void;
  totalShoppingPackages: number;
  favoritesCount: number;
  preferFavorites: boolean;
  onTogglePreferFavorites: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onGenerate,
  onReset,
  onExportExcel,
  onOpenCode,
  onOpenFoodManager,
  onOpenBackup,
  intercanvis,
  activeTab,
  setActiveTab,
  totalShoppingPackages,
  favoritesCount,
  preferFavorites,
  onTogglePreferFavorites,
}) => {
  return (
    <header className="bg-white border-b border-emerald-100 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🥗</span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-950">
                Menú setmanal
              </h1>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-generate-menu"
              onClick={onGenerate}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-sm font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Generar Menú
            </button>

            <button
              onClick={onTogglePreferFavorites}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                preferFavorites
                  ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Quan està actiu, el generador prioritza els teus plats favorits guardats"
            >
              <Star className={`w-3.5 h-3.5 ${preferFavorites ? 'fill-amber-500 text-amber-600' : 'text-slate-400'}`} />
              Prioritzar favorits
            </button>

            <button
              onClick={onOpenFoodManager}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              title="Afegeix nous aliments, edita gramatges i ajusta les pautes de la nutricionista"
            >
              <Apple className="w-4 h-4 text-emerald-700" />
              Aliments i racions
            </button>

            <button
              onClick={onOpenBackup}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              title="Descarrega una còpia de seguretat en JSON o restaura-la per passar dades al mòbil"
            >
              <HardDriveDownload className="w-4 h-4 text-teal-700" />
              Còpia de seguretat
            </button>

            <button
              id="btn-reset-menu"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
              title="Reiniciar menú"
            >
              <RotateCcw className="w-4 h-4" />
              Reiniciar
            </button>
            <button
              id="btn-export-excel"
              onClick={onExportExcel}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-600" />
              Excel (.xlsx)
            </button>
            <button
              id="btn-view-code"
              onClick={onOpenCode}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-sm font-medium rounded-lg transition-colors cursor-pointer"
              title="Veure app.py i products.csv"
            >
              <Code className="w-4 h-4" />
              Python / CSV
            </button>
          </div>
        </div>

        {/* Nutritional Profiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-3 border-t border-emerald-50">
          <div className="bg-emerald-50/70 border border-emerald-100/90 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                <span>👩</span> Sheila
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-200/70 text-emerald-900 rounded-full">
                {intercanvis.Sheila.calories.toLocaleString('es-ES')} kcal
              </span>
            </div>
            <div className="text-xs text-emerald-800 mt-1.5 space-y-0.5">
              <div>
                <strong className="font-semibold">Dinar:</strong> {intercanvis.Sheila.Dinar.Farinacis} Farinacis · {intercanvis.Sheila.Dinar.Proteïnes} Proteïnes · {intercanvis.Sheila.Dinar.Verdures} Verdures · {intercanvis.Sheila.Dinar.Greixos} Greixos
              </div>
              <div>
                <strong className="font-semibold">Sopar:</strong> {intercanvis.Sheila.Sopar.Farinacis} Farinacis · {intercanvis.Sheila.Sopar.Proteïnes} Proteïnes · {intercanvis.Sheila.Sopar.Verdures} Verdures · {intercanvis.Sheila.Sopar.Greixos} Greixos
              </div>
            </div>
          </div>

          <div className="bg-teal-50/70 border border-teal-100/90 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-900 text-sm flex items-center gap-1.5">
                <span>👨</span> Marc
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-teal-200/70 text-teal-900 rounded-full">
                {intercanvis.Marc.calories.toLocaleString('es-ES')} kcal
              </span>
            </div>
            <div className="text-xs text-teal-800 mt-1.5 space-y-0.5">
              <div>
                <strong className="font-semibold">Dinar:</strong> {intercanvis.Marc.Dinar.Farinacis} Farinacis · {intercanvis.Marc.Dinar.Proteïnes} Proteïnes · {intercanvis.Marc.Dinar.Verdures} Verdures · {intercanvis.Marc.Dinar.Greixos} Greixos
              </div>
              <div>
                <strong className="font-semibold">Sopar:</strong> {intercanvis.Marc.Sopar.Farinacis} Farinacis · {intercanvis.Marc.Sopar.Proteïnes} Proteïnes · {intercanvis.Marc.Sopar.Verdures} Verdures · {intercanvis.Marc.Sopar.Greixos} Greixos
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-4 pt-2 border-t border-slate-100">
          <button
            id="tab-btn-menu"
            onClick={() => setActiveTab('menu')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            📅 Planificador Setmanal
          </button>

          <button
            id="tab-btn-image"
            onClick={() => setActiveTab('image')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'image'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            🖼️ Menú
          </button>

          <button
            id="tab-btn-proposals"
            onClick={() => setActiveTab('proposals')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'proposals'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            💡 Propostes Automàtiques
          </button>

          <button
            id="tab-btn-favorites"
            onClick={() => setActiveTab('favorites')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Star className={`w-4 h-4 ${activeTab === 'favorites' ? 'fill-white' : 'fill-amber-400 text-amber-500'}`} />
            ⭐ Favorits
            <span className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'favorites' ? 'bg-emerald-800 text-white' : 'bg-amber-100 text-amber-900'
            }`}>
              {favoritesCount}
            </span>
          </button>

          <button
            id="tab-btn-compra"
            onClick={() => setActiveTab('compra')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'compra'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Compra
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'compra' ? 'bg-emerald-800 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {totalShoppingPackages} paquets
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
