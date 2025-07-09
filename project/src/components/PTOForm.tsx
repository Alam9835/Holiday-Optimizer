import React from 'react';
import { Calendar, MapPin, Briefcase, Target, Sparkles, Plus, X } from 'lucide-react';
import { UserPreferences } from '../types';

interface PTOFormProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
  onOptimize: () => void;
  isLoading: boolean;
}

const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
];

const vacationStyles = [
  { 
    value: 'long-weekends', 
    label: 'Long Weekends', 
    description: 'Maximize 3-4 day weekends',
    icon: '🏖️'
  },
  { 
    value: 'week-long', 
    label: 'Week-long Breaks', 
    description: 'Focus on full week vacations',
    icon: '✈️'
  },
  { 
    value: 'balanced', 
    label: 'Balanced Mix', 
    description: 'Mix of short and long breaks',
    icon: '⚖️'
  },
  { 
    value: 'custom', 
    label: 'Custom Strategy', 
    description: 'Flexible optimization',
    icon: '🎯'
  },
];

export function PTOForm({ preferences, onPreferencesChange, onOptimize, isLoading }: PTOFormProps) {
  const [newCompanyHoliday, setNewCompanyHoliday] = React.useState('');

  const handleChange = (field: keyof UserPreferences, value: any) => {
    onPreferencesChange({
      ...preferences,
      [field]: value,
    });
  };

  const addCompanyHoliday = () => {
    if (newCompanyHoliday && !preferences.companyHolidays.includes(newCompanyHoliday)) {
      handleChange('companyHolidays', [...preferences.companyHolidays, newCompanyHoliday]);
      setNewCompanyHoliday('');
    }
  };

  const removeCompanyHoliday = (date: string) => {
    handleChange('companyHolidays', preferences.companyHolidays.filter(d => d !== date));
  };

  const selectedCountry = countries.find(c => c.code === preferences.country);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 hover:shadow-2xl transition-all duration-500 animate-fade-in-up">
      <div className="flex items-center space-x-3 mb-8 animate-fade-in-up animation-delay-100">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl animate-bounce-gentle">
          <Briefcase className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white animate-shimmer">PTO Configuration</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Set up your vacation preferences</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Total PTO Days */}
        <div className="animate-fade-in-up animation-delay-200">
          <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 animate-fade-in-up">
            <Calendar className="w-4 h-4 mr-2" />
            Total PTO Days Available
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              max="365"
              value={preferences.totalPTODays}
              onChange={(e) => handleChange('totalPTODays', parseInt(e.target.value) || 0)}
              className="form-input text-lg font-medium hover:shadow-lg transition-all duration-300"
              placeholder="e.g., 20"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
              days
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Enter the total number of PTO days you have available for the year
          </p>
        </div>

        {/* Country Selection */}
        <div className="animate-fade-in-up animation-delay-300">
          <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 animate-fade-in-up">
            <MapPin className="w-4 h-4 mr-2" />
            Country
          </label>
          <select
            value={preferences.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className="form-input text-lg hover:shadow-lg transition-all duration-300"
          >
            <option value="">Select your country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
          {selectedCountry && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Public holidays for {selectedCountry.flag} {selectedCountry.name} will be included
            </p>
          )}
        </div>

        {/* Company Holidays */}
        <div className="animate-fade-in-up animation-delay-400">
          <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 animate-fade-in-up">
            <Briefcase className="w-4 h-4 mr-2" />
            Company Holidays (Optional)
          </label>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="date"
                value={newCompanyHoliday}
                onChange={(e) => setNewCompanyHoliday(e.target.value)}
                className="flex-1 form-input py-3 hover:shadow-lg transition-all duration-300"
              />
              <button
                onClick={addCompanyHoliday}
                disabled={!newCompanyHoliday}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {preferences.companyHolidays.length > 0 && (
              <div className="space-y-2">
                {preferences.companyHolidays.map((date) => (
                  <div key={date} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 hover:shadow-md transition-all duration-300 animate-fade-in-up">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <button
                      onClick={() => removeCompanyHoliday(date)}
                      className="text-red-500 hover:text-red-700 transition-all duration-300 hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Add any company-specific holidays or floating holidays
          </p>
        </div>

        {/* Vacation Style */}
        <div className="animate-fade-in-up animation-delay-500">
          <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 animate-fade-in-up">
            <Target className="w-4 h-4 mr-2" />
            Vacation Style Preference
          </label>
          <div className="grid grid-cols-1 gap-3">
            {vacationStyles.map((style, index) => (
              <label
                key={style.value}
                className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 animate-fade-in-up ${
                  preferences.vacationStyle === style.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <input
                  type="radio"
                  name="vacationStyle"
                  value={style.value}
                  checked={preferences.vacationStyle === style.value}
                  onChange={(e) => handleChange('vacationStyle', e.target.value)}
                  className="mt-1 text-blue-600 focus:ring-blue-500 transition-all duration-300"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{style.icon}</span>
                    <div className="font-semibold text-gray-900 dark:text-white">{style.label}</div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{style.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Optimize Button */}
        <div className="animate-fade-in-up animation-delay-600">
          <button
            onClick={onOptimize}
            disabled={isLoading || !preferences.country || preferences.totalPTODays <= 0}
            className="w-full flex items-center justify-center px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105 animate-glow"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner h-6 w-6 mr-3"></div>
                <span className="animate-bounce-gentle">Optimizing Your PTO...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 mr-3 animate-bounce-gentle" />
                Optimize My PTO Plan
              </>
            )}
          </button>
        </div>
        
        {(!preferences.country || preferences.totalPTODays <= 0) && (
          <p className="text-sm text-amber-600 dark:text-amber-400 text-center animate-fade-in-up animation-delay-700">
            {!preferences.country && "Please select a country"}
            {preferences.country && preferences.totalPTODays <= 0 && "Please enter your total PTO days"}
          </p>
        )}
      </div>
    </div>
  );
}