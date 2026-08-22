import type {
  Application,
  CareCycle,
  Group,
  Photo,
  Plant,
  Product,
} from "./entities";

export type CareUrgency = "atrasado" | "hoje" | "proximo";

export interface CareItem {
  cycle: CareCycle;
  product: Product;
  plant?: Plant;
  group?: Group;
  urgency: CareUrgency;
  daysFromToday: number;
}

export interface DashboardData {
  overdue: CareItem[];
  today: CareItem[];
  upcoming: CareItem[];
  recentApplications: (Application & {
    product?: Product;
    plant?: Plant;
    group?: Group;
  })[];
  plantCount: number;
}

export type TimelineEntryType = "photo" | "application";

export interface TimelineEntry {
  type: TimelineEntryType;
  date: Date;
  photo?: Photo;
  application?: Application & { product?: Product };
}

export interface PlantWithCareStatus extends Plant {
  activeCycle?: CareCycle;
  /** Next-manejo urgency badge — only meaningful when activeCycle exists. */
  urgency?: CareUrgency;
  /** Most recent application for this plant, cycle or not — drives "adubada há X dias". */
  lastApplicationDate?: Date;
  lastApplicationProduct?: Product;
}
