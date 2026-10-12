import { CarListing, EvaluatedCar, EvaluationConfig, ScoreTier, VehicleCondition, TitleStatus } from '../types/car';

export const CURRENT_YEAR = 2026;

export const DEFAULT_MAKE_LIFESPANS: Record<string, number> = {
  toyota: 250000,
  lexus: 260000,
  honda: 250000,
  acura: 250000,
  subaru: 220000,
  mazda: 220000,
  volvo: 215000,
  ford: 200000,
  chevrolet: 195000,
  chevy: 195000,
  hyundai: 200000,
  kia: 200000,
  gmc: 195000,
  nissan: 190000,
  volkswagen: 190000,
  vw: 190000,
  audi: 175000,
  bmw: 175000,
  'mercedes-benz': 175000,
  mercedes: 175000,
  jeep: 180000,
  dodge: 180000,
  ram: 195000,
  chrysler: 180000,
  cadillac: 180000,
  tesla: 220000,
  porsche: 190000,
  mini: 170000,
  landrover: 165000,
  'land rover': 165000,
};

export const DEFAULT_EVALUATION_CONFIG: EvaluationConfig = {
  benchmarkAnnualMiles: 13500,
  defaultTotalLifespan: 200000,
  makeLifespanPresets: DEFAULT_MAKE_LIFESPANS,
  conditionMultipliers: {
    excellent: 1.05,
    good: 1.00,
    fair: 0.88,
    poor: 0.72,
  },
  titleMultipliers: {
    clean: 1.00,
    rebuilt: 0.80,
    salvage: 0.65,
  },
};

export const SCORE_TIERS: Record<ScoreTier['label'], ScoreTier> = {
  Exceptional: {
    label: 'Exceptional',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeText: 'text-emerald-700 dark:text-emerald-400',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800',
    colorHex: '#16A34A',
    description: 'Outstanding value: very low cost-per-mile and superior remaining lifespan.',
  },
  'Great Deal': {
    label: 'Great Deal',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/40',
    badgeText: 'text-teal-700 dark:text-teal-400',
    badgeBorder: 'border-teal-200 dark:border-teal-800',
    colorHex: '#0D9488',
    description: 'Above-average value: strong balance of price, mileage, and condition.',
  },
  'Fair Market': {
    label: 'Fair Market',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeText: 'text-amber-700 dark:text-amber-400',
    badgeBorder: 'border-amber-200 dark:border-amber-800',
    colorHex: '#D97706',
    description: 'Reasonable market price given vehicle age and odometer readings.',
  },
  'Below Average': {
    label: 'Below Average',
    badgeBg: 'bg-orange-50 dark:bg-orange-950/40',
    badgeText: 'text-orange-700 dark:text-orange-400',
    badgeBorder: 'border-orange-200 dark:border-orange-800',
    colorHex: '#EA580C',
    description: 'High cost per remaining mile or noticeable repair/wear burdens.',
  },
  'High Risk': {
    label: 'High Risk',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40',
    badgeText: 'text-rose-700 dark:text-rose-400',
    badgeBorder: 'border-rose-200 dark:border-rose-800',
    colorHex: '#DC2626',
    description: 'Excessive price for remaining life, branded title, or severe wear.',
  },
};

export function lookupMakeLifespan(make: string, config: EvaluationConfig): number {
  if (!make) return config.defaultTotalLifespan;
  const clean = make.trim().toLowerCase();
  if (config.makeLifespanPresets[clean]) {
    return config.makeLifespanPresets[clean];
  }
  // Try partial match
  for (const [key, val] of Object.entries(config.makeLifespanPresets)) {
    if (clean.includes(key) || key.includes(clean)) {
      return val;
    }
  }
  return config.defaultTotalLifespan;
}

