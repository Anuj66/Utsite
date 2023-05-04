'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class assignedRoles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.users, {foreignKey: 'userId'})
      this.belongsTo(models.userRoles, {foreignKey: 'roleId'})
    }
  }
  assignedRoles.init({
    userId:{ 
      type:DataTypes.INTEGER,
      references: {model: 'users', key: 'id'}
    },
    roleId:{ 
      type:DataTypes.INTEGER,
      references: {model: 'userRoles', key: 'id'}
    }
  }, {
    sequelize,
    modelName: 'assignedRoles',
    tableName: 'assigned_roles'
  });
  return assignedRoles;
};