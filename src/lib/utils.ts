import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Opening hours utility functions
interface OpeningHours {
  monday: string;
  tuesdayToFriday: string;
  weekends: string;
  publicHolidays: string;
}

export const OPENING_HOURS: OpeningHours = {
  monday: "Closed",
  tuesdayToFriday: "10:00 - 18:00",
  weekends: "09:00 - 20:00",
  publicHolidays: "10:00 - 16:00"
};

export function getOpeningHoursByDay(date: Date | null): string {
  if (!date) return '';
  
  // Simplified public holiday check - in production you would use a proper holiday API
  const isPublicHoliday = false; // Placeholder
  
  if (isPublicHoliday) {
    return OPENING_HOURS.publicHolidays;
  }
  
  const day = date.getDay();
  switch (day) {
    case 0: // Sunday
      return OPENING_HOURS.weekends;
    case 1: // Monday
      return OPENING_HOURS.monday;
    case 2: // Tuesday
    case 3: // Wednesday
    case 4: // Thursday
    case 5: // Friday
      return OPENING_HOURS.tuesdayToFriday;
    case 6: // Saturday
      return OPENING_HOURS.weekends;
    default:
      return '';
  }
}

export function getLastAdmissionTime(openingHours: string): string {
  if (openingHours === 'Closed') return 'Closed';
  
  const closingTime = openingHours.split(' - ')[1];
  const hourParts = closingTime.split(':');
  const hour = parseInt(hourParts[0], 10) - 1;
  
  return `${hour}:${hourParts[1]}`;
}
