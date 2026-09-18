import React, { useEffect, useRef, useState } from 'react';
import {
  Download,
  Copy,
  Printer,
  Sparkles,
  Check,
  Maximize2,
  Minimize2,
  RefreshCw,
  Sun,
  Moon,
  Layers,
  Image as ImageIcon,
  TableProperties,
} from 'lucide-react';
import { WeeklyMenuState, DayOfWeek, MealType } from '../types';
import { DIES_SETMANA, GUIA_TEMATICA } from '../data/products';
import { getDishShortTitle } from '../utils/dishVisuals';

interface WeeklyImageOverviewProps {
  menu: WeeklyMenuState;
  onNavigateToMeal?: (day: DayOfWeek, mealType: MealType) => void;
  onGenerateMenu?: () => void;
}

export const WeeklyImageOverview: React.FC<WeeklyImageOverviewProps> = ({
  menu,
  onNavigateToMeal,
  onGenerateMenu,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'image' | 'compactGrid'>('image');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Renderització al Canvas per generar una imatge d'alta resolució (Retina 2x)
  const drawWeeklyImage = () => {
    setIsGenerating(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Dimensions del canvas (Alta resolució per a impressió o descàrrega neta)
    const scale = 2; // Retina scale
    const width = 1400;
    const height = 820;
    canvas.width = width * scale;
    canvas.height = height * scale;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(scale, scale);

    // 1. Fons principal
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Marc exterior decoratiu
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    // 2. Capçalera superior de la imatge
    const headerBg = ctx.createLinearGradient(16, 16, width - 16, 16);
    headerBg.addColorStop(0, '#064e3b');
    headerBg.addColorStop(1, '#0f766e');
    ctx.fillStyle = headerBg;
    ctx.beginPath();
    ctx.roundRect(24, 24, width - 48, 76, 12);
    ctx.fill();

    // Títol
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif';
    ctx.fillText('🥗 Menú setmanal', 44, 62);

    // Subtítol amb calories de la parella
    ctx.font = '500 13px system-ui, sans-serif';
    ctx.fillStyle = '#a7f3d0';
    ctx.fillText('Planificació nutricional per a Sheila (1.745 kcal) i Marc (2.275 kcal) · Vista d\'un cop d\'ull', 44, 84);

    // Indicador visual a la dreta de la capçalera
    ctx.fillStyle = '#ecfdf5';
    ctx.font = '600 12px system-ui, sans-serif';
    ctx.fillText('☀️ Dinar & 🌙 Sopar', width - 210, 68);

    // 3. Càlcul de columnes per als 7 dies de la setmana
    const startX = 24;
    const startY = 114;
    const availableWidth = width - 48;
    const colGap = 10;
    const colWidth = (availableWidth - colGap * 6) / 7;
    const colHeight = height - startY - 48;

    DIES_SETMANA.forEach((day, index) => {
      const colX = startX + index * (colWidth + colGap);

      // Fons de la columna del dia
      const isWeekend = day === 'Dissabte' || day === 'Diumenge';
      ctx.fillStyle = isWeekend ? '#f1f5f9' : '#ffffff';
      ctx.beginPath();
      ctx.roundRect(colX, startY, colWidth, colHeight, 10);
      ctx.fill();
      ctx.strokeStyle = isWeekend ? '#cbd5e1' : '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Capçalera del dia
      ctx.fillStyle = isWeekend ? '#334155' : '#047857';
      ctx.beginPath();
      ctx.roundRect(colX, startY, colWidth, 38, [10, 10, 0, 0]);
      ctx.fill();

      // Nom del dia
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(day, colX + colWidth / 2, startY + 24);
      ctx.textAlign = 'left';

      const mealBoxHeight = (colHeight - 48) / 2;

      // --- SECCIÓ DINAR (☀️) ---
      const dinarY = startY + 44;
      const dinar = menu[day]?.Dinar;

      ctx.fillStyle = '#fffbeb';
      ctx.beginPath();
      ctx.roundRect(colX + 5, dinarY, colWidth - 10, mealBoxHeight, 8);
      ctx.fill();
      ctx.strokeStyle = '#fef3c7';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Etiqueta Dinar
      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.fillText('☀️ DINAR', colX + 12, dinarY + 18);

      // Temàtica Dinar
      const themeDinar = GUIA_TEMATICA[day]?.Dinar?.desc || '';
      ctx.fillStyle = '#92400e';
      ctx.font = 'italic 10px system-ui, sans-serif';
      renderTruncatedText(ctx, themeDinar, colX + 12, dinarY + 32, colWidth - 24);

      // Ingredients Dinar
      if (dinar) {
        let textY = dinarY + 48;
        const lineSpacing = 16;

        // Títol del plat adaptat
        const titleDinar = getDishShortTitle(dinar, true);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px system-ui, sans-serif';
        renderTruncatedText(ctx, `🍽️ ${titleDinar}`, colX + 12, textY, colWidth - 24);
        textY += lineSpacing;

        // Farinaci
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 10.5px system-ui, sans-serif';
        renderTruncatedText(ctx, `🍞 ${dinar.farinaci || '---'}`, colX + 12, textY, colWidth - 24);
        textY += lineSpacing;

        // Proteïnes
        ctx.fillStyle = '#334155';
        ctx.font = '500 10px system-ui, sans-serif';
        const prots = dinar.proteines?.join(', ') || '---';
        renderTruncatedText(ctx, `🍗 ${prots}`, colX + 12, textY, colWidth - 24);
        textY += lineSpacing;

        // Verdures
        ctx.fillStyle = '#15803d';
        ctx.font = '500 9.5px system-ui, sans-serif';
        const verds = dinar.verdures?.join(', ') || '---';
        renderTruncatedText(ctx, `🥬 ${verds}`, colX + 12, textY, colWidth - 24);
        textY += lineSpacing;

        // Greix
        ctx.fillStyle = '#475569';
        ctx.font = '400 9px system-ui, sans-serif';
        renderTruncatedText(ctx, `🥑 ${dinar.greix || '---'}`, colX + 12, textY, colWidth - 24);
      }

      // --- SECCIÓ SOPAR (🌙) ---
      const soparY = dinarY + mealBoxHeight + 6;
      const sopar = menu[day]?.Sopar;

      ctx.fillStyle = '#f0fdf4';
      ctx.beginPath();
      ctx.roundRect(colX + 5, soparY, colWidth - 10, mealBoxHeight, 8);
      ctx.fill();
      ctx.strokeStyle = '#dcfce7';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Etiqueta Sopar
      ctx.fillStyle = '#166534';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.fillText('🌙 SOPAR', colX + 12, soparY + 18);

      // Temàtica Sopar
      const themeSopar = GUIA_TEMATICA[day]?.Sopar?.desc || '';
      ctx.fillStyle = '#15803d';
      ctx.font = 'italic 10px system-ui, sans-serif';
      renderTruncatedText(ctx, themeSopar, colX + 12, soparY + 32, colWidth - 24);

      // Ingredients Sopar
      if (sopar) {
        let textY = soparY + 48;
        const lineSpacing = 16;

        // Títol del plat adaptat
        const titleSopar = getDishShortTitle(sopar, true);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px system-ui, sans-serif';
        renderTruncatedText(ctx, `🍽️ ${titleSopar}`, colX + 12, textY, colWidth - 24);
        textY += lineSpacing;

        // Farinaci
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 10.5px system-ui, sans-serif';
        renderTruncatedText(ctx, `🍞 ${sopar.farinaci || '---'}`, colX + 12, textY, colWidth - 24);
        textY += lineSpacing;

        // Proteïnes
        ctx.fillStyle = '#334155';
        ctx.font = '500 10px system-ui, sans-serif';
        const prots = sopar.proteines?.join(', ') || '---';
        renderTruncatedText(ctx, `🍗 ${prots}`, colX + 12, textY, colWidth - 24);
        textY += lineSpacing;

        // Verdures
        ctx.fillStyle = '#15803d';
        ctx.font = '500 9.5px system-ui, sans-serif';
        const verds = sopar.verdures?.join(', ') || '---';
        renderTruncatedText(ctx, `🥬 ${verds}`, colX + 12, textY, colWidth - 24);
        textY += lineSpacing;

        // Greix
        ctx.fillStyle = '#475569';
        ctx.font = '400 9px system-ui, sans-serif';
        renderTruncatedText(ctx, `🥑 ${sopar.greix || '---'}`, colX + 12, textY, colWidth - 24);
      }
    });

    // 4. Peu de pàgina del pòster
    ctx.fillStyle = '#64748b';
    ctx.font = '500 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Menú setmanal generat per a Sheila & Marc · Mercadona & Batch Cooking', width / 2, height - 16);
    ctx.textAlign = 'left';

    // Generar la URL de la imatge com a PNG d'alta qualitat
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    setImageUrl(dataUrl);
    setIsGenerating(false);
  };

  // Funció auxiliar per truncar text i evitar desbordaments visuals al canvas
  const renderTruncatedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number
  ) => {
    if (ctx.measureText(text).width <= maxWidth) {
      ctx.fillText(text, x, y);
      return;
    }
    let truncated = text;
    while (truncated.length > 3 && ctx.measureText(truncated + '...').width > maxWidth) {
      truncated = truncated.slice(0, -1);
    }
    ctx.fillText(truncated + '...', x, y);
  };

  // Dibuixar la imatge automàticament quan canvia el menú
  useEffect(() => {
    // Petit retard per assegurar que els tipus de lletra del sistema estiguin disponibles
    const timer = setTimeout(() => {
      drawWeeklyImage();
    }, 100);
    return () => clearTimeout(timer);
  }, [menu]);

  // Acció de descàrrega
  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.download = 'menu-setmanal.png';
    link.href = imageUrl;
    link.click();
  };

  // Acció de copiar al portapapers com a imatge
  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } catch {
      // Fallback si l'API del navegador no suporta clipboard d'imatges directes
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Acció d'impressió
  const handlePrint = () => {
    if (!imageUrl) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Menú setmanal - Impressió</title>
          <style>
            body { margin: 0; padding: 15px; display: flex; justify-content: center; align-items: center; background: #fff; }
            img { max-width: 100%; height: auto; border: 1px solid #ccc; border-radius: 8px; }
            @page { size: landscape; margin: 1cm; }
          </style>
        </head>
        <body>
          <img src="${imageUrl}" onload="window.print();window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900/90 p-4 sm:p-8 flex flex-col justify-center items-center overflow-auto' : ''}`}>
      {/* Canvas ocult utilitzat per dibuixar la imatge en alta resolució */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Barra de controls superior */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xl">🖼️</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Menú
              </h2>
              <p className="text-xs text-slate-500">
                Tots els 7 dies de la setmana en un sol cop d'ull sense scroll
              </p>
            </div>
          </div>
        </div>

        {/* Botons d'acció */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Selector de mode: Menú setmanal vs Graella Compacta */}
          <div className="bg-slate-100 p-0.5 rounded-lg flex items-center border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('image')}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                viewMode === 'image'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Menú setmanal
            </button>
            <button
              onClick={() => setViewMode('compactGrid')}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                viewMode === 'compactGrid'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5" />
              Graella Compacta
            </button>
          </div>

          <button
            onClick={drawWeeklyImage}
            title="Regenerar imatge amb els canvis actuals"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin text-emerald-600' : ''}`} />
          </button>

          <button
            id="btn-copy-menu-image"
            onClick={handleCopyImage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 text-xs font-semibold rounded-lg transition-all cursor-pointer"
            title="Copiar imatge per enganxar a WhatsApp o Notes"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copiat!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copiar
              </>
            )}
          </button>

          <button
            id="btn-print-menu-image"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir
          </button>

          <button
            id="btn-download-menu-image"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Descarregar Imatge (.png)
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            title={isFullscreen ? 'Sortir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Contingut: Vista 1 - Imatge visual real d'un cop d'ull */}
      {viewMode === 'image' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-2 sm:p-4 shadow-sm flex flex-col items-center justify-center min-h-[500px] overflow-hidden">
          {imageUrl ? (
            <div className="relative group max-w-full flex justify-center">
              <img
                src={imageUrl}
                alt="Menú setmanal d'un sol cop d'ull"
                className="max-h-[70vh] w-auto object-contain rounded-xl border border-slate-200 shadow-md transition-transform"
              />
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md pointer-events-none">
                💡 Clic dret per desar o copiar
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
              <p className="text-sm font-medium">Generant la imatge del menú setmanal...</p>
            </div>
          )}
        </div>
      )}

      {/* Contingut: Vista 2 - Resum net dels 7 dies de la setmana (sense imatges, estil resum d'historial) */}
      {viewMode === 'compactGrid' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <TableProperties className="w-5 h-5 text-emerald-700" />
                Resum setmanal dels 7 dies
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Vista ràpida i neta de tots els dinars i sopars de la setmana adaptats als ingredients de cada plat.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              14 àpats
            </span>
          </div>

          <div className="space-y-3">
            {DIES_SETMANA.map((day) => {
              const dinar = menu[day]?.Dinar;
              const sopar = menu[day]?.Sopar;
              const isWeekend = day === 'Dissabte' || day === 'Diumenge';

              // Títols adaptats als ingredients
              const dinarTitle = dinar ? getDishShortTitle(dinar, true) : 'Sense planificar';
              const soparTitle = sopar ? getDishShortTitle(sopar, true) : 'Sense planificar';

              return (
                <div
                  key={day}
                  className={`rounded-2xl border transition-all p-3.5 sm:p-4.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    isWeekend
                      ? 'bg-slate-50/70 border-slate-200/90'
                      : 'bg-white border-slate-200/90 hover:border-emerald-300 shadow-2xs'
                  }`}
                >
                  {/* Etiqueta del Dia */}
                  <div className="w-full md:w-36 shrink-0 flex items-center justify-between md:flex-col md:items-start gap-1 pb-2 md:pb-0 border-b md:border-b-0 border-slate-100">
                    <span className="text-sm font-bold text-slate-900 tracking-tight">
                      {day}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        isWeekend
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                      }`}
                    >
                      {isWeekend ? 'Cap de setmana' : 'Feiner'}
                    </span>
                  </div>

                  {/* Contingut dels àpats: Dinar i Sopar */}
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
                    {/* Bloc Dinar */}
                    <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10.5px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                            <Sun className="w-3.5 h-3.5 text-amber-600" />
                            Dinar
                          </span>
                          {dinar?.isFavorite && (
                            <span className="text-xs" title="Plat favorit">⭐</span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {dinarTitle}
                        </h4>

                        <div className="text-xs text-slate-600 mt-1.5 space-y-0.5">
                          <div className="truncate">
                            <span className="text-slate-500">🍞 Farinaci:</span> <span className="font-medium text-slate-800">{dinar?.farinaci || '---'}</span>
                          </div>
                          <div className="truncate">
                            <span className="text-slate-500">🍗 Proteïna:</span> <span className="font-medium text-slate-800">{dinar?.proteines?.join(', ') || '---'}</span>
                          </div>
                          <div className="truncate">
                            <span className="text-slate-500">🥬 Verdura:</span> <span className="text-slate-700">{dinar?.verdures?.join(', ') || '---'}</span>
                          </div>
                        </div>
                      </div>

                      {onNavigateToMeal && (
                        <div className="pt-2 mt-2 border-t border-amber-100/80 flex justify-end">
                          <button
                            onClick={() => onNavigateToMeal(day, 'Dinar')}
                            className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 hover:underline cursor-pointer"
                          >
                            Editar àpat →
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Bloc Sopar */}
                    <div className="bg-emerald-50/40 border border-emerald-200/60 rounded-xl p-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10.5px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                            <Moon className="w-3.5 h-3.5 text-emerald-600" />
                            Sopar
                          </span>
                          {sopar?.isFavorite && (
                            <span className="text-xs" title="Plat favorit">⭐</span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {soparTitle}
                        </h4>

                        <div className="text-xs text-slate-600 mt-1.5 space-y-0.5">
                          <div className="truncate">
                            <span className="text-slate-500">🍞 Farinaci:</span> <span className="font-medium text-slate-800">{sopar?.farinaci || '---'}</span>
                          </div>
                          <div className="truncate">
                            <span className="text-slate-500">🍗 Proteïna:</span> <span className="font-medium text-slate-800">{sopar?.proteines?.join(', ') || '---'}</span>
                          </div>
                          <div className="truncate">
                            <span className="text-slate-500">🥬 Verdura:</span> <span className="text-slate-700">{sopar?.verdures?.join(', ') || '---'}</span>
                          </div>
                        </div>
                      </div>

                      {onNavigateToMeal && (
                        <div className="pt-2 mt-2 border-t border-emerald-100/80 flex justify-end">
                          <button
                            onClick={() => onNavigateToMeal(day, 'Sopar')}
                            className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
                          >
                            Editar àpat →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Consell d'ús */}
      <div className="flex items-center justify-between px-3 py-2 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-800">
        <span className="flex items-center gap-1.5">
          <span>💡</span>
          <strong>Comoditat total:</strong> Guarda la imatge al teu mòbil o imprimeix-la per tenir el menú de tota la setmana a la nevera d'un sol cop d'ull.
        </span>
        {onGenerateMenu && (
          <button
            onClick={onGenerateMenu}
            className="font-semibold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1 cursor-pointer shrink-0 ml-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generar un altre menú
          </button>
        )}
      </div>
    </div>
  );
};
