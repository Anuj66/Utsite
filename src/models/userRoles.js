'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userRoles extends Model {
    
    static associate(models) {
      // define association here
      this.hasMany(models.assignedRoles, {foreignKey: 'roleId'})
    }
  }
  userRoles.init({
    role: DataTypes.STRING,
    status: DataTypes.ENUM("Active", "Inactive", "Deleted")
  }, {
    sequelize,
    modelName: 'userRoles',
    tableName: 'user_roles',
    timestamps:true,
    paranoid: true
  });
  return userRoles;
};