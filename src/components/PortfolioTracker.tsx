import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wallet, Plus, Trash2, TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PortfolioItem {
  id: string;
  currency: string;
  amount: number;
  purchase_rate: number;
  current_rate: number;
  purchase_date: string;
  notes: string;
}

export const PortfolioTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [newItem, setNewItem] = useState({
    currency: 'EUR',
    amount: '',
    purchase_rate: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const currencies = [
    { code: 'EUR', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', symbol: '£', flag: '🇬🇧' },
    { code: 'JPY', symbol: '¥', flag: '🇯🇵' },
    { code: 'CAD', symbol: 'C$', flag: '🇨🇦' },
    { code: 'AUD', symbol: 'A$', flag: '🇦🇺' },
    { code: 'CHF', symbol: 'Fr', flag: '🇨🇭' },
    { code: 'CNY', symbol: '¥', flag: '🇨🇳' }
  ];

  // Mock current rates (in a real app, this would come from an API)
  const currentRates = {
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.0,
    CAD: 1.25,
    AUD: 1.35,
    CHF: 0.92,
    CNY: 6.45
  };

  useEffect(() => {
    if (user) {
      fetchPortfolio();
    }
  }, [user]);

  const fetchPortfolio = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const portfolioWithCurrentRates = (data || []).map(item => ({
        ...item,
        current_rate: currentRates[item.currency as keyof typeof currentRates] || item.purchase_rate
      }));

      setPortfolio(portfolioWithCurrentRates);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const addToPortfolio = async () => {
    if (!user || !newItem.amount || !newItem.purchase_rate) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('portfolio')
        .insert({
          user_id: user.id,
          currency: newItem.currency,
          amount: parseFloat(newItem.amount),
          purchase_rate: parseFloat(newItem.purchase_rate),
          notes: newItem.notes
        });

      if (error) throw error;

      setNewItem({ currency: 'EUR', amount: '', purchase_rate: '', notes: '' });
      fetchPortfolio();
      
      toast({
        title: "Added to Portfolio",
        description: `${newItem.amount} ${newItem.currency} added to your portfolio`,
      });
    } catch (error) {
      console.error('Error adding to portfolio:', error);
      toast({
        title: "Error",
        description: "Failed to add to portfolio",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromPortfolio = async (id: string) => {
    try {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchPortfolio();
      toast({
        title: "Removed from Portfolio",
        description: "Currency holding has been removed",
      });
    } catch (error) {
      console.error('Error removing from portfolio:', error);
    }
  };

  const calculatePnL = (item: PortfolioItem) => {
    const purchaseValue = item.amount * item.purchase_rate;
    const currentValue = item.amount * item.current_rate;
    const pnl = currentValue - purchaseValue;
    const pnlPercentage = (pnl / purchaseValue) * 100;
    return { pnl, pnlPercentage, currentValue, purchaseValue };
  };

  const totalPortfolioValue = portfolio.reduce((total, item) => {
    const { currentValue } = calculatePnL(item);
    return total + currentValue;
  }, 0);

  const totalPnL = portfolio.reduce((total, item) => {
    const { pnl } = calculatePnL(item);
    return total + pnl;
  }, 0);

  const totalPnLPercentage = portfolio.length > 0 
    ? (totalPnL / portfolio.reduce((total, item) => total + (item.amount * item.purchase_rate), 0)) * 100 
    : 0;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card className="p-6 shadow-large border-card-border bg-gradient-subtle">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Currency Portfolio
            </h2>
            <p className="text-muted-foreground">Track your foreign currency holdings and performance</p>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 border-card-border">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Total Value</span>
            </div>
            <div className="text-2xl font-bold">${totalPortfolioValue.toFixed(2)}</div>
          </Card>
          
          <Card className="p-4 border-card-border">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Total P&L</span>
            </div>
            <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-success' : 'text-destructive'}`}>
              ${totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(2)}
            </div>
          </Card>
          
          <Card className="p-4 border-card-border">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Total Return</span>
            </div>
            <div className={`text-2xl font-bold flex items-center gap-1 ${totalPnLPercentage >= 0 ? 'text-success' : 'text-destructive'}`}>
              {totalPnLPercentage >= 0 ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              {totalPnLPercentage >= 0 ? '+' : ''}{totalPnLPercentage.toFixed(2)}%
            </div>
          </Card>
        </div>

        {/* Add New Currency */}
        <Card className="p-4 mb-6 border-card-border">
          <h3 className="font-semibold mb-4">Add Currency to Portfolio</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select value={newItem.currency} onValueChange={(value) => setNewItem(prev => ({ ...prev, currency: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(currency => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span>{currency.flag}</span>
                      <span>{currency.code}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Amount"
              value={newItem.amount}
              onChange={(e) => setNewItem(prev => ({ ...prev, amount: e.target.value }))}
            />

            <Input
              type="number"
              step="0.0001"
              placeholder="Purchase rate"
              value={newItem.purchase_rate}
              onChange={(e) => setNewItem(prev => ({ ...prev, purchase_rate: e.target.value }))}
            />

            <Input
              placeholder="Notes (optional)"
              value={newItem.notes}
              onChange={(e) => setNewItem(prev => ({ ...prev, notes: e.target.value }))}
            />

            <Button 
              onClick={addToPortfolio} 
              disabled={loading || !newItem.amount || !newItem.purchase_rate}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </Card>

        {/* Portfolio Holdings */}
        <div className="space-y-3">
          {portfolio.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Wallet className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Your portfolio is empty. Add your first currency holding above!</p>
            </div>
          ) : (
            portfolio.map((item) => {
              const { pnl, pnlPercentage, currentValue, purchaseValue } = calculatePnL(item);
              const currency = currencies.find(c => c.code === item.currency);
              
              return (
                <Card key={item.id} className="p-4 border-card-border hover:shadow-medium transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{currency?.flag}</span>
                        <div>
                          <div className="font-semibold text-lg">{item.amount.toLocaleString()} {item.currency}</div>
                          <div className="text-sm text-muted-foreground">
                            Purchased: {new Date(item.purchase_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Purchase Rate</div>
                          <div className="font-medium">{item.purchase_rate.toFixed(4)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Current Rate</div>
                          <div className="font-medium">{item.current_rate.toFixed(4)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Purchase Value</div>
                          <div className="font-medium">${purchaseValue.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Current Value</div>
                          <div className="font-medium">${currentValue.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-lg font-bold ${pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                          ${pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
                        </div>
                        <div className={`text-sm flex items-center gap-1 ${pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {pnl >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {pnl >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromPortfolio(item.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {item.notes && (
                    <div className="mt-2 pt-2 border-t border-card-border">
                      <div className="text-sm text-muted-foreground italic">"{item.notes}"</div>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
};