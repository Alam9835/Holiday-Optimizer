import { addDays, isWeekend, format, differenceInDays, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import { Holiday, UserPreferences, OptimizationResult, PTODay, VacationBlock } from '../types';

export class PTOOptimizer {
  private holidays: Holiday[];
  private preferences: UserPreferences;
  private year: number;

  constructor(holidays: Holiday[], preferences: UserPreferences, year: number) {
    this.holidays = holidays;
    this.preferences = preferences;
    this.year = year;
  }

  optimize(): OptimizationResult {
    const suggestedPTO: PTODay[] = [];
    const vacationBlocks: VacationBlock[] = [];
    
    console.log('Starting optimization with:', {
      holidays: this.holidays.length,
      totalPTO: this.preferences.totalPTODays,
      country: this.preferences.country,
      style: this.preferences.vacationStyle
    });
    
    // Get all holiday dates
    const holidayDates = new Set(this.holidays.map(h => h.date));
    const companyHolidayDates = new Set(this.preferences.companyHolidays);
    
    // Find opportunities around holidays
    const opportunities = this.findOptimizationOpportunities(holidayDates, companyHolidayDates);
    
    console.log('Found opportunities:', opportunities.length);
    
    // Sort opportunities by efficiency (days off per PTO day)
    opportunities.sort((a, b) => b.efficiency - a.efficiency);
    
    let remainingPTO = this.preferences.totalPTODays;
    
    // Select the best opportunities within PTO budget
    for (const opportunity of opportunities) {
      if (remainingPTO >= opportunity.ptoDaysNeeded && opportunity.ptoDaysNeeded > 0 && opportunity.efficiency >= 1.2) {
        // Add PTO days
        for (const date of opportunity.ptoDates) {
          suggestedPTO.push({
            date: format(date, 'yyyy-MM-dd'),
            type: 'suggested',
            reason: `Part of ${opportunity.totalDays}-day vacation block`
          });
        }
        
        // Create vacation block
        vacationBlocks.push({
          startDate: format(opportunity.startDate, 'yyyy-MM-dd'),
          endDate: format(opportunity.endDate, 'yyyy-MM-dd'),
          totalDays: opportunity.totalDays,
          ptoDays: opportunity.ptoDaysNeeded,
          weekendDays: opportunity.weekendDays,
          holidayDays: opportunity.holidayDays
        });
        
        remainingPTO -= opportunity.ptoDaysNeeded;
      }
      
      // Stop if we've used most of our PTO or have enough vacation blocks
      if (remainingPTO <= 2 || vacationBlocks.length >= 6) {
        break;
      }
    }
    
    console.log('Final result:', {
      vacationBlocks: vacationBlocks.length,
      ptoUsed: this.preferences.totalPTODays - remainingPTO,
      totalDaysOff: vacationBlocks.reduce((sum, block) => sum + block.totalDays, 0)
    });
    
    const totalDaysOff = vacationBlocks.reduce((sum, block) => sum + block.totalDays, 0);
    const ptoUsed = this.preferences.totalPTODays - remainingPTO;
    const efficiency = ptoUsed > 0 ? Math.round((totalDaysOff / ptoUsed) * 100) : 0;
    
    return {
      suggestedPTO,
      vacationBlocks,
      totalDaysOff,
      ptoUsed,
      efficiency
    };
  }

  private findOptimizationOpportunities(holidayDates: Set<string>, companyHolidayDates: Set<string>) {
    const opportunities: Array<{
      startDate: Date;
      endDate: Date;
      totalDays: number;
      ptoDaysNeeded: number;
      ptoDates: Date[];
      weekendDays: number;
      holidayDays: number;
      efficiency: number;
    }> = [];

    console.log('Finding opportunities with holidays:', this.holidays.length);

    // Check each holiday for optimization opportunities
    for (const holiday of this.holidays) {
      const holidayDate = new Date(holiday.date);
      
      // Strategy 1: Extend weekends with holidays
      const weekendOpportunities = this.findWeekendExtensions(holidayDate, holidayDates, companyHolidayDates);
      opportunities.push(...weekendOpportunities);
      
      // Strategy 2: Bridge holidays
      const bridgeOpportunities = this.findHolidayBridges(holidayDate, holidayDates, companyHolidayDates);
      opportunities.push(...bridgeOpportunities);
    }

    // Strategy 3: Create standalone vacation blocks if we need more opportunities
    if (opportunities.length < 3) {
      const standaloneOpportunities = this.createStandaloneVacations();
      opportunities.push(...standaloneOpportunities);
    }

    console.log('Total opportunities before deduplication:', opportunities.length);

    // Remove duplicates and overlapping opportunities
    const deduplicated = this.deduplicateOpportunities(opportunities);
    console.log('Opportunities after deduplication:', deduplicated.length);
    
    return deduplicated;
  }

  private findWeekendExtensions(holidayDate: Date, holidayDates: Set<string>, companyHolidayDates: Set<string>) {
    const opportunities = [];
    
    // Check if holiday is adjacent to weekend
    const dayOfWeek = holidayDate.getDay();
    
    if (dayOfWeek === 1) { // Monday holiday - extend weekend
      const friday = addDays(holidayDate, -4);
      if (this.isWorkDay(friday, holidayDates, companyHolidayDates)) {
        const opportunity = this.createOpportunity(friday, holidayDate, holidayDates, companyHolidayDates);
        if (opportunity.ptoDaysNeeded > 0) {
          opportunities.push(opportunity);
        }
      }
    } else if (dayOfWeek === 5) { // Friday holiday - extend weekend
      const monday = addDays(holidayDate, 3);
      if (this.isWorkDay(monday, holidayDates, companyHolidayDates)) {
        const opportunity = this.createOpportunity(holidayDate, monday, holidayDates, companyHolidayDates);
        if (opportunity.ptoDaysNeeded > 0) {
          opportunities.push(opportunity);
        }
      }
    }
    
    return opportunities;
  }

  private findHolidayBridges(holidayDate: Date, holidayDates: Set<string>, companyHolidayDates: Set<string>) {
    const opportunities = [];
    
    // Look for holidays within a week of each other
    for (let i = 1; i <= 7; i++) {
      const nextDate = addDays(holidayDate, i);
      const nextDateStr = format(nextDate, 'yyyy-MM-dd');
      
      if (holidayDates.has(nextDateStr) || companyHolidayDates.has(nextDateStr)) {
        // Found another holiday - create bridge opportunity
        const bridgeOpportunity = this.createBridgeOpportunity(holidayDate, nextDate, holidayDates, companyHolidayDates);
        if (bridgeOpportunity && bridgeOpportunity.ptoDaysNeeded > 0) {
          opportunities.push(bridgeOpportunity);
        }
        break;
      }
    }
    
    return opportunities;
  }

  private createStandaloneVacations() {
    const opportunities = [];
    
    // Create vacation opportunities based on style preference
    if (this.preferences.vacationStyle === 'long-weekends') {
      // Create 3-4 day weekend opportunities
      const fridays = this.findFridaysForLongWeekends();
      for (const friday of fridays.slice(0, 8)) {
        const monday = addDays(friday, 3);
        const opportunity = this.createOpportunity(friday, monday, new Set(), new Set());
        if (opportunity.ptoDaysNeeded > 0 && opportunity.ptoDaysNeeded <= 2) {
          opportunities.push(opportunity);
        }
      }
    } else if (this.preferences.vacationStyle === 'week-long') {
      // Create week-long vacation opportunities
      const months = [2, 5, 8, 10]; // March, June, September, November
      for (const month of months) {
        const vacationStart = new Date(this.year, month, 15);
        const vacationEnd = addDays(vacationStart, 6);
        const opportunity = this.createOpportunity(vacationStart, vacationEnd, new Set(), new Set());
        if (opportunity.ptoDaysNeeded > 0) {
          opportunities.push(opportunity);
        }
      }
    } else {
      // Balanced approach - mix of short and long
      const shortVacations = this.findFridaysForLongWeekends().slice(0, 4);
      for (const friday of shortVacations) {
        const monday = addDays(friday, 3);
        const opportunity = this.createOpportunity(friday, monday, new Set(), new Set());
        if (opportunity.ptoDaysNeeded > 0 && opportunity.ptoDaysNeeded <= 2) {
          opportunities.push(opportunity);
        }
      }
      
      // Add some longer vacations
      const months = [5, 8]; // June, September
      for (const month of months) {
        const vacationStart = new Date(this.year, month, 15);
        const vacationEnd = addDays(vacationStart, 6);
        const opportunity = this.createOpportunity(vacationStart, vacationEnd, new Set(), new Set());
        if (opportunity.ptoDaysNeeded > 0) {
          opportunities.push(opportunity);
        }
      }
    }
    
    return opportunities;
  }
  
  private findFridaysForLongWeekends(): Date[] {
    const fridays: Date[] = [];
    const startDate = new Date(this.year, 0, 1);
    
    // Find all Fridays in the year
    let currentDate = new Date(startDate);
    while (currentDate.getFullYear() === this.year) {
      if (currentDate.getDay() === 5) { // Friday
        fridays.push(new Date(currentDate));
      }
      currentDate = addDays(currentDate, 1);
    }
    
    // Filter out Fridays that are too close to holidays or already taken
    return fridays.filter((friday, index) => {
      // Space them out - every 4th Friday or so
      return index % 4 === 0;
    });
  }

  private createOpportunity(startDate: Date, endDate: Date, holidayDates: Set<string>, companyHolidayDates: Set<string>) {
    const ptoDates: Date[] = [];
    let weekendDays = 0;
    let holidayDays = 0;
    let totalDays = 0;
    
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      totalDays++;
      
      if (isWeekend(currentDate)) {
        weekendDays++;
      } else if (holidayDates.has(dateStr) || companyHolidayDates.has(dateStr)) {
        holidayDays++;
      } else {
        ptoDates.push(new Date(currentDate));
      }
      
      currentDate = addDays(currentDate, 1);
    }
    
    const efficiency = ptoDates.length > 0 ? totalDays / ptoDates.length : 0;
    
    return {
      startDate,
      endDate,
      totalDays,
      ptoDaysNeeded: ptoDates.length,
      ptoDates,
      weekendDays,
      holidayDays,
      efficiency
    };
  }

  private createBridgeOpportunity(startHoliday: Date, endHoliday: Date, holidayDates: Set<string>, companyHolidayDates: Set<string>) {
    // Extend to include surrounding weekends
    const weekStart = startOfWeek(startHoliday);
    const weekEnd = endOfWeek(endHoliday);
    
    return this.createOpportunity(weekStart, weekEnd, holidayDates, companyHolidayDates);
  }

  private isWorkDay(date: Date, holidayDates: Set<string>, companyHolidayDates: Set<string>): boolean {
    if (isWeekend(date)) return false;
    const dateStr = format(date, 'yyyy-MM-dd');
    return !holidayDates.has(dateStr) && !companyHolidayDates.has(dateStr);
  }

  private deduplicateOpportunities(opportunities: any[]) {
    const seen = new Set<string>();
    return opportunities.filter(opp => {
      const key = `${format(opp.startDate, 'yyyy-MM-dd')}-${format(opp.endDate, 'yyyy-MM-dd')}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return opp.ptoDaysNeeded > 0; // Only include opportunities that require PTO
    });
  }
}