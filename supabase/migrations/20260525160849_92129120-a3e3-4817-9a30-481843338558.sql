CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  reservation_date DATE NOT NULL,
  num_guests INTEGER NOT NULL CHECK (num_guests >= 1 AND num_guests <= 20),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit reservations"
  ON public.reservations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view reservations"
  ON public.reservations FOR SELECT
  TO authenticated
  USING (true);