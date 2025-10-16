import { useState, useEffect } from 'react';

interface CurrencyRate {
  code: string;
  symbol: string;
  flag: string;
  rate: number;
  change: number;
  changePercent: number;
}

const baseCurrencies = [
  { code: 'EUR', symbol: '€', flag: '🇪🇺', baseRate: 0.85 },
  { code: 'GBP', symbol: '£', flag: '🇬🇧', baseRate: 0.73 },
  { code: 'JPY', symbol: '¥', flag: '🇯🇵', baseRate: 110.0 },
  { code: 'CAD', symbol: 'C$', flag: '🇨🇦', baseRate: 1.25 },
  { code: 'AUD', symbol: 'A$', flag: '🇦🇺', baseRate: 1.35 },
  { code: 'CHF', symbol: 'Fr', flag: '🇨🇭', baseRate: 0.92 },
  { code: 'CNY', symbol: '¥', flag: '🇨🇳', baseRate: 6.45 },
  { code: 'INR', symbol: '₹', flag: '🇮🇳', baseRate: 83.12 },
  { code: 'SEK', symbol: 'kr', flag: '🇸🇪', baseRate: 10.25 },
  { code: 'NOK', symbol: 'kr', flag: '🇳🇴', baseRate: 10.85 },
  { code: 'DKK', symbol: 'kr', flag: '🇩🇰', baseRate: 6.33 },
  { code: 'SGD', symbol: 'S$', flag: '🇸🇬', baseRate: 1.34 },
  { code: 'HKD', symbol: 'HK$', flag: '🇭🇰', baseRate: 7.82 },
  { code: 'NZD', symbol: 'NZ$', flag: '🇳🇿', baseRate: 1.52 },
  { code: 'KRW', symbol: '₩', flag: '🇰🇷', baseRate: 1320.45 },
  { code: 'MXN', symbol: 'Mex$', flag: '🇲🇽', baseRate: 17.25 },
  { code: 'BRL', symbol: 'R$', flag: '🇧🇷', baseRate: 4.95 },
  { code: 'ZAR', symbol: 'R', flag: '🇿🇦', baseRate: 18.75 },
  { code: 'AED', symbol: 'د.إ', flag: '🇦🇪', baseRate: 3.67 },
  { code: 'THB', symbol: '฿', flag: '🇹🇭', baseRate: 35.42 }
];

export const useCurrencyRates = () => {
  const [rates, setRates] = useState<Record<string, CurrencyRate>>({});
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const generateRealisticRate = (baseRate: number, volatility: number = 0.02) => {
    // Generate a small random change (-2% to +2% by default)
    const changePercent = (Math.random() - 0.5) * 2 * volatility * 100;
    const change = baseRate * (changePercent / 100);
    const newRate = baseRate + change;
    
    return {
      rate: newRate,
      change: change,
      changePercent: changePercent
    };
  };

  const updateRates = () => {
    const newRates: Record<string, CurrencyRate> = {};
    
    baseCurrencies.forEach(currency => {
      const { rate, change, changePercent } = generateRealisticRate(currency.baseRate);
      
      newRates[currency.code] = {
        code: currency.code,
        symbol: currency.symbol,
        flag: currency.flag,
        rate: rate,
        change: change,
        changePercent: changePercent
      };
    });

    setRates(newRates);
    setLastUpdated(new Date());
  };

  useEffect(() => {
    // Initial load
    updateRates();
    
    // Update every 30 seconds to simulate real-time data
    const interval = setInterval(updateRates, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const refreshRates = () => {
    updateRates();
  };

  const getRate = (fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === 'USD') {
      return rates[toCurrency]?.rate || 1;
    } else if (toCurrency === 'USD') {
      return 1 / (rates[fromCurrency]?.rate || 1);
    } else {
      // Cross rate calculation: EUR/GBP = (EUR/USD) / (GBP/USD)
      const fromRate = rates[fromCurrency]?.rate || 1;
      const toRate = rates[toCurrency]?.rate || 1;
      return fromRate / toRate;
    }
  };

  const formatCurrency = (value: number, currency: string): string => {
    const currencyInfo = rates[currency];
    if (!currencyInfo) return value.toFixed(2);

    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: currency === 'JPY' ? 0 : 4,
      maximumFractionDigits: currency === 'JPY' ? 0 : 4,
    }).format(value);
  };

  return {
    rates,
    lastUpdated,
    refreshRates,
    getRate,
    formatCurrency
  };
};