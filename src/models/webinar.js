'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class webinar extends Model {
    
    static associate(models) {
      // define association here
    }
  }
  webinar.init({
    fullname: {
      type: DataTypes.STRING(100)
    },
    webinarNo:{
      type: DataTypes.STRING(100),
      allowNull: false,
      unique:true
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique:true
    },
    mobileNo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique:true
    },
    city: {
      type: DataTypes.STRING(100)
    },
    areaOfIntrerest: {
      type: DataTypes.STRING(100)
    },
    webinarSlots: {
      type:DataTypes.STRING(200)
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Submitted'),
      allowNull: false,
      defaultValue:'Pending'
    },
  }, {
    sequelize,
    modelName: 'webinar',
    tableName: 'webinars',
    timestamps: true,
  });
  return webinar;
};