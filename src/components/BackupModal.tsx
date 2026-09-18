import React, { useState, useRef } from 'react';
import {
  X,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileJson,
  ShieldCheck,
  Calendar,
  Star,
  BookOpen,
  Apple,
} from 'lucide-react';
import { WeeklyMenuState, FavoriteMeal, SavedWeeklyMenu, Product } from '../types';
import { IntercanvisConfig } from '../utils/productStorage';

export interface FullBackupData {
  version: string;
  exportedAt: string;
  timestamp: number;
  menu: WeeklyMenuState;
  favorites: FavoriteMeal[];
  savedMenus: SavedWeeklyMenu[];
  rebost: string[];
  customProducts?: Product[];
  customIntercanvis?: IntercanvisConfig;
  customQuantities?: Record<string, number>;
}

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu: WeeklyMenuState;
  favorites: FavoriteMeal[];
  savedMenus: SavedWeeklyMenu[];
  rebost: Set<string>;
  products: Product[];
  intercanvis: IntercanvisConfig;
  customQuantities: Record<string, number>;
  onRestoreBackup: (backup: FullBackupData) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  menu,
  favorites,
  savedMenus,
  rebost,
  products,
  intercanvis,
  customQuantities,
  onRestoreBackup,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importStatus, setImportStatus] = useState<'idle' | 'validating' | 'ready' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [parsedBackup, setParsedBackup] = useState<FullBackupData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Generar i descarregar fitxer JSON
  const handleDownloadBackup = () => {
    const today = new Date().toISOString().split('T')[0];
    const backup: FullBackupData = {
      version: '2.0.0',
      exportedAt: new Date().toLocaleString('ca-ES'),
      timestamp: Date.now(),
      menu,
      favorites,
      savedMenus,
      rebost: Array.from(rebost),
      customProducts: products,
      customIntercanvis: intercanvis,
      customQuantities,
    };

    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `menu-parella-backup-${today}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Processar fitxer seleccionat
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readAndValidateFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      readAndValidateFile(file);
    }
  };

  const readAndValidateFile = (file: File) => {
    if (!file.name.endsWith('.json')) {
      setImportStatus('error');
      setErrorMessage('El fitxer ha de tenir extensió .json');
      return;
    }

    setImportStatus('validating');
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content) as FullBackupData;

        // Validacions bàsiques de seguretat
        if (!data.menu && !data.favorites) {
          throw new Error('El fitxer no conté informació vàlida de menús o favorits.');
        }

        setParsedBackup(data);
        setImportStatus('ready');
        setErrorMessage('');
      } catch (err) {
        setImportStatus('error');
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Error en llegir el fitxer. Assegura&apos;t que és una còpia generada per aquesta app.'
        );
      }
    };

    reader.onerror = () => {
      setImportStatus('error');
      setErrorMessage('No s&apos;ha pogut llegir el fitxer seleccionat.');
    };

    reader.readAsText(file);
  };

  const handleConfirmRestore = () => {
    if (!parsedBackup) return;

    onRestoreBackup(parsedBackup);
    setImportStatus('success');
    setTimeout(() => {
      onClose();
      setImportStatus('idle');
      setParsedBackup(null);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Capçalera */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center text-xl font-bold shadow-2xs">
              💾
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                Còpia de seguretat
              </h2>
              <p className="text-xs text-slate-500">
                Exporta o restaura totes les teves dades per passar-les al mòbil o guardar-les sense perill.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestanyes Exportar / Importar */}
        <div className="flex border-b border-slate-200 bg-white px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('export')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'export'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            Descarregar còpia (.json)
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'import'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            Restaurar còpia existent
          </button>
        </div>

        {/* Cos del modal */}
        <div className="p-5 overflow-y-auto max-h-[75vh]">
          {/* TAB 1: EXPORTAR */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="p-4 bg-teal-50/70 border border-teal-200/70 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div className="text-xs text-teal-900 leading-relaxed">
                  <strong>Totalment privada i segura:</strong> Tota la teva informació es compila en un sol fitxer de text estructurat (.json). No necessites cap compte extern. Pots enviar-te&apos;l per correu, WhatsApp o desar-lo al teu núvol privat (Drive, iCloud).
                </div>
              </div>

              {/* Resum de contingut a exportar */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
                <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10.5px]">
                  Contingut inclòs a la còpia:
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Menú setmanal actiu (7 dies)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    <span><b>{favorites.length}</b> plats favorits</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    <span><b>{savedMenus.length}</b> menús a l&apos;historial</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Apple className="w-3.5 h-3.5 text-rose-500" />
                    <span><b>{products.length}</b> aliments i gramatges</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleDownloadBackup}
                  className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Descarregar fitxer JSON de còpia de seguretat
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: IMPORTAR */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Zona de càrrega */}
              {importStatus !== 'ready' && importStatus !== 'success' && (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-teal-500 bg-slate-50 hover:bg-teal-50/40 rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <FileJson className="w-10 h-10 text-teal-600" />
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">
                      Fes clic o arrossega el fitxer de còpia (.json)
                    </span>
                    <span className="text-xs text-slate-400 mt-0.5 block">
                      Selecciona l&apos;arxiu que vas descarregar prèviament
                    </span>
                  </div>
                </div>
              )}

              {/* Error */}
              {importStatus === 'error' && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Dades a punt per restaurar */}
              {importStatus === 'ready' && parsedBackup && (
                <div className="space-y-3">
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Fitxer vàlid trobat!</strong>
                      <p className="text-[11.5px] text-emerald-800 mt-0.5">
                        Exportat el {parsedBackup.exportedAt || 'Data desconeguda'}.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5 text-xs text-slate-700">
                    <span className="font-bold block text-slate-900 mb-1">Dades que es restauraran:</span>
                    <div>⭐ <b>{parsedBackup.favorites?.length || 0}</b> plats favorits</div>
                    <div>🗓️ <b>{parsedBackup.savedMenus?.length || 0}</b> menús desats a l&apos;historial</div>
                    <div>🥗 Menú setmanal complet de 7 dies</div>
                    <div>⚖️ Pautes i <b>{parsedBackup.customProducts?.length || 0}</b> aliments del catàleg</div>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11.5px] text-amber-900">
                    ⚠️ <b>Atenció:</b> En confirmar, es reemplaçaran les dades actuals del navegador per les que conté aquest fitxer.
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        setImportStatus('idle');
                        setParsedBackup(null);
                      }}
                      className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Triar un altre fitxer
                    </button>
                    <button
                      onClick={handleConfirmRestore}
                      className="flex-1 py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Restaurar totes les dades
                    </button>
                  </div>
                </div>
              )}

              {/* Èxit de restauració */}
              {importStatus === 'success' && (
                <div className="p-6 text-center space-y-2 animate-in zoom-in-95">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-2xl">
                    🎉
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Dades restaurades amb èxit!</h4>
                  <p className="text-xs text-slate-500">
                    S&apos;han actualitzat tots els menús, favorits, catàleg d&apos;aliments i càlculs.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
