import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  LogOut, 
  Calendar, 
  TrendingUp, 
  Trophy, 
  Target,
  Flame,
  BarChart3,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useHabits } from '../../contexts/HabitContext';
import HabitCard from '../habits/HabitCard';
import AddHabitModal from '../habits/AddHabitModal';
import EditHabitModal from '../habits/EditHabitModal';
import ProgressChart from './ProgressChart';
import StatsOverview from './StatsOverview';
import LevelProgress from '../gamification/LevelProgress';
import AchievementBadge from '../gamification/AchievementBadge';

const Dashboard = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [activeTab, setActiveTab] = useState('habits');
  const { logout } = useAuth();
  const { habits, deleteHabit, loading } = useHabits();
  
  const completedToday = habits.filter(habit => {
    const today = new Date();
    return habit.completions?.some(completion => 
      new Date(completion.timestamp).toDateString() === today.toDateString()
    );
  }).length;

  const totalStreak = habits.reduce((sum, habit) => sum + (habit.streak || 0), 0);
  const totalCompletions = habits.reduce((sum, habit) => sum + (habit.totalCompletions || 0), 0);

  // Gamification data
  const totalExperience = habits.reduce((sum, habit) => sum + (habit.totalCompletions || 0) * 10, 0);
  const currentLevel = Math.floor(totalExperience / 100) + 1;
  const currentLevelExp = totalExperience % 100;
  const nextLevelExp = 100;
  
  // Sample achievements data
  const achievements = [
    {
      id: 1,
      name: 'First Steps',
      description: 'Complete your first habit',
      type: 'completions',
      requirement: 1,
      rarity: 'common',
      unlocked: totalExperience > 0
    },
    {
      id: 2,
      name: 'Streak Master',
      description: 'Maintain a 7-day streak',
      type: 'streak',
      requirement: 7,
      rarity: 'uncommon',
      unlocked: habits.length > 0 ? Math.max(...habits.map(h => h.streak || 0)) >= 7 : false
    },
    {
      id: 3,
      name: 'Habit Hero',
      description: 'Complete 100 habits total',
      type: 'completions',
      requirement: 100,
      rarity: 'rare',
      unlocked: totalCompletions >= 100
    },
    {
      id: 4,
      name: 'Consistency King',
      description: 'Complete all habits for 30 days',
      type: 'consistency',
      requirement: 30,
      rarity: 'epic',
      unlocked: false // This would need more complex logic
    }
  ];

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setShowEditModal(true);
  };

  const handleDelete = async (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      try {
        await deleteHabit(habitId);
      } catch (error) {
        console.error('Error deleting habit:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading your habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Habit Tracker</h1>
              <p className="text-white/70">Build better habits, one day at a time</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <StatsOverview 
            totalHabits={habits.length}
            completedToday={completedToday}
            totalStreak={totalStreak}
            totalCompletions={totalCompletions}
          />
        </motion.div>

        {/* Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <LevelProgress
            level={currentLevel}
            experience={currentLevelExp}
            nextLevelExp={nextLevelExp}
            totalExperience={totalExperience}
          />
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex space-x-1 bg-white/10 backdrop-blur-lg rounded-2xl p-1 mb-8"
        >
          <button
            onClick={() => setActiveTab('habits')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-xl transition-all ${
              activeTab === 'habits'
                ? 'bg-white text-purple-600 shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>My Habits</span>
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-xl transition-all ${
              activeTab === 'progress'
                ? 'bg-white text-purple-600 shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Progress</span>
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-xl transition-all ${
              activeTab === 'achievements'
                ? 'bg-white text-purple-600 shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Achievements</span>
          </button>
        </motion.div>

        {/* Content */}
        {activeTab === 'habits' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Add Habit Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Your Habits</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:from-yellow-500 hover:to-orange-600 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Add Habit</span>
              </motion.button>
            </div>

            {/* Habits Grid */}
            {habits.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-12 h-12 text-white/50" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No habits yet</h3>
                <p className="text-white/70 mb-6">Start your journey by adding your first habit!</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:from-yellow-500 hover:to-orange-600 transition-all"
                >
                  Create Your First Habit
                </motion.button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {habits.map((habit, index) => (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <HabitCard
                      habit={habit}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'progress' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Your Progress</h2>
            <ProgressChart habits={habits} />
          </motion.div>
        )}

        {activeTab === 'achievements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AchievementBadge
                    achievement={achievement}
                    isUnlocked={achievement.unlocked}
                    progress={
                      achievement.type === 'completions' ? totalCompletions :
                      achievement.type === 'streak' ? Math.max(...habits.map(h => h.streak || 0)) :
                      0
                    }
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AddHabitModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
      
      <EditHabitModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingHabit(null);
        }}
        habit={editingHabit}
      />
    </div>
  );
};

export default Dashboard;
