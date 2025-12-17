module.exports = (sequelize, DataTypes) => {
  const HabitCompletion = sequelize.define('HabitCompletion', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    habitId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'habits',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    tableName: 'habit_completions',
    timestamps: true
  });

  return HabitCompletion;
};

