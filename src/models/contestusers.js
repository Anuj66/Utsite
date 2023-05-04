'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contestUsers extends Model {
    
    static associate(models) {
      // define association here
    }
  }
  contestUsers.init({
    name: {
      type:DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    mobileNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    contest: DataTypes.STRING,
    resourceLink: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('Pending', 'Submitted'),
      allowNull: false,
      defaultValue:'Pending'
    },
    token:{
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    }
  }, {
    sequelize,
    modelName: 'contestUsers',
    tableName: 'contest_users',
    timestamps: true,
  });
  return contestUsers;
};