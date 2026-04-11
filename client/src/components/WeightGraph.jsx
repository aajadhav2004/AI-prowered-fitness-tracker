import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../api';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

export default function WeightGraph() {
  const [weightData, setWeightData] = useState([]);
  const [stats, setStats] = useState({
    current: 0,
    highest: 0,
    lowest: 0,
    change: 0,
  });
  const [loading, setLoading] = useState(true);
  const [fitnessGoal, setFitnessGoal] = useState('weight_loss'); // Default to weight_loss

  useEffect(() => {
    fetchWeightData();
    fetchUserGoal();
  }, []);

  const fetchUserGoal = async () => {
    try {
      const profileRes = await api.get('/profile');
      const goal = profileRes.data.user.fitnessGoal || 'weight_loss';
      setFitnessGoal(goal);
    } catch (err) {
      console.error('Error fetching user goal:', err);
    }
  };

  const fetchWeightData = async () => {
    try {
      const response = await api.get('/weight/progress');
      const progressData = response.data.progress;
      
      if (progressData && progressData.history && progressData.history.length > 0) {
        // Use highest/lowest from backend (calculated from last 30 days)
        const current = progressData.currentWeight;
        const highest = progressData.highest;
        const lowest = progressData.lowest;
        const change = progressData.totalChange || 0;
        
        setStats({ current, highest, lowest, change });
        
        // Show all weight history from last 30 days
        const chartData = progressData.history.map((entry) => ({
          date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          weight: entry.weight,
          isMax: entry.weight === highest,
          isMin: entry.weight === lowest,
          isCurrent: entry.weight === current,
        }));
        
        setWeightData(chartData);
      } else {
        // No history yet - fetch current weight from profile
        const profileRes = await api.get('/profile');
        const currentWeight = profileRes.data.user.weight;
        
        if (currentWeight) {
          // Create a single data point for current weight
          setWeightData([{
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            weight: currentWeight,
            isCurrent: true,
          }]);
          
          setStats({
            current: currentWeight,
            highest: currentWeight,
            lowest: currentWeight,
            change: 0,
          });
        }
      }
    } catch (err) {
      console.error('Error fetching weight data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get colors based on fitness goal
  const getMaxColor = () => {
    // For weight loss: high weight is bad (red), low weight is good (green)
    // For weight gain: high weight is good (green), low weight is bad (red)
    return fitnessGoal === 'weight_gain' ? '#16a34a' : '#dc2626';
  };

  const getMinColor = () => {
    return fitnessGoal === 'weight_gain' ? '#dc2626' : '#16a34a';
  };

  const getMaxColorClass = () => {
    return fitnessGoal === 'weight_gain' ? 'text-green-600' : 'text-red-600';
  };

  const getMinColorClass = () => {
    return fitnessGoal === 'weight_gain' ? 'text-red-600' : 'text-green-600';
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      let label = 'Weight';
      let color = '#9ca3af'; // Gray
      
      if (data.isCurrent) {
        label = 'Current Weight';
        color = '#3b82f6'; // Blue
      } else if (data.isMax) {
        label = 'Highest Weight';
        color = getMaxColor();
      } else if (data.isMin) {
        label = 'Lowest Weight';
        color = getMinColor();
      }
      
      return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
          <p className="text-sm text-gray-600 mb-1">{data.date}</p>
          <p className="text-base font-bold" style={{ color }}>
            {label}: {data.weight.toFixed(1)} kg
          </p>
        </div>
      );
    }
    return null;
  };

  const getTrendIcon = () => {
    if (stats.change > 0) return <TrendingUp className="w-5 h-5 text-red-500" />;
    if (stats.change < 0) return <TrendingDown className="w-5 h-5 text-green-500" />;
    return <Minus className="w-5 h-5 text-gray-500" />;
  };

  const getTrendColor = () => {
    if (stats.change > 0) return 'text-red-600';
    if (stats.change < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="text-center py-8">
          <p className="text-gray-600">Loading weight data...</p>
        </div>
      </div>
    );
  }

  if (weightData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Weight Progress</h3>
        <div className="text-center py-8">
          <p className="text-gray-600">Loading weight data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">Weight Progress</h3>
        <div className="flex items-center gap-2">
          {getTrendIcon()}
          <span className={`text-sm font-semibold ${getTrendColor()}`}>
            {stats.change > 0 ? '+' : ''}{stats.change.toFixed(1)} kg
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-600">Current</p>
          <p className="text-2xl font-bold text-gray-800">{stats.current.toFixed(1)} kg</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Highest</p>
          <p className={`text-lg font-semibold ${getMaxColorClass()}`}>{stats.highest.toFixed(1)} kg</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Lowest</p>
          <p className={`text-lg font-semibold ${getMinColorClass()}`}>{stats.lowest.toFixed(1)} kg</p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={weightData}>
          <defs>
            <style>
              {`
                @keyframes dash {
                  to {
                    stroke-dashoffset: -20;
                  }
                }
                .animated-line {
                  animation: dash 1s linear infinite;
                }
              `}
            </style>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            stroke="#666"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#666"
            domain={['dataMin - 1', 'dataMax + 1']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#3b82f6" 
            strokeWidth={2}
            strokeDasharray="5 5"
            className="animated-line"
            dot={(props) => {
              const { cx, cy, payload } = props;
              let fill = '#9ca3af'; // Default gray for other points
              let r = 5;
              
              if (payload.isCurrent) {
                fill = '#3b82f6'; // Blue for current
                r = 6;
              } else if (payload.isMax) {
                fill = getMaxColor(); // Goal-based color for max
                r = 6;
              } else if (payload.isMin) {
                fill = getMinColor(); // Goal-based color for min
                r = 6;
              }
              
              return (
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={r} 
                  fill={fill} 
                  stroke="#fff" 
                  strokeWidth={2}
                />
              );
            }}
            activeDot={(props) => {
              const { cx, cy, payload } = props;
              let fill = '#9ca3af'; // Default gray for other points
              let r = 8; // Larger for active
              
              if (payload.isCurrent) {
                fill = '#3b82f6'; // Blue for current
              } else if (payload.isMax) {
                fill = getMaxColor(); // Goal-based color for max
              } else if (payload.isMin) {
                fill = getMinColor(); // Goal-based color for min
              }
              
              return (
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={r} 
                  fill={fill} 
                  stroke="#fff" 
                  strokeWidth={3}
                />
              );
            }}
            name="Weight (kg)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
