import React from 'react';
import { Calendar, Target, Download, Shield, Zap, Globe, Star, Award, Clock, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Smart Calendar Analysis',
    description: 'Analyzes public holidays, weekends, and your company holidays to find optimal vacation opportunities.',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
  },
   {
    icon: Download,
    title: 'Calendar Export',
    description: 'Export your optimized PTO plan as an .ics file to import into any calendar application.',
    color: 'from-green-500 to-green-600',
    bgColor: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20'
  },
  {
    icon: Zap,
    title: 'Maximum Efficiency',
    description: 'Get up to 2.5x more days off by strategically placing your PTO around existing holidays.',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20'
  }
  
];

export function FeatureCards() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/20 dark:bg-purple-800/20 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-indigo-200/20 dark:bg-indigo-800/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-60 right-10 w-28 h-28 bg-green-200/20 dark:bg-green-800/20 rounded-full blur-xl animate-float-delayed"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-xl animate-bounce-gentle">
              <Sparkles className="w-10 h-10 text-white animate-float" />
            </div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-shimmer">
              Why Choose Holiday Optimizer?
            </span>
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Our intelligent algorithm analyzes your PTO constraints and finds the most efficient 
            way to maximize your time off throughout the year with precision and ease.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 hover:rotate-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Animated Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl`}></div>
              
              {/* Floating Icon Container */}
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-18 h-18 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg animate-float`}>
                  <feature.icon className="w-9 h-9 text-white" />
                </div>
                
                {/* Content with Enhanced Typography */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
              
              {/* Enhanced Hover Glow Effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 transition-all duration-500 blur-2xl scale-110`}></div>
              
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-500"></div>
            </div>
          ))}
        </div>
        
        {/* Enhanced Bottom CTA with Pulsing Animation */}
        <div className="text-center mt-24 animate-fade-in-up animation-delay-800">
          <div className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-500 animate-pulse-ring">
            <Award className="w-6 h-6 mr-3 animate-bounce-gentle" />
            <span className="animate-shimmer">Start Optimizing Your PTO Today</span>
            <Sparkles className="w-6 h-6 ml-3 animate-float" />
          </div>
        </div>
      </div>
    </section>
  );
}