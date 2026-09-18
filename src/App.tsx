import React, { useState, useMemo, useEffect } from 'react';
import {
  generateInitialWeeklyMenu,
  generateSingleMeal,
  DIES_SETMANA,
  GUIA_TEMATICA,
  INITIAL_FAVORITES,
  PRODUCTS_LIST,
  INTERCANVIS as DEFAULT_INTERCANVIS,
} from './data/products';
import {
  WeeklyMenuState,
  DayOfWeek,
  MealType,
  MealConfig,
  FavoriteMeal,
  SeasonalDish,
  SavedWeeklyMenu,
  Product,
} from './types';
import { calculateShoppingList, exportToExcel } from './utils/calculator';
import { Header } from './components/Header';
import { MealCard } from './components/MealCard';
import { PantrySidebar } from './components/PantrySidebar';
import { ShoppingListView } from './components/ShoppingListView';
import { CodeModal } from './components/CodeModal';
import { NutritionSummary } from './components/NutritionSummary';
import { FavoritesView } from './components/FavoritesView';
import { CreateFavoriteModal } from './components/CreateFavoriteModal';
import { ProposalsView } from './components/ProposalsView';
import { WeeklyImageOverview } from './components/WeeklyImageOverview';
import { SavedMenusHistory } from './components/SavedMenusHistory';
import { FoodManagerModal } from './components/FoodManagerModal';
import { BackupModal, FullBackupData } from './components/BackupModal';
import {
  getInitialProducts,
  getInitialIntercanvis,
  syncGlobalProductsState,
  IntercanvisConfig,
  STORAGE_PRODUCTS_KEY,
  STORAGE_INTERCANVIS_KEY,
} from './utils/productStorage';
import { SlidersHorizontal, Calendar, Star, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function App() {
  // 0. Estat dels Productes i Intercanvis Nutricionals
  const [products, setProducts] = useState<Product[]>(() => getInitialProducts());
  const [intercanvis, setIntercanvis] = useState<IntercanvisConfig>(() => getInitialIntercanvis());
  const [isFoodManagerOpen, setIsFoodManagerOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // Sincronització inicial i reactiva
  useEffect(() => {
    syncGlobalProductsState(products, intercanvis);
  }, [products, intercanvis]);

  const handleSaveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(newProducts));
    syncGlobalProductsState(newProducts, intercanvis);
  };

  const handleSaveIntercanvis = (newIntercanvis: IntercanvisConfig) => {
    setIntercanvis(newIntercanvis);
    localStorage.setItem(STORAGE_INTERCANVIS_KEY, JSON.stringify(newIntercanvis));
    syncGlobalProductsState(products, newIntercanvis);
  };

  const handleResetProducts = () => {
    localStorage.removeItem(STORAGE_PRODUCTS_KEY);
    const fresh = [...PRODUCTS_LIST];
    setProducts(fresh);
    syncGlobalProductsState(fresh, intercanvis);
  };

  const handleResetIntercanvis = () => {
    localStorage.removeItem(STORAGE_INTERCANVIS_KEY);
    const fresh = JSON.parse(JSON.stringify(DEFAULT_INTERCANVIS));
    setIntercanvis(fresh);
    syncGlobalProductsState(products, fresh);
  };

  const handleRestoreBackup = (backup: FullBackupData) => {
    if (backup.menu) {
      updateMenu(backup.menu);
    }
    if (backup.favorites) {
      updateFavorites(backup.favorites);
    }
    if (backup.savedMenus) {
      updateSavedMenus(backup.savedMenus);
    }
    if (backup.rebost) {
      updateRebost(new Set(backup.rebost));
    }
    if (backup.customProducts) {
      setProducts(backup.customProducts);
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(backup.customProducts));
    }
    if (backup.customIntercanvis) {
      setIntercanvis(backup.customIntercanvis);
      localStorage.setItem(STORAGE_INTERCANVIS_KEY, JSON.stringify(backup.customIntercanvis));
    }
    if (backup.customQuantities) {
      setCustomQuantities(backup.customQuantities);
      localStorage.setItem('custom_quantities_compra', JSON.stringify(backup.customQuantities));
    }
    syncGlobalProductsState(
      backup.customProducts || products,
      backup.customIntercanvis || intercanvis
    );
  };

  // 1. Estat dels Plats Favorits
  const [favorites, setFavorites] = useState<FavoriteMeal[]>(() => {
    const saved = localStorage.getItem('favorits_parella');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_FAVORITES;
  });

  const [preferFavorites, setPreferFavorites] = useState<boolean>(() => {
    const saved = localStorage.getItem('prefer_favorits_flag');
    return saved ? JSON.parse(saved) : true;
  });

  const [isCreateFavOpen, setIsCreateFavOpen] = useState(false);

  const updateFavorites = (newFavs: FavoriteMeal[]) => {
    setFavorites(newFavs);
    localStorage.setItem('favorits_parella', JSON.stringify(newFavs));
  };

  const handleAddFavorite = (newFavData: Omit<FavoriteMeal, 'id' | 'createdAt'>) => {
    const newFav: FavoriteMeal = {
      ...newFavData,
      id: `fav-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: Date.now(),
    };
    updateFavorites([newFav, ...favorites]);
  };

  const handleRemoveFavorite = (id: string) => {
    updateFavorites(favorites.filter((f) => f.id !== id));
  };

  const handleTogglePreferFavorites = () => {
    const nextVal = !preferFavorites;
    setPreferFavorites(nextVal);
    localStorage.setItem('prefer_favorits_flag', JSON.stringify(nextVal));
  };

  // 2. Estat del Menú
  const [menu, setMenu] = useState<WeeklyMenuState>(() => {
    const saved = localStorage.getItem('menu_setmanal_parella');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return generateInitialWeeklyMenu(INITIAL_FAVORITES, true);
  });

  // 3. Estat de l'Historial de Menús ("Els meus menús")
  const [savedMenus, setSavedMenus] = useState<SavedWeeklyMenu[]>(() => {
    const saved = localStorage.getItem('historial_menus_guardats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    // Inicialització amb un menú d'exemple si encara no n'hi ha cap
    return [
      {
        id: 'saved-ex-1',
        nom: 'Menú Tardor Equilibrat (Peix, Llegums i Wraps)',
        dataCreacio: Date.now() - 86400000 * 2,
        menu: generateInitialWeeklyMenu(INITIAL_FAVORITES, true),
        notes: 'Molt variat, excel·lent combinació de salmó al forn, fajitas i amanides de cigrons.',
      },
    ];
  });

  const updateSavedMenus = (newSaved: SavedWeeklyMenu[]) => {
    setSavedMenus(newSaved);
    localStorage.setItem('historial_menus_guardats', JSON.stringify(newSaved));
  };

  const handleSaveCurrentMenu = (name: string, notes?: string) => {
    const newSaved: SavedWeeklyMenu = {
      id: `saved-menu-${Date.now()}`,
      nom: name,
      dataCreacio: Date.now(),
      menu: JSON.parse(JSON.stringify(menu)),
      notes,
    };
    updateSavedMenus([newSaved, ...savedMenus]);
  };

  const handleLoadSavedMenu = (loadedMenu: WeeklyMenuState) => {
    updateMenu(loadedMenu);
  };

  const handleDeleteSavedMenu = (id: string) => {
    updateSavedMenus(savedMenus.filter((m) => m.id !== id));
  };

  const handleRenameSavedMenu = (id: string, newName: string) => {
    updateSavedMenus(savedMenus.map((m) => (m.id === id ? { ...m, nom: newName } : m)));
  };

  // 4. Estat del Rebost (ingredients a casa)
  const [rebost, setRebost] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('rebost_parella');
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch {
        // fallback
      }
    }
    return new Set(["Oli d'oliva verge extra"]);
  });

  // Quantitats personalitzades de compra (paquets que volem comprar de cada producte)
  const [customQuantities, setCustomQuantities] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('custom_quantities_compra');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {};
  });

  // 4. Estat de navegació
  const [activeTab, setActiveTab] = useState<'menu' | 'image' | 'proposals' | 'favorites' | 'compra'>('menu');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | 'Tots'>('Dilluns');
  const [isPantryOpen, setIsPantryOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  // Persistència del Menú
  const updateMenu = (newMenu: WeeklyMenuState) => {
    setMenu(newMenu);
    localStorage.setItem('menu_setmanal_parella', JSON.stringify(newMenu));
  };

  // Persistència del Rebost
  const updateRebost = (newRebost: Set<string>) => {
    setRebost(newRebost);
    localStorage.setItem('rebost_parella', JSON.stringify(Array.from(newRebost)));
  };

  // Persistència de quantitats personalitzades
  const handleUpdateItemQuantity = (nom: string, packages: number) => {
    setCustomQuantities((prev) => {
      const next = { ...prev, [nom]: Math.max(0, packages) };
      localStorage.setItem('custom_quantities_compra', JSON.stringify(next));
      return next;
    });
  };

  const handleResetItemQuantity = (nom: string) => {
    setCustomQuantities((prev) => {
      const next = { ...prev };
      delete next[nom];
      localStorage.setItem('custom_quantities_compra', JSON.stringify(next));
      return next;
    });
  };

  const handleResetAllQuantities = () => {
    setCustomQuantities({});
    localStorage.removeItem('custom_quantities_compra');
  };

  // Càlcul de la llista de la compra amb memoització
  const shoppingList = useMemo(() => {
    return calculateShoppingList(menu, rebost, customQuantities);
  }, [menu, rebost, customQuantities]);

  const totalShoppingPackages = useMemo(() => {
    return shoppingList
      .filter((item) => !item.inPantry)
      .reduce((acc, curr) => acc + curr.packages, 0);
  }, [shoppingList]);

  // Accions del menú
  const handleGenerateMenu = () => {
    const nextMenu = { ...menu };
    for (const day of DIES_SETMANA) {
      for (const mealType of ['Dinar', 'Sopar'] as MealType[]) {
        const current = nextMenu[day][mealType];
        if (!current.locked) {
          nextMenu[day][mealType] = generateSingleMeal(
            day,
            mealType,
            favorites,
            preferFavorites
          );
        }
      }
    }
    updateMenu(nextMenu);
  };

  const handleResetMenu = () => {
    const fresh = generateInitialWeeklyMenu(favorites, preferFavorites);
    updateMenu(fresh);
  };

  const handleUpdateMeal = (day: DayOfWeek, mealType: MealType, updated: MealConfig) => {
    const nextMenu = {
      ...menu,
      [day]: {
        ...menu[day],
        [mealType]: updated,
      },
    };
    updateMenu(nextMenu);
  };

  const handleApplyFavoriteToMenu = (
    fav: FavoriteMeal,
    day: DayOfWeek,
    mealType: MealType
  ) => {
    handleUpdateMeal(day, mealType, {
      farinaci: fav.farinaci,
      proteines: [...fav.proteines],
      verdures: [...fav.verdures],
      greix: fav.greix,
      locked: false,
      isFavorite: true,
    });
    setActiveTab('menu');
    setSelectedDay(day);
  };

  const handleApplySeasonalDish = (
    dish: SeasonalDish,
    day: DayOfWeek,
    mealType: MealType
  ) => {
    handleUpdateMeal(day, mealType, {
      farinaci: dish.farinaci,
      proteines: [...dish.proteines],
      verdures: [...dish.verdures],
      greix: dish.greix,
      locked: false,
      isFavorite: false,
    });
    setActiveTab('menu');
    setSelectedDay(day);
  };

  const handleApplyProposal = (proposedMenu: WeeklyMenuState) => {
    updateMenu(proposedMenu);
  };

  // Accions del rebost
  const handleTogglePantryItem = (nom: string) => {
    const next = new Set(rebost);
    if (next.has(nom)) {
      next.delete(nom);
    } else {
      next.add(nom);
    }
    updateRebost(next);
  };

  const handleClearPantry = () => {
    updateRebost(new Set());
  };

  const handleSetBasicsPantry = () => {
    const basics = [
      "Oli d'oliva verge extra",
      'Arròs integral Hacendado',
      'Pasta integral',
      'Ceba',
      'Pastanaga',
    ];
    updateRebost(new Set([...Array.from(rebost), ...basics]));
  };

  const handleExportExcel = () => {
    exportToExcel(menu, shoppingList);
  };

  const daysToRender = selectedDay === 'Tots' ? DIES_SETMANA : [selectedDay];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Capçalera */}
      <Header
        onGenerate={handleGenerateMenu}
        onReset={handleResetMenu}
        onExportExcel={handleExportExcel}
        onOpenCode={() => setIsCodeModalOpen(true)}
        onOpenFoodManager={() => setIsFoodManagerOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
        intercanvis={intercanvis}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalShoppingPackages={totalShoppingPackages}
        favoritesCount={favorites.length}
        preferFavorites={preferFavorites}
        onTogglePreferFavorites={handleTogglePreferFavorites}
      />

      {/* Cos principal de l'aplicació */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex gap-6">
        {/* Àrea de contingut */}
        <main className="flex-1 min-w-0">
          {/* TAB 1: MENU SETMANAL */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              {/* Resum Nutricional matemàtic per àpats i setmana */}
              <NutritionSummary menu={menu} />

              {/* Barra de filtre de dies + botó mòbil de rebost */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
                  <span className="text-xs font-semibold text-slate-400 pl-1 pr-2 flex items-center gap-1 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Dia:
                  </span>
                  <button
                    onClick={() => setSelectedDay('Tots')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedDay === 'Tots'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Tots els 7 dies
                  </button>
                  {DIES_SETMANA.map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        selectedDay === day
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-quick-view-image"
                    onClick={() => setActiveTab('image')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    title="Veure tot el menú d'un cop d'ull en una sola imatge sense fer scroll"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Veure Menú (sense scroll)</span>
                    <span className="sm:hidden">Menú</span>
                  </button>

                  <button
                    onClick={() => setIsPantryOpen(true)}
                    className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    Rebost ({rebost.size})
                  </button>
                </div>
              </div>

              {/* Llista de dies i àpats */}
              <div className="space-y-8">
                {daysToRender.map((day) => (
                  <section key={day} className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                          <span>🗓️</span> {day}
                        </h2>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        Dinar: {GUIA_TEMATICA[day].Dinar.desc} · Sopar: {GUIA_TEMATICA[day].Sopar.desc}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <MealCard
                        day={day}
                        mealType="Dinar"
                        meal={menu[day].Dinar}
                        onUpdate={(updated) => handleUpdateMeal(day, 'Dinar', updated)}
                        onSaveFavorite={handleAddFavorite}
                        products={products}
                        intercanvis={intercanvis}
                      />
                      <MealCard
                        day={day}
                        mealType="Sopar"
                        meal={menu[day].Sopar}
                        onUpdate={(updated) => handleUpdateMeal(day, 'Sopar', updated)}
                        onSaveFavorite={handleAddFavorite}
                        products={products}
                        intercanvis={intercanvis}
                      />
                    </div>
                  </section>
                ))}
              </div>

              {/* APARTAT "ELS MEUS MENÚS" - Historial de planificacions que faig cada setmana */}
              <SavedMenusHistory
                currentMenu={menu}
                savedMenus={savedMenus}
                onSaveCurrentMenu={handleSaveCurrentMenu}
                onLoadSavedMenu={handleLoadSavedMenu}
                onDeleteSavedMenu={handleDeleteSavedMenu}
                onRenameSavedMenu={handleRenameSavedMenu}
              />
            </div>
          )}

          {/* TAB 2: MENU EN UNA IMATGE (SENSE SCROLL) */}
          {activeTab === 'image' && (
            <WeeklyImageOverview
              menu={menu}
              onNavigateToMeal={(day) => {
                setSelectedDay(day);
                setActiveTab('menu');
              }}
              onGenerateMenu={handleGenerateMenu}
            />
          )}

          {/* TAB 3: PROPOSTES AUTOMÀTIQUES */}
          {activeTab === 'proposals' && (
            <ProposalsView
              onApplyProposal={handleApplyProposal}
              favorites={favorites}
              onApplySeasonalDish={handleApplySeasonalDish}
            />
          )}

          {/* TAB 4: FAVORITS */}
          {activeTab === 'favorites' && (
            <FavoritesView
              favorites={favorites}
              onDeleteFavorite={handleRemoveFavorite}
              onApplyFavoriteToMenu={(day, mealType, fav) => handleApplyFavoriteToMenu(fav, day, mealType)}
              onOpenCreateFavorite={() => setIsCreateFavOpen(true)}
            />
          )}

          {/* TAB 4: LLISTA DE LA COMPRA */}
          {activeTab === 'compra' && (
            <ShoppingListView
              shoppingList={shoppingList}
              onExportExcel={handleExportExcel}
              onUpdateQuantity={handleUpdateItemQuantity}
              onResetQuantity={handleResetItemQuantity}
              onResetAllQuantities={handleResetAllQuantities}
            />
          )}
        </main>

        {/* Barra lateral del Rebost (Desktop) */}
        <div className="hidden lg:block shrink-0">
          <PantrySidebar
            rebost={rebost}
            onToggleItem={handleTogglePantryItem}
            onClearAll={handleClearPantry}
            onSetBasics={handleSetBasicsPantry}
            isOpen={false}
            onClose={() => {}}
          />
        </div>
      </div>

      {/* Barra lateral del Rebost (Mòbil) */}
      <PantrySidebar
        rebost={rebost}
        onToggleItem={handleTogglePantryItem}
        onClearAll={handleClearPantry}
        onSetBasics={handleSetBasicsPantry}
        isOpen={isPantryOpen}
        onClose={() => setIsPantryOpen(false)}
      />

      {/* Modal crear plat favorit */}
      <CreateFavoriteModal
        isOpen={isCreateFavOpen}
        onClose={() => setIsCreateFavOpen(false)}
        onSave={handleAddFavorite}
        products={products}
      />

      {/* Modal per veure el codi Python / Streamlit i CSV */}
      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />

      {/* Modal Gestió d'aliments, gramatges i pautes nutricionals (Sense codi) */}
      <FoodManagerModal
        isOpen={isFoodManagerOpen}
        onClose={() => setIsFoodManagerOpen(false)}
        products={products}
        intercanvis={intercanvis}
        onSaveProducts={handleSaveProducts}
        onSaveIntercanvis={handleSaveIntercanvis}
        onResetProducts={handleResetProducts}
        onResetIntercanvis={handleResetIntercanvis}
      />

      {/* Modal Còpia de seguretat completa (Exportar / Importar JSON) */}
      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        menu={menu}
        favorites={favorites}
        savedMenus={savedMenus}
        rebost={rebost}
        products={products}
        intercanvis={intercanvis}
        customQuantities={customQuantities}
        onRestoreBackup={handleRestoreBackup}
      />
    </div>
  );
}
