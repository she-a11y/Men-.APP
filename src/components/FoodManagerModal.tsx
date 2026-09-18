import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  Search,
  Check,
  Apple,
  Scale,
  Save,
  Info,
} from 'lucide-react';
import { Product, GroupType } from '../types';
import { PRODUCTS_LIST, INTERCANVIS as DEFAULT_INTERCANVIS } from '../data/products';
import { IntercanvisConfig } from '../utils/productStorage';

interface FoodManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  intercanvis: IntercanvisConfig;
  onSaveProducts: (updatedProducts: Product[]) => void;
  onSaveIntercanvis: (updatedIntercanvis: IntercanvisConfig) => void;
  onResetProducts: () => void;
  onResetIntercanvis: () => void;
}

const SUPERMERCATS = ['Mercadona', 'Bonpreu', 'Carrefour', 'Lidl', 'Aldi', 'Consum', 'Altre'];
const SECCIONS = [
  'Rebost',
  'Carnisseria i Embotits',
  'Peixateria i Congelats',
  'Fruiteria i Verdura',
  'Làctics i Formatges',
  'Olis i Fruits Secs',
  'Forn i Pa',
];

export const FoodManagerModal: React.FC<FoodManagerModalProps> = ({
  isOpen,
  onClose,
  products,
  intercanvis,
  onSaveProducts,
  onSaveIntercanvis,
  onResetProducts,
  onResetIntercanvis,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'aliments' | 'pautes'>('aliments');

  // Filtres per aliments
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<GroupType | 'Tots'>('Tots');

  // Modal d'edició / creació d'aliment
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Estat temporal d'aliment en formulari
  const [formNom, setFormNom] = useState('');
  const [formGrup, setFormGrup] = useState<GroupType>('Proteïnes');
  const [formSupermercat, setFormSupermercat] = useState('Mercadona');
  const [formRacioG, setFormRacioG] = useState(30);
  const [formUnitat, setFormUnitat] = useState('g');
  const [formFormatCompra, setFormFormatCompra] = useState(500);
  const [formFormatUnitat, setFormFormatUnitat] = useState('g');
  const [formSeccio, setFormSeccio] = useState('Carnisseria i Embotits');
  const [formPreu, setFormPreu] = useState(2.5);
  const [formKcal, setFormKcal] = useState(120);
  const [formProt, setFormProt] = useState(20);
  const [formCarbs, setFormCarbs] = useState(0);
  const [formGreix, setFormGreix] = useState(3);

  // Estat temporal de pautes nutricionals (Sheila i Marc)
  const [localIntercanvis, setLocalIntercanvis] = useState<IntercanvisConfig>(() =>
    JSON.parse(JSON.stringify(intercanvis))
  );
  const [pautesSavedSuccess, setPautesSavedSuccess] = useState(false);

  if (!isOpen) return null;

  // Filtrar productes
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.nom.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGroup = selectedGroup === 'Tots' || p.grup === selectedGroup;
    return matchSearch && matchGroup;
  });

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setIsCreatingNew(false);
    setFormNom(p.nom);
    setFormGrup(p.grup);
    setFormSupermercat(p.supermercat || 'Mercadona');
    setFormRacioG(p.racio_g);
    setFormUnitat(p.unitat || 'g');
    setFormFormatCompra(p.format_compra);
    setFormFormatUnitat(p.format_unitat || 'g');
    setFormSeccio(p.seccio || 'Rebost');
    setFormPreu(p.preu_format || 0);
    setFormKcal(p.calories_per_100g || 0);
    setFormProt(p.proteines_per_100g || 0);
    setFormCarbs(p.carbs_per_100g || 0);
    setFormGreix(p.greixos_per_100g || 0);
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsCreatingNew(true);
    setFormNom('');
    setFormGrup('Proteïnes');
    setFormSupermercat('Mercadona');
    setFormRacioG(30);
    setFormUnitat('g');
    setFormFormatCompra(400);
    setFormFormatUnitat('g');
    setFormSeccio('Carnisseria i Embotits');
    setFormPreu(2.95);
    setFormKcal(110);
    setFormProt(22);
    setFormCarbs(0);
    setFormGreix(2);
  };

  const handleCloseForm = () => {
    setEditingProduct(null);
    setIsCreatingNew(false);
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNom.trim()) {
      alert('Introdueix el nom del producte');
      return;
    }

    const updatedProduct: Product = {
      nom: formNom.trim(),
      grup: formGrup,
      supermercat: formSupermercat,
      racio_g: Number(formRacioG) || 1,
      unitat: formUnitat,
      format_compra: Number(formFormatCompra) || 1,
      format_unitat: formFormatUnitat,
      seccio: formSeccio,
      preu_format: Number(formPreu) || 0,
      calories_per_100g: Number(formKcal) || 0,
      proteines_per_100g: Number(formProt) || 0,
      carbs_per_100g: Number(formCarbs) || 0,
      greixos_per_100g: Number(formGreix) || 0,
    };

    if (isCreatingNew) {
      // Evitar duplicats pel mateix nom
      if (products.some((p) => p.nom.toLowerCase() === updatedProduct.nom.toLowerCase())) {
        alert('Ja existeix un aliment amb aquest mateix nom. Tria un nom diferent.');
        return;
      }
      onSaveProducts([...products, updatedProduct]);
    } else if (editingProduct) {
      onSaveProducts(
        products.map((p) => (p.nom === editingProduct.nom ? updatedProduct : p))
      );
    }

    handleCloseForm();
  };

  const handleDeleteProduct = (nom: string) => {
    if (window.confirm(`Segur que vols eliminar l'aliment "${nom}" del catàleg?`)) {
      onSaveProducts(products.filter((p) => p.nom !== nom));
    }
  };

  const handleResetProductsList = () => {
    if (
      window.confirm(
        'Vols restaurar tots els aliments i gramatges als valors inicials de fàbrica? Es perdran els aliments creats manualment.'
      )
    ) {
      onResetProducts();
    }
  };

  const handleSavePautes = () => {
    onSaveIntercanvis(localIntercanvis);
    setPautesSavedSuccess(true);
    setTimeout(() => setPautesSavedSuccess(false), 3000);
  };

  const handleResetPautes = () => {
    if (
      window.confirm(
        'Vols restaurar les racions i intercanvis originals de la Sheila i en Marc (1.745 i 2.275 kcal)?'
      )
    ) {
      setLocalIntercanvis(JSON.parse(JSON.stringify(DEFAULT_INTERCANVIS)));
      onResetIntercanvis();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Capçalera */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold shadow-2xs">
              ⚖️
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                Gestió d&apos;aliments i racions
              </h2>
              <p className="text-xs text-slate-500">
                Personalitza els productes, gramatges i pautes de la nutricionista sense necessitat de tocar codi.
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

        {/* Pestanyes internes */}
        <div className="flex border-b border-slate-200 bg-white px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveSubTab('aliments')}
            className={`pb-2.5 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'aliments'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Apple className="w-4 h-4" />
            Catàleg d&apos;aliments ({products.length})
          </button>
          <button
            onClick={() => setActiveSubTab('pautes')}
            className={`pb-2.5 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'pautes'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Scale className="w-4 h-4" />
            Pautes nutricionals (Sheila i Marc)
          </button>
        </div>

        {/* Contingut */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/40">
          {/* SUB-TAB 1: ALIMENTS I GRAMATGES */}
          {activeSubTab === 'aliments' && (
            <div className="space-y-4">
              {/* Barra de controls: cerca, filtre per grup i botó afegir */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cerca un aliment per nom..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  {(['Tots', 'Farinacis', 'Proteïnes', 'Verdures', 'Greixos'] as const).map((grp) => (
                    <button
                      key={grp}
                      onClick={() => setSelectedGroup(grp)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                        selectedGroup === grp
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {grp}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleOpenCreate}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Nou aliment
                  </button>
                  <button
                    onClick={handleResetProductsList}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Restaurar llista inicial de fàbrica"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Llistat d'aliments */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                        <th className="py-2.5 px-3">Aliment</th>
                        <th className="py-2.5 px-3">Grup</th>
                        <th className="py-2.5 px-3">Ració d&apos;intercanvi</th>
                        <th className="py-2.5 px-3">Format de compra</th>
                        <th className="py-2.5 px-3">Preu</th>
                        <th className="py-2.5 px-3 text-right">Accions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-slate-400">
                            Cap aliment coincideix amb la cerca.
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((p) => (
                          <tr key={p.nom} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2.5 px-3 font-semibold text-slate-900">
                              {p.nom}
                              <span className="block text-[10px] text-slate-400 font-normal">
                                {p.seccio} · {p.calories_per_100g} kcal / 100g
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`inline-block text-[10.5px] font-bold px-2 py-0.5 rounded-md ${
                                  p.grup === 'Farinacis'
                                    ? 'bg-amber-100 text-amber-900'
                                    : p.grup === 'Proteïnes'
                                    ? 'bg-rose-100 text-rose-900'
                                    : p.grup === 'Verdures'
                                    ? 'bg-emerald-100 text-emerald-900'
                                    : 'bg-teal-100 text-teal-900'
                                }`}
                              >
                                {p.grup}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-medium text-slate-700">
                              <b>{p.racio_g}</b> {p.unitat}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">
                              {p.format_compra} {p.format_unitat}
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">
                              {p.preu_format ? `${p.preu_format.toFixed(2)} €` : '---'}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => handleOpenEdit(p)}
                                  className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                  title="Editar aliment"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.nom)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Eliminar aliment"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 2: PAUTES NUTRICIONALS DE LA NUTRICIONISTA */}
          {activeSubTab === 'pautes' && (
            <div className="space-y-6">
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Ajust de racions segons la vostra nutricionista:</strong>
                  <p className="mt-0.5 text-amber-800">
                    Aquests valors defineixen el nombre d&apos;intercanvis (racions) que us corresponen a cadascun per Dinar i Sopar. Si la vostra nutricionista us canvia les quantitats, modifiqueu els números i tots els càlculs de l&apos;aplicació (pes de cada plat, llista de la compra acumulada i kcal totals) s&apos;actualitzaran automàticament.
                  </p>
                </div>
              </div>

              {pautesSavedSuccess && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-700" />
                  Pautes guardades correctament! S&apos;han actualitzat tots els càlculs de l&apos;aplicació.
                </div>
              )}

              {/* Taula Sheila */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👩</span>
                    <h3 className="text-base font-bold text-slate-900">Sheila</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-medium">Objectiu diari:</span>
                    <input
                      type="number"
                      value={localIntercanvis.Sheila.calories}
                      onChange={(e) =>
                        setLocalIntercanvis({
                          ...localIntercanvis,
                          Sheila: {
                            ...localIntercanvis.Sheila,
                            calories: Number(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-20 px-2 py-1 border border-slate-200 rounded-lg font-bold text-emerald-800 text-center text-xs"
                    />
                    <span className="text-slate-400 font-medium">kcal</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Dinar Sheila */}
                  <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 space-y-2">
                    <h4 className="font-bold text-amber-900 uppercase tracking-wider text-[11px]">
                      ☀️ Dinar (Racions d&apos;intercanvi)
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-500 block text-[11px]">🍞 Farinacis</label>
                        <input
                          type="number"
                          step="0.5"
                          value={localIntercanvis.Sheila.Dinar.Farinacis}
                          onChange={(e) =>
                            setLocalIntercanvis({
                              ...localIntercanvis,
                              Sheila: {
                                ...localIntercanvis.Sheila,
                                Dinar: {
                                  ...localIntercanvis.Sheila.Dinar,
                                  Farinacis: Number(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded-md font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block text-[11px]">🍗 Proteïnes</label>
                        <input
                          type="number"
                          step="0.5"
                          value={localIntercanvis.Sheila.Dinar.Proteïnes}
                          onChange={(e) =>
                            setLocalIntercanvis({
                              ...localIntercanvis,
                              Sheila: {
                                ...localIntercanvis.Sheila,
                                Dinar: {
                                  ...localIntercanvis.Sheila.Dinar,
                                  Proteïnes: Number(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded-md font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block text-[11px]">🥬 Verdures</label>
                        <input
                          type="number"
                          step="0.5"
                          value={localIntercanvis.Sheila.Dinar.Verdures}
                          onChange={(e) =>
                            setLocalIntercanvis({
                              ...localIntercanvis,
                              Sheila: {
                                ...localIntercanvis.Sheila,
                                Dinar: {
                                  ...localIntercanvis.Sheila.Dinar,
                                  Verdures: Number(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded-md font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block text-[11px]">🥑 Greixos</label>
                        <input
                          type="number"
                          step="0.5"
                          value={localIntercanvis.Sheila.Dinar.Greixos}
                          onChange={(e) =>
                            setLocalIntercanvis({
                              ...localIntercanvis,
                              Sheila: {
                                ...localIntercanvis.Sheila,
                                Dinar: {
                                  ...localIntercanvis.Sheila.Dinar,
                                  Greixos: Number(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded-md font-semibold text-slate-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sopar Sheila */}
                  <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                    <h4 className="font-bold text-emerald-900 uppercase tracking-wider text-[11px]">
                      🌙 Sopar (Racions d&apos;intercanvi)
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-500 block text-[11px]">🍞 Farinacis</label>
                        <input
                          type="number"
                          step="0.5"
                          value={localIntercanvis.Sheila.Sopar.Farinacis}
                          onChange={(e) =>
                            setLocalIntercanvis({
                              ...localIntercanvis,
                              Sheila: {
                                ...localIntercanvis.Sheila,
                                Sopar: {
                                  ...localIntercanvis.Sheila.Sopar,
                                  Farinacis: Number(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded-md font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block text-[11px]">🍗 Proteïnes</label>
                        <input
                          type="number"
                          step="0.5"
                          value={localIntercanvis.Sheila.Sopar.Proteïnes}
                          onChange={(e) =>
                            setLocalIntercanvis({
                              ...localIntercanvis,
                              Sheila: {
                                ...localIntercanvis.Sheila,
                                Sopar: {
                                  ...localIntercanvis.Sheila.Sopar,
                                  Proteïnes: Number(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded-md font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block text-[11px]">🥬 Verdures</label>
                        <input
                          type="number"
                          step="0.5"
                          value={localIntercanvis.Sheila.Sopar.Verdures}
                          onChange={(e) =>
                            setLocalIntercanvis({
                              ...localIntercanvis,
                              Sheila: {
                                ...localIntercanvis.Sheila,
                                Sopar: {
                                  ...localIntercanvis.Sheila.Sopar,
                                  Verdures: Number(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded-md font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block text-[11px]">🥑 Greixos</label>
                        <input
                          type="number"
                          step="0.5"
                          value={localIntercanvis.Sheila.Sopar.Greixos}
                          onChange={(e) =>
                            setLocalIntercanvis({
                              ...localIntercanvis,
                              Sheila: {
                                ...localIntercanvis.Sheila,
                                Sopar: {
                                  ...localIntercanvis.Sheila.Sopar,
                                  Greixos: Number(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded-md font-semibold text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Taula Marc */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👨</span>
                    <h3 className="text-base font-bold text-slate-900">Marc</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-medium">Objectiu diari:</span>
                    <input
                      type="number"
                      value={localIntercanvis.Marc.calories}
                      onChange={(e) =>
                        setLocalIntercanvis({
                          ...localIntercanvis,
                          Marc: {
                            ...localIntercanvis.Marc,
                            calories: Number(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-20 px-2 py-1 border border-slate-200 rounded-lg font-bold text-teal-800 text-center text-xs"
                    />
                    <span className="text-slate-400 font-medium">kcal</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Dinar Marc */}
                  <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 space-y-2">
                    <h4 className="font-bold text-amber-900 uppercase tracking-wider text-[11px]">
                      ☀️ Dinar (Racions d&apos;intercanvi)
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-500 block text-[11px]">🍞 Farinacis</label>
                        <input
                          type="number"
                          step="0.5"
                          value={localIntercanvis.Marc.Dinar.Farinacis}
                          onChange={(e) =>
                            setLocalIntercanvis({
                              ...localIntercanvis,
                              Marc: {
                                ...localIntercanvis.Marc,
                                Dinar: {
                                  ...localIntercanvis.Marc.Dinar,
                                  Farinacis: Number(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded-md font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block text-[11px]">🍗 Proteïnes</label>
                        <input
                          type="number"
                          step="0.5"
                          value={localIntercanvis.Marc.Dinar.Proteïnes}
                          onChange={(e) =>
                            setLocalIntercanvis({
                              ...localIntercanvis,
                              Marc: {
                                ...localIntercanvis.Marc,
                                Dinar: {
                                  ...localIntercanvis.Marc.Dinar,
                                  Proteïnes: Number(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded-md font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block text-[11px]">🥬 Verdures</label>
                        <input
                          type="number"
                          step="0.5"
                          value={localIntercanvis.Marc.Dinar.Verdures}
                          onChange={(e) =>
                            setLocalIntercanvis({
                              ...localIntercanvis,
                              Marc: {
                                ...localIntercanvis.Marc,
                                Dinar: {
                                  ...localIntercanvis.Marc.Dinar,
                                  Verdures: Number(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded-md font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block text-[11px]">🥑 Greixos</label>
                        <input
                          type="number"
                          step="0.5"
                          value={localIntercanvis.Marc.Dinar.Greixos}
                          onChange={(e) =>
                            setLocalIntercanvis({
                              ...localIntercanvis,
                              Marc: {
                                ...localIntercanvis.Marc,
                                Dinar: {
                                  ...localIntercanvis.Marc.Dinar,
                                  Greixos: Number(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded-md font-semibold text-slate-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sopar Marc */}
                  <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                    <h4 className="font-bold text-emerald-900 uppercase tracking-wider text-[11px]">
                      🌙 Sopar (Racions d&apos;intercanvi)
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-500 block text-[11px]">🍞 Farinacis</label>
                        <input
                          type="number"
                          step="0.5"
                          value={localIntercanvis.Marc.Sopar.Farinacis}
                          onChange={(e) =>
                            setLocalIntercanvis({
                              ...localIntercanvis,
                              Marc: {
                                ...localIntercanvis.Marc,
                                Sopar: {
                                  ...localIntercanvis.Marc.Sopar,
                                  Farinacis: Number(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded-md font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block text-[11px]">🍗 Proteïnes</label>
                        <input
                          type="number"
                          step="0.5"
                          value={localIntercanvis.Marc.Sopar.Proteïnes}
                          onChange={(e) =>
                            setLocalIntercanvis({
                              ...localIntercanvis,
                              Marc: {
                                ...localIntercanvis.Marc,
                                Sopar: {
                                  ...localIntercanvis.Marc.Sopar,
                                  Proteïnes: Number(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded-md font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block text-[11px]">🥬 Verdures</label>
                        <input
                          type="number"
                          step="0.5"
                          value={localIntercanvis.Marc.Sopar.Verdures}
                          onChange={(e) =>
                            setLocalIntercanvis({
                              ...localIntercanvis,
                              Marc: {
                                ...localIntercanvis.Marc,
                                Sopar: {
                                  ...localIntercanvis.Marc.Sopar,
                                  Verdures: Number(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded-md font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 block text-[11px]">🥑 Greixos</label>
                        <input
                          type="number"
                          step="0.5"
                          value={localIntercanvis.Marc.Sopar.Greixos}
                          onChange={(e) =>
                            setLocalIntercanvis({
                              ...localIntercanvis,
                              Marc: {
                                ...localIntercanvis.Marc,
                                Sopar: {
                                  ...localIntercanvis.Marc.Sopar,
                                  Greixos: Number(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded-md font-semibold text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botons d'acció pautes */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleResetPautes}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restaurar pautes inicials (Nutricionista)
                </button>

                <button
                  type="button"
                  onClick={handleSavePautes}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Guardar i aplicar pautes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Formulari d'edició / creació d'aliment (Modal superposat) */}
        {(editingProduct || isCreatingNew) && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-slate-950/50 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-base font-bold text-slate-900">
                  {isCreatingNew ? '➕ Afegir nou aliment' : `✏️ Editar: ${editingProduct?.nom}`}
                </h3>
                <button
                  onClick={handleCloseForm}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProductForm} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nom de l&apos;aliment</label>
                  <input
                    type="text"
                    required
                    value={formNom}
                    onChange={(e) => setFormNom(e.target.value)}
                    placeholder="Ex: Orada fresca, Tempeh marinat, Arròs salvatge..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Grup principal</label>
                    <select
                      value={formGrup}
                      onChange={(e) => setFormGrup(e.target.value as GroupType)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-800"
                    >
                      <option value="Farinacis">🍞 Farinacis</option>
                      <option value="Proteïnes">🍗 Proteïnes</option>
                      <option value="Verdures">🥬 Verdures</option>
                      <option value="Greixos">🥑 Greixos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Supermercat</label>
                    <select
                      value={formSupermercat}
                      onChange={(e) => setFormSupermercat(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-800"
                    >
                      {SUPERMERCATS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Pes d&apos;1 ració d&apos;intercanvi
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="number"
                        min="0.1"
                        step="0.5"
                        required
                        value={formRacioG}
                        onChange={(e) => setFormRacioG(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-semibold"
                      />
                      <select
                        value={formUnitat}
                        onChange={(e) => setFormUnitat(e.target.value)}
                        className="px-2 py-1.5 border border-slate-300 rounded-lg"
                      >
                        <option value="g">g</option>
                        <option value="ml">ml</option>
                        <option value="unitat">unitat</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Format de compra</label>
                    <div className="flex gap-1.5">
                      <input
                        type="number"
                        min="1"
                        required
                        value={formFormatCompra}
                        onChange={(e) => setFormFormatCompra(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-semibold"
                      />
                      <select
                        value={formFormatUnitat}
                        onChange={(e) => setFormFormatUnitat(e.target.value)}
                        className="px-2 py-1.5 border border-slate-300 rounded-lg"
                      >
                        <option value="g">g</option>
                        <option value="ml">ml</option>
                        <option value="unitat">unitat</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Secció al supermercat</label>
                    <select
                      value={formSeccio}
                      onChange={(e) => setFormSeccio(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-800"
                    >
                      {SECCIONS.map((sec) => (
                        <option key={sec} value={sec}>
                          {sec}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Preu per paquet (€)</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      value={formPreu}
                      onChange={(e) => setFormPreu(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-semibold"
                    />
                  </div>
                </div>

                {/* Valors per 100g */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="block font-semibold text-slate-600 mb-1.5 text-[11px]">
                    Valors nutricionals per 100g (Opcional):
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block">Kcal</label>
                      <input
                        type="number"
                        value={formKcal}
                        onChange={(e) => setFormKcal(Number(e.target.value))}
                        className="w-full px-2 py-1 border border-slate-200 rounded text-center font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block">Proteïnes</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formProt}
                        onChange={(e) => setFormProt(Number(e.target.value))}
                        className="w-full px-2 py-1 border border-slate-200 rounded text-center font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block">Carbs</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formCarbs}
                        onChange={(e) => setFormCarbs(Number(e.target.value))}
                        className="w-full px-2 py-1 border border-slate-200 rounded text-center font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block">Greixos</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formGreix}
                        onChange={(e) => setFormGreix(Number(e.target.value))}
                        className="w-full px-2 py-1 border border-slate-200 rounded text-center font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel·lar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
                  >
                    Guardar aliment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
