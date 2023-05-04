'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class showReelFeedbackParameters extends Model {
    
    static associate(models) {
      // define association here
      // this.hasMany(models.showreelFeedback)
      this.belongsTo(models.courses, { foreignKey: 'courseId'})
    }
  }
  showReelFeedbackParameters.init({
    courseId:{
      type: DataTypes.INTEGER,
      references: { model: 'courses', key: 'id'},
    },
    parameterTitle: DataTypes.STRING,
    status: DataTypes.ENUM('Active', 'Inactive'),
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'showReelFeedbackParameters',
    tableName: 'show_reel_feedback_parameters',
    timestamps: true

  });
  return showReelFeedbackParameters;
};