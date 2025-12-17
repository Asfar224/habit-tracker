import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  CheckCircle, 
  Flame, 
  Trophy
} from 'lucide-react';

const StatsOverview = ({ 
  totalHabits, 
  completedToday, 
  totalStreak, 
  totalCompletions 
}) => {
  const stats = [
    {
      icon: Target,
      label: 'Total Habits',
      value: totalHabits,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400'
    },
    {
      icon: CheckCircle,
      label: 'Completed Today',
      value: completedToday,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-400'
    },
    {
      icon: Flame,
      label: 'Total Streak',
      value: totalStreak,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      textColor: 'text-orange-400'
    },
    {
      icon: Trophy,
      label: 'Total Completions',
      value: totalCompletions,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400'
    }
  ];

  const getMotivationalMessage = () => {
    if (completedToday === totalHabits && totalHabits > 0) {
      return "🎉 Perfect day! You completed all your habits!";
    } else if (completedToday > 0) {
      return "💪 Great job! Keep the momentum going!";
    } else if (totalHabits > 0) {
      return "🌟 Ready to start your day? Let's do this!";
    } else {
      return "🚀 Ready to build your first habit?";
    }
  };

  return (
    <div className="space-y-6">
      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-white font-medium"
          >
            {getMotivationalMessage()}
          </motion.p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative group"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300">
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 rounded-2xl group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <div className="text-right">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
                      className="text-3xl font-bold text-white"
                    >
                      {stat.value}
                    </motion.div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white/80 font-medium text-sm mb-1">
                    {stat.label}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.color}`} />
                    <span className="text-white/60 text-xs">
                      {stat.label === 'Total Streak' ? 'days' : 
                       stat.label === 'Total Completions' ? 'times' : 
                       stat.label === 'Completed Today' ? 'habits' : 'active'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Indicator */}
      {totalHabits > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Today's Progress</h3>
            <span className="text-white/70 text-sm">
              {completedToday} / {totalHabits} habits
            </span>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-3 mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0}%` }}
              transition={{ duration: 1, delay: 0.8 }}
              className="h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg"
            />
          </div>
          
          <div className="flex justify-between text-sm text-white/60">
            <span>0%</span>
            <span className="font-medium">
              {totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0}%
            </span>
            <span>100%</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StatsOverview;
