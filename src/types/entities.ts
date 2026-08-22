export type Id = string;

export type MethodType = "solo" | "foliar" | "agua" | "outro";
export type UnitType = "mL/L" | "mL" | "g/L" | "g" | "mg/L" | "outro";
export type ProductType = "mineral" | "biologico";
export type FrequencyUnit = "dias" | "semanas" | "meses";
export type CycleStatus = "ativo" | "pausado" | "excluido";
export type EvidenceLevel = "alto" | "medio" | "baixo";

export interface Plant {
  id: Id;
  userId: Id;
  name: string;
  species?: string;
  groupId?: Id;
  location?: string;
  coverPhotoUrl?: string;
  coverPhotoStoragePath?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Group {
  id: Id;
  userId: Id;
  name: string;
  description?: string;
  coverPhotoUrl?: string;
  coverPhotoStoragePath?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: Id;
  userId: Id;
  name: string;
  type: ProductType;
  manufacturer?: string;
  description?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CareCycle {
  id: Id;
  userId: Id;
  plantId?: Id;
  groupId?: Id;
  productId: Id;
  dose?: number;
  unit?: UnitType;
  volume?: number;
  method?: MethodType;
  frequencyValue: number;
  frequencyUnit: FrequencyUnit;
  startDate: Date;
  lastApplicationDate?: Date;
  nextApplicationDate?: Date;
  status: CycleStatus;
  recommendationId?: Id;
  createdAt: Date;
  updatedAt: Date;
}

export interface Application {
  id: Id;
  userId: Id;
  plantId?: Id;
  groupId?: Id;
  affectedPlantIds?: Id[];
  productId: Id;
  date: Date;
  dose?: number;
  unit?: UnitType;
  volume?: number;
  method?: MethodType;
  notes?: string;
  cycleId?: Id;
  createdAt: Date;
}

export interface Photo {
  id: Id;
  userId: Id;
  plantId: Id;
  storagePath: string;
  url: string;
  note?: string;
  createdAt: Date;
}

export interface Recommendation {
  id: Id;
  speciesOrCategory: string;
  productType: ProductType;
  doseMin: number;
  doseMax: number;
  unit: UnitType;
  frequencyValue: number;
  frequencyUnit: FrequencyUnit;
  method: MethodType;
  context?: string;
  source: string;
  reference: string;
  notes?: string;
  evidenceLevel: EvidenceLevel;
  createdAt: Date;
}
