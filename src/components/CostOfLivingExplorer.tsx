import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { MapPin, Coffee, Home, Car, Zap, TrendingUp, TrendingDown, RefreshCw, DollarSign, PieChart, Calculator, Globe2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCurrencyRates } from '@/hooks/useCurrencyRates';

interface CostItem {
  id: string;
  country_code: string;
  city: string;
  category: string;
  item_name: string;
  price_usd: number;
  local_currency: string;
  local_price: number;
  quality_rating: number;
}

const CostOfLivingExplorer = () => {
  const [costData, setCostData] = useState<CostItem[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [comparisonCity, setComparisonCity] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [monthlyBudget, setMonthlyBudget] = useState<string>('80000');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('INR');
  const { toast } = useToast();
  const { rates, getRate } = useCurrencyRates();

  useEffect(() => {
    fetchCostData();
  }, []);

  const fetchCostData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cost_of_living')
        .select('*')
        .order('city', { ascending: true });
      
      if (error) throw error;
      setCostData(data || []);
      
      // Set default cities
      if (data && data.length > 0) {
        const cities = [...new Set(data.map(item => item.city))];
        if (!selectedCity && cities.length > 0) setSelectedCity(cities[0]);
        if (!comparisonCity && cities.length > 1) setComparisonCity(cities[1]);
      }
    } catch (error) {
      console.error('Error fetching cost data:', error);
      toast({
        title: "Error loading data",
        description: "Failed to fetch cost of living data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get unique cities and countries
  const cities = [...new Set(costData.map(item => item.city))].sort();
  const countries = [...new Set(costData.map(item => item.country_code))].sort();
  
  // Get unique categories
  const categories = ['all', ...new Set(costData.map(item => item.category))].sort();

  // Map country codes to names and flags
  const countryInfo: Record<string, { name: string; flag: string }> = {
    'US': { name: 'United States', flag: '🇺🇸' },
    'IN': { name: 'India', flag: '🇮🇳' },
    'GB': { name: 'United Kingdom', flag: '🇬🇧' },
    'SG': { name: 'Singapore', flag: '🇸🇬' },
    'JP': { name: 'Japan', flag: '🇯🇵' },
    'AU': { name: 'Australia', flag: '🇦🇺' },
    'CA': { name: 'Canada', flag: '🇨🇦' },
  };

  // Filter data by country then category
  const filteredByCountry = selectedCountry === 'all' 
    ? costData 
    : costData.filter(item => item.country_code === selectedCountry);
  
  const filteredData = selectedCategory === 'all' 
    ? filteredByCountry 
    : filteredByCountry.filter(item => item.category === selectedCategory);

  // Get filtered cities
  const filteredCities = [...new Set(filteredByCountry.map(item => item.city))].sort();

  // Get data for selected cities
  const baseCityData = filteredData.filter(item => item.city === selectedCity);
  const comparisonCityData = filteredData.filter(item => item.city === comparisonCity);

  // Calculate cost difference
  const calculateDifference = (basePrice: number, comparisonPrice: number) => {
    if (!basePrice || !comparisonPrice) return 0;
    return ((comparisonPrice - basePrice) / basePrice) * 100;
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food':
        return Coffee;
      case 'housing':
        return Home;
      case 'transport':
        return Car;
      case 'utilities':
        return Zap;
      default:
        return MapPin;
    }
  };

  // Group by category
  const groupedData = baseCityData.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, CostItem[]>);

  // Calculate monthly costs for budget planning
  const calculateMonthlyEstimate = (cityData: CostItem[]) => {
    const estimates = {
      food: 0,
      transport: 0,
      housing: 0,
      utilities: 0,
      total: 0
    };

    cityData.forEach(item => {
      if (estimates.hasOwnProperty(item.category)) {
        estimates[item.category as keyof typeof estimates] += item.price_usd;
      }
    });

    estimates.total = Object.values(estimates).reduce((a, b) => a + b, 0);
    return estimates;
  };

  const baseCityEstimate = calculateMonthlyEstimate(baseCityData);
  const compCityEstimate = calculateMonthlyEstimate(comparisonCityData);

  // Convert amounts to selected currency
  const convertAmount = (usdAmount: number) => {
    if (selectedCurrency === 'USD') return usdAmount;
    const rate = getRate('USD', selectedCurrency);
    return usdAmount * rate;
  };

  const countryNames: Record<string, string> = {
    'IN': '🇮🇳 India',
    'US': '🇺🇸 USA',
    'GB': '🇬🇧 UK',
    'AE': '🇦🇪 UAE',
    'SG': '🇸🇬 Singapore',
  };


  return (
    <section className="py-8 sm:py-12 bg-gradient-to-b from-accent/5 to-background">
      <div className="container mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">
            Cost of Living Explorer
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground px-4">
            Discover real-world costs across cities with live currency data
          </p>
        </div>

        {/* City Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <MapPin className="h-5 w-5" />
              Compare Cities
            </CardTitle>
            <CardDescription className="text-sm">
              Select two cities to compare living costs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-primary" />
                  Country
                </label>
                <Select value={selectedCountry} onValueChange={(value) => {
                  setSelectedCountry(value);
                  setSelectedCity('');
                  setComparisonCity('');
                }}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All countries" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-[100]">
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map((code) => (
                      <SelectItem key={code} value={code}>
                        {countryInfo[code]?.flag || '🌍'} {countryInfo[code]?.name || code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Base City</label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select base city" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-[100]">
                    {filteredCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Compare With</label>
                <Select value={comparisonCity} onValueChange={setComparisonCity}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select comparison city" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-[100]">
                    {filteredCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Category Filter</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-[100]">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="text-sm text-muted-foreground">
                  Showing {baseCityData.length} items
                </div>
                {selectedCountry !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {countryInfo[selectedCountry]?.flag} {countryInfo[selectedCountry]?.name}
                  </Badge>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchCostData}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        {loading ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                Loading cost of living data...
              </div>
            </CardContent>
          </Card>
        ) : baseCityData.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                No data available for the selected cities
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedData).map(([category, items]) => {
              const Icon = getCategoryIcon(category);
              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg capitalize">
                      <Icon className="h-5 w-5 text-primary" />
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-2 font-medium">Item</th>
                            <th className="text-right py-3 px-2 font-medium">
                              <div className="flex flex-col items-end">
                                <span>{selectedCity}</span>
                                <span className="text-xs text-muted-foreground font-normal">
                                  {baseCityData[0]?.local_currency}
                                </span>
                              </div>
                            </th>
                            <th className="text-right py-3 px-2 font-medium">USD</th>
                            <th className="text-right py-3 px-2 font-medium">
                              <div className="flex flex-col items-end">
                                <span>{comparisonCity}</span>
                                <span className="text-xs text-muted-foreground font-normal">
                                  {comparisonCityData[0]?.local_currency}
                                </span>
                              </div>
                            </th>
                            <th className="text-right py-3 px-2 font-medium">USD</th>
                            <th className="text-right py-3 px-2 font-medium">Diff</th>
                            <th className="text-center py-3 px-2 font-medium">Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item) => {
                            const compItem = comparisonCityData.find(
                              c => c.item_name === item.item_name && c.category === item.category
                            );
                            const diff = compItem ? calculateDifference(item.price_usd, compItem.price_usd) : 0;
                            
                            return (
                              <tr key={item.id} className="border-b hover:bg-muted/50">
                                <td className="py-3 px-2">{item.item_name}</td>
                                <td className="text-right py-3 px-2 font-medium">
                                  {item.local_price.toFixed(2)}
                                </td>
                                <td className="text-right py-3 px-2 text-muted-foreground">
                                  ${item.price_usd.toFixed(2)}
                                </td>
                                <td className="text-right py-3 px-2 font-medium">
                                  {compItem ? compItem.local_price.toFixed(2) : '-'}
                                </td>
                                <td className="text-right py-3 px-2 text-muted-foreground">
                                  {compItem ? `$${compItem.price_usd.toFixed(2)}` : '-'}
                                </td>
                                <td className="text-right py-3 px-2">
                                  {compItem && (
                                    <div className="flex items-center justify-end gap-1">
                                      {diff > 0 ? (
                                        <TrendingUp className="h-3 w-3 text-destructive" />
                                      ) : diff < 0 ? (
                                        <TrendingDown className="h-3 w-3 text-success" />
                                      ) : null}
                                      <span className={`text-xs font-medium ${
                                        diff > 0 ? 'text-destructive' : diff < 0 ? 'text-success' : ''
                                      }`}>
                                        {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                                      </span>
                                    </div>
                                  )}
                                </td>
                                <td className="text-center py-3 px-2">
                                  <Badge variant="outline" className="text-xs">
                                    ⭐ {item.quality_rating.toFixed(1)}
                                  </Badge>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Budget Planner */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Budget Calculator
              </CardTitle>
              <CardDescription>Estimate your monthly living costs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Monthly Budget</label>
                  <Input
                    type="number"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(e.target.value)}
                    placeholder="Enter amount"
                    className="bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Currency</label>
                  <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-[100]">
                      <SelectItem value="INR">🇮🇳 INR (₹)</SelectItem>
                      <SelectItem value="USD">🇺🇸 USD ($)</SelectItem>
                      <SelectItem value="EUR">🇪🇺 EUR (€)</SelectItem>
                      <SelectItem value="GBP">🇬🇧 GBP (£)</SelectItem>
                      <SelectItem value="JPY">🇯🇵 JPY (¥)</SelectItem>
                      <SelectItem value="AUD">🇦🇺 AUD (A$)</SelectItem>
                      <SelectItem value="CAD">🇨🇦 CAD (C$)</SelectItem>
                      <SelectItem value="CHF">🇨🇭 CHF (Fr)</SelectItem>
                      <SelectItem value="CNY">🇨🇳 CNY (¥)</SelectItem>
                      <SelectItem value="SGD">🇸🇬 SGD (S$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="text-sm font-medium mb-3">Estimated Monthly Breakdown for {selectedCity}:</div>
                {Object.entries(baseCityEstimate).map(([key, value]) => {
                  if (key === 'total') return null;
                  const Icon = getCategoryIcon(key);
                  const converted = convertAmount(value);
                  const budget = parseFloat(monthlyBudget) || 0;
                  const percentage = budget > 0 ? (converted / budget) * 100 : 0;
                  
                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="capitalize font-medium">{key}</span>
                        </div>
                        <span className="font-bold">
                          {rates[selectedCurrency]?.symbol || '$'}{converted.toFixed(2)}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all ${
                            percentage > 100 ? 'bg-destructive' : 
                            percentage > 75 ? 'bg-warning' : 'bg-success'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Total Estimate:</span>
                    <span className="text-lg font-bold text-primary">
                      {rates[selectedCurrency]?.symbol || '$'}{convertAmount(baseCityEstimate.total).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {baseCityEstimate.total > parseFloat(monthlyBudget) ? (
                      <span className="text-destructive">⚠️ Over budget by {rates[selectedCurrency]?.symbol || '$'}{Math.abs(convertAmount(baseCityEstimate.total) - parseFloat(monthlyBudget)).toFixed(2)}</span>
                    ) : (
                      <span className="text-success">✓ Within budget ({((convertAmount(baseCityEstimate.total) / parseFloat(monthlyBudget)) * 100).toFixed(1)}% used)</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Cost Distribution
              </CardTitle>
              <CardDescription>How your money is spent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['food', 'transport', 'housing', 'utilities'].map((cat) => {
                  const baseVal = baseCityEstimate[cat as keyof typeof baseCityEstimate];
                  const compVal = compCityEstimate[cat as keyof typeof compCityEstimate];
                  const diff = compVal > 0 ? calculateDifference(baseVal, compVal) : 0;
                  
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium capitalize">{cat}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold">${baseVal.toFixed(0)}</span>
                          {compVal > 0 && (
                            <>
                              <span className="text-xs text-muted-foreground">vs</span>
                              <span className="text-sm font-bold">${compVal.toFixed(0)}</span>
                              <Badge variant={diff > 0 ? "destructive" : "default"} className="text-xs">
                                {diff > 0 ? '+' : ''}{diff.toFixed(0)}%
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${(baseVal / baseCityEstimate.total) * 100}%` }}
                          />
                        </div>
                        {compVal > 0 && (
                          <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-secondary"
                              style={{ width: `${(compVal / compCityEstimate.total) * 100}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{selectedCity}</Badge>
                    <span className="text-xl font-bold text-primary">
                      ${baseCityEstimate.total.toFixed(0)}/mo
                    </span>
                  </div>
                  {compCityEstimate.total > 0 && (
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{comparisonCity}</Badge>
                      <span className="text-xl font-bold text-secondary">
                        ${compCityEstimate.total.toFixed(0)}/mo
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export { CostOfLivingExplorer };