'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class country extends Model {
    
    static associate(models) {
      // define association here
      this.hasMany(models.states, {foreignKey: 'countryID'})
    }
  }
  country.init({
    country_name: DataTypes.STRING,
    country_code: DataTypes.STRING,
    phone_code: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Country',
    tableName: "countries"
  });
  return country;
};