export type GroupType = 'Farinacis' | 'Proteïnes' | 'Verdures' | 'Greixos';

export interface Product {
  nom: string;
  grup: GroupType;
  supermercat: string;
  racio_g: number;
  unitat: string;
  format_compra: number;
  format_unitat: string;
  seccio: string;
  preu_format: number;
  calories_per_100g: number;
  proteines_per_100g: number;
  carbs_per_100g: number;
  greixos_per_100g: number;
}

export type DayOfWeek = 
  | 'Dilluns' 
  | 'Dimarts' 
  | 'Dimecres' 
  | 'Dijous' 
  | 'Divendres' 
  | 'Dissabte' 
  | 'Diumenge';

export type MealType = 'Dinar' | 'Sopar';

export interface MealConfig {
  farinaci: string;
  proteines: string[];
  verdures: string[];
  greix: string;
  locked: boolean;
  isFavorite?: boolean;
}

export type DayMeals = {
  Dinar: MealConfig;
  Sopar: MealConfig;
};

export type WeeklyMenuState = Record<DayOfWeek, DayMeals>;

export interface ShoppingItem {
  nom: string;
  grup: GroupType;
  seccio: string;
  totalNeeded: number;
  unitat: string;
  format_compra: number;
  format_unitat: string;
  packages: number;
  calculatedPackages?: number;
  isCustomPackages?: boolean;
  inPantry: boolean;
  preu_format: number;
  total_preu: number;
}

export interface NutritionBreakdown {
  calories: number;
  proteines: number;
  carbs: number;
  greixos: number;
}

export interface MealNutrition {
  sheila: NutritionBreakdown;
  marc: NutritionBreakdown;
}

export interface FavoriteMeal {
  id: string;
  nom: string;
  categoria?: string;
  imageUrl?: string;
  farinaci: string;
  proteines: string[];
  verdures: string[];
  greix: string;
  desc?: string;
  createdAt: number;
}

export interface SavedWeeklyMenu {
  id: string;
  nom: string;
  dataCreacio: number;
  menu: WeeklyMenuState;
  notes?: string;
}

export interface ProposalTheme {
  id: string;
  title: string;
  badge: string;
  description: string;
  icon: string;
}

export type Season = 'Tardor' | 'Hivern' | 'Primavera' | 'Estiu';

export interface SeasonalDish {
  id: string;
  nom: string;
  estacio: Season;
  desc: string;
  context?: string;
  tipus: MealType | 'Ambdós';
  farinaci: string;
  proteines: string[];
  verdures: string[];
  greix: string;
  destacat?: boolean;
}

export interface SeasonInfo {
  id: Season;
  nom: string;
  mesos: string;
  icona: string;
  descripcio: string;
  ingredientsEstrella: string[];
  desaconsellats: string[];
}
