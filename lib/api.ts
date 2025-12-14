import { supabase } from './supabase';
import type { CheckIn, DayPlan, Reflection, PlanBlock, CalendarEvent } from './types';

const today = () => new Date().toISOString().split('T')[0];

// ============ Check-Ins ============

export async function getTodayCheckIn(userId: string) {
  const { data, error } = await supabase
    .from('check_ins')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today())
    .maybeSingle();

  if (error) throw error;
  return data as CheckIn | null;
}

export async function createCheckIn(
  userId: string,
  mood: number,
  energyLevel: number,
  note?: string
) {
  const { data, error } = await supabase
    .from('check_ins')
    .upsert({
      user_id: userId,
      date: today(),
      mood,
      energy_level: energyLevel,
      note,
    })
    .select()
    .single();

  if (error) throw error;
  return data as CheckIn;
}

// ============ Day Plans ============

export async function getTodayPlan(userId: string) {
  const { data, error } = await supabase
    .from('day_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today())
    .maybeSingle();

  if (error) throw error;
  return data as DayPlan | null;
}

export async function createDayPlan(
  userId: string,
  checkInId: string,
  plan: PlanBlock[]
) {
  const { data, error } = await supabase
    .from('day_plans')
    .upsert({
      user_id: userId,
      check_in_id: checkInId,
      date: today(),
      plan,
      current_step: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data as DayPlan;
}

export async function updateCurrentStep(planId: string, step: number) {
  const { data, error } = await supabase
    .from('day_plans')
    .update({ current_step: step })
    .eq('id', planId)
    .select()
    .single();

  if (error) throw error;
  return data as DayPlan;
}

// ============ Reflections ============

export async function getTodayReflection(userId: string) {
  const { data, error } = await supabase
    .from('reflections')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today())
    .maybeSingle();

  if (error) throw error;
  return data as Reflection | null;
}

export async function createReflection(
  userId: string,
  planId: string | null,
  rating: number,
  notes?: string
) {
  const { data, error } = await supabase
    .from('reflections')
    .upsert({
      user_id: userId,
      day_plan_id: planId,
      date: today(),
      rating,
      notes,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Reflection;
}

// ============ Plan Generation ============

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function generatePlan(
  checkIn: CheckIn,
  calendarEvents: CalendarEvent[],
  workStart: string = '09:00',
  workEnd: string = '17:00'
): PlanBlock[] {
  const blocks: PlanBlock[] = [];
  const { energy_level } = checkIn;

  // Determine focus block duration based on energy
  let focusDuration = 60; // default
  if (energy_level >= 4) focusDuration = 90; // high energy
  if (energy_level <= 2) focusDuration = 45; // low energy

  const workStartMin = timeToMinutes(workStart);
  const workEndMin = timeToMinutes(workEnd);
  let currentTime = workStartMin;

  // Add calendar events
  const sortedEvents = [...calendarEvents].sort(
    (a, b) => timeToMinutes(a.start) - timeToMinutes(b.start)
  );

  for (const event of sortedEvents) {
    const eventStart = timeToMinutes(event.start);
    const eventEnd = timeToMinutes(event.end);

    // Add focus block before event if there's time
    if (currentTime + focusDuration <= eventStart) {
      blocks.push({
        type: 'focus',
        title: 'Focus Block',
        start: minutesToTime(currentTime),
        end: minutesToTime(currentTime + focusDuration),
        duration: focusDuration,
      });
      currentTime += focusDuration;

      // Add break
      blocks.push({
        type: 'break',
        title: 'Break',
        start: minutesToTime(currentTime),
        end: minutesToTime(currentTime + 15),
        duration: 15,
      });
      currentTime += 15;
    }

    // Add event
    blocks.push({
      type: 'event',
      title: event.title,
      start: event.start,
      end: event.end,
      duration: eventEnd - eventStart,
    });
    currentTime = eventEnd;
  }

  // Fill remaining time with focus blocks
  while (currentTime + focusDuration <= workEndMin) {
    blocks.push({
      type: 'focus',
      title: 'Focus Block',
      start: minutesToTime(currentTime),
      end: minutesToTime(currentTime + focusDuration),
      duration: focusDuration,
    });
    currentTime += focusDuration;

    // Add break if there's time
    if (currentTime + 15 <= workEndMin) {
      blocks.push({
        type: 'break',
        title: 'Break',
        start: minutesToTime(currentTime),
        end: minutesToTime(currentTime + 15),
        duration: 15,
      });
      currentTime += 15;
    }
  }

  return blocks;
}

export function getNextStep(plan: DayPlan): PlanBlock | null {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Find the next block that hasn't started yet or is currently active
  for (const block of plan.plan) {
    const blockStart = timeToMinutes(block.start);
    const blockEnd = timeToMinutes(block.end);

    if (currentMinutes < blockEnd) {
      return block;
    }
  }

  return null; // All blocks completed
}
