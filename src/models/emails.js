'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class emails extends Model {
    
    static associate(models) {
      // define association here
    }
  }
  emails.init({
    slug: DataTypes.STRING,
    subject: DataTypes.STRING,
    template: DataTypes.TEXT,
    placeHolders: DataTypes.TEXT,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'emails',
    tableName: 'emails',
    timestamps: true
  });
  return emails;
};