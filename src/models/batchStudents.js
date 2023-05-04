'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class batchStudents extends Model {
    
    static associate(models) {
      // define association here
      this.belongsTo(models.courseBatches, { foreignKey: 'batchId'})
      this.belongsTo(models.users,{ foreignKey: 'studentId' })
    }
  }
  batchStudents.init({
    studentId: {
      type: DataTypes.INTEGER,
    },
    batchId: {
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'batchStudents',
    tableName: 'batch_students',
    timestamps: true,
    updatedAt: false
  });
  return batchStudents;
};