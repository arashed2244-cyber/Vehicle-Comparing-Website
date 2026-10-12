export type VehicleCondition = 'excellent' | 'good' | 'fair' | 'poor';
export type TitleStatus = 'clean' | 'rebuilt' | 'salvage';

export interface CarListing {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: VehicleCondition;
  titleStatus: TitleStatus;
  estimatedRepairs: number;
  notes?: string;
  listingUrl?: string;
  isFavorite?: boolean;
  createdAt: number;
}

export interface EvaluationConfig {
  benchmarkAnnualMiles: number; // default: 13,500
  defaultTotalLifespan: number; // default: 200,000
  makeLifespanPresets: Record<string, number>;
  conditionMultipliers: Record<VehicleCondition, number>;
  titleMultipliers: Record<TitleStatus, number>;
}

export interface ScoreTier {
  label: 'Exceptional' | 'Great Deal' | 'Fair Market' | 'Below Average' | 'High Risk';
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  colorHex: string;
  description: string;
}

export interface EvaluatedCar {
  listing: CarListing;
  effectivePrice: number;
  vehicleAge: number;
  observedAnnualMiles: number;
  usageCategory: 'Very Low' | 'Moderate' | 'High' | 'Heavy Fleet/Highway';
  baseLifespan: number;
  adjustedLifespan: number;
  remainingMiles: number;
  remainingYears: number;
  pricePerOdometerMile: number; // Price / current mileage
  costPerRemainingMile: number; // Effective price / remaining miles
  annualizedCost: number;       // Effective price / remaining years
  valueScore: number;           // 0 to 100
  scoreTier: ScoreTier;
  rank: number;
  isBestOverall: boolean;
  highlights: string[];
  warnings: string[];
}

export type SortCriteria = 
  | 'score'
  | 'cprMile'
  | 'price'
  | 'mileage'
  | 'year'
  | 'ppm'
  | 'annualized'
  | 'remainingLife';

export type SortDirection = 'asc' | 'desc';
