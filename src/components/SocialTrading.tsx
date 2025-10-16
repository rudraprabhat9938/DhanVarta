import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Share, TrendingUp, TrendingDown, Star, Trophy, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SocialPost {
  id: string;
  user_id: string;
  currency_pair: string;
  actual_rate: number;
  official_rate: number;
  spread_percentage: number;
  location: string;
  venue_type: string;
  notes: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  profiles?: {
    username: string;
    avatar_url: string;
    user_type: string;
  } | null;
}

export const SocialTrading = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [newPost, setNewPost] = useState({
    currency_pair: 'USD/EUR',
    actual_rate: '',
    location: '',
    venue_type: 'bank',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('currency_insights')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setPosts((data as SocialPost[]) || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const createPost = async () => {
    if (!user || !newPost.actual_rate || !newPost.location) return;

    setLoading(true);
    try {
      // Calculate official rate (mock)
      const officialRate = parseFloat(newPost.actual_rate) * (0.98 + Math.random() * 0.04);
      const spreadPercentage = ((parseFloat(newPost.actual_rate) - officialRate) / officialRate) * 100;

      const { error } = await supabase
        .from('currency_insights')
        .insert({
          user_id: user.id,
          currency_pair: newPost.currency_pair,
          actual_rate: parseFloat(newPost.actual_rate),
          official_rate: officialRate,
          spread_percentage: spreadPercentage,
          location: newPost.location,
          venue_type: newPost.venue_type,
          notes: newPost.notes
        });

      if (error) throw error;

      setNewPost({
        currency_pair: 'USD/EUR',
        actual_rate: '',
        location: '',
        venue_type: 'bank',
        notes: ''
      });
      
      fetchPosts();
      toast({
        title: "Insight Shared",
        description: "Your currency insight has been posted to the community",
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to share insight",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const voteOnPost = async (postId: string, voteType: 'up' | 'down') => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const updates = voteType === 'up' 
        ? { upvotes: post.upvotes + 1 }
        : { downvotes: post.downvotes + 1 };

      const { error } = await supabase
        .from('currency_insights')
        .update(updates)
        .eq('id', postId);

      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="p-6 shadow-large border-card-border bg-gradient-subtle">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Users className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Community Insights
            </h2>
            <p className="text-muted-foreground">Share and discover real-world exchange rates</p>
          </div>
        </div>

        {/* Share New Insight */}
        {user && (
          <Card className="p-4 mb-6 border-card-border">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="font-medium">Share your exchange rate experience</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Currency Pair</label>
                  <select 
                    className="w-full mt-1 p-2 border border-input-border rounded-md bg-background"
                    value={newPost.currency_pair}
                    onChange={(e) => setNewPost(prev => ({ ...prev, currency_pair: e.target.value }))}
                  >
                    <option value="USD/EUR">USD/EUR</option>
                    <option value="USD/GBP">USD/GBP</option>
                    <option value="USD/JPY">USD/JPY</option>
                    <option value="USD/CAD">USD/CAD</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Rate You Got</label>
                  <input
                    type="number"
                    step="0.0001"
                    className="w-full mt-1 p-2 border border-input-border rounded-md bg-background"
                    placeholder="e.g., 0.8520"
                    value={newPost.actual_rate}
                    onChange={(e) => setNewPost(prev => ({ ...prev, actual_rate: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border border-input-border rounded-md bg-background"
                    placeholder="e.g., London, UK"
                    value={newPost.location}
                    onChange={(e) => setNewPost(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Venue Type</label>
                <select 
                  className="w-full mt-1 p-2 border border-input-border rounded-md bg-background"
                  value={newPost.venue_type}
                  onChange={(e) => setNewPost(prev => ({ ...prev, venue_type: e.target.value }))}
                >
                  <option value="bank">Bank</option>
                  <option value="exchange_office">Exchange Office</option>
                  <option value="atm">ATM</option>
                  <option value="online">Online Platform</option>
                </select>
              </div>
              
              <Textarea
                placeholder="Any additional notes about your experience..."
                value={newPost.notes}
                onChange={(e) => setNewPost(prev => ({ ...prev, notes: e.target.value }))}
                className="border-input-border"
              />
              
              <Button 
                onClick={createPost} 
                disabled={loading || !newPost.actual_rate || !newPost.location}
                className="gap-2"
              >
                <Share className="h-4 w-4" />
                Share Insight
              </Button>
            </div>
          </Card>
        )}

        {/* Community Posts */}
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="p-4 border-card-border hover:shadow-medium transition-all duration-300">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Anonymous Trader</span>
                    <Badge variant="outline" className="text-xs">
                      trader
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="text-sm text-muted-foreground">Currency Pair</div>
                      <div className="font-semibold">{post.currency_pair}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Rate Received</div>
                      <div className="font-semibold text-lg">{post.actual_rate.toFixed(4)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Spread</div>
                      <div className={`font-semibold flex items-center gap-1 ${
                        post.spread_percentage > 0 ? 'text-destructive' : 'text-success'
                      }`}>
                        {post.spread_percentage > 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {Math.abs(post.spread_percentage).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">📍 {post.location}</span>
                    {post.venue_type && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {post.venue_type.replace('_', ' ')}
                      </Badge>
                    )}
                  </div>
                  
                  {post.notes && (
                    <p className="text-sm text-muted-foreground italic">"{post.notes}"</p>
                  )}
                  
                  <div className="flex items-center gap-4 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => voteOnPost(post.id, 'up')}
                      className="gap-2 text-success hover:text-success hover:bg-success/10"
                    >
                      <TrendingUp className="h-4 w-4" />
                      <span>{post.upvotes}</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => voteOnPost(post.id, 'down')}
                      className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <TrendingDown className="h-4 w-4" />
                      <span>{post.downvotes}</span>
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Comment
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Share className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};