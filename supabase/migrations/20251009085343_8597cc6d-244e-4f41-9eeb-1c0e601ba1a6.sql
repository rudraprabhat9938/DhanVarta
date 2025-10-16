-- Add more Indian cities to cost_of_living table
INSERT INTO public.cost_of_living (country_code, city, category, item_name, price_usd, local_currency, local_price, quality_rating) VALUES
-- Mumbai
('IN', 'Mumbai', 'food', 'Meal at Inexpensive Restaurant', 4.50, 'INR', 375, 4.2),
('IN', 'Mumbai', 'food', 'Meal for 2, Mid-range Restaurant', 18.00, 'INR', 1500, 4.5),
('IN', 'Mumbai', 'food', 'Domestic Beer (0.5L)', 3.60, 'INR', 300, 4.0),
('IN', 'Mumbai', 'housing', 'Apartment 1 bedroom City Centre', 800.00, 'INR', 66700, 3.8),
('IN', 'Mumbai', 'housing', 'Apartment 3 bedroom City Centre', 2200.00, 'INR', 183500, 4.0),
('IN', 'Mumbai', 'transport', 'One-way Ticket Local Transport', 0.50, 'INR', 42, 3.5),
('IN', 'Mumbai', 'transport', 'Monthly Pass Regular Price', 18.00, 'INR', 1500, 3.8),
('IN', 'Mumbai', 'utilities', 'Basic Utilities (Monthly)', 45.00, 'INR', 3750, 3.5),

-- Delhi
('IN', 'Delhi', 'food', 'Meal at Inexpensive Restaurant', 3.80, 'INR', 316, 4.0),
('IN', 'Delhi', 'food', 'Meal for 2, Mid-range Restaurant', 15.00, 'INR', 1250, 4.3),
('IN', 'Delhi', 'food', 'Domestic Beer (0.5L)', 3.00, 'INR', 250, 3.8),
('IN', 'Delhi', 'housing', 'Apartment 1 bedroom City Centre', 550.00, 'INR', 45850, 3.6),
('IN', 'Delhi', 'housing', 'Apartment 3 bedroom City Centre', 1500.00, 'INR', 125000, 3.8),
('IN', 'Delhi', 'transport', 'One-way Ticket Local Transport', 0.36, 'INR', 30, 4.0),
('IN', 'Delhi', 'transport', 'Monthly Pass Regular Price', 15.00, 'INR', 1250, 4.2),
('IN', 'Delhi', 'utilities', 'Basic Utilities (Monthly)', 40.00, 'INR', 3330, 3.3),

-- Bangalore
('IN', 'Bangalore', 'food', 'Meal at Inexpensive Restaurant', 3.60, 'INR', 300, 4.3),
('IN', 'Bangalore', 'food', 'Meal for 2, Mid-range Restaurant', 14.00, 'INR', 1166, 4.5),
('IN', 'Bangalore', 'food', 'Domestic Beer (0.5L)', 2.75, 'INR', 229, 4.0),
('IN', 'Bangalore', 'housing', 'Apartment 1 bedroom City Centre', 480.00, 'INR', 40000, 4.0),
('IN', 'Bangalore', 'housing', 'Apartment 3 bedroom City Centre', 1300.00, 'INR', 108330, 4.2),
('IN', 'Bangalore', 'transport', 'One-way Ticket Local Transport', 0.36, 'INR', 30, 3.8),
('IN', 'Bangalore', 'transport', 'Monthly Pass Regular Price', 12.00, 'INR', 1000, 4.0),
('IN', 'Bangalore', 'utilities', 'Basic Utilities (Monthly)', 38.00, 'INR', 3166, 3.6),

-- Hyderabad
('IN', 'Hyderabad', 'food', 'Meal at Inexpensive Restaurant', 2.80, 'INR', 233, 4.2),
('IN', 'Hyderabad', 'food', 'Meal for 2, Mid-range Restaurant', 12.00, 'INR', 1000, 4.4),
('IN', 'Hyderabad', 'food', 'Domestic Beer (0.5L)', 2.50, 'INR', 208, 3.9),
('IN', 'Hyderabad', 'housing', 'Apartment 1 bedroom City Centre', 350.00, 'INR', 29166, 3.9),
('IN', 'Hyderabad', 'housing', 'Apartment 3 bedroom City Centre', 950.00, 'INR', 79166, 4.1),
('IN', 'Hyderabad', 'transport', 'One-way Ticket Local Transport', 0.30, 'INR', 25, 3.7),
('IN', 'Hyderabad', 'transport', 'Monthly Pass Regular Price', 10.00, 'INR', 833, 3.9),
('IN', 'Hyderabad', 'utilities', 'Basic Utilities (Monthly)', 35.00, 'INR', 2916, 3.5),

