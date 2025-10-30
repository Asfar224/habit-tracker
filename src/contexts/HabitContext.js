import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { format, startOfDay, endOfDay, isSameDay, addDays, subDays } from 'date-fns';

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

  // Add a new habit
  const addHabit = async (habitData) => {
    if (!currentUser) return;
    
    try {
      const docRef = await addDoc(collection(db, 'habits'), {
        ...habitData,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        streak: 0,
        totalCompletions: 0
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding habit:', error);
      throw error;
    }
  };

  // Update a habit
  const updateHabit = async (habitId, habitData) => {
    if (!currentUser) return;
    
    try {
      const habitRef = doc(db, 'habits', habitId);
      await updateDoc(habitRef, {
        ...habitData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating habit:', error);
      throw error;
    }
  };

  // Delete a habit
  const deleteHabit = async (habitId) => {
    if (!currentUser) return;
    
    try {
      // Delete the habit
      await deleteDoc(doc(db, 'habits', habitId));
      
      // Delete all completions for this habit
      const completionsQuery = query(
        collection(db, 'habitCompletions'),
        where('habitId', '==', habitId),
        where('userId', '==', currentUser.uid)
      );
      const completionsSnapshot = await getDocs(completionsQuery);
      const deletePromises = completionsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
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
      const completionRef = doc(db, 'habitCompletions', `${currentUser.uid}_${habitId}_${dateStr}`);
      
      await addDoc(collection(db, 'habitCompletions'), {
        habitId,
        userId: currentUser.uid,
        completedAt: serverTimestamp(),
        date: dateStr,
        timestamp: date.getTime()
      });
      
      // Update habit streak and total completions
      await updateHabitStats(habitId);
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
      const completionsQuery = query(
        collection(db, 'habitCompletions'),
        where('habitId', '==', habitId),
        where('userId', '==', currentUser.uid),
        where('date', '==', dateStr)
      );
      
      const completionsSnapshot = await getDocs(completionsQuery);
      const deletePromises = completionsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      // Update habit streak and total completions
      await updateHabitStats(habitId);
    } catch (error) {
      console.error('Error unmarking habit complete:', error);
      throw error;
    }
  };

  // Update habit statistics (streak, total completions)
  const updateHabitStats = async (habitId) => {
    if (!currentUser) return;
    
    try {
      const completionsQuery = query(
        collection(db, 'habitCompletions'),
        where('habitId', '==', habitId),
        where('userId', '==', currentUser.uid),
        orderBy('timestamp', 'desc')
      );
      
      const completionsSnapshot = await getDocs(completionsQuery);
      const completions = completionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Calculate streak
      let streak = 0;
      const today = new Date();
      let currentDate = startOfDay(today);
      
      for (let i = 0; i < completions.length; i++) {
        const completionDate = new Date(completions[i].timestamp);
        if (isSameDay(completionDate, currentDate)) {
          streak++;
          currentDate = subDays(currentDate, 1);
        } else if (completionDate < currentDate) {
          break;
        }
      }
      
      // Update habit with new stats
      const habitRef = doc(db, 'habits', habitId);
      await updateDoc(habitRef, {
        streak,
        totalCompletions: completions.length,
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating habit stats:', error);
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

    // Load habits
    const habitsQuery = query(
      collection(db, 'habits'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribeHabits = onSnapshot(habitsQuery, (snapshot) => {
      const habitsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched habits:', habitsData);
      setHabits(habitsData);
    }, (error) => {
      console.error('Error fetching habits:', error);
    });

    // Load habit completions
    const completionsQuery = query(
      collection(db, 'habitCompletions'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribeCompletions = onSnapshot(completionsQuery, (snapshot) => {
      const completionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched completions:', completionsData);
      setHabitCompletions(completionsData);
    }, (error) => {
      console.error('Error fetching completions:', error);
    });

    setLoading(false);

    return () => {
      unsubscribeHabits();
      unsubscribeCompletions();
    };
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
