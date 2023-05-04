'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class batchDays extends Model {
    
    static associate(models) {
      this.belongsTo(models.courseBatches, {foreignKey: "batchId"})
    }
  }
  batchDays.init({
    batchId: {
      type: DataTypes.INTEGER,
      references:{ model: "courseBatches", key: 'id'}
    },
    weekDay: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'batchDays',
    tableName: 'batch_days',
    timestamps: false,
    paranoid: false,
  });
  return batchDays;
};