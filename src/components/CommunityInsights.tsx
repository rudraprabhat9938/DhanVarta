import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, ThumbsUp, TrendingUp, Users, MapPin, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface CurrencyInsight {
  id: string;
  currency_pair: string;
  location: string;
  venue_type: string;
  notes: string;
  actual_rate: number;
  official_rate: number;
  spread_percentage: number;
  upvotes: number;
  downvotes: number;
  created_at: string;
  verified_by_blockchain: boolean;
  user_id: string;
}

const CommunityInsights = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [insights, setInsights] = useState<CurrencyInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newInsight, setNewInsight] = useState({
    currency_pair: 'USD/EUR',
    location: '',
    venue_type: 'bank',
    notes: '',
    actual_rate: '',
    official_rate: ''
  });

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const { data, error } = await supabase
        .from('currency_insights')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setInsights(data || []);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitInsight = async () => {
    if (!user || !newInsight.location || !newInsight.notes || !newInsight.actual_rate || !newInsight.official_rate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const actualRate = parseFloat(newInsight.actual_rate);
      const officialRate = parseFloat(newInsight.official_rate);
      const spreadPercentage = ((actualRate - officialRate) / officialRate) * 100;

      const { error } = await supabase
        .from('currency_insights')
        .insert({
          user_id: user.id,
          currency_pair: newInsight.currency_pair,
          location: newInsight.location,
          venue_type: newInsight.venue_type,
          notes: newInsight.notes,
          actual_rate: actualRate,
          official_rate: officialRate,
          spread_percentage: spreadPercentage
        });

      if (error) throw error;

      setNewInsight({
        currency_pair: 'USD/EUR',
        location: '',
        venue_type: 'bank',
        notes: '',
        actual_rate: '',
        official_rate: ''
      });
      setIsDialogOpen(false);
      fetchInsights();
      
      toast({
        title: "Insight Shared",
        description: "Your currency insight has been shared with the community",
      });
    } catch (error) {
      console.error('Error submitting insight:', error);
      toast({
        title: "Error",
        description: "Failed to share insight",
        variant: "destructive",
      });
    }
  };

  const upvoteInsight = async (insightId: string) => {
    if (!user) return;

    try {
      const insight = insights.find(i => i.id === insightId);
      if (!insight) return;

      const { error } = await supabase
        .from('currency_insights')
        .update({ upvotes: insight.upvotes + 1 })
        .eq('id', insightId);

      if (error) throw error;
      fetchInsights();
    } catch (error) {
      console.error('Error upvoting insight:', error);
    }
  };

  const trendingTopics = [
    { topic: 'Fed Rate Decision', mentions: 156, trend: 'up' },
    { topic: 'Digital Currencies', mentions: 89, trend: 'up' },
    { topic: 'Travel Exchange Tips', mentions: 67, trend: 'neutral' },
    { topic: 'Brexit Impact', mentions: 45, trend: 'down' }
  ];

  const sentimentData = React.useMemo(() => {
    const totalInsights = insights.length;
    if (totalInsights === 0) return { bullish: 33, bearish: 33, neutral: 34 };

    const positive = insights.filter(i => i.spread_percentage > 0).length;
    const negative = insights.filter(i => i.spread_percentage < -1).length;
    const neutral = totalInsights - positive - negative;

    return {
      bullish: Math.round((positive / totalInsights) * 100),
      bearish: Math.round((negative / totalInsights) * 100),
      neutral: Math.round((neutral / totalInsights) * 100)
    };
  }, [insights]);

  return (
    <section className="py-12 bg-gradient-to-b from-accent/5 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Community Insights</h2>
          <p className="text-muted-foreground">Real experiences from our global community</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Latest Insights</h3>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" disabled={!user}>
                    <Plus className="h-4 w-4 mr-2" />
                    Share Insight
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share Currency Insight</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Currency Pair</label>
                      <Select value={newInsight.currency_pair} onValueChange={(value) => setNewInsight(prev => ({ ...prev, currency_pair: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD/EUR">USD/EUR</SelectItem>
                          <SelectItem value="USD/GBP">USD/GBP</SelectItem>
                          <SelectItem value="USD/JPY">USD/JPY</SelectItem>
                          <SelectItem value="EUR/GBP">EUR/GBP</SelectItem>
                          <SelectItem value="EUR/JPY">EUR/JPY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Location</label>
                      <Input
                        placeholder="e.g., New York, London"
                        value={newInsight.location}
                        onChange={(e) => setNewInsight(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Venue Type</label>
                      <Select value={newInsight.venue_type} onValueChange={(value) => setNewInsight(prev => ({ ...prev, venue_type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank">Bank</SelectItem>
                          <SelectItem value="exchange">Currency Exchange</SelectItem>
                          <SelectItem value="airport">Airport</SelectItem>
                          <SelectItem value="atm">ATM</SelectItem>
                          <SelectItem value="online">Online Platform</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Actual Rate</label>
                        <Input
                          type="number"
                          step="0.0001"
                          placeholder="1.0850"
                          value={newInsight.actual_rate}
                          onChange={(e) => setNewInsight(prev => ({ ...prev, actual_rate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Official Rate</label>
                        <Input
                          type="number"
                          step="0.0001"
                          placeholder="1.0800"
                          value={newInsight.official_rate}
                          onChange={(e) => setNewInsight(prev => ({ ...prev, official_rate: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Notes</label>
                      <Textarea
                        placeholder="Share your experience and tips..."
                        value={newInsight.notes}
                        onChange={(e) => setNewInsight(prev => ({ ...prev, notes: e.target.value }))}
                        rows={3}
                      />
                    </div>

                    <Button onClick={submitInsight} className="w-full">
                      Share Insight
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-3 bg-muted rounded w-full mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : insights.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No community insights yet. Be the first to share!</p>
                </CardContent>
              </Card>
            ) : (
              insights.map((insight) => (
                <Card key={insight.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            US
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              Community Member
                            </span>
                            {insight.verified_by_blockchain && (
                              <Badge variant="secondary" className="text-xs">Verified</Badge>
                            )}
          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {insight.location} • {insight.venue_type} • {new Date(insight.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={
                          insight.spread_percentage > 0 ? 'default' :
                          insight.spread_percentage < -1 ? 'destructive' : 'secondary'
                        } className="text-xs">
                          {insight.currency_pair}
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          Spread: {insight.spread_percentage.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{insight.notes}</p>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-muted-foreground">
                        Rate: {insight.actual_rate.toFixed(4)} (Official: {insight.official_rate.toFixed(4)})
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <button 
                        onClick={() => upvoteInsight(insight.id)}
                        className="flex items-center gap-1 hover:text-primary disabled:opacity-50"
                        disabled={!user}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        {insight.upvotes}
                      </button>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        Community
                      </span>
                    </div>
                  </CardContent>
                 </Card>
              ))
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Sentiment</CardTitle>
                <CardDescription>Overall market feeling</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                   <div className="flex items-center justify-between">
                    <span className="text-sm text-success">Bullish</span>
                    <span className="text-sm font-medium">{sentimentData.bullish}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: `${sentimentData.bullish}%` }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Neutral</span>
                    <span className="text-sm font-medium">{sentimentData.neutral}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-muted h-2 rounded-full" style={{ width: `${sentimentData.neutral}%` }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-destructive">Bearish</span>
                    <span className="text-sm font-medium">{sentimentData.bearish}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-destructive h-2 rounded-full" style={{ width: `${sentimentData.bearish}%` }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">{topic.topic}</span>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{topic.mentions} mentions</span>
                        </div>
                      </div>
                      <div className={`h-2 w-2 rounded-full ${
                        topic.trend === 'up' ? 'bg-success' :
                        topic.trend === 'down' ? 'bg-destructive' : 'bg-muted-foreground'
                      }`}></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export { CommunityInsights };