import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Star, Zap, Target } from 'lucide-react';

const LevelProgress = ({ level, experience, nextLevelExp, totalExperience }) => {
  const getLevelIcon = (level) => {
    if (level >= 50) return Crown;
    if (level >= 25) return Star;
    if (level >= 10) return Zap;
    return Target;
  };

  const getLevelColor = (level) => {
    if (level >= 50) return 'from-yellow-400 to-orange-500';
    if (level >= 25) return 'from-purple-400 to-pink-500';
    if (level >= 10) return 'from-blue-400 to-cyan-500';
    return 'from-green-400 to-emerald-500';
  };

  const getLevelTitle = (level) => {
    if (level >= 50) return 'Habit Master';
    if (level >= 25) return 'Habit Expert';
    if (level >= 10) return 'Habit Enthusiast';
    return 'Habit Beginner';
  };

  const progressPercentage = (experience / nextLevelExp) * 100;
  const Icon = getLevelIcon(level);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className={`w-12 h-12 rounded-full bg-gradient-to-r ${getLevelColor(level)} flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-white">Level {level}</h3>
            <p className="text-white/70 text-sm">{getLevelTitle(level)}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{experience}</div>
          <div className="text-white/60 text-sm">XP</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-white/70">
          <span>Progress to Level {level + 1}</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className={`h-3 bg-gradient-to-r ${getLevelColor(level)} rounded-full relative`}
          >
            {/* Shimmer Effect */}
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          </motion.div>
        </div>
        
        <div className="flex justify-between text-xs text-white/50">
          <span>{experience} XP</span>
          <span>{nextLevelExp} XP needed</span>
        </div>
      </div>

      {/* Level Rewards */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <h4 className="text-sm font-semibold text-white/80 mb-2">Level Rewards</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2 text-white/70">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span>Unlock new themes</span>
          </div>
          <div className="flex items-center space-x-2 text-white/70">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span>Advanced analytics</span>
          </div>
          <div className="flex items-center space-x-2 text-white/70">
            <div className="w-2 h-2 bg-purple-400 rounded-full" />
            <span>Custom badges</span>
          </div>
          <div className="flex items-center space-x-2 text-white/70">
            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
            <span>Priority support</span>
          </div>
        </div>
      </div>

      {/* Achievement Streak */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">Total Experience</span>
          </div>
          <span className="text-lg font-bold text-yellow-400">{totalExperience}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LevelProgress;
