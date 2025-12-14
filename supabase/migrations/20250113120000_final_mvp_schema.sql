-- Final MVP Schema: profiles, check_ins, day_plans, reflections

-- Check-Ins (mood + energy + optional note)
CREATE TABLE IF NOT EXISTS public.check_ins (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date date DEFAULT CURRENT_DATE NOT NULL,
  mood integer CHECK (mood >= 1 AND mood <= 5) NOT NULL,
  energy_level integer CHECK (energy_level >= 1 AND energy_level <= 5) NOT NULL,
  note text,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, date)
);

-- Day Plans (generated plan with blocks)
CREATE TABLE IF NOT EXISTS public.day_plans (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  check_in_id uuid REFERENCES public.check_ins ON DELETE CASCADE NOT NULL,
  date date DEFAULT CURRENT_DATE NOT NULL,
  plan jsonb NOT NULL, -- Array of {type, title, start, end, duration}
  current_step integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, date)
);

-- Reflections (1-5 rating + optional text)
CREATE TABLE IF NOT EXISTS public.reflections (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  date date DEFAULT CURRENT_DATE NOT NULL,
  day_plan_id uuid REFERENCES public.day_plans ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, date)
);

-- User Settings (minimal: timezone, workday)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'America/New_York';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS work_start time DEFAULT '09:00';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS work_end time DEFAULT '17:00';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS calendar_connected boolean DEFAULT false;

-- Enable RLS
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.day_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own check-ins"
  ON public.check_ins FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own day plans"
  ON public.day_plans FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own reflections"
  ON public.reflections FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Updated_at trigger
CREATE TRIGGER handle_updated_at_day_plans
  BEFORE UPDATE ON public.day_plans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_check_ins_user_date ON public.check_ins(user_id, date);
CREATE INDEX IF NOT EXISTS idx_day_plans_user_date ON public.day_plans(user_id, date);
CREATE INDEX IF NOT EXISTS idx_reflections_user_date ON public.reflections(user_id, date);
