import React, { useState } from 'react';
import { ShoppingItem } from '../types';
import {
  ShoppingBag,
  CheckCircle2,
  Circle,
  FileSpreadsheet,
  Coins,
  CheckSquare,
  Square,
  PiggyBank,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';

interface ShoppingListViewProps {
  shoppingList: ShoppingItem[];
  onExportExcel: () => void;
  onUpdateQuantity?: (nom: string, packages: number) => void;
  onResetQuantity?: (nom: string) => void;
  onResetAllQuantities?: () => void;
}

const SECCIONS_ICONS: Record<string, string> = {
  'Fruiteria i Verdura': '🥬',
  'Carnisseria i Embotits': '🥩',
  'Peixateria i Congelats': '🐟',
  'Rebost': '🥫',
  'Forn i Pa': '🥖',
  'Làctics i Formatges': '🧀',
  'Olis i Fruits Secs': '🥜',
};

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  shoppingList,
  onExportExcel,
  onUpdateQuantity,
  onResetQuantity,
  onResetAllQuantities,
}) => {
  const [checkedCart, setCheckedCart] = useState<Set<string>>(new Set());
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  const handleCopyWhatsApp = () => {
    const toBuyItems = shoppingList.filter((item) => !item.inPantry && item.packages > 0);
    const totalP = toBuyItems.reduce((acc, curr) => acc + curr.packages, 0);
    const totalE = toBuyItems.reduce((sum, item) => sum + (item.total_preu || item.packages * (item.preu_format || 0)), 0);

    const sectionsMapForText = new Map<string, ShoppingItem[]>();
    for (const item of toBuyItems) {
      if (!sectionsMapForText.has(item.seccio)) {
        sectionsMapForText.set(item.seccio, []);
      }
      sectionsMapForText.get(item.seccio)!.push(item);
    }

    let text = `🛒 *LLISTA DE LA COMPRA SETMANAL*\n`;
    text += `Total: ${totalP} paquets (~${totalE.toFixed(2)} €)\n\n`;

    for (const [sec, items] of sectionsMapForText.entries()) {
      const icon = SECCIONS_ICONS[sec] || '📦';
      text += `${icon} *${sec}*\n`;
      for (const item of items) {
        text += `[ ] ${item.nom} - *${item.packages}* ${item.packages === 1 ? 'paquet' : 'paquets'} (${item.format_compra}${item.format_unitat})\n`;
      }
      text += `\n`;
    }

    navigator.clipboard.writeText(text.trim());
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2500);
  };

  const toggleCartItem = (nom: string) => {
    const next = new Set(checkedCart);
    if (next.has(nom)) {
      next.delete(nom);
    } else {
      next.add(nom);
    }
    setCheckedCart(next);
  };

  const markAllAsChecked = () => {
    const allToBuy = shoppingList.filter((i) => !i.inPantry && i.packages > 0).map((i) => i.nom);
    setCheckedCart(new Set(allToBuy));
  };

  const clearCheckedCart = () => {
    setCheckedCart(new Set());
  };

  // Productes a comprar i al rebost
  const toBuy = shoppingList.filter((item) => !item.inPantry && item.packages > 0);
  const inPantry = shoppingList.filter((item) => item.inPantry);
  const customItemsCount = shoppingList.filter((item) => item.isCustomPackages).length;

  const totalPackages = toBuy.reduce((acc, curr) => acc + curr.packages, 0);

  // Càlcul de diners
  const totalCost = toBuy.reduce(
    (sum, item) => sum + (item.total_preu || item.packages * (item.preu_format || 0)),
    0
  );
  const checkedCost = toBuy
    .filter((item) => checkedCart.has(item.nom))
    .reduce((sum, item) => sum + (item.total_preu || item.packages * (item.preu_format || 0)), 0);
  const remainingCost = Math.max(0, totalCost - checkedCost);
  const pantrySavings = inPantry.reduce(
    (sum, item) => sum + Math.ceil(item.totalNeeded / item.format_compra) * (item.preu_format || 0),
    0
  );

  const cartPercentage = totalCost > 0 ? Math.round((checkedCost / totalCost) * 100) : 0;

  // Group by section
  const sectionsMap = new Map<string, ShoppingItem[]>();
  for (const item of shoppingList) {
    if (!sectionsMap.has(item.seccio)) {
      sectionsMap.set(item.seccio, []);
    }
    sectionsMap.get(item.seccio)!.push(item);
  }

  const sectionsList = Array.from(sectionsMap.entries());

  return (
    <div className="space-y-6">
      {/* Top Banner KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* KPI 1: Total diners */}
        <div className="bg-emerald-700 text-white rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-100 font-medium">Total de la Compra</p>
            <p className="text-2xl font-extrabold tracking-tight mt-0.5">
              {totalCost.toFixed(2)} €
            </p>
            <p className="text-[11px] text-emerald-200 mt-1">
              {totalPackages} paquets a Mercadona
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-600/60 border border-emerald-400/30 flex items-center justify-center text-2xl shrink-0">
            💶
          </div>
        </div>

        {/* KPI 2: Carretó & Progrés */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div className="w-full mr-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-slate-500 font-medium">Ja al carretó físic</p>
              <span className="text-xs font-bold text-emerald-700">{cartPercentage}%</span>
            </div>
            <p className="text-xl font-bold text-slate-900">{checkedCost.toFixed(2)} €</p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${cartPercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Falten {remainingCost.toFixed(2)} €</p>
          </div>
        </div>

        {/* KPI 3: Estalvi pel Rebost */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Estalvi pel teu Rebost</p>
            <p className="text-xl font-bold text-emerald-700 mt-0.5">
              +{pantrySavings.toFixed(2)} €
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              {inPantry.length} productes que ja tens
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4: Quantitats ajustades */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Ajustos manuals</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">
              {customItemsCount} modificats
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Adaptats al que ja tens a casa
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Avís explicatiu de modificació de quantitats */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-base">💡</span>
          <span className="text-amber-900">
            <b>Modificació de quantitats:</b> Pots augmentar o reduir els paquets a comprar amb els botons <b>+</b> i <b>-</b>, o posar-ho a <b>0</b> si ja en tens prou a casa. El cost i el total s&apos;actualitzen automàticament.
          </span>
        </div>

        {customItemsCount > 0 && onResetAllQuantities && (
          <button
            onClick={onResetAllQuantities}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg font-bold text-xs transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restablir quantitats originals ({customItemsCount})
          </button>
        )}
      </div>

      {/* Header bar: controls de compra i Excel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            Compra Mercadona
          </h2>
          <p className="text-xs text-slate-500">
            Llista calculada segons els 14 àpats de la parella amb formats oficials de Mercadona.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {checkedCart.size > 0 ? (
            <button
              onClick={clearCheckedCart}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              <Square className="w-3.5 h-3.5" />
              Desmarcar tot
            </button>
          ) : (
            <button
              onClick={markAllAsChecked}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              Marcar tot
            </button>
          )}

          <button
            onClick={handleCopyWhatsApp}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              copiedWhatsApp
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
            title="Copia la llista ordenada per seccions de supermercat amb caixes [ ] per enviar-la per WhatsApp"
          >
            {copiedWhatsApp ? (
              <>
                <Check className="w-4 h-4" />
                Copiat al porta-retalls!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-emerald-700" />
                Copiar per a WhatsApp
              </>
            )}
          </button>

          <button
            onClick={onExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-600" />
            Descarregar Excel
          </button>
        </div>
      </div>

      {/* Grouped by supermarket sections */}
      <div className="space-y-4">
        {sectionsList.map(([seccio, items]) => {
          const icon = SECCIONS_ICONS[seccio] || '🛒';
          const toBuyInSection = items.filter((i) => !i.inPantry && i.packages > 0);
          const inPantryInSection = items.filter((i) => i.inPantry || i.packages === 0);
          const sectionTotalCost = toBuyInSection.reduce((sum, i) => sum + i.total_preu, 0);

          return (
            <div
              key={seccio}
              className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden"
            >
              {/* Section Header */}
              <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{icon}</span>
                  <h3 className="font-bold text-slate-800 text-sm">{seccio}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                    Subtotal: {sectionTotalCost.toFixed(2)} €
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-700 font-medium">
                    {toBuyInSection.length} a comprar {inPantryInSection.length > 0 && `· ${inPantryInSection.length} al rebost / ja en tens`}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div className="divide-y divide-slate-100">
                {items.map((item) => {
                  const isChecked = checkedCart.has(item.nom);
                  const isZeroToBuy = item.inPantry || item.packages === 0;

                  return (
                    <div
                      key={item.nom}
                      className={`px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors ${
                        isZeroToBuy
                          ? 'bg-slate-50/60 text-slate-400'
                          : isChecked
                          ? 'bg-emerald-50/40 text-slate-400'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Left: Checkbox + Nom + Format */}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={isZeroToBuy}
                          onClick={() => toggleCartItem(item.nom)}
                          className={`p-1 rounded transition-colors ${
                            isZeroToBuy ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-200/60'
                          }`}
                          title={isZeroToBuy ? 'No cal comprar-ne' : 'Marcar al carretó'}
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                          )}
                        </button>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p
                              className={`text-sm font-semibold ${
                                isZeroToBuy
                                  ? 'line-through text-slate-400'
                                  : isChecked
                                  ? 'line-through text-slate-400'
                                  : 'text-slate-800'
                              }`}
                            >
                              {item.nom}
                            </p>

                            {item.inPantry && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                                Al Rebost
                              </span>
                            )}

                            {item.isCustomPackages && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                                Modificat
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-500 mt-0.5">
                            Format Mercadona:{' '}
                            <strong className="font-medium text-slate-700">
                              {item.format_compra} {item.format_unitat}
                            </strong>
                            <span className="text-slate-400 ml-1.5">
                              ({item.preu_format.toFixed(2)} €/paquet)
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Right: Consum net, Controls de quantitat (+/-), Paquets i Preu */}
                      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pl-7 md:pl-0">
                        {/* Consum matemàtic net de la setmana */}
                        <div className="text-right">
                          <div className="text-[11px] text-slate-400">Consum menú:</div>
                          <div className="text-xs font-mono font-bold text-slate-700">
                            {item.totalNeeded} {item.unitat}
                          </div>
                        </div>

                        {/* Modificador de quantitats (+ / -) */}
                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => {
                              if (onUpdateQuantity) {
                                onUpdateQuantity(item.nom, Math.max(0, item.packages - 1));
                              }
                            }}
                            disabled={item.packages <= 0}
                            className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                              item.packages <= 0
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-700 hover:bg-slate-100 hover:text-rose-600 cursor-pointer'
                            }`}
                            title="Reduir 1 paquet (si ja en tens a casa)"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <span className="w-7 text-center font-mono font-bold text-xs text-slate-800">
                            {item.packages}
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              if (onUpdateQuantity) {
                                onUpdateQuantity(item.nom, item.packages + 1);
                              }
                            }}
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition-colors cursor-pointer"
                            title="Augmentar 1 paquet"
                          >
                            <Plus className="w-3 h-3" />
                          </button>

                          {item.isCustomPackages && onResetQuantity && (
                            <button
                              type="button"
                              onClick={() => onResetQuantity(item.nom)}
                              className="ml-1 p-1 text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                              title={`Restablir a la quantitat calculada (${item.calculatedPackages ?? 0} paquets)`}
                            >
                              <RotateCcw className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {/* Paquets i Total en € */}
                        <div className="min-w-28 text-right flex items-center justify-end gap-2">
                          <span
                            className={`inline-block px-2.5 py-1 text-xs font-bold rounded-lg border ${
                              isZeroToBuy
                                ? 'bg-slate-100 text-slate-400 border-slate-200'
                                : isChecked
                                ? 'bg-slate-100 text-slate-400 border-slate-200'
                                : 'bg-emerald-100/80 text-emerald-900 border-emerald-200'
                            }`}
                          >
                            {item.packages} {item.packages === 1 ? 'paquet' : 'paquets'}
                          </span>
                          <span
                            className={`text-xs font-bold font-mono min-w-14 text-right ${
                              isZeroToBuy || isChecked ? 'text-slate-400 line-through' : 'text-slate-900'
                            }`}
                          >
                            {item.total_preu.toFixed(2)} €
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* FINAL DE LA SECCIÓ: TOTAL DE DINERS DE LA COMPRA */}
      {/* ========================================================================= */}
      <div
        id="total-diners-compra-final"
        className="bg-gradient-to-br from-emerald-900 via-emerald-850 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-emerald-700/50 mt-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-emerald-700/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-xs font-semibold text-emerald-200 mb-2">
              <Coins className="w-3.5 h-3.5 text-emerald-300" />
              Resum Econòmic Final
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Total de diners de la compra
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 max-w-xl">
              Càlcul matemàtic exacte del cost estimat a Mercadona, tenint en compte les quantitats que ja tens a casa i els teus ajustos personals.
            </p>
          </div>

          <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-2xl p-5 text-right flex flex-col justify-center min-w-60 shadow-inner">
            <span className="text-xs uppercase tracking-wider text-emerald-300 font-bold">
              Import Total Estimat
            </span>
            <span className="text-4xl sm:text-5xl font-black text-emerald-300 font-mono tracking-tight mt-1">
              {totalCost.toFixed(2)} €
            </span>
            <span className="text-[11px] text-emerald-200/70 mt-1">
              {totalPackages} paquets a adquirir
            </span>
          </div>
        </div>

        {/* Detalls de l'estalvi i ajustos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs sm:text-sm">
          <div className="bg-emerald-950/50 p-3.5 rounded-xl border border-emerald-800/60">
            <span className="text-emerald-300 font-bold block mb-1">
              🏡 Estalvi pel rebost:
            </span>
            <p className="text-emerald-100">
              Has estalviat <b>+{pantrySavings.toFixed(2)} €</b> en {inPantry.length} productes que ja tenies guardats a casa.
            </p>
          </div>

          <div className="bg-emerald-950/50 p-3.5 rounded-xl border border-emerald-800/60">
            <span className="text-emerald-300 font-bold block mb-1">
              🎯 Quantitats modificades:
            </span>
            <p className="text-emerald-100">
              {customItemsCount > 0 ? (
                <>Has ajustat manualment <b>{customItemsCount} productes</b> a la teva mida.</>
              ) : (
                <>Totes les quantitats coincideixen amb el càlcul teòric del menú.</>
              )}
            </p>
          </div>

          <div className="bg-emerald-950/50 p-3.5 rounded-xl border border-emerald-800/60">
            <span className="text-emerald-300 font-bold block mb-1">
              🛒 Progrés al supermercat:
            </span>
            <p className="text-emerald-100">
              Portes al carretó <b>{checkedCost.toFixed(2)} €</b> de {totalCost.toFixed(2)} € ({cartPercentage}% completat).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
