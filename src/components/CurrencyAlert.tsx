import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, BellRing, Plus, Trash2, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  currency_pair: string;
  target_rate: number;
  alert_type: string;
  is_active: boolean;
  created_at: string;
}

export const CurrencyAlert = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [newAlert, setNewAlert] = useState({
    currency_pair: 'USD/EUR',
    target_rate: '',
    alert_type: 'above'
  });
  const [loading, setLoading] = useState(false);

  const currencyPairs = [
    'USD/EUR', 'USD/GBP', 'USD/JPY', 'USD/CAD', 'USD/AUD',
    'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'USD/CHF', 'USD/CNY'
  ];

  useEffect(() => {
    if (user) {
      fetchAlerts();
    }
  }, [user]);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('user_watchlist')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const createAlert = async () => {
    if (!newAlert.target_rate || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_watchlist')
        .insert({
          user_id: user.id,
          currency_pair: newAlert.currency_pair,
          target_rate: parseFloat(newAlert.target_rate),
          alert_type: newAlert.alert_type,
          is_active: true
        });

      if (error) throw error;

      setNewAlert({ currency_pair: 'USD/EUR', target_rate: '', alert_type: 'above' });
      fetchAlerts();
      toast({
        title: "Alert Created",
        description: `You'll be notified when ${newAlert.currency_pair} ${newAlert.alert_type === 'above' ? 'rises above' : 'falls below'} ${newAlert.target_rate}`,
      });
    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        title: "Error",
        description: "Failed to create alert",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('user_watchlist')
        .delete()
        .eq('id', alertId);

      if (error) throw error;

      fetchAlerts();
      toast({
        title: "Alert Deleted",
        description: "Price alert has been removed",
      });
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="p-6 shadow-large border-card-border bg-gradient-subtle">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Bell className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Price Alerts
            </h2>
            <p className="text-muted-foreground">Get notified when currencies hit your target prices</p>
          </div>
        </div>

        {/* Create New Alert */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-muted/30 rounded-lg border border-card-border">
          <Select value={newAlert.currency_pair} onValueChange={(value) => setNewAlert(prev => ({ ...prev, currency_pair: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencyPairs.map(pair => (
                <SelectItem key={pair} value={pair}>{pair}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={newAlert.alert_type} onValueChange={(value) => setNewAlert(prev => ({ ...prev, alert_type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="above">Above</SelectItem>
              <SelectItem value="below">Below</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Target rate"
            value={newAlert.target_rate}
            onChange={(e) => setNewAlert(prev => ({ ...prev, target_rate: e.target.value }))}
            step="0.0001"
          />

          <Button 
            onClick={createAlert} 
            disabled={loading || !newAlert.target_rate}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Alert
          </Button>
        </div>

        {/* Active Alerts */}
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No price alerts set. Create your first alert above!</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 bg-card border border-card-border rounded-lg hover:shadow-medium transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {alert.alert_type === 'above' ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                    <span className="font-semibold">{alert.currency_pair}</span>
                  </div>
                  <Badge variant={alert.is_active ? "default" : "secondary"}>
                    {alert.alert_type === 'above' ? '↗' : '↘'} {alert.target_rate}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Created {new Date(alert.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={alert.is_active ? "default" : "secondary"}>
                    {alert.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAlert(alert.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {alerts.length > 0 && (
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2 text-primary">
              <BellRing className="h-4 w-4" />
              <span className="text-sm font-medium">
                You have {alerts.filter(a => a.is_active).length} active price alerts
              </span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};