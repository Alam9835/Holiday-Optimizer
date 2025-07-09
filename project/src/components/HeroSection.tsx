import React from 'react';
import { Calendar, Sparkles, Star } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating circles */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-white/5 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-40 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-60 right-1/3 w-8 h-8 bg-white/15 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-60 right-10 w-14 h-14 bg-white/8 rounded-full animate-float"></div>
        <div className="absolute top-32 left-1/3 w-10 h-10 bg-white/12 rounded-full animate-float-delayed"></div>
        
        {/* Moving gradient orbs */}
        <div className="absolute top-1/4 left-1/2 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-xl animate-float-delayed"></div>
        
        {/* Animated lines */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-wave"></div>
          <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent animate-wave" style={{ animationDelay: '1s' }}></div>
        </div>
        
        {/* Pulsing dots */}
        <div className="absolute top-1/2 left-20 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-32 w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          {/* Main Heading */}
          <div className="flex items-center justify-center mb-6 animate-fade-in-up">
            <div className="flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mr-6 animate-bounce-gentle">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent animate-shimmer">
              Holiday Optimizer
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Maximize your time off with intelligent PTO planning. Get more vacation days 
            by strategically placing your PTO around holidays and weekends.
          </p>
          
          {/* Service Features */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 animate-fade-in-up animation-delay-600">
            
          </div>
        </div>
      </div>
      
      {/* Enhanced Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-wave">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor" className="text-blue-50 dark:text-gray-900"/>
        </svg>
      </div>
    </section>
  );
}