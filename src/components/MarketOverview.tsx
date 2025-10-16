import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Globe, AlertTriangle } from 'lucide-react';
import { useCurrencyRates } from '@/hooks/useCurrencyRates';

const MarketOverview = () => {
  const { rates } = useCurrencyRates();
  
  const getRegionPerformance = (currencies: string[]) => {
    if (!rates || Object.keys(rates).length === 0) return 0;
    const regionRates = Object.values(rates).filter(r => currencies.includes(r.code));
    if (regionRates.length === 0) return 0;
    const avgChange = regionRates.reduce((sum, r) => sum + r.changePercent, 0) / regionRates.length;
    return avgChange;
  };

  const marketData = [
    {
      region: 'Americas',
      currencies: ['USD', 'CAD', 'BRL'],
      highlight: 'USD strengthening against majors'
    },
    {
      region: 'Europe',
      currencies: ['EUR', 'GBP', 'CHF'],
      highlight: 'ECB policy uncertainty'
    },
    {
      region: 'Asia-Pacific',
      currencies: ['JPY', 'AUD', 'SGD'],
      highlight: 'Central bank interventions'
    },
    {
      region: 'Emerging',
      currencies: ['CNY', 'INR', 'MXN'],
      highlight: 'Risk-off sentiment'
    }
  ].map(region => {
    const perf = getRegionPerformance(region.currencies);
    return {
      ...region,
      performance: `${perf > 0 ? '+' : ''}${perf.toFixed(1)}%`,
      trend: perf > 0 ? 'up' : 'down',
      status: Math.abs(perf) > 2 ? 'Volatile' : Math.abs(perf) > 1 ? 'Mixed' : perf > 0 ? 'Strong' : 'Stable'
    };
  });

  const globalEvents = [
    { event: 'Fed Rate Decision', impact: 'High', time: '2 hours', type: 'monetary' },
    { event: 'ECB Press Conference', impact: 'Medium', time: '1 day', type: 'monetary' },
    { event: 'US Employment Data', impact: 'High', time: '3 days', type: 'economic' },
    { event: 'G7 Summit', impact: 'Medium', time: '1 week', type: 'political' }
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Global Market Overview</h2>
          <p className="text-muted-foreground">Real-time insights into global currency markets</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {marketData.map((market) => (
            <Card key={market.region} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{market.region}</CardTitle>
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                   <span className={`text-lg font-bold ${
                    market.trend === 'up' ? 'text-success' : 'text-destructive'
                  }`}>
                    {market.performance}
                  </span>
                   {market.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Badge variant={
                  market.status === 'Strong' ? 'default' : 
                  market.status === 'Stable' ? 'secondary' : 
                  'destructive'
                } className="mb-3">
                  {market.status}
                </Badge>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {market.currencies.map((currency) => (
                      <span key={currency} className="text-xs bg-accent px-2 py-1 rounded">
                        {currency}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{market.highlight}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Upcoming Market Events
            </CardTitle>
            <CardDescription>
              Key events that could impact currency markets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {globalEvents.map((event, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={
                      event.impact === 'High' ? 'destructive' : 'secondary'
                    }>
                      {event.impact} Impact
                    </Badge>
                    <span className="text-xs text-muted-foreground">{event.time}</span>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{event.event}</h4>
                  <span className="text-xs bg-accent px-2 py-1 rounded capitalize">
                    {event.type}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export { MarketOverview };