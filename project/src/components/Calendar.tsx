import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isWeekend, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { Holiday, PTODay } from '../types';

interface CalendarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  holidays: Holiday[];
  ptoDays: PTODay[];
  companyHolidays: string[];
  isPreview?: boolean;
}

export function Calendar({ currentDate, onDateChange, holidays, ptoDays, companyHolidays, isPreview = false }: CalendarProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getDayType = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Check if it's a PTO day
    const ptoDay = ptoDays.find(pto => pto.date === dateStr);
    if (ptoDay) return 'pto';
    
    // Check if it's a company holiday
    if (companyHolidays.includes(dateStr)) return 'company';
    
    // Check if it's a public holiday
    const holiday = holidays.find(h => h.date === dateStr);
    if (holiday) return 'holiday';
    
    // Check if it's a weekend
    if (isWeekend(date)) return 'weekend';
    
    return 'regular';
  };

  const getDayStyles = (date: Date) => {
    const type = getDayType(date);
    const isCurrentMonth = isSameMonth(date, currentDate);
    const isToday = isSameDay(date, new Date());
    
    const baseStyles = "relative w-full h-12 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105";
    
    if (!isCurrentMonth) {
      return `${baseStyles} text-gray-300 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700`;
    }
    
    let styles = baseStyles;
    
    if (isToday) {
      styles += " ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800";
    }
    
    switch (type) {
      case 'pto':
        return `${styles} bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl`;
      case 'holiday':
        return `${styles} bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl`;
      case 'company':
        return `${styles} bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl`;
      case 'weekend':
        return `${styles} bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600`;
      default:
        return `${styles} text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700`;
    }
  };

  const getHolidayName = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const holiday = holidays.find(h => h.date === dateStr);
    return holiday?.localName || holiday?.name;
  };

  const getTooltipContent = (date: Date) => {
    const type = getDayType(date);
    const holidayName = getHolidayName(date);
    const dateStr = format(date, 'EEEE, MMMM d, yyyy');
    
    switch (type) {
      case 'pto':
        return `PTO Day - ${dateStr}`;
      case 'holiday':
        return `${holidayName} - ${dateStr}`;
      case 'company':
        return `Company Holiday - ${dateStr}`;
      case 'weekend':
        return `Weekend - ${dateStr}`;
      default:
        return dateStr;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-500 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in-up animation-delay-100">
        <div className="flex items-center space-x-3 animate-fade-in-up animation-delay-200">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg animate-bounce-gentle">
            <CalendarIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white animate-shimmer">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            {isPreview && (
              <p className="text-sm text-gray-500 dark:text-gray-400">Preview</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onDateChange(subMonths(currentDate, 1))}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
            title="Previous month"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={() => onDateChange(new Date())}
            className="px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 hover:scale-105"
          >
            Today
          </button>
          <button
            onClick={() => onDateChange(addMonths(currentDate, 1))}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
            title="Next month"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4 animate-fade-in-up animation-delay-300">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="h-10 flex items-center justify-center text-sm font-semibold text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-6 animate-fade-in-up animation-delay-400">
        {days.map((date, index) => (
          <div
            key={date.toISOString()}
            className={`${getDayStyles(date)} animate-fade-in-up`}
            style={{ animationDelay: `${index * 20}ms` }}
            title={getTooltipContent(date)}
          >
            {format(date, 'd')}
            {isSameDay(date, new Date()) && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-3 animate-fade-in-up animation-delay-500">
        <div className="flex items-center justify-between animate-fade-in-up animation-delay-600">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 animate-shimmer">Legend</h3>
          {!isPreview && ptoDays.length > 0 && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 animate-bounce-gentle">
              <Info className="w-3 h-3 mr-1" />
              {ptoDays.length} PTO days suggested
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2 animate-fade-in-up animation-delay-700">
            <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded shadow-sm animate-pulse"></div>
            <span className="text-gray-700 dark:text-gray-300">Suggested PTO</span>
          </div>
          <div className="flex items-center space-x-2 animate-fade-in-up animation-delay-700">
            <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded shadow-sm animate-pulse"></div>
            <span className="text-gray-700 dark:text-gray-300">Public Holiday</span>
          </div>
          <div className="flex items-center space-x-2 animate-fade-in-up animation-delay-700">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">Weekend</span>
          </div>
          <div className="flex items-center space-x-2 animate-fade-in-up animation-delay-700">
            <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded shadow-sm animate-pulse"></div>
            <span className="text-gray-700 dark:text-gray-300">Company Holiday</span>
          </div>
        </div>
      </div>
    </div>
  );
}