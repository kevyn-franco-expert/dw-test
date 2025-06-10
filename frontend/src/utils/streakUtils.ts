import { isToday, isYesterday, differenceInDays, parseISO } from 'date-fns';
import type { CheckIn, StreakInfo } from '../types';

/**
 * Calculate streak information for a habit based on its check-ins
 * @param checkIns Array of check-ins for a habit
 * @returns Object containing current streak, days since last check-in, and if checked in today
 */
export const calculateStreakInfo = (checkIns: CheckIn[]): StreakInfo => {
  if (!checkIns || checkIns.length === 0) {
    return {
      currentStreak: 0,
      daysSinceLastCheckIn: 0,
      isCheckedInToday: false,
    };
  }

  // Sort check-ins by date (newest first)
  const sortedCheckIns = [...checkIns].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const latestCheckIn = sortedCheckIns[0];
  const latestDate = parseISO(latestCheckIn.date);
  const isCheckedInToday = isToday(latestDate);
  
  // If checked in today or yesterday, calculate current streak
  if (isCheckedInToday || isYesterday(latestDate)) {
    let currentStreak = 1;
    let previousDate = latestDate;
    
    // Start from the second check-in (index 1)
    for (let i = 1; i < sortedCheckIns.length; i++) {
      const currentDate = parseISO(sortedCheckIns[i].date);
      const dayDifference = differenceInDays(previousDate, currentDate);
      
      // If the difference is 1 day, it's consecutive
      if (dayDifference === 1) {
        currentStreak++;
        previousDate = currentDate;
      } else {
        break;
      }
    }
    
    return {
      currentStreak,
      daysSinceLastCheckIn: 0,
      isCheckedInToday,
    };
  } else {
    // Not in a streak, calculate days since last check-in
    const daysSinceLastCheckIn = differenceInDays(new Date(), latestDate);
    
    return {
      currentStreak: 0,
      daysSinceLastCheckIn,
      isCheckedInToday: false,
    };
  }
};