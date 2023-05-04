'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sapFeedback extends Model {
    
    static associate(models) {
      // define association here
      this.belongsTo(models.studentApplications, { foreignKey: 'sapId'})
      this.belongsTo(models.showReelFeedbackParameters, { foreignKey: 'feedbackParameterId'})
    }
  }
  sapFeedback.init({
    sapId: DataTypes.INTEGER,
    feedbackParameterId: DataTypes.INTEGER,
    feedback: DataTypes.TEXT,
    grade: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'sapFeedback',
    tableName: 'sap_showreel_feedbacks',
    timestamps: true
  });
  return sapFeedback;
};