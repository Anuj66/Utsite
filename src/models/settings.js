'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class settings extends Model {
    
    static associate(models) {
      // define association here
    }
  }
  settings.init({
    settingKey: DataTypes.STRING,
    settingValue: DataTypes.TEXT,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'settings',
    timestamps: 'settings',
    timestamps: true
  });
  return settings;
};