import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieChartIcon,
  Calendar,
  Target,
  Flame
} from 'lucide-react';
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns';

const ProgressChart = ({ habits }) => {
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState(30);

  // Generate data for the last 30 days
  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();
    
    for (let i = timeRange - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Count completions for this date
      const completions = habits.reduce((count, habit) => {
        const hasCompletion = habit.completions?.some(completion => 
          completion.date === dateStr
        );
        return count + (hasCompletion ? 1 : 0);
      }, 0);
      
      data.push({
        date: format(date, 'MMM dd'),
        fullDate: dateStr,
        completions,
        totalHabits: habits.length,
        percentage: habits.length > 0 ? Math.round((completions / habits.length) * 100) : 0
      });
    }
    
    return data;
  }, [habits, timeRange]);

  // Habit completion data for pie chart
  const habitCompletionData = useMemo(() => {
    return habits.map(habit => ({
      name: habit.name,
      value: habit.totalCompletions || 0,
      color: habit.color || '#3B82F6',
      streak: habit.streak || 0
    })).sort((a, b) => b.value - a.value);
  }, [habits]);

  // Weekly completion data
  const weeklyData = useMemo(() => {
    const weeks = [];
    const today = new Date();
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = subDays(today, (i * 7) + 6);
      const weekEnd = subDays(today, i * 7);
      
      let weekCompletions = 0;
      let weekTotal = 0;
      
      for (let j = 0; j < 7; j++) {
        const date = subDays(weekEnd, j);
        const dateStr = format(date, 'yyyy-MM-dd');
        
        habits.forEach(habit => {
          weekTotal++;
          const hasCompletion = habit.completions?.some(completion => 
            completion.date === dateStr
          );
          if (hasCompletion) weekCompletions++;
        });
      }
      
      weeks.push({
        week: `Week ${4 - i}`,
        completions: weekCompletions,
        total: weekTotal,
        percentage: weekTotal > 0 ? Math.round((weekCompletions / weekTotal) * 100) : 0
      });
    }
    
    return weeks;
  }, [habits]);

  const chartTypes = [
    { value: 'line', label: 'Daily Progress', icon: TrendingUp },
    { value: 'bar', label: 'Weekly Overview', icon: BarChart3 },
    { value: 'pie', label: 'Habit Distribution', icon: PieChartIcon }
  ];

  const timeRanges = [
    { value: 7, label: '7 days' },
    { value: 30, label: '30 days' },
    { value: 90, label: '90 days' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-lg rounded-xl p-4 shadow-xl border border-white/20">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === 'percentage' && '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (habits.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-12 h-12 text-white/50" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No data to display</h3>
        <p className="text-white/70">Add some habits and start tracking to see your progress!</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex space-x-1 bg-white/10 backdrop-blur-lg rounded-xl p-1">
          {chartTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setChartType(type.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                chartType === type.value
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <type.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{type.label}</span>
            </button>
          ))}
        </div>

        {chartType !== 'pie' && (
          <div className="flex space-x-1 bg-white/10 backdrop-blur-lg rounded-xl p-1">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range.value
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chart Container */}
      <motion.div
        key={chartType}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
      >
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' && (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="completions"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="totalHabits"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            )}

            {chartType === 'bar' && (
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="week" 
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="completions" 
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}

            {chartType === 'pie' && (
              <PieChart>
                <Pie
                  data={habitCompletionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {habitCompletionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Chart Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {habits.reduce((sum, habit) => sum + (habit.streak || 0), 0)}
            </div>
            <div className="text-white/70 text-sm">Total Streak Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {habits.reduce((sum, habit) => sum + (habit.totalCompletions || 0), 0)}
            </div>
            <div className="text-white/70 text-sm">Total Completions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {habits.length > 0 ? Math.round(
                habits.reduce((sum, habit) => sum + (habit.totalCompletions || 0), 0) / habits.length
              ) : 0}
            </div>
            <div className="text-white/70 text-sm">Avg per Habit</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressChart;
