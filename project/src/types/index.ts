export interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties?: string[];
  launchYear?: number;
  types: string[];
}

export interface PTODay {
  date: string;
  type: 'suggested' | 'pinned' | 'company';
  reason?: string;
}

export interface VacationBlock {
  startDate: string;
  endDate: string;
  totalDays: number;
  ptoDays: number;
  weekendDays: number;
  holidayDays: number;
}

export interface UserPreferences {
  totalPTODays: number;
  country: string;
  companyHolidays: string[];
  vacationStyle: 'long-weekends' | 'week-long' | 'balanced' | 'custom';
  pinnedDates: string[];
}

export interface OptimizationResult {
  suggestedPTO: PTODay[];
  vacationBlocks: VacationBlock[];
  totalDaysOff: number;
  ptoUsed: number;
  efficiency: number;
}