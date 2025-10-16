import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Newspaper, ExternalLink, Clock, TrendingUp, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  timestamp: string;
  impact: 'high' | 'medium' | 'low';
  currencies: string[];
  source: string;
  url: string;
}

export const CurrencyNewsFeed = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate real-time news data
    const generateNews = () => {
      const newsItems: NewsItem[] = [
        {
          id: '1',
          title: 'Federal Reserve Signals Potential Rate Changes',
          summary: 'Fed officials hint at upcoming monetary policy adjustments that could significantly impact USD strength across major currency pairs.',
          category: 'central-bank',
          timestamp: '2 minutes ago',
          impact: 'high',
          currencies: ['USD', 'EUR', 'GBP'],
          source: 'Reuters',
          url: '#'
        },
        {
          id: '2',
          title: 'European Central Bank Maintains Current Policy',
          summary: 'ECB keeps interest rates unchanged, citing inflation concerns and economic stability in the eurozone.',
          category: 'policy',
          timestamp: '15 minutes ago',
          impact: 'medium',
          currencies: ['EUR', 'USD'],
          source: 'Bloomberg',
          url: '#'
        },
        {
          id: '3',
          title: 'Brexit Trade Deal Update Affects GBP',
          summary: 'New trade negotiations between UK and EU show progress, causing volatility in GBP/EUR and GBP/USD pairs.',
          category: 'politics',
          timestamp: '1 hour ago',
          impact: 'high',
          currencies: ['GBP', 'EUR'],
          source: 'Financial Times',
          url: '#'
        },
        {
          id: '4',
          title: 'Japan Economic Data Shows Strong Growth',
          summary: 'Latest GDP figures from Japan exceed expectations, strengthening JPY against major currencies.',
          category: 'economic-data',
          timestamp: '2 hours ago',
          impact: 'medium',
          currencies: ['JPY', 'USD'],
          source: 'Nikkei',
          url: '#'
        },
        {
          id: '5',
          title: 'Oil Prices Impact Canadian Dollar',
          summary: 'Rising crude oil prices boost CAD performance against USD as energy sector shows strength.',
          category: 'commodities',
          timestamp: '3 hours ago',
          impact: 'medium',
          currencies: ['CAD', 'USD'],
          source: 'MarketWatch',
          url: '#'
        },
        {
          id: '6',
          title: 'Swiss National Bank Intervention Rumors',
          summary: 'Market speculation about potential SNB intervention to prevent CHF appreciation gains momentum.',
          category: 'central-bank',
          timestamp: '4 hours ago',
          impact: 'low',
          currencies: ['CHF', 'EUR'],
          source: 'WSJ',
          url: '#'
        }
      ];
      setNews(newsItems);
    };

    generateNews();
    const interval = setInterval(generateNews, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const filteredNews = news.filter(item => {
    const matchesFilter = filter === 'all' || item.category === filter;
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.currencies.some(curr => curr.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const categories = [
    { value: 'all', label: 'All News' },
    { value: 'central-bank', label: 'Central Banks' },
    { value: 'policy', label: 'Policy' },
    { value: 'politics', label: 'Politics' },
    { value: 'economic-data', label: 'Economic Data' },
    { value: 'commodities', label: 'Commodities' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="p-6 shadow-large border-card-border bg-gradient-subtle">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Newspaper className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Currency News Feed
            </h2>
            <p className="text-muted-foreground">Real-time market-moving news and analysis</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            Live Updates
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search news or currency..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-input-border"
              />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(category => (
              <Button
                key={category.value}
                variant={filter === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(category.value)}
                className="whitespace-nowrap"
              >
                <Filter className="h-4 w-4 mr-1" />
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* News Items */}
        <div className="space-y-4">
          {filteredNews.map((item) => (
            <Card key={item.id} className="p-4 border-card-border hover:shadow-medium transition-all duration-300 group cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                        {item.summary}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    <Badge variant={getImpactColor(item.impact)} className="gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {item.impact.toUpperCase()} IMPACT
                    </Badge>
                    
                    <div className="flex items-center gap-1">
                      {item.currencies.map(currency => (
                        <Badge key={currency} variant="outline" className="text-xs">
                          {currency}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{item.timestamp}</span>
                      <span>•</span>
                      <span className="font-medium">{item.source}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Newspaper className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No news found matching your criteria</p>
          </div>
        )}

        {/* Market Status Summary */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-card-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Market Status:</span> Active trading in 
              <Badge variant="outline" className="ml-1 text-xs">Asian Markets</Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Next: European Open in 3h 24m
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};