export function evaluateCar(
  listing: CarListing,
  config: EvaluationConfig = DEFAULT_EVALUATION_CONFIG
): EvaluatedCar {
  const effectivePrice = Math.max(0, listing.price + (listing.estimatedRepairs || 0));
  const rawAge = CURRENT_YEAR - listing.year;
  const vehicleAge = Math.max(0.5, rawAge);
  const observedAnnualMiles = Math.round(listing.mileage / vehicleAge);

  let usageCategory: EvaluatedCar['usageCategory'] = 'Moderate';
  if (observedAnnualMiles < 9000) usageCategory = 'Very Low';
  else if (observedAnnualMiles <= 14500) usageCategory = 'Moderate';
  else if (observedAnnualMiles <= 20000) usageCategory = 'High';
  else usageCategory = 'Heavy Fleet/Highway';

  const baseLifespan = lookupMakeLifespan(listing.make, config);
  const condMult = config.conditionMultipliers[listing.condition] ?? 1.0;
  const titleMult = config.titleMultipliers[listing.titleStatus] ?? 1.0;

  const adjustedLifespan = Math.round(baseLifespan * condMult * titleMult);
  const remainingMiles = Math.max(1000, adjustedLifespan - listing.mileage);
  const remainingYears = Number((remainingMiles / config.benchmarkAnnualMiles).toFixed(1));

  const pricePerOdometerMile = Number(
    (listing.price / Math.max(1, listing.mileage)).toFixed(3)
  );

  const costPerRemainingMile = Number(
    (effectivePrice / remainingMiles).toFixed(3)
  );

  const annualizedCost = Math.round(effectivePrice / Math.max(0.3, remainingYears));

  // Value Score Calculation (0-100)
  // 1. Base CPRM component: 58 pts standard for ~$0.18/mi
  // If CPRM is $0.08 -> ~75 pts. If CPRM is $0.35 -> ~20 pts.
  let cprmScore = 75 - ((costPerRemainingMile - 0.08) / 0.32) * 60;
  cprmScore = Math.max(10, Math.min(80, cprmScore));

  // 2. Annual usage modifier
  let usageBonus = 0;
  if (observedAnnualMiles < 8500) usageBonus = 6;
  else if (observedAnnualMiles <= 12500) usageBonus = 3;
  else if (observedAnnualMiles > 18000) usageBonus = -5;
  else if (observedAnnualMiles > 24000) usageBonus = -9;

  // 3. Title multiplier impact
  let titleBonus = 0;
  if (listing.titleStatus === 'clean') titleBonus = 8;
  else if (listing.titleStatus === 'rebuilt') titleBonus = -8;
  else if (listing.titleStatus === 'salvage') titleBonus = -20;

  // 4. Condition impact
  let condBonus = 0;
  if (listing.condition === 'excellent') condBonus = 6;
  else if (listing.condition === 'good') condBonus = 2;
  else if (listing.condition === 'fair') condBonus = -4;
  else if (listing.condition === 'poor') condBonus = -12;

  // 5. Repair burden penalty
  let repairPenalty = 0;
  if (effectivePrice > 0 && listing.estimatedRepairs > 0) {
    const repairRatio = listing.estimatedRepairs / effectivePrice;
    repairPenalty = Math.min(15, Math.round(repairRatio * 35));
  }

  // 6. Reliability brand bonus
  const brandBonus = baseLifespan >= 240000 ? 4 : 0;

  let totalScore = Math.round(
    cprmScore + usageBonus + titleBonus + condBonus - repairPenalty + brandBonus
  );
  totalScore = Math.max(5, Math.min(99, totalScore));

  // Assign Score Tier
  let scoreTier: ScoreTier = SCORE_TIERS['Fair Market'];
  if (totalScore >= 88) scoreTier = SCORE_TIERS['Exceptional'];
  else if (totalScore >= 75) scoreTier = SCORE_TIERS['Great Deal'];
  else if (totalScore >= 60) scoreTier = SCORE_TIERS['Fair Market'];
  else if (totalScore >= 46) scoreTier = SCORE_TIERS['Below Average'];
  else scoreTier = SCORE_TIERS['High Risk'];

  // Highlights & Warnings
  const highlights: string[] = [];
  const warnings: string[] = [];

  if (costPerRemainingMile <= 0.12) {
    highlights.push(`Superb efficiency at $${costPerRemainingMile.toFixed(2)} / remaining mile`);
  }
  if (remainingYears >= 8) {
    highlights.push(`Projected ${remainingYears} years of usable driving life`);
  }
  if (baseLifespan >= 240000) {
    highlights.push(`Proven ${listing.make} longevity (${baseLifespan.toLocaleString()} mi baseline)`);
  }
  if (usageCategory === 'Very Low') {
    highlights.push(`Lightly driven: ~${observedAnnualMiles.toLocaleString()} miles/yr`);
  }
  if (listing.titleStatus === 'clean' && listing.condition === 'excellent') {
    highlights.push('Clean title in excellent condition');
  }

  if (listing.titleStatus !== 'clean') {
    warnings.push(`${listing.titleStatus.toUpperCase()} title: structural/insurance risk`);
  }
  if (listing.estimatedRepairs > 1000) {
    warnings.push(`$${listing.estimatedRepairs.toLocaleString()} in anticipated repairs`);
  }
  if (listing.mileage >= 140000) {
    warnings.push(`Higher odometer (${listing.mileage.toLocaleString()} mi)`);
  }
  if (usageCategory === 'Heavy Fleet/Highway') {
    warnings.push(`High annual mileage rate (~${observedAnnualMiles.toLocaleString()} mi/yr)`);
  }
  if (costPerRemainingMile > 0.28) {
    warnings.push(`Steep cost per remaining mile ($${costPerRemainingMile.toFixed(2)}/mi)`);
  }

  return {
    listing,
    effectivePrice,
    vehicleAge,
    observedAnnualMiles,
    usageCategory,
    baseLifespan,
    adjustedLifespan,
    remainingMiles,
    remainingYears,
    pricePerOdometerMile,
    costPerRemainingMile,
    annualizedCost,
    valueScore: totalScore,
    scoreTier,
    rank: 1, // calculated after sorting all
    isBestOverall: false,
    highlights,
    warnings,
  };
}

