import { useQuery } from '@tanstack/react-query';
import { Holiday } from '../types';

// Fallback holiday data for common countries
const fallbackHolidays: Record<string, Holiday[]> = {
  US: [
    { date: '2025-01-01', localName: "New Year's Day", name: "New Year's Day", countryCode: 'US', fixed: true, global: true, types: ['Public'] },
    { date: '2025-01-20', localName: 'Martin Luther King Jr. Day', name: 'Martin Luther King Jr. Day', countryCode: 'US', fixed: false, global: true, types: ['Public'] },
    { date: '2025-02-17', localName: "Presidents' Day", name: "Presidents' Day", countryCode: 'US', fixed: false, global: true, types: ['Public'] },
    { date: '2025-05-26', localName: 'Memorial Day', name: 'Memorial Day', countryCode: 'US', fixed: false, global: true, types: ['Public'] },
    { date: '2025-07-04', localName: 'Independence Day', name: 'Independence Day', countryCode: 'US', fixed: true, global: true, types: ['Public'] },
    { date: '2025-09-01', localName: 'Labor Day', name: 'Labor Day', countryCode: 'US', fixed: false, global: true, types: ['Public'] },
    { date: '2025-10-13', localName: 'Columbus Day', name: 'Columbus Day', countryCode: 'US', fixed: false, global: true, types: ['Public'] },
    { date: '2025-11-11', localName: 'Veterans Day', name: 'Veterans Day', countryCode: 'US', fixed: true, global: true, types: ['Public'] },
    { date: '2025-11-27', localName: 'Thanksgiving Day', name: 'Thanksgiving Day', countryCode: 'US', fixed: false, global: true, types: ['Public'] },
    { date: '2025-12-25', localName: 'Christmas Day', name: 'Christmas Day', countryCode: 'US', fixed: true, global: true, types: ['Public'] },
  ],
  CA: [
    { date: '2025-01-01', localName: "New Year's Day", name: "New Year's Day", countryCode: 'CA', fixed: true, global: true, types: ['Public'] },
    { date: '2025-04-18', localName: 'Good Friday', name: 'Good Friday', countryCode: 'CA', fixed: false, global: true, types: ['Public'] },
    { date: '2025-05-19', localName: 'Victoria Day', name: 'Victoria Day', countryCode: 'CA', fixed: false, global: true, types: ['Public'] },
    { date: '2025-07-01', localName: 'Canada Day', name: 'Canada Day', countryCode: 'CA', fixed: true, global: true, types: ['Public'] },
    { date: '2025-09-01', localName: 'Labour Day', name: 'Labour Day', countryCode: 'CA', fixed: false, global: true, types: ['Public'] },
    { date: '2025-10-13', localName: 'Thanksgiving', name: 'Thanksgiving', countryCode: 'CA', fixed: false, global: true, types: ['Public'] },
    { date: '2025-12-25', localName: 'Christmas Day', name: 'Christmas Day', countryCode: 'CA', fixed: true, global: true, types: ['Public'] },
    { date: '2025-12-26', localName: 'Boxing Day', name: 'Boxing Day', countryCode: 'CA', fixed: true, global: true, types: ['Public'] },
  ],
  GB: [
    { date: '2025-01-01', localName: "New Year's Day", name: "New Year's Day", countryCode: 'GB', fixed: true, global: true, types: ['Public'] },
    { date: '2025-04-18', localName: 'Good Friday', name: 'Good Friday', countryCode: 'GB', fixed: false, global: true, types: ['Public'] },
    { date: '2025-04-21', localName: 'Easter Monday', name: 'Easter Monday', countryCode: 'GB', fixed: false, global: true, types: ['Public'] },
    { date: '2025-05-05', localName: 'Early May Bank Holiday', name: 'Early May Bank Holiday', countryCode: 'GB', fixed: false, global: true, types: ['Public'] },
    { date: '2025-05-26', localName: 'Spring Bank Holiday', name: 'Spring Bank Holiday', countryCode: 'GB', fixed: false, global: true, types: ['Public'] },
    { date: '2025-08-25', localName: 'Summer Bank Holiday', name: 'Summer Bank Holiday', countryCode: 'GB', fixed: false, global: true, types: ['Public'] },
    { date: '2025-12-25', localName: 'Christmas Day', name: 'Christmas Day', countryCode: 'GB', fixed: true, global: true, types: ['Public'] },
    { date: '2025-12-26', localName: 'Boxing Day', name: 'Boxing Day', countryCode: 'GB', fixed: true, global: true, types: ['Public'] },
  ],
  DE: [
    { date: '2025-01-01', localName: 'Neujahr', name: "New Year's Day", countryCode: 'DE', fixed: true, global: true, types: ['Public'] },
    { date: '2025-04-18', localName: 'Karfreitag', name: 'Good Friday', countryCode: 'DE', fixed: false, global: true, types: ['Public'] },
    { date: '2025-04-21', localName: 'Ostermontag', name: 'Easter Monday', countryCode: 'DE', fixed: false, global: true, types: ['Public'] },
    { date: '2025-05-01', localName: 'Tag der Arbeit', name: 'Labour Day', countryCode: 'DE', fixed: true, global: true, types: ['Public'] },
    { date: '2025-05-29', localName: 'Christi Himmelfahrt', name: 'Ascension Day', countryCode: 'DE', fixed: false, global: true, types: ['Public'] },
    { date: '2025-06-09', localName: 'Pfingstmontag', name: 'Whit Monday', countryCode: 'DE', fixed: false, global: true, types: ['Public'] },
    { date: '2025-10-03', localName: 'Tag der Deutschen Einheit', name: 'German Unity Day', countryCode: 'DE', fixed: true, global: true, types: ['Public'] },
    { date: '2025-12-25', localName: '1. Weihnachtsfeiertag', name: 'Christmas Day', countryCode: 'DE', fixed: true, global: true, types: ['Public'] },
    { date: '2025-12-26', localName: '2. Weihnachtsfeiertag', name: 'Boxing Day', countryCode: 'DE', fixed: true, global: true, types: ['Public'] },
  ],
  FR: [
    { date: '2025-01-01', localName: 'Jour de l\'An', name: "New Year's Day", countryCode: 'FR', fixed: true, global: true, types: ['Public'] },
    { date: '2025-04-21', localName: 'Lundi de Pâques', name: 'Easter Monday', countryCode: 'FR', fixed: false, global: true, types: ['Public'] },
    { date: '2025-05-01', localName: 'Fête du Travail', name: 'Labour Day', countryCode: 'FR', fixed: true, global: true, types: ['Public'] },
    { date: '2025-05-08', localName: 'Fête de la Victoire', name: 'Victory in Europe Day', countryCode: 'FR', fixed: true, global: true, types: ['Public'] },
    { date: '2025-05-29', localName: 'Ascension', name: 'Ascension Day', countryCode: 'FR', fixed: false, global: true, types: ['Public'] },
    { date: '2025-06-09', localName: 'Lundi de Pentecôte', name: 'Whit Monday', countryCode: 'FR', fixed: false, global: true, types: ['Public'] },
    { date: '2025-07-14', localName: 'Fête nationale', name: 'Bastille Day', countryCode: 'FR', fixed: true, global: true, types: ['Public'] },
    { date: '2025-08-15', localName: 'Assomption', name: 'Assumption of Mary', countryCode: 'FR', fixed: true, global: true, types: ['Public'] },
    { date: '2025-11-01', localName: 'Toussaint', name: 'All Saints\' Day', countryCode: 'FR', fixed: true, global: true, types: ['Public'] },
    { date: '2025-11-11', localName: 'Armistice', name: 'Armistice Day', countryCode: 'FR', fixed: true, global: true, types: ['Public'] },
    { date: '2025-12-25', localName: 'Noël', name: 'Christmas Day', countryCode: 'FR', fixed: true, global: true, types: ['Public'] },
  ],
  AU: [
    { date: '2025-01-01', localName: "New Year's Day", name: "New Year's Day", countryCode: 'AU', fixed: true, global: true, types: ['Public'] },
    { date: '2025-01-27', localName: 'Australia Day', name: 'Australia Day', countryCode: 'AU', fixed: true, global: true, types: ['Public'] },
    { date: '2025-04-18', localName: 'Good Friday', name: 'Good Friday', countryCode: 'AU', fixed: false, global: true, types: ['Public'] },
    { date: '2025-04-21', localName: 'Easter Monday', name: 'Easter Monday', countryCode: 'AU', fixed: false, global: true, types: ['Public'] },
    { date: '2025-04-25', localName: 'Anzac Day', name: 'Anzac Day', countryCode: 'AU', fixed: true, global: true, types: ['Public'] },
    { date: '2025-12-25', localName: 'Christmas Day', name: 'Christmas Day', countryCode: 'AU', fixed: true, global: true, types: ['Public'] },
    { date: '2025-12-26', localName: 'Boxing Day', name: 'Boxing Day', countryCode: 'AU', fixed: true, global: true, types: ['Public'] },
  ],
  JP: [
    { date: '2025-01-01', localName: '元日', name: "New Year's Day", countryCode: 'JP', fixed: true, global: true, types: ['Public'] },
    { date: '2025-01-13', localName: '成人の日', name: 'Coming of Age Day', countryCode: 'JP', fixed: false, global: true, types: ['Public'] },
    { date: '2025-02-11', localName: '建国記念の日', name: 'National Foundation Day', countryCode: 'JP', fixed: true, global: true, types: ['Public'] },
    { date: '2025-03-20', localName: '春分の日', name: 'Vernal Equinox Day', countryCode: 'JP', fixed: false, global: true, types: ['Public'] },
    { date: '2025-04-29', localName: '昭和の日', name: 'Showa Day', countryCode: 'JP', fixed: true, global: true, types: ['Public'] },
    { date: '2025-05-03', localName: '憲法記念日', name: 'Constitution Memorial Day', countryCode: 'JP', fixed: true, global: true, types: ['Public'] },
    { date: '2025-05-04', localName: 'みどりの日', name: 'Greenery Day', countryCode: 'JP', fixed: true, global: true, types: ['Public'] },
    { date: '2025-05-05', localName: 'こどもの日', name: "Children's Day", countryCode: 'JP', fixed: true, global: true, types: ['Public'] },
    { date: '2025-07-21', localName: '海の日', name: 'Marine Day', countryCode: 'JP', fixed: false, global: true, types: ['Public'] },
    { date: '2025-08-11', localName: '山の日', name: 'Mountain Day', countryCode: 'JP', fixed: true, global: true, types: ['Public'] },
    { date: '2025-09-15', localName: '敬老の日', name: 'Respect for the Aged Day', countryCode: 'JP', fixed: false, global: true, types: ['Public'] },
    { date: '2025-09-23', localName: '秋分の日', name: 'Autumnal Equinox Day', countryCode: 'JP', fixed: false, global: true, types: ['Public'] },
    { date: '2025-10-13', localName: 'スポーツの日', name: 'Sports Day', countryCode: 'JP', fixed: false, global: true, types: ['Public'] },
    { date: '2025-11-03', localName: '文化の日', name: 'Culture Day', countryCode: 'JP', fixed: true, global: true, types: ['Public'] },
    { date: '2025-11-23', localName: '勤労感謝の日', name: 'Labour Thanksgiving Day', countryCode: 'JP', fixed: true, global: true, types: ['Public'] },
  ],
  IN: [
    { date: '2025-01-26', localName: 'Republic Day', name: 'Republic Day', countryCode: 'IN', fixed: true, global: true, types: ['Public'] },
    { date: '2025-08-15', localName: 'Independence Day', name: 'Independence Day', countryCode: 'IN', fixed: true, global: true, types: ['Public'] },
    { date: '2025-10-02', localName: 'Gandhi Jayanti', name: 'Gandhi Jayanti', countryCode: 'IN', fixed: true, global: true, types: ['Public'] },
  ],
};

async function fetchHolidays(countryCode: string, year: number): Promise<Holiday[]> {
  try {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('Failed to fetch holidays from API, using fallback data:', error);
    return fallbackHolidays[countryCode] || [];
  }
}

export function useHolidays(countryCode: string, year: number) {
  return useQuery({
    queryKey: ['holidays', countryCode, year],
    queryFn: () => fetchHolidays(countryCode, year),
    enabled: !!countryCode,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 1,
  });
}