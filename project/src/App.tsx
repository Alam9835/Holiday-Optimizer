import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import { CalendarDays, Sparkles, Target, TrendingUp, Shield } from 'lucide-react';
import { PTOForm } from './components/PTOForm';
import { Calendar } from './components/Calendar';
import { OptimizationResults } from './components/OptimizationResults';
import { ThemeToggle } from './components/ThemeToggle';
import { HeroSection } from './components/HeroSection';
import { FeatureCards } from './components/FeatureCards';
import { useHolidays } from './hooks/useHolidays';
import { useLocalStorage } from './hooks/useLocalStorage';
import { PTOOptimizer } from './utils/ptoOptimizer';
import { generateICSFile, downloadICSFile } from './utils/calendarExport';
import { UserPreferences, OptimizationResult } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: 1000,
      staleTime: 1000 * 60 * 60, // 1 hour
    },
  },
});

const defaultPreferences: UserPreferences = {
  totalPTODays: 20,
  country: 'US',
  companyHolidays: [],
  vacationStyle: 'balanced',
  pinnedDates: []
};

function HolidayOptimizerApp() {
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>('pto-preferences', defaultPreferences);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useLocalStorage('dark-mode', false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const { data: holidays = [], isLoading: holidaysLoading, error: holidaysError } = useHolidays(
    preferences.country,
    currentDate.getFullYear()
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (holidaysError) {
      console.warn('Holiday API error:', holidaysError);
      // Only show warning if we don't have fallback data
      if (!holidays || holidays.length === 0) {
        toast.warning('Using offline holiday data. Some holidays may be missing.', {
          duration: 5000,
        });
      }
    }
  }, [holidaysError]);

  const handleOptimize = async () => {
    if (!preferences.country) {
      toast.error('Please select a country');
      return;
    }
    
    if (preferences.totalPTODays <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsOptimizing(true);
    setShowResults(false);
    
    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const optimizer = new PTOOptimizer(holidays, preferences, currentDate.getFullYear());
      const result = optimizer.optimize();
      
      setOptimizationResult(result);
      setShowResults(true);
      toast.success(`Optimization complete! Found ${result.vacationBlocks.length} vacation blocks using ${result.ptoUsed} PTO days.`);
    } catch (error) {
      console.error('Optimization error:', error);
      toast.error('Failed to optimize PTO. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleExportCalendar = () => {
    if (!optimizationResult) return;
    
    try {
      const icsContent = generateICSFile(optimizationResult, holidays, preferences.companyHolidays);
      downloadICSFile(icsContent, `pto-plan-${currentDate.getFullYear()}.ics`);
      toast.success('Calendar exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export calendar. Please try again.');
    }
  };

  const handleReset = () => {
    setOptimizationResult(null);
    setShowResults(false);
    setPreferences(defaultPreferences);
    toast.info('Preferences reset to defaults');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'}`}>
      <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
      
      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl animate-float hover:scale-110 transition-all duration-500">
                <CalendarDays className="w-6 h-6 text-white" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 animate-pulse-ring"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-shimmer hover:scale-105 transition-transform duration-300 cursor-pointer">
                  Holiday Optimizer
                </h1>
               
              </div>
            </div>
            
            {showResults && (
              <button
                onClick={handleReset}
                className="group relative px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-white bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-blue-500 hover:to-indigo-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 animate-fade-in-up overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center">
                  <Target className="w-4 h-4 mr-2 group-hover:animate-bounce-gentle" />
                Start Over
                </span>
              </button>
            )}
          </div>
        </div>
        {/* Header bottom glow effect */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
      </header>

      {!showResults ? (
        <>
          {/* Hero Section */}
          <HeroSection />
          
          {/* Feature Cards */}
          <FeatureCards />
          
          {/* Main Form Section */}
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in-up animation-delay-300">
            <div className="text-center mb-12 animate-fade-in-up animation-delay-400">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 animate-shimmer">
                Optimize Your Time Off
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Enter your details below and let our algorithm find the perfect vacation opportunities 
                that maximize your days off while minimizing PTO usage.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form */}
              <div className="animate-fade-in-up animation-delay-500">
                <PTOForm
                  preferences={preferences}
                  onPreferencesChange={setPreferences}
                  onOptimize={handleOptimize}
                  isLoading={isOptimizing || holidaysLoading}
                />
              </div>
              
              {/* Calendar Preview */}
              <div className="lg:sticky lg:top-24 lg:self-start animate-fade-in-up animation-delay-600">
                <Calendar
                  currentDate={currentDate}
                  onDateChange={setCurrentDate}
                  holidays={holidays}
                  ptoDays={[]}
                  companyHolidays={preferences.companyHolidays}
                  isPreview={true}
                />
              </div>
            </div>
            
            {/* Loading State */}
            {isOptimizing && (
              <div className="mt-12 flex items-center justify-center py-16 animate-fade-in-up">
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto animate-glow"></div>
                    <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-indigo-200 border-b-indigo-600 animate-spin mx-auto animate-pulse-ring" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 animate-bounce-gentle">
                    Optimizing Your PTO...
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 animate-fade-in-up animation-delay-200">
                    Analyzing holidays and finding the best vacation opportunities
                  </p>
                  <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400 animate-fade-in-up animation-delay-400">
                    <Sparkles className="w-4 h-4" />
                    <span>This may take a few moments</span>
                  </div>
                </div>
              </div>
            )}
          </section>
        </>
      ) : (
        /* Results View */
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
          <div className="mb-8 animate-fade-in-up animation-delay-200">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 animate-shimmer">
              Your Optimized PTO Plan
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Here's your personalized vacation strategy for {currentDate.getFullYear()}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-2 animate-fade-in-up animation-delay-300">
              <Calendar
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                holidays={holidays}
                ptoDays={optimizationResult?.suggestedPTO || []}
                companyHolidays={preferences.companyHolidays}
                isPreview={false}
              />
            </div>
            
            {/* Results */}
            <div className="lg:col-span-1 animate-fade-in-up animation-delay-400">
              {optimizationResult && (
                <OptimizationResults
                  result={optimizationResult}
                  onExportCalendar={handleExportCalendar}
                />
              )}
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 mt-16 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-purple-400/10 rounded-full blur-xl animate-float-delayed"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-indigo-400/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-10 right-1/3 w-24 h-24 bg-blue-400/10 rounded-full blur-xl animate-float-delayed"></div>
        </div>
        
        {/* Top border glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center relative z-10">
            {/* Logo and Brand */}
            <div className="flex items-center justify-center space-x-3 mb-6 animate-fade-in-up">
              <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-xl shadow-lg animate-float">
                <CalendarDays className="w-6 h-6 text-white" />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent animate-shimmer">
                  Holiday Optimizer
                </h3>
                <p className="text-sm text-blue-200/80">Smart PTO Planning</p>
              </div>
            </div>
            
            {/* Description */}
            <p className="text-blue-100/90 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
              Maximize your time off with intelligent PTO planning and strategic vacation optimization
            </p>
            
            {/* Footer Links/Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8 animate-fade-in-up animation-delay-400">
              
              <div className="flex items-center text-blue-200/80 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <Shield className="w-4 h-4 mr-2 text-green-300" />
                <span className="text-sm font-medium">Privacy First • Offline Ready</span>
              </div>
            </div>
            
            {/* Copyright and Creator */}
            <div className="border-t border-white/10 pt-6 animate-fade-in-up animation-delay-600">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <p className="text-blue-200/60 text-sm">
                  © 2025 Holiday Optimizer. All rights reserved.
                </p>
                <div className="flex items-center space-x-2">
  <span className="text-blue-200/80 text-sm flex items-center">
    Made with 
    <span className="text-red-400 ml-1 animate-bounce-gentle">♥</span> 
  </span>
  
  <a 
    href="https://github.com/Alam9835" 
    target="_blank" 
    rel="noopener noreferrer"
    className="group flex items-center space-x-2 text-blue-200/80 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
  >
    <svg className="w-4 h-4 group-hover:animate-bounce-gentle" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
    <span className="text-sm font-medium">GitHub</span>
  </a>
</div>

              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom gradient glow */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none"></div>
      </footer>

      <Toaster position="top-right" richColors />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HolidayOptimizerApp />
    </QueryClientProvider>
  );
}

export default App;