export function evaluateAllCars(
  listings: CarListing[],
  config: EvaluationConfig = DEFAULT_EVALUATION_CONFIG
): EvaluatedCar[] {
  if (listings.length === 0) return [];

  const evaluated = listings.map((l) => evaluateCar(l, config));

  // Sort descending by value score to assign ranks
  const ranked = [...evaluated].sort((a, b) => {
    if (b.valueScore !== a.valueScore) {
      return b.valueScore - a.valueScore;
    }
    return a.costPerRemainingMile - b.costPerRemainingMile;
  });

  return ranked.map((car, index) => ({
    ...car,
    rank: index + 1,
    isBestOverall: index === 0,
  }));
}

export const SAMPLE_CAR_LISTINGS: CarListing[] = [
  {
    id: 'sample-1',
    make: 'Toyota',
    model: 'RAV4 XLE AWD',
    year: 2019,
    price: 18900,
    mileage: 64000,
    condition: 'excellent',
    titleStatus: 'clean',
    estimatedRepairs: 200,
    notes: 'Single owner, full dealership service records, new Michelin tires.',
    listingUrl: '',
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'sample-2',
    make: 'Honda',
    model: 'Civic EX',
    year: 2017,
    price: 13200,
    mileage: 69000,
    condition: 'good',
    titleStatus: 'clean',
    estimatedRepairs: 0,
    notes: 'Well maintained commuter car, clean Carfax, no rust.',
    listingUrl: '',
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'sample-3',
    make: 'Subaru',
    model: 'Forester Premium',
    year: 2020,
    price: 20400,
    mileage: 51000,
    condition: 'excellent',
    titleStatus: 'clean',
    estimatedRepairs: 350,
    notes: 'All-weather package, sunroof, eyesight safety package.',
    listingUrl: '',
    createdAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'sample-4',
    make: 'Ford',
    model: 'Escape Titanium',
    year: 2016,
    price: 8800,
    mileage: 122000,
    condition: 'fair',
    titleStatus: 'clean',
    estimatedRepairs: 1100,
    notes: 'Low initial price, but needs brake pads and suspension bushing service.',
    listingUrl: '',
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'sample-5',
    make: 'Hyundai',
    model: 'Elantra SEL',
    year: 2021,
    price: 14900,
    mileage: 46000,
    condition: 'excellent',
    titleStatus: 'clean',
    estimatedRepairs: 0,
    notes: 'Apple CarPlay, remaining powertrain warranty transfer eligible.',
    listingUrl: '',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'sample-6',
    make: 'BMW',
    model: '328i xDrive',
    year: 2015,
    price: 11400,
    mileage: 98000,
    condition: 'good',
    titleStatus: 'clean',
    estimatedRepairs: 2200,
    notes: 'Luxury interior, minor oil filter housing seep, higher maintenance tier.',
    listingUrl: '',
    createdAt: Date.now() - 86400000 * 6,
  },
  {
    id: 'sample-7',
    make: 'Nissan',
    model: 'Altima 2.5 S',
    year: 2018,
    price: 9200,
    mileage: 86000,
    condition: 'fair',
    titleStatus: 'rebuilt',
    estimatedRepairs: 600,
    notes: 'Rebuilt title after front fender replacement. Drives straight.',
    listingUrl: '',
    createdAt: Date.now() - 86400000 * 7,
  },
];
