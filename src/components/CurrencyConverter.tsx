import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, Star, StarOff, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurrencyRates } from '@/hooks/useCurrencyRates';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CHF' | 'CNY' | 'SEK' | 'NOK' | 'DKK';

interface ConversionResult {
  amount: number;
  fromCurrency: Currency;
  toCurrency: Currency;
  result: number;
  rate: number;
}

export const CurrencyConverter = () => {
  const { user } = useAuth();
  const { rates, lastUpdated, refreshRates, getRate, formatCurrency } = useCurrencyRates();
  const [amount, setAmount] = useState<string>('1000');
  const [fromCurrency, setFromCurrency] = useState<Currency>('USD');
  const [toCurrency, setToCurrency] = useState<Currency>('EUR');
  const [favorites, setFavorites] = useState<Currency[]>(['EUR', 'GBP', 'JPY']);
  const [isLoading, setIsLoading] = useState(false);

  const calculateConversion = (): ConversionResult => {
    const amountNum = parseFloat(amount) || 0;
    const rate = getRate(fromCurrency, toCurrency);
    const result = amountNum * rate;
    
    return {
      amount: amountNum,
      fromCurrency,
      toCurrency,
      result,
      rate
    };
  };

  const conversion = calculateConversion();

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const toggleFavorite = (currency: Currency) => {
    setFavorites(prev => 
      prev.includes(currency) 
        ? prev.filter(c => c !== currency)
        : [...prev, currency]
    );
  };

  const handleRefreshRates = async () => {
    setIsLoading(true);
    refreshRates();
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const saveConversionHistory = async (conversion: ConversionResult) => {
    if (!user) return;
    
    try {
      await supabase
        .from('conversion_history')
        .insert({
          user_id: user.id,
          amount: conversion.amount,
          from_currency: conversion.fromCurrency,
          to_currency: conversion.toCurrency,
          result: conversion.result,
          exchange_rate: conversion.rate
        });
    } catch (error) {
      console.error('Error saving conversion history:', error);
    }
  };

  const handleConvert = () => {
    const conversion = calculateConversion();
    saveConversionHistory(conversion);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Converter Card */}
      <Card className="p-8 shadow-large border-card-border bg-gradient-subtle">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Currency Converter
            </h2>
            <p className="text-muted-foreground mt-1">
              Real-time exchange rates • Last updated {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
               <Button
                 variant="outline"
                 size="sm"
                 onClick={handleRefreshRates}
                 disabled={isLoading}
                 className="gap-2"
               >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
          {/* From Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">From</label>
            <div className="space-y-3">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12 text-lg font-semibold border-input-border"
                placeholder="Enter amount"
              />
              <Select value={fromCurrency} onValueChange={(value: Currency) => setFromCurrency(value)}>
                <SelectTrigger className="h-12 border-input-border">
                  <SelectValue />
                </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="USD">
                     <div className="flex items-center gap-2">
                       <span className="text-lg">🇺🇸</span>
                       <span className="font-medium">USD</span>
                       <span className="text-muted-foreground text-sm">$</span>
                     </div>
                   </SelectItem>
                   {Object.entries(rates).map(([code, { flag, symbol }]) => (
                     <SelectItem key={code} value={code}>
                       <div className="flex items-center gap-2">
                         <span className="text-lg">{flag}</span>
                         <span className="font-medium">{code}</span>
                         <span className="text-muted-foreground text-sm">{symbol}</span>
                       </div>
                     </SelectItem>
                   ))}
                 </SelectContent>
              </Select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center lg:justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={swapCurrencies}
              className="h-12 w-12 rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
            >
              <ArrowUpDown className="h-5 w-5" />
            </Button>
          </div>

          {/* To Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">To</label>
            <div className="space-y-3">
               <div className="h-12 px-3 py-2 border border-input-border rounded-md bg-muted/50 flex items-center">
                 <span className="text-lg font-semibold text-foreground">
                   {toCurrency === 'USD' ? '$' : rates[toCurrency]?.symbol || ''}{formatCurrency(conversion.result, toCurrency)}
                 </span>
               </div>
              <Select value={toCurrency} onValueChange={(value: Currency) => setToCurrency(value)}>
                <SelectTrigger className="h-12 border-input-border">
                  <SelectValue />
                </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="USD">
                     <div className="flex items-center gap-2">
                       <span className="text-lg">🇺🇸</span>
                       <span className="font-medium">USD</span>
                       <span className="text-muted-foreground text-sm">$</span>
                     </div>
                   </SelectItem>
                   {Object.entries(rates).map(([code, { flag, symbol }]) => (
                     <SelectItem key={code} value={code}>
                       <div className="flex items-center gap-2">
                         <span className="text-lg">{flag}</span>
                         <span className="font-medium">{code}</span>
                         <span className="text-muted-foreground text-sm">{symbol}</span>
                       </div>
                     </SelectItem>
                   ))}
                 </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Exchange Rate Info */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-card-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">
                1 {fromCurrency} = {conversion.rate.toFixed(6)} {toCurrency}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleFavorite(toCurrency)}
              className="gap-1"
            >
              {favorites.includes(toCurrency) ? (
                <Star className="h-4 w-4 fill-warning text-warning" />
              ) : (
                <StarOff className="h-4 w-4" />
              )}
              <span className="text-xs">
                {favorites.includes(toCurrency) ? 'Favorited' : 'Add to favorites'}
              </span>
            </Button>
          </div>
        </div>
      </Card>

       {/* Quick Conversion Grid */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {favorites.slice(0, 4).map((currency) => {
           const currencyInfo = currency === 'USD' ? { flag: '🇺🇸', symbol: '$', changePercent: 0 } : rates[currency];
           if (!currencyInfo) return null;
           
           const conversionResult = (parseFloat(amount) || 1) * getRate(fromCurrency, currency);
           const rate = getRate(fromCurrency, currency);
           
           return (
             <Card key={currency} className="p-4 hover:shadow-medium transition-all duration-300 border-card-border cursor-pointer" onClick={handleConvert}>
               <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-2">
                   <span className="text-lg">{currencyInfo.flag}</span>
                   <span className="font-semibold">{currency}</span>
                 </div>
                 {currencyInfo.changePercent >= 0 ? (
                   <TrendingUp className="h-4 w-4 text-success" />
                 ) : (
                   <TrendingDown className="h-4 w-4 text-destructive" />
                 )}
               </div>
               <div className="text-lg font-bold text-foreground">
                 {currencyInfo.symbol}{formatCurrency(conversionResult, currency)}
               </div>
               <div className="text-xs text-muted-foreground flex items-center justify-between">
                 <span>1 {fromCurrency} = {rate.toFixed(4)} {currency}</span>
                 {currencyInfo.changePercent !== undefined && (
                   <span className={`${currencyInfo.changePercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                     {currencyInfo.changePercent >= 0 ? '+' : ''}{currencyInfo.changePercent.toFixed(2)}%
                   </span>
                 )}
               </div>
             </Card>
           );
         })}
       </div>
    </div>
  );
};