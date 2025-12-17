// Database Models and Schemas

export const UserSchema = {
  id: String,
  email: String,
  name: String,
  createdAt: Date,
  updatedAt: Date
};

export const HabitSchema = {
  id: String,
  userId: String,
  title: String,
  description: String,
  color: String,
  icon: String,
  frequency: String, // 'daily', 'weekly', etc.
  streak: Number,
  totalCompletions: Number,
  createdAt: Date,
  updatedAt: Date,
  lastUpdated: Date
};

export const HabitCompletionSchema = {
  id: String,
  habitId: String,
  userId: String,
  date: String, // Format: 'YYYY-MM-DD'
  completedAt: Date,
  timestamp: Number
};

// Database helper functions
export const createUser = (userData) => {
  return {
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

export const createHabit = (habitData) => {
  return {
    ...habitData,
    streak: 0,
    totalCompletions: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastUpdated: new Date()
  };
};

export const createHabitCompletion = (completionData) => {
  return {
    ...completionData,
    completedAt: new Date(),
    timestamp: Date.now()
  };
};

