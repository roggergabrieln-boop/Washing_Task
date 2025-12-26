export interface ClothingItem {
  id: string;
  name: string;
  category: string;
  dryWeightKg: number;
  absorptionFactor: number; // Multiplier: 1.0 means it holds 100% of its weight in water
  icon: string;
}

export interface BasketItem extends ClothingItem {
  uid: string; // Unique ID for list rendering
}

export interface MachineConfig {
  capacityKg: number;
}

export enum LoadStatus {
  OPTIMAL = 'OPTIMAL',
  HEAVY = 'HEAVY',
  OVERLOAD = 'OVERLOAD'
}