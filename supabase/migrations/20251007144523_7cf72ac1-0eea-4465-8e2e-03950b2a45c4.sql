-- Insert sample currency insights for demonstration (using correct venue_type values)
INSERT INTO currency_insights (user_id, currency_pair, actual_rate, official_rate, spread_percentage, location, venue_type, notes, upvotes, downvotes)
VALUES 
  ('23daf1a3-79d7-4265-9ae4-3783c9829b50', 'USD/EUR', 0.8520, 0.8500, 0.24, 'Paris, France', 'exchange', 'Great rates at Charles de Gaulle airport exchange', 12, 2),
  ('23daf1a3-79d7-4265-9ae4-3783c9829b50', 'USD/GBP', 0.7320, 0.7300, 0.27, 'London, UK', 'bank', 'Better rates at HSBC than other banks', 8, 1),
  ('23daf1a3-79d7-4265-9ae4-3783c9829b50', 'USD/JPY', 110.50, 110.00, 0.45, 'Tokyo, Japan', 'atm', 'Seven Bank ATMs have good rates', 15, 0);

-- Insert sample portfolio entries
INSERT INTO portfolio (user_id, currency, amount, purchase_rate, purchase_date, notes)
VALUES 
  ('23daf1a3-79d7-4265-9ae4-3783c9829b50', 'EUR', 5000, 0.8450, '2025-01-15', 'Travel fund for Europe trip'),
  ('23daf1a3-79d7-4265-9ae4-3783c9829b50', 'GBP', 2000, 0.7250, '2025-02-01', 'Investment position'),
  ('23daf1a3-79d7-4265-9ae4-3783c9829b50', 'JPY', 500000, 109.50, '2025-02-20', 'Japan vacation budget');

-- Insert sample watchlist alerts
INSERT INTO user_watchlist (user_id, currency_pair, target_rate, alert_type)
VALUES 
  ('23daf1a3-79d7-4265-9ae4-3783c9829b50', 'USD/EUR', 0.8400, 'below'),
  ('23daf1a3-79d7-4265-9ae4-3783c9829b50', 'USD/GBP', 0.7400, 'above'),
  ('23daf1a3-79d7-4265-9ae4-3783c9829b50', 'USD/JPY', 112.00, 'above');