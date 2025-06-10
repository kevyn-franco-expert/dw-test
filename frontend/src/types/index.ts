export interface Habit {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  check_ins?: CheckIn[];
}

export interface CheckIn {
  id: number;
  habit_id: number;
  date: string;
  notes: string | null;
  created_at: string;
}

export interface Streak {
  first: string;
  last: string;
  days: number;
}

export interface StreakInfo {
  currentStreak: number;
  daysSinceLastCheckIn: number;
  isCheckedInToday: boolean;
}