import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Flame, ArrowUp, ArrowDown, Eye, Activity, BarChart3, RefreshCw } from 'lucide-react';
import { useCurrencyRates } from '@/hooks/useCurrencyRates';

interface TrendingCurrency {
  code: string;
  symbol: string;
  flag: string;
  rate: number;
  change: number;
  changePercent: number;
  pair: string;
  volume: string;
  isHot: boolean;
  strength: number;
}

export const TrendingCurrencies = () => {
  const { rates, refreshRates, lastUpdated } = useCurrencyRates();
  const [trendingData, setTrendingData] = useState<TrendingCurrency[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'change' | 'volume' | 'alphabetical'>('change');

  useEffect(() => {
    if (rates && Object.keys(rates).length > 0) {
      const data = Object.values(rates).map(rate => ({
        ...rate,
        pair: `${rate.code}/USD`,
        volume: `${(Math.random() * 500 + 100).toFixed(0)}M`,
        isHot: Math.abs(rate.changePercent) > 1.5,
        strength: 50 + rate.changePercent * 5
      }));
      
      // Sort based on selection
      let sorted = [...data];
      switch (sortBy) {
        case 'change':
          sorted.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
          break;
        case 'volume':
          sorted.sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume));
          break;
        case 'alphabetical':
          sorted.sort((a, b) => a.code.localeCompare(b.code));
          break;
      }
      
      setTrendingData(sorted);
    }
  }, [rates, sortBy]);

  const topGainers = trendingData.filter(c => c.change > 0).slice(0, 5);
  const topLosers = trendingData.filter(c => c.change < 0).slice(0, 5);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6">
      <Card className="p-4 sm:p-6 shadow-large border-card-border bg-card">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
              <Flame className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Trending Now
              </h2>
              <p className="text-sm text-muted-foreground">Most active currency pairs</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshRates}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-md">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              Live
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'list')} className="flex-1">
            <TabsList className="grid w-full grid-cols-2 max-w-[300px] bg-muted">
              <TabsTrigger value="grid" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <Activity className="h-4 w-4" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2">
            <Button
              variant={sortBy === 'change' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('change')}
            >
              By Change
            </Button>
            <Button
              variant={sortBy === 'volume' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('volume')}
            >
              By Volume
            </Button>
            <Button
              variant={sortBy === 'alphabetical' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('alphabetical')}
            >
              A-Z
            </Button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingData.slice(0, 12).map((currency, index) => (
              <Card key={currency.code} className="p-4 hover:shadow-large transition-all duration-300 border-card-border bg-background group cursor-pointer hover:border-primary/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{currency.flag}</span>
                    <span className="font-bold text-sm">{currency.pair}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {index < 3 && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        #{index + 1}
                      </Badge>
                    )}
                    {currency.isHot && (
                      <Badge variant="destructive" className="text-xs px-1.5 py-0 animate-pulse">
                        🔥
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-2xl font-bold text-foreground">
                    {currency.rate.toFixed(4)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-1 text-sm font-semibold ${
                      currency.change > 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {currency.change > 0 ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                      <span>{Math.abs(currency.change).toFixed(4)}</span>
                    </div>
                    
                    <Badge 
                      variant={currency.changePercent > 0 ? "default" : "destructive"}
                      className="text-xs font-bold"
                    >
                      {currency.changePercent > 0 ? '+' : ''}{currency.changePercent.toFixed(2)}%
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium">Vol: {currency.volume}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                      <Eye className="h-3 w-3" />
                      <span className="font-medium">Details</span>
                    </div>
                  </div>
                </div>

                {/* Strength Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Strength</span>
                    <span className="font-medium">{currency.strength.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        currency.change > 0 ? 'bg-gradient-to-r from-success to-success/60' : 'bg-gradient-to-r from-destructive to-destructive/60'
                      }`}
                      style={{ width: `${Math.max(10, Math.min(currency.strength, 100))}%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-2">
            {trendingData.slice(0, 15).map((currency, index) => (
              <Card key={currency.code} className="p-4 hover:shadow-medium transition-all duration-200 border-card-border bg-background cursor-pointer hover:border-primary/50">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-sm font-medium text-muted-foreground w-8">
                      #{index + 1}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{currency.flag}</span>
                      <div>
                        <div className="font-bold text-foreground">{currency.pair}</div>
                        <div className="text-xs text-muted-foreground">Vol: {currency.volume}</div>
                      </div>
                    </div>
                    {currency.isHot && (
                      <Badge variant="destructive" className="text-xs">🔥 HOT</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-lg font-bold text-foreground">{currency.rate.toFixed(4)}</div>
                      <div className={`text-xs font-medium ${
                        currency.change > 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        {currency.change > 0 ? '+' : ''}{currency.change.toFixed(4)}
                      </div>
                    </div>

                    <Badge 
                      variant={currency.changePercent > 0 ? "default" : "destructive"}
                      className="text-sm font-bold min-w-[80px] justify-center"
                    >
                      {currency.changePercent > 0 ? '+' : ''}{currency.changePercent.toFixed(2)}%
                    </Badge>

                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Top Gainers & Losers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <Card className="p-4 bg-success/5 border-success/20">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-success" />
              <h3 className="font-bold text-success">Top Gainers</h3>
            </div>
            <div className="space-y-2">
              {topGainers.map((curr) => (
                <div key={curr.code} className="flex items-center justify-between p-2 bg-background rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{curr.flag}</span>
                    <span className="font-medium text-sm">{curr.code}</span>
                  </div>
                  <Badge className="bg-success text-success-foreground">
                    +{curr.changePercent.toFixed(2)}%
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 bg-destructive/5 border-destructive/20">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="h-5 w-5 text-destructive" />
              <h3 className="font-bold text-destructive">Top Losers</h3>
            </div>
            <div className="space-y-2">
              {topLosers.map((curr) => (
                <div key={curr.code} className="flex items-center justify-between p-2 bg-background rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{curr.flag}</span>
                    <span className="font-medium text-sm">{curr.code}</span>
                  </div>
                  <Badge variant="destructive">
                    {curr.changePercent.toFixed(2)}%
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Market Summary */}
        <Card className="mt-6 p-4 bg-muted/50 border-card-border">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-success mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-2xl font-bold">{trendingData.filter(c => c.change > 0).length}</span>
              </div>
              <div className="text-xs text-muted-foreground">Rising</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-destructive mb-1">
                <TrendingDown className="h-4 w-4" />
                <span className="text-2xl font-bold">{trendingData.filter(c => c.change < 0).length}</span>
              </div>
              <div className="text-xs text-muted-foreground">Falling</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-warning mb-1">
                <Flame className="h-4 w-4" />
                <span className="text-2xl font-bold">{trendingData.filter(c => c.isHot).length}</span>
              </div>
              <div className="text-xs text-muted-foreground">Hot Pairs</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-primary mb-1">
                <Activity className="h-4 w-4" />
                <span className="text-2xl font-bold">{trendingData.length}</span>
              </div>
              <div className="text-xs text-muted-foreground">Total Pairs</div>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  );
};