'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class classes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.courses, {foreignKey: 'courseId'})
      this.belongsTo(models.courseBatches, {foreignKey: 'batchId'}),
      this.hasMany(models.attendance, {foreignKey: 'classId'})
    }
  }
  classes.init({
    courseId: {
      type: DataTypes.INTEGER,
      references:{ model: 'courses', key: 'id' },
    },
    batchId: {
      type: DataTypes.INTEGER,
      references: { model: 'courseBatches', key: 'id' }
    },
    classDate: {
      type: DataTypes.DATEONLY
    },
    startTime: {
      type: DataTypes.TIME
    },
    endTime: {
      type: DataTypes.TIME
    },
    status: {
      type: DataTypes.ENUM('Scheduled', 'Rescheduled')
    },
    link: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'classes',
    tableName: 'classes',
    timestamps: true,
  });
  return classes;
};