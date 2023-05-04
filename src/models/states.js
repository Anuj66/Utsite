'use strict';
const { Model } = require('sequelize');
const cities = require('./cities');


module.exports = (sequelize, DataTypes) => {
  class states extends Model {
    
    static associate(models) {
      
      // define association here
      this.belongsTo(models.Country, {foreignKey: 'countryID'})
      this.hasMany(models.cities, {
        foreignKey: {
          name: 'stateId',
          allowNull: false,
        }
      })
    }
  }
  states.init({
    countryID: DataTypes.INTEGER,
    stateName: DataTypes.STRING(150)
  }, {
    sequelize,
    modelName: 'states',
    timestamps:false
  });
  return states;
};