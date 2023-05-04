'use strict';
const { Model } = require('sequelize');
const states = require('./states');

module.exports = (sequelize, DataTypes) => {
  class cities extends Model {
    
    static associate(models) {
      // define association here
      cities.belongsTo(models.states)
    }
  }
  cities.init({
    stateId: {
      type:DataTypes.INTEGER,
      references: { model: 'states', key: 'id' }
    },
    city: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'cities',
    timestamps:false
  });
  return cities;
};