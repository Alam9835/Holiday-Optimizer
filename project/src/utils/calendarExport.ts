import { format } from 'date-fns';
import { OptimizationResult, Holiday } from '../types';

export function generateICSFile(result: OptimizationResult, holidays: Holiday[], companyHolidays: string[]): string {
  const events: string[] = [];
  
  // Add PTO days as events
  result.suggestedPTO.forEach(pto => {
    const date = new Date(pto.date);
    const dateStr = format(date, 'yyyyMMdd');
    
    events.push([
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${dateStr}`,
      `DTEND;VALUE=DATE:${dateStr}`,
      `SUMMARY:PTO Day`,
      `DESCRIPTION:${pto.reason || 'Suggested PTO day'}`,
      `UID:pto-${pto.date}@holiday-optimizer.com`,
      'END:VEVENT'
    ].join('\r\n'));
  });
  
  // Add vacation blocks as events
  result.vacationBlocks.forEach((block, index) => {
    const startDate = format(new Date(block.startDate), 'yyyyMMdd');
    const endDate = format(new Date(block.endDate), 'yyyyMMdd');
    
    events.push([
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${startDate}`,
      `DTEND;VALUE=DATE:${endDate}`,
      `SUMMARY:Vacation Block ${index + 1}`,
      `DESCRIPTION:${block.totalDays} days off (${block.ptoDays} PTO days)`,
      `UID:vacation-block-${index}@holiday-optimizer.com`,
      'END:VEVENT'
    ].join('\r\n'));
  });
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Holiday Optimizer//EN',
    'CALSCALE:GREGORIAN',
    ...events,
    'END:VCALENDAR'
  ].join('\r\n');
  
  return icsContent;
}

export function downloadICSFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}