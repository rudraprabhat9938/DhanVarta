-- Add more Indian cities to cost_of_living table
INSERT INTO public.cost_of_living (country_code, city, category, item_name, price_usd, local_currency, local_price, quality_rating) 
SELECT * FROM (VALUES
  -- Jaipur
  ('IN', 'Jaipur', 'food', 'Meal at Inexpensive Restaurant', 2.20, 'INR', 183, 3.9),
  ('IN', 'Jaipur', 'food', 'Meal for 2, Mid-range Restaurant', 10.50, 'INR', 875, 4.1),
  ('IN', 'Jaipur', 'housing', 'Apartment 1 bedroom City Centre', 270.00, 'INR', 22500, 3.7),
  ('IN', 'Jaipur', 'transport', 'One-way Ticket Local Transport', 0.24, 'INR', 20, 3.6),
  ('IN', 'Jaipur', 'utilities', 'Basic Utilities (Monthly)', 32.00, 'INR', 2666, 3.4),
  
  -- Surat
  ('IN', 'Surat', 'food', 'Meal at Inexpensive Restaurant', 1.80, 'INR', 150, 3.8),
  ('IN', 'Surat', 'food', 'Meal for 2, Mid-range Restaurant', 9.00, 'INR', 750, 4.0),
  ('IN', 'Surat', 'housing', 'Apartment 1 bedroom City Centre', 240.00, 'INR', 20000, 3.5),
  ('IN', 'Surat', 'transport', 'One-way Ticket Local Transport', 0.18, 'INR', 15, 3.4),
  ('IN', 'Surat', 'utilities', 'Basic Utilities (Monthly)', 28.00, 'INR', 2333, 3.2),
  
  -- Lucknow
  ('IN', 'Lucknow', 'food', 'Meal at Inexpensive Restaurant', 2.10, 'INR', 175, 3.9),
  ('IN', 'Lucknow', 'food', 'Meal for 2, Mid-range Restaurant', 9.50, 'INR', 791, 4.0),
  ('IN', 'Lucknow', 'housing', 'Apartment 1 bedroom City Centre', 260.00, 'INR', 21666, 3.6),
  ('IN', 'Lucknow', 'transport', 'One-way Ticket Local Transport', 0.20, 'INR', 16, 3.5),
  ('IN', 'Lucknow', 'utilities', 'Basic Utilities (Monthly)', 30.00, 'INR', 2500, 3.3),
  
  -- Kanpur
  ('IN', 'Kanpur', 'food', 'Meal at Inexpensive Restaurant', 1.90, 'INR', 158, 3.7),
  ('IN', 'Kanpur', 'food', 'Meal for 2, Mid-range Restaurant', 8.50, 'INR', 708, 3.9),
  ('IN', 'Kanpur', 'housing', 'Apartment 1 bedroom City Centre', 230.00, 'INR', 19166, 3.4),
  ('IN', 'Kanpur', 'transport', 'One-way Ticket Local Transport', 0.18, 'INR', 15, 3.3),
  ('IN', 'Kanpur', 'utilities', 'Basic Utilities (Monthly)', 27.00, 'INR', 2250, 3.2),
  
  -- Nagpur
  ('IN', 'Nagpur', 'food', 'Meal at Inexpensive Restaurant', 2.00, 'INR', 166, 3.8),
  ('IN', 'Nagpur', 'food', 'Meal for 2, Mid-range Restaurant', 9.00, 'INR', 750, 4.0),
  ('IN', 'Nagpur', 'housing', 'Apartment 1 bedroom City Centre', 250.00, 'INR', 20833, 3.5),
  ('IN', 'Nagpur', 'transport', 'One-way Ticket Local Transport', 0.18, 'INR', 15, 3.4),
  ('IN', 'Nagpur', 'utilities', 'Basic Utilities (Monthly)', 29.00, 'INR', 2416, 3.3),
  
  -- Indore
  ('IN', 'Indore', 'food', 'Meal at Inexpensive Restaurant', 2.10, 'INR', 175, 3.9),
  ('IN', 'Indore', 'food', 'Meal for 2, Mid-range Restaurant', 9.50, 'INR', 791, 4.1),
  ('IN', 'Indore', 'housing', 'Apartment 1 bedroom City Centre', 260.00, 'INR', 21666, 3.6),
  ('IN', 'Indore', 'transport', 'One-way Ticket Local Transport', 0.18, 'INR', 15, 3.5),
  ('IN', 'Indore', 'utilities', 'Basic Utilities (Monthly)', 30.00, 'INR', 2500, 3.4),
  
  -- Thane
  ('IN', 'Thane', 'food', 'Meal at Inexpensive Restaurant', 4.00, 'INR', 333, 4.1),
  ('IN', 'Thane', 'food', 'Meal for 2, Mid-range Restaurant', 16.00, 'INR', 1333, 4.4),
  ('IN', 'Thane', 'housing', 'Apartment 1 bedroom City Centre', 650.00, 'INR', 54166, 3.7),
  ('IN', 'Thane', 'transport', 'One-way Ticket Local Transport', 0.42, 'INR', 35, 3.6),
  ('IN', 'Thane', 'utilities', 'Basic Utilities (Monthly)', 42.00, 'INR', 3500, 3.5),
  
  -- Bhopal
  ('IN', 'Bhopal', 'food', 'Meal at Inexpensive Restaurant', 2.00, 'INR', 166, 3.8),
  ('IN', 'Bhopal', 'food', 'Meal for 2, Mid-range Restaurant', 9.00, 'INR', 750, 4.0),
  ('IN', 'Bhopal', 'housing', 'Apartment 1 bedroom City Centre', 240.00, 'INR', 20000, 3.5),
  ('IN', 'Bhopal', 'transport', 'One-way Ticket Local Transport', 0.18, 'INR', 15, 3.4),
  ('IN', 'Bhopal', 'utilities', 'Basic Utilities (Monthly)', 28.00, 'INR', 2333, 3.3),
  
  -- Visakhapatnam
  ('IN', 'Visakhapatnam', 'food', 'Meal at Inexpensive Restaurant', 2.30, 'INR', 191, 3.9),
  ('IN', 'Visakhapatnam', 'food', 'Meal for 2, Mid-range Restaurant', 10.00, 'INR', 833, 4.1),
  ('IN', 'Visakhapatnam', 'housing', 'Apartment 1 bedroom City Centre', 280.00, 'INR', 23333, 3.6),
  ('IN', 'Visakhapatnam', 'transport', 'One-way Ticket Local Transport', 0.18, 'INR', 15, 3.5),
  ('IN', 'Visakhapatnam', 'utilities', 'Basic Utilities (Monthly)', 31.00, 'INR', 2583, 3.4),
  
  -- Patna
  ('IN', 'Patna', 'food', 'Meal at Inexpensive Restaurant', 1.80, 'INR', 150, 3.7),
  ('IN', 'Patna', 'food', 'Meal for 2, Mid-range Restaurant', 8.00, 'INR', 666, 3.8),
  ('IN', 'Patna', 'housing', 'Apartment 1 bedroom City Centre', 220.00, 'INR', 18333, 3.4),
  ('IN', 'Patna', 'transport', 'One-way Ticket Local Transport', 0.18, 'INR', 15, 3.3),
  ('IN', 'Patna', 'utilities', 'Basic Utilities (Monthly)', 26.00, 'INR', 2166, 3.2)
) AS v(country_code, city, category, item_name, price_usd, local_currency, local_price, quality_rating)
WHERE NOT EXISTS (
  SELECT 1 FROM public.cost_of_living c 
  WHERE c.country_code = v.country_code 
  AND c.city = v.city 
  AND c.category = v.category 
  AND c.item_name = v.item_name
);