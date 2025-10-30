import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  X, 
  Edit3, 
  Trash2, 
  Target, 
  Flame, 
  Calendar,
  MoreVertical,
  Trophy,
  Star
} from 'lucide-react';
import { useHabits } from '../../contexts/HabitContext';
import { format, isToday } from 'date-fns';

const HabitCard = ({ habit, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { markHabitComplete, unmarkHabitComplete, isHabitCompleted, getHabitCompletionRate } = useHabits();
  
  const isCompleted = isHabitCompleted(habit.id);
  const completionRate = getHabitCompletionRate(habit.id, 30);
  const today = new Date();

  const handleToggleComplete = async () => {
    try {
      if (isCompleted) {
        await unmarkHabitComplete(habit.id, today);
      } else {
        await markHabitComplete(habit.id, today);
      }
    } catch (error) {
      console.error('Error toggling habit completion:', error);
    }
  };

  const getStreakEmoji = (streak) => {
    if (streak >= 30) return '🔥🔥🔥';
    if (streak >= 14) return '🔥🔥';
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '⭐';
    return '🌱';
  };

  const getStreakMessage = (streak) => {
    if (streak >= 30) return 'Incredible! You\'re on fire!';
    if (streak >= 14) return 'Amazing streak! Keep it up!';
    if (streak >= 7) return 'Great job! You\'re building momentum!';
    if (streak >= 3) return 'Good start! Keep going!';
    return 'Every journey begins with a single step!';
  };

  const getCompletionRateColor = (rate) => {
    if (rate >= 80) return 'text-green-500';
    if (rate >= 60) return 'text-yellow-500';
    if (rate >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`relative bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 ${
        isCompleted 
          ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' 
          : 'border-gray-100 hover:border-gray-200'
      }`}
      style={{ borderLeftColor: habit.color, borderLeftWidth: '4px' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{habit.name}</h3>
            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-500"
              >
                <Check className="w-5 h-5" />
              </motion.div>
            )}
          </div>
          {habit.description && (
            <p className="text-sm text-gray-600 mb-3">{habit.description}</p>
          )}
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <Target className="w-3 h-3" />
              <span>{habit.targetDays} days/week</span>
            </span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{habit.category}</span>
            </span>
          </div>
        </div>

        {/* Menu Button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
          
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]"
            >
              <button
                onClick={() => {
                  onEdit(habit);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  onDelete(habit.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-lg font-bold text-gray-800">{habit.streak || 0}</span>
          </div>
          <p className="text-xs text-gray-500">Current Streak</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-lg font-bold text-gray-800">{habit.totalCompletions || 0}</span>
          </div>
          <p className="text-xs text-gray-500">Total Done</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Star className="w-4 h-4 text-blue-500" />
            <span className={`text-lg font-bold ${getCompletionRateColor(completionRate)}`}>
              {completionRate}%
            </span>
          </div>
          <p className="text-xs text-gray-500">30-day Rate</p>
        </div>
      </div>

      {/* Streak Message */}
      {habit.streak > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-4"
        >
          <p className="text-sm text-gray-600 mb-1">{getStreakEmoji(habit.streak)}</p>
          <p className="text-xs text-gray-500">{getStreakMessage(habit.streak)}</p>
        </motion.div>
      )}

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleToggleComplete}
        className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
          isCompleted
            ? 'bg-green-500 text-white hover:bg-green-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {isCompleted ? (
          <div className="flex items-center justify-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Completed Today!</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
            <span>Mark as Done</span>
          </div>
        )}
      </motion.button>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`h-2 rounded-full ${
              completionRate >= 80 ? 'bg-green-500' :
              completionRate >= 60 ? 'bg-yellow-500' :
              completionRate >= 40 ? 'bg-orange-500' : 'bg-red-500'
            }`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default HabitCard;
