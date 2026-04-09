import React from 'react';
import { Activity } from 'lucide-react';

const BMITracker = ({ bmi, weight, height }) => {
  // Calculate BMI if not provided
  const calculatedBMI = bmi || (weight && height ? weight / Math.pow(height / 100, 2) : null);
  const currentBMI = calculatedBMI ? parseFloat(calculatedBMI.toFixed(1)) : null;

  // BMI ranges
  const ranges = [
    { min: 0, max: 16, label: 'Severe Underweight', color: '#60a5fa', textColor: '#1e40af' },
    { min: 16, max: 18.5, label: 'Underweight', color: '#34d399', textColor: '#065f46' },
    { min: 18.5, max: 25, label: 'Healthy', color: '#4ade80', textColor: '#166534' },
    { min: 25, max: 30, label: 'Overweight', color: '#fbbf24', textColor: '#92400e' },
    { min: 30, max: 35, label: 'Obese', color: '#fb923c', textColor: '#9a3412' },
    { min: 35, max: 50, label: 'Severely Obese', color: '#f87171', textColor: '#991b1b' },
  ];

  // Get current status
  const getCurrentStatus = () => {
    if (!currentBMI) return null;
    return ranges.find(r => currentBMI >= r.min && currentBMI < r.max) || ranges[ranges.length - 1];
  };

  const status = getCurrentStatus();

  // Calculate position on the bar (0-100%)
  const getPosition = () => {
    if (!currentBMI) return 50;
    
    // Map BMI to percentage (16-35 range mapped to 0-100%)
    const minBMI = 16;
    const maxBMI = 35;
    const clampedBMI = Math.max(minBMI, Math.min(maxBMI, currentBMI));
    return ((clampedBMI - minBMI) / (maxBMI - minBMI)) * 100;
  };

  const position = getPosition();

  if (!currentBMI) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">BMI Tracker</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Please update your height and weight in your profile to see BMI tracking</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">BMI Tracker</h2>
      </div>

      {/* Current BMI Display */}
      <div className="text-center mb-8">
        <div className="inline-block">
          <div className="text-5xl font-bold text-gray-800 mb-2">{currentBMI}</div>
          <div 
            className="px-4 py-2 rounded-full text-white font-semibold text-sm"
            style={{ backgroundColor: status?.color }}
          >
            {status?.label}
          </div>
        </div>
      </div>

      {/* BMI Scale Bar */}
      <div className="relative mb-8">
        {/* Color gradient bar */}
        <div className="relative h-10 rounded-full overflow-hidden shadow-inner border-2 border-gray-300">
          <div className="absolute inset-0 flex">
            {ranges.map((range, idx) => (
              <div
                key={idx}
                className="flex-1 relative"
                style={{ backgroundColor: range.color }}
              >
                {/* Tick marks */}
                <div className="absolute top-0 left-0 w-px h-full bg-white opacity-30"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Pointer/Indicator */}
        <div 
          className="absolute top-0 transition-all duration-500 ease-out"
          style={{ 
            left: `${position}%`,
            transform: 'translateX(-50%)',
            marginTop: '-12px'
          }}
        >
          {/* Arrow pointing down */}
          <div className="flex flex-col items-center">
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-gray-800"></div>
            <div className="w-1 h-10 bg-gray-800"></div>
            <div className="w-6 h-6 bg-gray-800 rounded-full border-4 border-white shadow-lg"></div>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="grid grid-cols-6 gap-1 text-center text-xs mb-4">
        {ranges.map((range, idx) => (
          <div key={idx} className="px-1">
            <div className="font-semibold" style={{ color: range.textColor }}>
              {range.label}
            </div>
            <div className="text-gray-500 mt-1">
              {range.min}-{range.max}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Current Weight</p>
          <p className="text-2xl font-bold text-gray-800">{weight} kg</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Height</p>
          <p className="text-2xl font-bold text-gray-800">{height} cm</p>
        </div>
      </div>
    </div>
  );
};

export default BMITracker;
