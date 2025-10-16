import { useAuth } from '@/hooks/useAuth';
import { Auth } from '@/components/Auth';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { CurrencyConverter } from '@/components/CurrencyConverter';
import { TrendingCurrencies } from '@/components/TrendingCurrencies';
import { CurrencyAlert } from '@/components/CurrencyAlert';
import { SocialTrading } from '@/components/SocialTrading';
import { CurrencyNewsFeed } from '@/components/CurrencyNewsFeed';
import { PortfolioTracker } from '@/components/PortfolioTracker';
import { MarketOverview } from '@/components/MarketOverview';
import { CommunityInsights } from '@/components/CommunityInsights';
import { WhatIfScenarios } from '@/components/WhatIfScenarios';
import { CostOfLivingExplorer } from '@/components/CostOfLivingExplorer';
import { AIAvatar } from '@/components/AIAvatar';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        
        <section id="trending-section" className="py-6 sm:py-8 lg:py-12">
          <div className="container mx-auto">
            <TrendingCurrencies />
          </div>
        </section>

        <section id="converter-section" className="py-6 sm:py-8 lg:py-12">
          <div className="container mx-auto">
            <CurrencyConverter />
          </div>
        </section>

        <section id="alerts-section" className="py-6 sm:py-8 lg:py-12">
          <div className="container mx-auto">
            <CurrencyAlert />
          </div>
        </section>

        <section className="py-6 sm:py-8 lg:py-12">
          <div className="container mx-auto">
            <CurrencyNewsFeed />
          </div>
        </section>

        <section id="portfolio-section" className="py-6 sm:py-8 lg:py-12">
          <div className="container mx-auto">
            <PortfolioTracker />
          </div>
        </section>

        <section id="community-section" className="py-6 sm:py-8 lg:py-12">
          <div className="container mx-auto">
            <SocialTrading />
          </div>
        </section>

        <MarketOverview />
        
        <section id="insights-section">
          <CommunityInsights />
        </section>
        
        <WhatIfScenarios />
        <CostOfLivingExplorer />
      </main>
      <AIAvatar />
    </div>
  );
};

export default Index;
