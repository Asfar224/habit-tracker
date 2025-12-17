const express = require('express');
const router = express.Router();
const { Habit } = require('../models');
const authMiddleware = require('../middleware/auth');

// Get all habits for a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.query;
    const habits = await Habit.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    res.json(habits);
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single habit
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const habit = await Habit.findByPk(req.params.id);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    res.json(habit);
  } catch (error) {
    console.error('Get habit error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new habit
router.post('/', authMiddleware, async (req, res) => {
  try {
    const habitData = {
      ...req.body,
      userId: req.body.userId,
      streak: 0,
      totalCompletions: 0
    };
    const habit = await Habit.create(habitData);
    res.status(201).json(habit);
  } catch (error) {
    console.error('Create habit error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update habit
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const habit = await Habit.findByPk(req.params.id);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    await habit.update(req.body);
    res.json(habit);
  } catch (error) {
    console.error('Update habit error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete habit
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const habit = await Habit.findByPk(req.params.id);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    await habit.destroy();
    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

