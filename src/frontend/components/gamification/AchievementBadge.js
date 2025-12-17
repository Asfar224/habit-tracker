import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Flame, 
  Target, 
  Calendar,
  Zap,
  Crown,
  Award
} from 'lucide-react';

const AchievementBadge = ({ achievement, isUnlocked, progress = 0 }) => {
  const getIcon = (type) => {
    const icons = {
      streak: Flame,
      completions: Target,
      consistency: Calendar,
      speed: Zap,
      mastery: Crown,
      special: Award,
      default: Star
    };
    return icons[type] || icons.default;
  };

  const getColor = (rarity) => {
    const colors = {
      common: 'from-gray-400 to-gray-600',
      uncommon: 'from-green-400 to-green-600',
      rare: 'from-blue-400 to-blue-600',
      epic: 'from-purple-400 to-purple-600',
      legendary: 'from-yellow-400 to-orange-600'
    };
    return colors[rarity] || colors.common;
  };

  const getGlowColor = (rarity) => {
    const glows = {
      common: 'shadow-gray-500/50',
      uncommon: 'shadow-green-500/50',
      rare: 'shadow-blue-500/50',
      epic: 'shadow-purple-500/50',
      legendary: 'shadow-yellow-500/50'
    };
    return glows[rarity] || glows.common;
  };

  const Icon = getIcon(achievement.type);
  const isCompleted = progress >= achievement.requirement;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
        isUnlocked && isCompleted
          ? `bg-gradient-to-br ${getColor(achievement.rarity)} text-white shadow-lg ${getGlowColor(achievement.rarity)}`
          : isUnlocked
          ? 'bg-white/10 border-white/30 text-white/70'
          : 'bg-gray-800/50 border-gray-600/50 text-gray-500'
      }`}
    >
      {/* Background Pattern */}
      {isUnlocked && isCompleted && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent" />
      )}
      
      {/* Icon */}
      <div className="relative z-10 text-center mb-3">
        <motion.div
          animate={isUnlocked && isCompleted ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
          className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
            isUnlocked && isCompleted
              ? 'bg-white/20'
              : isUnlocked
              ? 'bg-white/10'
              : 'bg-gray-700/50'
          }`}
        >
          <Icon className={`w-6 h-6 ${
            isUnlocked && isCompleted ? 'text-white' : 'text-current'
          }`} />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h3 className={`font-semibold text-sm mb-1 ${
          isUnlocked && isCompleted ? 'text-white' : 'text-current'
        }`}>
          {achievement.name}
        </h3>
        
        <p className={`text-xs mb-3 ${
          isUnlocked && isCompleted ? 'text-white/80' : 'text-current/70'
        }`}>
          {achievement.description}
        </p>

        {/* Progress Bar */}
        {isUnlocked && !isCompleted && (
          <div className="space-y-2">
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(progress / achievement.requirement) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
              />
            </div>
            <p className="text-xs text-white/60">
              {progress} / {achievement.requirement}
            </p>
          </div>
        )}

        {/* Rarity Badge */}
        {isUnlocked && isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center space-x-1 px-2 py-1 bg-white/20 rounded-full text-xs font-medium"
          >
            <Trophy className="w-3 h-3" />
            <span className="capitalize">{achievement.rarity}</span>
          </motion.div>
        )}

        {/* Lock Icon for locked achievements */}
        {!isUnlocked && (
          <div className="text-center">
            <div className="w-6 h-6 mx-auto mb-1 opacity-50">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
            </div>
            <p className="text-xs opacity-50">Locked</p>
          </div>
        )}
      </div>

      {/* Sparkle Effect */}
      {isUnlocked && isCompleted && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, Math.random() * 20 - 10],
                y: [0, Math.random() * 20 - 10]
              }}
              transition={{
                duration: 2,
                delay: i * 0.5,
                repeat: Infinity,
                repeatDelay: 4
              }}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AchievementBadge;
