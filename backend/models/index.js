const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Create Sequelize instance
// Strip quotes from password if present
const dbPassword = (process.env.DB_PASSWORD || 'postgres123').replace(/^["']|["']$/g, '');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'habit_tracker',
  process.env.DB_USER || 'postgres',
  dbPassword,
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: false
  }
);

// Import models
const UserModel = require('./User');
const HabitModel = require('./Habit');
const HabitCompletionModel = require('./HabitCompletion');

// Initialize models
const User = UserModel(sequelize, DataTypes);
const Habit = HabitModel(sequelize, DataTypes);
const HabitCompletion = HabitCompletionModel(sequelize, DataTypes);

// Define relationships
Habit.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Habit, { foreignKey: 'userId', as: 'habits' });

HabitCompletion.belongsTo(Habit, { foreignKey: 'habitId', as: 'habit' });
Habit.hasMany(HabitCompletion, { foreignKey: 'habitId', as: 'completions' });

HabitCompletion.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(HabitCompletion, { foreignKey: 'userId', as: 'completions' });

module.exports = {
  sequelize,
  User,
  Habit,
  HabitCompletion
};

