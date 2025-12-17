const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection and sync models
sequelize.authenticate()
  .then(async () => {
    console.log('✅ Database connection established successfully.');
    // Sync database models
    try {
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synced successfully.');
    } catch (syncError) {
      console.error('⚠️  Database sync warning:', syncError.message);
    }
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err);
  });

// Import routes
const authRoutes = require('./routes/auth');
const habitRoutes = require('./routes/habits');
const completionRoutes = require('./routes/completions');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/completions', completionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Habit Tracker API Server' });
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

module.exports = app;

