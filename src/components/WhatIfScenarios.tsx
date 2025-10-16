import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, AlertCircle, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const WhatIfScenarios = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [scenario, setScenario] = useState({
    amount: '',
    fromCurrency: '',
    toCurrency: '',
    timeHorizon: '',
    scenario: ''
  });
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const predefinedScenarios = [
    {
      id: 1,
      title: 'US Election Impact',
      description: 'USD strengthens by 5% post-election',
      currencies: ['USD/EUR', 'USD/GBP', 'USD/JPY'],
      impact: 'High',
      probability: '65%'
    },
    {
      id: 2,
      title: 'ECB Rate Hike',
      description: 'EUR gains 3% on aggressive monetary policy',
      currencies: ['EUR/USD', 'EUR/GBP', 'EUR/CHF'],
      impact: 'Medium',
      probability: '45%'
    },
    {
      id: 3,
      title: 'Geopolitical Tension',
      description: 'Safe havens rally, JPY and CHF up 4%',
      currencies: ['JPY/USD', 'CHF/EUR', 'XAU/USD'],
      impact: 'High',
      probability: '30%'
    }
  ];

  const aiPredictions = [
    {
      currency: 'USD/EUR',
      current: 1.0850,
      prediction: 1.1200,
      confidence: 78,
      timeframe: '30 days',
      factors: ['Fed policy', 'Economic data', 'Risk sentiment']
    },
    {
      currency: 'GBP/USD',
      current: 1.2650,
      prediction: 1.2400,
      confidence: 65,
      timeframe: '30 days',
      factors: ['Brexit uncertainty', 'BoE decisions', 'Inflation']
    }
  ];

  const runScenario = async () => {
    if (!user || !scenario.amount || !scenario.fromCurrency || !scenario.toCurrency || !scenario.scenario) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to run the scenario",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const scenarioData = {
        amount: parseFloat(scenario.amount),
        fromCurrency: scenario.fromCurrency,
        toCurrency: scenario.toCurrency,
        timeHorizon: scenario.timeHorizon,
        marketScenario: scenario.scenario,
        description: `What if ${scenario.amount} ${scenario.fromCurrency} to ${scenario.toCurrency} in ${scenario.timeHorizon} under ${scenario.scenario} conditions?`
      };

      const { data, error } = await supabase.functions.invoke('what-if-scenarios', {
        body: {
          scenario: scenarioData,
          authToken: await supabase.auth.getSession().then(res => res.data.session?.access_token)
        }
      });

      if (error) throw error;

      setResults(data.results);
      toast({
        title: "Scenario Analysis Complete",
        description: "Your what-if scenario has been analyzed",
      });
    } catch (error) {
      console.error('Error running scenario:', error);
      toast({
        title: "Error",
        description: "Failed to run scenario analysis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">What-If Scenarios</h2>
          <p className="text-muted-foreground">
            Explore potential currency movements and their impact on your finances
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Custom Scenario Builder
                </CardTitle>
                <CardDescription>
                  Create your own what-if scenario to see potential outcomes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={scenario.amount}
                      onChange={(e) => setScenario({ ...scenario, amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeHorizon">Time Horizon</Label>
                    <Select value={scenario.timeHorizon} onValueChange={(value) => setScenario({ ...scenario, timeHorizon: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1week">1 Week</SelectItem>
                        <SelectItem value="1month">1 Month</SelectItem>
                        <SelectItem value="3months">3 Months</SelectItem>
                        <SelectItem value="6months">6 Months</SelectItem>
                        <SelectItem value="1year">1 Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fromCurrency">From Currency</Label>
                    <Select value={scenario.fromCurrency} onValueChange={(value) => setScenario({ ...scenario, fromCurrency: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="From" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="toCurrency">To Currency</Label>
                    <Select value={scenario.toCurrency} onValueChange={(value) => setScenario({ ...scenario, toCurrency: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="To" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="scenario">Market Scenario</Label>
                  <Select value={scenario.scenario} onValueChange={(value) => setScenario({ ...scenario, scenario: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bullish">Bullish Market (+10%)</SelectItem>
                      <SelectItem value="moderate">Moderate Growth (+5%)</SelectItem>
                      <SelectItem value="neutral">Neutral (0%)</SelectItem>
                      <SelectItem value="bearish">Bearish Market (-10%)</SelectItem>
                      <SelectItem value="crisis">Financial Crisis (-20%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={runScenario} 
                  className="w-full"
                  disabled={loading || !user}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {loading ? 'Analyzing...' : 'Run Scenario Analysis'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predefined Market Scenarios</CardTitle>
                <CardDescription>Explore common market scenarios and their potential impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predefinedScenarios.map((scenario) => (
                    <div key={scenario.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{scenario.title}</h4>
                        <div className="flex gap-2">
                          <Badge variant={scenario.impact === 'High' ? 'destructive' : 'secondary'}>
                            {scenario.impact} Impact
                          </Badge>
                          <Badge variant="outline">{scenario.probability}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{scenario.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {scenario.currencies.map((currency) => (
                          <span key={currency} className="text-xs bg-accent px-2 py-1 rounded">
                            {currency}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Results Card */}
            {results && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-accent/30 rounded-lg">
                      <div>
                        <div className="text-sm text-muted-foreground">Current Value</div>
                        <div className="text-lg font-semibold">${results.currentValue?.toFixed(2) || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Projected Value</div>
                        <div className="text-lg font-semibold">${results.projectedValue?.toFixed(2) || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Potential Gain/Loss</div>
                        <div className={`text-lg font-semibold ${
                          (results.potentialGainLoss || 0) >= 0 ? 'text-success' : 'text-destructive'
                        }`}>
                          ${results.potentialGainLoss >= 0 ? '+' : ''}{results.potentialGainLoss?.toFixed(2) || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Confidence</div>
                        <div className="text-lg font-semibold">{results.confidence || 'N/A'}%</div>
                      </div>
                    </div>
                    {results.analysis && (
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="text-sm font-medium mb-2">AI Analysis:</div>
                        <p className="text-sm text-muted-foreground">{results.analysis}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  AI Predictions
                </CardTitle>
                <CardDescription>Machine learning forecasts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiPredictions.map((prediction, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{prediction.currency}</span>
                        <Badge variant="outline" className="text-xs">
                          {prediction.timeframe}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current:</span>
                          <span>{prediction.current}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Predicted:</span>
                          <span className={prediction.prediction > prediction.current ? 'text-success' : 'text-destructive'}>
                            {prediction.prediction}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Confidence:</span>
                          <span>{prediction.confidence}%</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="text-xs text-muted-foreground mb-1">Key factors:</div>
                        <div className="flex flex-wrap gap-1">
                          {prediction.factors.map((factor) => (
                            <span key={factor} className="text-xs bg-accent px-1 py-0.5 rounded">
                              {factor}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="h-2 w-2 bg-destructive rounded-full mt-2"></div>
                    <div>
                      <span className="font-medium">Central Bank Policies</span>
                      <p className="text-muted-foreground text-xs">Unexpected rate changes can cause significant volatility</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-2 w-2 bg-warning rounded-full mt-2"></div>
                    <div>
                      <span className="font-medium">Geopolitical Events</span>
                      <p className="text-muted-foreground text-xs">Political uncertainty affects market sentiment</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <span className="font-medium">Economic Data</span>
                      <p className="text-muted-foreground text-xs">GDP, inflation, and employment reports drive movements</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export { WhatIfScenarios };