
-- Simulation instance per user
CREATE TABLE public.scrum_simulations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  current_day INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.scrum_simulations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own simulations" ON public.scrum_simulations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own simulations" ON public.scrum_simulations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own simulations" ON public.scrum_simulations
  FOR UPDATE USING (auth.uid() = user_id);

-- Daily interactions / chat messages
CREATE TABLE public.simulation_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  simulation_id UUID NOT NULL REFERENCES public.scrum_simulations(id) ON DELETE CASCADE,
  day INTEGER NOT NULL,
  role TEXT NOT NULL, -- 'user', 'team_member', 'system', 'narrator'
  speaker TEXT, -- e.g. 'Sean', 'Sebastian', 'Christo', etc.
  content TEXT NOT NULL,
  ceremony TEXT, -- 'sprint_planning', 'daily_scrum', 'backlog_refinement', 'sprint_review', 'sprint_retro'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.simulation_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sim messages" ON public.simulation_messages
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.scrum_simulations s WHERE s.id = simulation_id AND s.user_id = auth.uid()
  ));
CREATE POLICY "Users can create own sim messages" ON public.simulation_messages
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.scrum_simulations s WHERE s.id = simulation_id AND s.user_id = auth.uid()
  ));

-- Daily scores
CREATE TABLE public.simulation_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  simulation_id UUID NOT NULL REFERENCES public.scrum_simulations(id) ON DELETE CASCADE,
  day INTEGER NOT NULL,
  facilitation_score INTEGER NOT NULL DEFAULT 0,
  communication_score INTEGER NOT NULL DEFAULT 0,
  artifact_score INTEGER NOT NULL DEFAULT 0,
  decision_score INTEGER NOT NULL DEFAULT 0,
  total_score INTEGER NOT NULL DEFAULT 0,
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(simulation_id, day)
);

ALTER TABLE public.simulation_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sim scores" ON public.simulation_scores
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.scrum_simulations s WHERE s.id = simulation_id AND s.user_id = auth.uid()
  ));
CREATE POLICY "Users can create own sim scores" ON public.simulation_scores
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.scrum_simulations s WHERE s.id = simulation_id AND s.user_id = auth.uid()
  ));

-- Remove all prerequisite records temporarily for testing
DELETE FROM public.course_prerequisites;
