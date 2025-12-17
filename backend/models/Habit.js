module.exports = (sequelize, DataTypes) => {
  const Habit = sequelize.define('Habit', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: '#3B82F6'
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true
    },
    frequency: {
      type: DataTypes.STRING,
      defaultValue: 'daily'
    },
    streak: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalCompletions: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'habits',
    timestamps: true
  });

  return Habit;
};

