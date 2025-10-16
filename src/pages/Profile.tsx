import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Globe, TrendingUp, MapPin, Save, ArrowLeft, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

interface UserProfile {
  username: string | null;
  full_name: string | null;
  user_type: string | null;
  preferred_currencies: string[];
  preferred_cities: string[];
  location_country: string | null;
  investment_experience: string | null;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    full_name: '',
    user_type: 'traveler',
    preferred_currencies: ['USD', 'INR'],
    preferred_cities: ['Mumbai', 'Delhi', 'Bangalore'],
    location_country: 'India',
    investment_experience: 'beginner',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile({
          username: data.username,
          full_name: data.full_name,
          user_type: data.user_type,
          preferred_currencies: data.preferred_currencies || ['USD', 'INR'],
          preferred_cities: data.preferred_cities || ['Mumbai', 'Delhi', 'Bangalore'],
          location_country: data.location_country,
          investment_experience: data.investment_experience,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...profile,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const currencyOptions = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  ];

  const cityOptions = [
    // Indian Cities (18 major cities)
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 
    'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur',
    'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna',
    // Global Cities
    'London', 'New York', 'Dubai', 'Singapore',
    'Tokyo', 'Paris', 'Sydney', 'Toronto', 'Berlin', 'Amsterdam'
  ];

  const toggleCurrency = (code: string) => {
    setProfile(prev => ({
      ...prev,
      preferred_currencies: prev.preferred_currencies.includes(code)
        ? prev.preferred_currencies.filter(c => c !== code)
        : [...prev.preferred_currencies, code]
    }));
  };

  const toggleCity = (city: string) => {
    setProfile(prev => ({
      ...prev,
      preferred_cities: prev.preferred_cities.includes(city)
        ? prev.preferred_cities.filter(c => c !== city)
        : [...prev.preferred_cities, city]
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Please sign in to view your profile</p>
            <Button 
              className="mt-4 bg-gradient-primary hover:opacity-90"
              onClick={() => navigate('/auth')}
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="border-b border-card-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarFallback className="text-2xl bg-gradient-primary text-primary-foreground">
                {user.email?.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {profile.full_name || 'Your Profile'}
          </h1>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Mail className="h-4 w-4" />
            {user.email}
          </p>
        </div>

        <div className="grid gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter username"
                    value={profile.username || ''}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    placeholder="Enter full name"
                    value={profile.full_name || ''}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="bg-background"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="Your country"
                      value={profile.location_country || ''}
                      onChange={(e) => setProfile({ ...profile, location_country: e.target.value })}
                      className="pl-10 bg-background"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user_type">User Type</Label>
                  <Select
                    value={profile.user_type || 'traveler'}
                    onValueChange={(value) => setProfile({ ...profile, user_type: value })}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-[100]">
                      <SelectItem value="traveler">🧳 Traveler</SelectItem>
                      <SelectItem value="investor">💼 Investor</SelectItem>
                      <SelectItem value="business">🏢 Business</SelectItem>
                      <SelectItem value="student">🎓 Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Investment Experience</Label>
                <Select
                  value={profile.investment_experience || 'beginner'}
                  onValueChange={(value) => setProfile({ ...profile, investment_experience: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-[100]">
                    <SelectItem value="beginner">📚 Beginner</SelectItem>
                    <SelectItem value="intermediate">📊 Intermediate</SelectItem>
                    <SelectItem value="advanced">🎯 Advanced</SelectItem>
                    <SelectItem value="expert">🏆 Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Currency Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Preferred Currencies
              </CardTitle>
              <CardDescription>
                Select currencies you frequently work with (including INR for India)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {currencyOptions.map((currency) => (
                  <Button
                    key={currency.code}
                    variant={profile.preferred_currencies.includes(currency.code) ? "default" : "outline"}
                    onClick={() => toggleCurrency(currency.code)}
                    className="h-auto flex-col gap-1 py-3 hover:scale-105 transition-transform"
                  >
                    <span className="text-2xl">{currency.flag}</span>
                    <span className="text-sm font-semibold">{currency.code}</span>
                    <span className="text-xs text-muted-foreground">{currency.name}</span>
                  </Button>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Selected:</span>
                {profile.preferred_currencies.map((code) => (
                  <Badge key={code} variant="secondary">
                    {currencyOptions.find(c => c.code === code)?.flag} {code}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* City Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Preferred Cities
              </CardTitle>
              <CardDescription>
                Select cities you're interested in tracking for cost of living comparisons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {cityOptions.map((city) => (
                  <Button
                    key={city}
                    variant={profile.preferred_cities.includes(city) ? "default" : "outline"}
                    onClick={() => toggleCity(city)}
                    className="h-auto py-3 hover:scale-105 transition-transform"
                  >
                    <span className="text-sm font-semibold">{city}</span>
                  </Button>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Selected:</span>
                {profile.preferred_cities.map((city) => (
                  <Badge key={city} variant="secondary">
                    📍 {city}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-gradient-primary hover:opacity-90 gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
