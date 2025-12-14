export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  timezone: string;
  work_start: string;
  work_end: string;
  calendar_connected: boolean;
  created_at: string;
  updated_at: string;
};

export type CheckIn = {
  id: string;
  user_id: string;
  date: string;
  mood: number; // 1-5
  energy_level: number; // 1-5
  note: string | null;
  created_at: string;
};

export type BlockType = 'event' | 'focus' | 'break';

export type PlanBlock = {
  type: BlockType;
  title: string;
  start: string; // HH:MM format
  end: string; // HH:MM format
  duration: number; // minutes
};

export type DayPlan = {
  id: string;
  user_id: string;
  check_in_id: string;
  date: string;
  plan: PlanBlock[];
  current_step: number;
  created_at: string;
  updated_at: string;
};

export type Reflection = {
  id: string;
  user_id: string;
  date: string;
  day_plan_id: string | null;
  rating: number | null; // 1-5
  notes: string | null;
  created_at: string;
};

export type CalendarEvent = {
  title: string;
  start: string;
  end: string;
};
