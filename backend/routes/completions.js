const express = require('express');
const router = express.Router();
const { HabitCompletion } = require('../models');
const authMiddleware = require('../middleware/auth');

// Get all completions for a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { userId, habitId } = req.query;
    const where = { userId };
    if (habitId) {
      where.habitId = habitId;
    }
    const completions = await HabitCompletion.findAll({
      where,
      order: [['timestamp', 'DESC']]
    });
    res.json(completions);
  } catch (error) {
    console.error('Get completions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark habit as complete
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { habitId, date } = req.body;
    const userId = req.user.userId;

    // Check if already completed for this date
    const existing = await HabitCompletion.findOne({
      where: { habitId, userId, date }
    });

    if (existing) {
      return res.status(400).json({ message: 'Already completed for this date' });
    }

    const completion = await HabitCompletion.create({
      habitId,
      userId,
      date,
      timestamp: new Date(date).getTime()
    });

    res.status(201).json(completion);
  } catch (error) {
    console.error('Create completion error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Unmark habit completion
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const completion = await HabitCompletion.findByPk(req.params.id);
    if (!completion) {
      return res.status(404).json({ message: 'Completion not found' });
    }
    await completion.destroy();
    res.json({ message: 'Completion deleted successfully' });
  } catch (error) {
    console.error('Delete completion error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

