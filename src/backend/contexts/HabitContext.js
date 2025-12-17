import React, { createContext, useContext, useState, useEffect } from 'react';
import { habitsAPI, completionsAPI } from '../api/apiService';
import { useAuth } from './AuthContext';
import { format, subDays } from 'date-fns';

const HabitContext = createContext();

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [habitCompletions, setHabitCompletions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Load habits from API
  const loadHabits = async () => {
    if (!currentUser) return;
    try {
      const data = await habitsAPI.getAll(currentUser.id);
      setHabits(data);
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  };

  // Load completions from API
  const loadCompletions = async () => {
    if (!currentUser) return;
    try {
      const data = await completionsAPI.getAll(currentUser.id);
      setHabitCompletions(data);
    } catch (error) {
      console.error('Error loading completions:', error);
    }
  };

  // Add a new habit
  const addHabit = async (habitData) => {
    if (!currentUser) return;
    
    try {
      const data = await habitsAPI.create({
        ...habitData,
        userId: currentUser.id
      });
      // Refresh habits list
      await loadHabits();
      return data.id;
    } catch (error) {
      console.error('Error adding habit:', error);
      throw error;
    }
  };

  // Update a habit
  const updateHabit = async (habitId, habitData) => {
    if (!currentUser) return;
    
    try {
      await habitsAPI.update(habitId, habitData);
      // Refresh habits list
      await loadHabits();
    } catch (error) {
      console.error('Error updating habit:', error);
      throw error;
    }
  };

  // Delete a habit
  const deleteHabit = async (habitId) => {
    if (!currentUser) return;
    
    try {
      await habitsAPI.delete(habitId);
      // Refresh habits and completions
      await loadHabits();
      await loadCompletions();
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  };

  // Mark habit as completed for a specific date
  const markHabitComplete = async (habitId, date = new Date()) => {
    if (!currentUser) return;
    
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      await completionsAPI.markComplete(habitId, dateStr);
      // Refresh completions
      await loadCompletions();
    } catch (error) {
      console.error('Error marking habit complete:', error);
      throw error;
    }
  };

  // Unmark habit as completed for a specific date
  const unmarkHabitComplete = async (habitId, date = new Date()) => {
    if (!currentUser) return;
    
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      // Find the completion ID
      const completion = habitCompletions.find(
        c => c.habitId === habitId && c.date === dateStr
      );
      if (completion) {
        await completionsAPI.unmarkComplete(completion.id);
        // Refresh completions
        await loadCompletions();
      }
    } catch (error) {
      console.error('Error unmarking habit complete:', error);
      throw error;
    }
  };

  // Check if habit is completed for a specific date
  const isHabitCompleted = (habitId, date = new Date()) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return habitCompletions.some(completion => 
      completion.habitId === habitId && completion.date === dateStr
    );
  };

  // Get habit completion rate for a period
  const getHabitCompletionRate = (habitId, days = 30) => {
    const endDate = new Date();
    const startDate = subDays(endDate, days - 1);
    const habit = habits.find(h => h.id === habitId);
    
    if (!habit) return 0;
    
    const completionsInPeriod = habitCompletions.filter(completion => {
      const completionDate = new Date(completion.timestamp);
      return completion.habitId === habitId && 
             completionDate >= startDate && 
             completionDate <= endDate;
    });
    
    return Math.round((completionsInPeriod.length / days) * 100);
  };

  // Load habits and completions
  useEffect(() => {
    if (!currentUser) {
      setHabits([]);
      setHabitCompletions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Load habits and completions
    Promise.all([
      loadHabits(),
      loadCompletions()
    ]).finally(() => {
      setLoading(false);
    });
  }, [currentUser]);

  const value = {
    habits,
    habitCompletions,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    markHabitComplete,
    unmarkHabitComplete,
    isHabitCompleted,
    getHabitCompletionRate
  };

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};
