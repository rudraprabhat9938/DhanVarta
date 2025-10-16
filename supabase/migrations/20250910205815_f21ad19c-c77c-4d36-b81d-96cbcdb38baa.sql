-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  user_type TEXT DEFAULT 'traveler' CHECK (user_type IN ('traveler', 'investor', 'business')),
  preferred_currencies TEXT[] DEFAULT ARRAY['USD', 'EUR'],
  location_country TEXT,
  investment_experience TEXT DEFAULT 'beginner' CHECK (investment_experience IN ('beginner', 'intermediate', 'expert')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create currency insights table for community-driven data
CREATE TABLE public.currency_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  currency_pair TEXT NOT NULL,
  location TEXT,
  actual_rate DECIMAL(20, 8),
  official_rate DECIMAL(20, 8),
  spread_percentage DECIMAL(5, 2),
  venue_type TEXT CHECK (venue_type IN ('bank', 'exchange', 'atm', 'street', 'online')),
  notes TEXT,
  verified_by_blockchain BOOLEAN DEFAULT false,
  verification_hash TEXT,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI predictions table
CREATE TABLE public.ai_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  currency_pair TEXT NOT NULL,
  prediction_type TEXT CHECK (prediction_type IN ('best_time', 'trend', 'volatility', 'event_impact')),
  prediction_data JSONB NOT NULL,
  confidence_score DECIMAL(3, 2),
  time_horizon TEXT CHECK (time_horizon IN ('1h', '1d', '1w', '1m', '3m')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create cost of living comparisons table
CREATE TABLE public.cost_of_living (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL,
  city TEXT,
  category TEXT CHECK (category IN ('food', 'transport', 'housing', 'entertainment', 'utilities')),
  item_name TEXT NOT NULL,
  price_usd DECIMAL(10, 2),
  local_currency TEXT,
  local_price DECIMAL(10, 2),
  quality_rating DECIMAL(2, 1),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(country_code, city, category, item_name)
);

-- Create user favorites and watchlists
CREATE TABLE public.user_watchlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  currency_pair TEXT NOT NULL,
  target_rate DECIMAL(20, 8),
  alert_type TEXT CHECK (alert_type IN ('above', 'below', 'change_percent')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, currency_pair, alert_type)
);

-- Create conversion history
CREATE TABLE public.conversion_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  amount DECIMAL(20, 8),
  result DECIMAL(20, 8),
  exchange_rate DECIMAL(20, 8),
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create what-if scenarios table
CREATE TABLE public.what_if_scenarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_name TEXT NOT NULL,
  scenario_data JSONB NOT NULL,
  results JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currency_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_of_living ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversion_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.what_if_scenarios ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for currency insights
CREATE POLICY "Anyone can view currency insights" 
ON public.currency_insights FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create insights" 
ON public.currency_insights FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own insights" 
ON public.currency_insights FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for AI predictions (public read)
CREATE POLICY "Anyone can view AI predictions" 
ON public.ai_predictions FOR SELECT USING (true);

-- Create RLS policies for cost of living (public read)
CREATE POLICY "Anyone can view cost of living data" 
ON public.cost_of_living FOR SELECT USING (true);

-- Create RLS policies for user watchlist
CREATE POLICY "Users can manage their own watchlist" 
ON public.user_watchlist FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for conversion history
CREATE POLICY "Users can view their own history" 
ON public.conversion_history FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create conversion history" 
ON public.conversion_history FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create RLS policies for what-if scenarios
CREATE POLICY "Users can manage their own scenarios" 
ON public.what_if_scenarios FOR ALL USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name, username)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample cost of living data
INSERT INTO public.cost_of_living (country_code, city, category, item_name, price_usd, local_currency, local_price, quality_rating) VALUES
('US', 'New York', 'food', 'Coffee (Regular)', 3.50, 'USD', 3.50, 4.2),
('US', 'New York', 'food', 'Big Mac Meal', 12.00, 'USD', 12.00, 4.0),
('GB', 'London', 'food', 'Coffee (Regular)', 4.20, 'GBP', 3.30, 4.1),
('GB', 'London', 'food', 'Big Mac Meal', 8.50, 'GBP', 6.70, 3.9),
('JP', 'Tokyo', 'food', 'Coffee (Regular)', 3.80, 'JPY', 420, 4.3),
('JP', 'Tokyo', 'food', 'Big Mac Meal', 6.50, 'JPY', 720, 4.4),
('IN', 'Mumbai', 'food', 'Coffee (Regular)', 1.20, 'INR', 100, 3.8),
('IN', 'Mumbai', 'food', 'Big Mac Meal', 4.50, 'INR', 375, 3.7),
('US', 'New York', 'transport', 'Taxi (1km)', 2.50, 'USD', 2.50, 3.5),
('GB', 'London', 'transport', 'Taxi (1km)', 3.20, 'GBP', 2.50, 3.8),
('JP', 'Tokyo', 'transport', 'Taxi (1km)', 4.50, 'JPY', 500, 4.5),
('IN', 'Mumbai', 'transport', 'Taxi (1km)', 0.80, 'INR', 67, 3.2);

-- Insert sample AI predictions
INSERT INTO public.ai_predictions (currency_pair, prediction_type, prediction_data, confidence_score, time_horizon, expires_at) VALUES
('USD/EUR', 'best_time', '{"recommendation": "wait", "reason": "EUR expected to strengthen in next 3 days", "optimal_time": "2025-01-13T10:00:00Z"}', 0.78, '1w', now() + interval '1 week'),
('GBP/USD', 'trend', '{"direction": "bullish", "strength": "moderate", "key_factors": ["BoE policy", "inflation data"]}', 0.65, '1m', now() + interval '1 month'),
('USD/JPY', 'volatility', '{"level": "high", "expected_range": "145-155", "triggers": ["Fed minutes", "BoJ intervention"]}', 0.82, '1w', now() + interval '1 week');