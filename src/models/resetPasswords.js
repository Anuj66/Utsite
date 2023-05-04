'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class resetPasswords extends Model {
    
    static associate(models) {
      // define association here
      this.belongsTo(models.users, {foreignKey: 'userId'})
    }
  }
  resetPasswords.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: DataTypes.INTEGER,
    token: DataTypes.STRING,
    status: DataTypes.ENUM("Active", 'Expired'),
  }, {
    sequelize,
    modelName: 'resetPasswords',
    tableName: 'reset_passwords',
    timestamps: true,
    updatedAt: false
  });
  return resetPasswords;
};