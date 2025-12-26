import { ClothingItem } from './types';
import { Shirt, Scissors, BedDouble, Bath, Droplets, Baby } from 'lucide-react';

export const CLOTHING_PRESETS: ClothingItem[] = [
  {
    id: 'tshirt',
    name: 'Camiseta',
    category: 'Diario',
    dryWeightKg: 0.2,
    absorptionFactor: 2.5, // Cotton absorbs a lot
    icon: 'Shirt',
  },
  {
    id: 'jeans',
    name: 'Jeans',
    category: 'Pesado',
    dryWeightKg: 0.7,
    absorptionFactor: 3.0, // Heavy denim gets very heavy
    icon: 'Scissors', // Representing tough fabric
  },
  {
    id: 'towel_bath',
    name: 'Toalla Baño',
    category: 'Baño',
    dryWeightKg: 0.6,
    absorptionFactor: 3.5, // Designed to absorb water
    icon: 'Bath',
  },
  {
    id: 'bed_sheet',
    name: 'Sábana',
    category: 'Cama',
    dryWeightKg: 0.8,
    absorptionFactor: 2.0,
    icon: 'BedDouble',
  },
  {
    id: 'underwear',
    name: 'Ropa Interior',
    category: 'Delicado',
    dryWeightKg: 0.05,
    absorptionFactor: 1.5,
    icon: 'Baby',
  },
  {
    id: 'hoodie',
    name: 'Sudadera',
    category: 'Invierno',
    dryWeightKg: 0.5,
    absorptionFactor: 3.0,
    icon: 'Droplets',
  }
];

export const DEFAULT_CAPACITY = 8; // kg