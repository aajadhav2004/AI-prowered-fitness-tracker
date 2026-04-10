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

  useEffect(() => {
    fetchWeightData();
  }, []);

  const fetchWeightData = async () => {
    try {
      const response = await api.get('/weight/progress');
      const progressData = response.data.progress;
      
      if (progressData) {
        // Use highest/lowest from backend (calculated from last 30 days)
        const current = progressData.currentWeight;
        const highest = progressData.highest;
        const lowest = progressData.lowest;
        const change = progressData.totalChange || 0;
        
        setStats({ current, highest, lowest, change });
        
        // Show only current weight as single point in graph
        setWeightData([{
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          weight: current,
        }]);
      } else {
        // No history yet - fetch current weight from profile
        const profileRes = await api.get('/profile');
        const currentWeight = profileRes.data.user.weight;
        
        if (currentWeight) {
          // Create a single data point for current weight
          setWeightData([{
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            weight: currentWeight,
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
          <p className="text-lg font-semibold text-red-600">{stats.highest.toFixed(1)} kg</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Lowest</p>
          <p className="text-lg font-semibold text-green-600">{stats.lowest.toFixed(1)} kg</p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={weightData}>
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
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px'
            }}
            formatter={(value) => [`${value.toFixed(1)} kg`, 'Weight']}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 5 }}
            activeDot={{ r: 7 }}
            name="Weight (kg)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
