-- Add more cities with INR and comprehensive cost of living data
INSERT INTO cost_of_living (country_code, city, category, item_name, price_usd, local_currency, local_price, quality_rating)
VALUES 
  -- Delhi, India
  ('IN', 'Delhi', 'food', 'Coffee (Regular)', 1.80, 'INR', 150.00, 3.9),
  ('IN', 'Delhi', 'food', 'Big Mac Meal', 4.20, 'INR', 350.00, 3.8),
  ('IN', 'Delhi', 'food', 'Restaurant Meal (Mid-range)', 6.00, 'INR', 500.00, 4.0),
  ('IN', 'Delhi', 'transport', 'Taxi (1km)', 0.35, 'INR', 29.00, 3.5),
  ('IN', 'Delhi', 'transport', 'Monthly Metro Pass', 18.00, 'INR', 1500.00, 4.2),
  ('IN', 'Delhi', 'housing', 'Apartment (1BR City Center)', 350.00, 'INR', 29000.00, 3.5),
  ('IN', 'Delhi', 'utilities', 'Basic Monthly Utilities', 25.00, 'INR', 2100.00, 3.8),
  
  -- Bangalore, India
  ('IN', 'Bangalore', 'food', 'Coffee (Regular)', 2.00, 'INR', 166.00, 4.1),
  ('IN', 'Bangalore', 'food', 'Big Mac Meal', 4.50, 'INR', 375.00, 4.0),
  ('IN', 'Bangalore', 'food', 'Restaurant Meal (Mid-range)', 7.50, 'INR', 625.00, 4.2),
  ('IN', 'Bangalore', 'transport', 'Taxi (1km)', 0.40, 'INR', 33.00, 3.8),
  ('IN', 'Bangalore', 'transport', 'Monthly Metro Pass', 20.00, 'INR', 1665.00, 4.3),
  ('IN', 'Bangalore', 'housing', 'Apartment (1BR City Center)', 420.00, 'INR', 35000.00, 3.8),
  ('IN', 'Bangalore', 'utilities', 'Basic Monthly Utilities', 28.00, 'INR', 2330.00, 4.0),
  
  -- Singapore
  ('SG', 'Singapore', 'food', 'Coffee (Regular)', 4.50, 'SGD', 6.00, 4.5),
  ('SG', 'Singapore', 'food', 'Big Mac Meal', 8.50, 'SGD', 11.40, 4.3),
  ('SG', 'Singapore', 'food', 'Restaurant Meal (Mid-range)', 15.00, 'SGD', 20.00, 4.6),
  ('SG', 'Singapore', 'transport', 'Taxi (1km)', 0.80, 'SGD', 1.07, 4.5),
  ('SG', 'Singapore', 'transport', 'Monthly Metro Pass', 90.00, 'SGD', 120.00, 4.7),
  ('SG', 'Singapore', 'housing', 'Apartment (1BR City Center)', 2200.00, 'SGD', 2950.00, 4.4),
  ('SG', 'Singapore', 'utilities', 'Basic Monthly Utilities', 120.00, 'SGD', 160.00, 4.5),
  
  -- Dubai, UAE
  ('AE', 'Dubai', 'food', 'Coffee (Regular)', 4.80, 'AED', 17.60, 4.3),
  ('AE', 'Dubai', 'food', 'Big Mac Meal', 7.50, 'AED', 27.50, 4.2),
  ('AE', 'Dubai', 'food', 'Restaurant Meal (Mid-range)', 18.00, 'AED', 66.00, 4.4),
  ('AE', 'Dubai', 'transport', 'Taxi (1km)', 0.60, 'AED', 2.20, 4.3),
  ('AE', 'Dubai', 'transport', 'Monthly Metro Pass', 70.00, 'AED', 257.00, 4.5),
  ('AE', 'Dubai', 'housing', 'Apartment (1BR City Center)', 1400.00, 'AED', 5140.00, 4.2),
  ('AE', 'Dubai', 'utilities', 'Basic Monthly Utilities', 110.00, 'AED', 404.00, 4.3),
  
  -- Sydney, Australia
  ('AU', 'Sydney', 'food', 'Coffee (Regular)', 3.80, 'AUD', 5.10, 4.4),
  ('AU', 'Sydney', 'food', 'Big Mac Meal', 9.50, 'AUD', 12.80, 4.2),
  ('AU', 'Sydney', 'food', 'Restaurant Meal (Mid-range)', 22.00, 'AUD', 29.70, 4.3),
  ('AU', 'Sydney', 'transport', 'Taxi (1km)', 2.20, 'AUD', 2.97, 4.0),
  ('AU', 'Sydney', 'transport', 'Monthly Metro Pass', 140.00, 'AUD', 189.00, 4.4),
  ('AU', 'Sydney', 'housing', 'Apartment (1BR City Center)', 1800.00, 'AUD', 2430.00, 4.1),
  ('AU', 'Sydney', 'utilities', 'Basic Monthly Utilities', 180.00, 'AUD', 243.00, 4.2),
  
  -- Bangkok, Thailand
  ('TH', 'Bangkok', 'food', 'Coffee (Regular)', 2.50, 'THB', 88.50, 4.0),
  ('TH', 'Bangkok', 'food', 'Big Mac Meal', 5.50, 'THB', 195.00, 3.9),
  ('TH', 'Bangkok', 'food', 'Restaurant Meal (Mid-range)', 8.00, 'THB', 283.00, 4.2),
  ('TH', 'Bangkok', 'transport', 'Taxi (1km)', 0.45, 'THB', 16.00, 3.8),
  ('TH', 'Bangkok', 'transport', 'Monthly Metro Pass', 45.00, 'THB', 1595.00, 4.1),
  ('TH', 'Bangkok', 'housing', 'Apartment (1BR City Center)', 600.00, 'THB', 21250.00, 3.9),
  ('TH', 'Bangkok', 'utilities', 'Basic Monthly Utilities', 65.00, 'THB', 2302.00, 4.0),
  
  -- Paris, France
  ('FR', 'Paris', 'food', 'Coffee (Regular)', 3.50, 'EUR', 2.98, 4.3),
  ('FR', 'Paris', 'food', 'Big Mac Meal', 10.00, 'EUR', 8.50, 4.1),
  ('FR', 'Paris', 'food', 'Restaurant Meal (Mid-range)', 18.00, 'EUR', 15.30, 4.5),
  ('FR', 'Paris', 'transport', 'Taxi (1km)', 2.00, 'EUR', 1.70, 4.0),
  ('FR', 'Paris', 'transport', 'Monthly Metro Pass', 85.00, 'EUR', 72.25, 4.4),
  ('FR', 'Paris', 'housing', 'Apartment (1BR City Center)', 1350.00, 'EUR', 1147.50, 4.0),
  ('FR', 'Paris', 'utilities', 'Basic Monthly Utilities', 130.00, 'EUR', 110.50, 4.1),
  
  -- Toronto, Canada
  ('CA', 'Toronto', 'food', 'Coffee (Regular)', 3.20, 'CAD', 4.00, 4.2),
  ('CA', 'Toronto', 'food', 'Big Mac Meal', 10.50, 'CAD', 13.13, 4.0),
  ('CA', 'Toronto', 'food', 'Restaurant Meal (Mid-range)', 20.00, 'CAD', 25.00, 4.3),
  ('CA', 'Toronto', 'transport', 'Taxi (1km)', 1.80, 'CAD', 2.25, 3.9),
  ('CA', 'Toronto', 'transport', 'Monthly Metro Pass', 120.00, 'CAD', 150.00, 4.2),
  ('CA', 'Toronto', 'housing', 'Apartment (1BR City Center)', 1650.00, 'CAD', 2062.50, 3.8),
  ('CA', 'Toronto', 'utilities', 'Basic Monthly Utilities', 140.00, 'CAD', 175.00, 4.0);