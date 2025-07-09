import React from 'react';
import { Download, TrendingUp, Calendar, Clock, Award, Target } from 'lucide-react';
import { format } from 'date-fns';
import { OptimizationResult } from '../types';

interface OptimizationResultsProps {
  result: OptimizationResult;
  onExportCalendar: () => void;
}

export function OptimizationResults({ result, onExportCalendar }: OptimizationResultsProps) {
  const efficiencyColor = result.efficiency >= 200 ? 'text-green-600' : result.efficiency >= 150 ? 'text-blue-600' : 'text-orange-600';
  const efficiencyBg = result.efficiency >= 200 ? 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20' : 
                      result.efficiency >= 150 ? 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20' : 
                      'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20';

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-500 animate-fade-in-up">
        <div className="flex items-center justify-between mb-6 animate-fade-in-up animation-delay-100">
          <div className="flex items-center space-x-3 animate-fade-in-up animation-delay-200">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg animate-bounce-gentle">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white animate-shimmer">Results Summary</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Your optimized PTO strategy</p>
            </div>
          </div>
          
          <button
            onClick={onExportCalendar}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-105 animate-glow animate-fade-in-up animation-delay-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 animate-fade-in-up animation-delay-400">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Days Off</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 animate-bounce-gentle">{result.totalDaysOff}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500 animate-float" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">PTO Used</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300 animate-bounce-gentle">{result.ptoUsed}</p>
              </div>
              <Clock className="w-8 h-8 text-green-500 animate-float-delayed" />
            </div>
          </div>

          <div className={`bg-gradient-to-br ${efficiencyBg} rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-700`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${efficiencyColor} dark:${efficiencyColor.replace('text-', 'text-')} font-medium`}>Efficiency</p>
                <p className={`text-2xl font-bold ${efficiencyColor} dark:${efficiencyColor.replace('text-', 'text-')} animate-bounce-gentle`}>{result.efficiency}%</p>
              </div>
              <Award className={`w-8 h-8 ${efficiencyColor.replace('text-', 'text-')} animate-float`} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Vacation Blocks</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 animate-bounce-gentle">{result.vacationBlocks.length}</p>
              </div>
              <Target className="w-8 h-8 text-purple-500 animate-float-delayed" />
            </div>
          </div>
        </div>

        {/* Efficiency Explanation */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-fade-in-up animation-delay-900">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>Efficiency:</strong> You get {(result.efficiency / 100).toFixed(1)}x more days off than PTO days used. 
            {result.efficiency >= 200 && " Excellent optimization! 🎉"}
            {result.efficiency >= 150 && result.efficiency < 200 && " Great optimization! 👍"}
            {result.efficiency < 150 && " Good start - consider different vacation styles for better efficiency."}
          </p>
        </div>
      </div>

      {/* Vacation Blocks */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-500 animate-fade-in-up animation-delay-300">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center animate-fade-in-up animation-delay-400">
          <Calendar className="w-5 h-5 mr-2" />
          <span className="animate-shimmer">Recommended Vacation Blocks</span>
        </h3>
        
        {result.vacationBlocks.length === 0 ? (
          <div className="text-center py-8 animate-fade-in-up animation-delay-500">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3 animate-bounce-gentle" />
            <p className="text-gray-500 dark:text-gray-400">No vacation blocks found. Try adjusting your preferences.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {result.vacationBlocks.map((block, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${(index + 5) * 100}ms` }}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full animate-bounce-gentle">
                      {index + 1}
                    </span>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {format(new Date(block.startDate), 'MMM d')} - {format(new Date(block.endDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse"></div>
                      {block.ptoDays} PTO
                    </span>
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                      {block.weekendDays} weekends
                    </span>
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                      {block.holidayDays} holidays
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 animate-bounce-gentle">{block.totalDays}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">days off</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}