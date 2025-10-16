-- Add preferred_cities column to profiles table (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'preferred_cities'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN preferred_cities TEXT[] DEFAULT ARRAY['Mumbai', 'Delhi', 'Bangalore'];
  END IF;
END $$;

-- Fix the handle_new_user trigger to avoid duplicate key violations
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    INSERT INTO public.profiles (user_id, full_name, username)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1))
    )
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$function$;

-- Add Indian cities that don't already exist
INSERT INTO public.cost_of_living (country_code, city, category, item_name, price_usd, local_currency, local_price, quality_rating) 
SELECT * FROM (VALUES
  -- Mumbai
  ('IN', 'Mumbai', 'food', 'Meal at Inexpensive Restaurant', 4.50, 'INR', 375, 4.2),
  ('IN', 'Mumbai', 'food', 'Meal for 2, Mid-range Restaurant', 18.00, 'INR', 1500, 4.5),
  ('IN', 'Mumbai', 'housing', 'Apartment 1 bedroom City Centre', 800.00, 'INR', 66700, 3.8),
  ('IN', 'Mumbai', 'transport', 'One-way Ticket Local Transport', 0.50, 'INR', 42, 3.5),
  ('IN', 'Mumbai', 'utilities', 'Basic Utilities (Monthly)', 45.00, 'INR', 3750, 3.5),
  
  -- Delhi  
  ('IN', 'Delhi', 'food', 'Meal at Inexpensive Restaurant', 3.80, 'INR', 316, 4.0),
  ('IN', 'Delhi', 'housing', 'Apartment 1 bedroom City Centre', 550.00, 'INR', 45850, 3.6),
  ('IN', 'Delhi', 'transport', 'One-way Ticket Local Transport', 0.36, 'INR', 30, 4.0),
  ('IN', 'Delhi', 'utilities', 'Basic Utilities (Monthly)', 40.00, 'INR', 3330, 3.3)
) AS v(country_code, city, category, item_name, price_usd, local_currency, local_price, quality_rating)
WHERE NOT EXISTS (
  SELECT 1 FROM public.cost_of_living c 
  WHERE c.country_code = v.country_code 
  AND c.city = v.city 
  AND c.category = v.category 
  AND c.item_name = v.item_name
);