-- Pune
('IN', 'Pune', 'food', 'Meal at Inexpensive Restaurant', 3.20, 'INR', 266, 4.1),
('IN', 'Pune', 'food', 'Meal for 2, Mid-range Restaurant', 13.00, 'INR', 1083, 4.3),
('IN', 'Pune', 'food', 'Domestic Beer (0.5L)', 2.60, 'INR', 216, 3.8),
('IN', 'Pune', 'housing', 'Apartment 1 bedroom City Centre', 420.00, 'INR', 35000, 3.8),
('IN', 'Pune', 'housing', 'Apartment 3 bedroom City Centre', 1150.00, 'INR', 95833, 4.0),
('IN', 'Pune', 'transport', 'One-way Ticket Local Transport', 0.33, 'INR', 27, 3.6),
('IN', 'Pune', 'transport', 'Monthly Pass Regular Price', 11.50, 'INR', 958, 3.8),
('IN', 'Pune', 'utilities', 'Basic Utilities (Monthly)', 36.00, 'INR', 3000, 3.4),

-- Chennai
('IN', 'Chennai', 'food', 'Meal at Inexpensive Restaurant', 2.50, 'INR', 208, 4.0),
('IN', 'Chennai', 'food', 'Meal for 2, Mid-range Restaurant', 11.00, 'INR', 916, 4.2),
('IN', 'Chennai', 'food', 'Domestic Beer (0.5L)', 2.40, 'INR', 200, 3.7),
('IN', 'Chennai', 'housing', 'Apartment 1 bedroom City Centre', 380.00, 'INR', 31666, 3.7),
('IN', 'Chennai', 'housing', 'Apartment 3 bedroom City Centre', 1050.00, 'INR', 87500, 3.9),
('IN', 'Chennai', 'transport', 'One-way Ticket Local Transport', 0.24, 'INR', 20, 3.9),
('IN', 'Chennai', 'transport', 'Monthly Pass Regular Price', 9.00, 'INR', 750, 4.0),
('IN', 'Chennai', 'utilities', 'Basic Utilities (Monthly)', 33.00, 'INR', 2750, 3.4),

-- Kolkata
('IN', 'Kolkata', 'food', 'Meal at Inexpensive Restaurant', 2.30, 'INR', 191, 3.9),
('IN', 'Kolkata', 'food', 'Meal for 2, Mid-range Restaurant', 10.00, 'INR', 833, 4.0),
('IN', 'Kolkata', 'food', 'Domestic Beer (0.5L)', 2.20, 'INR', 183, 3.6),
('IN', 'Kolkata', 'housing', 'Apartment 1 bedroom City Centre', 320.00, 'INR', 26666, 3.5),
('IN', 'Kolkata', 'housing', 'Apartment 3 bedroom City Centre', 880.00, 'INR', 73333, 3.7),
('IN', 'Kolkata', 'transport', 'One-way Ticket Local Transport', 0.20, 'INR', 16, 3.5),
('IN', 'Kolkata', 'transport', 'Monthly Pass Regular Price', 8.00, 'INR', 666, 3.7),
('IN', 'Kolkata', 'utilities', 'Basic Utilities (Monthly)', 32.00, 'INR', 2666, 3.3),

-- Ahmedabad
('IN', 'Ahmedabad', 'food', 'Meal at Inexpensive Restaurant', 2.00, 'INR', 166, 3.8),
('IN', 'Ahmedabad', 'food', 'Meal for 2, Mid-range Restaurant', 9.50, 'INR', 791, 4.0),
('IN', 'Ahmedabad', 'food', 'Domestic Beer (0.5L)', 2.10, 'INR', 175, 3.5),
('IN', 'Ahmedabad', 'housing', 'Apartment 1 bedroom City Centre', 280.00, 'INR', 23333, 3.6),
('IN', 'Ahmedabad', 'housing', 'Apartment 3 bedroom City Centre', 780.00, 'INR', 65000, 3.8),
('IN', 'Ahmedabad', 'transport', 'One-way Ticket Local Transport', 0.18, 'INR', 15, 3.4),
('IN', 'Ahmedabad', 'transport', 'Monthly Pass Regular Price', 7.50, 'INR', 625, 3.6),
('IN', 'Ahmedabad', 'utilities', 'Basic Utilities (Monthly)', 30.00, 'INR', 2500, 3.2);

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

-- Add preferred_cities column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS preferred_cities TEXT[] DEFAULT ARRAY['Mumbai', 'Delhi', 'Bangalore'];