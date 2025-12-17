// TypeScript-like type definitions for database entities

/**
 * @typedef {Object} User
 * @property {string} id - User unique identifier
 * @property {string} email - User email address
 * @property {string} name - User full name
 * @property {Date} createdAt - Account creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {Object} Habit
 * @property {string} id - Habit unique identifier
 * @property {string} userId - Owner user ID
 * @property {string} title - Habit title
 * @property {string} description - Habit description
 * @property {string} color - Habit color theme
 * @property {string} icon - Habit icon identifier
 * @property {string} frequency - Habit frequency (daily, weekly, etc.)
 * @property {number} streak - Current streak count
 * @property {number} totalCompletions - Total completion count
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 * @property {Date} lastUpdated - Last stats update date
 */

/**
 * @typedef {Object} HabitCompletion
 * @property {string} id - Completion unique identifier
 * @property {string} habitId - Related habit ID
 * @property {string} userId - User ID who completed
 * @property {string} date - Completion date (YYYY-MM-DD format)
 * @property {Date} completedAt - Completion timestamp
 * @property {number} timestamp - Unix timestamp
 */

