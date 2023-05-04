'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sapInterview extends Model {
    
    static associate(models) {
      // define association here
      this.belongsTo(models.studentApplications, { foreignKey: 'sapId'})
    }
  }
  sapInterview.init({
    sapId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {model: 'studentApplications', key:'id'},
    },
    interviewDate: DataTypes.DATEONLY,
    interviewTime: DataTypes.TIME,
    interviewLink: DataTypes.STRING,
    rescheduleReason: DataTypes.TEXT,
    satus: {
      type: DataTypes.ENUM('Scheduled', 'Attended', 'Not appeared'),
      defaultValue: 'Scheduled'
    }
  }, {
    sequelize,
    modelName: 'sapInterview',
    tableName: 'create_sap_interviews',
  });
  return sapInterview;
};