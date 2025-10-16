import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, Zap, Shield, Globe } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Live Exchange Rates • Updated Every Second</span>
            <span className="sm:hidden">Live Rates</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Currency Exchange
            </span>
            <br />
            <span className="text-foreground">Made Simple</span>
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Convert currencies with real-time rates, track your favorites, and make informed financial decisions 
            with our professional-grade currency converter.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4 sm:px-0">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90 text-base sm:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto"
              onClick={() => document.getElementById('converter-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Converting
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-base sm:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto"
              onClick={() => document.getElementById('trending-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Live Rates
            </Button>
          </div>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 px-4 sm:px-0">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-card border border-card-border">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
              <span className="text-xs sm:text-sm font-medium">Real-time Rates</span>
            </div>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-card border border-card-border">
              <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium">180+ Currencies</span>
            </div>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-card border border-card-border">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
              <span className="text-xs sm:text-sm font-medium">Bank-grade Security</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};