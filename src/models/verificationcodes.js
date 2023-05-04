'use strict';
const { Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class verificationCodes extends Model {
    s
    static associate(models) {
      // define association here
      
    }
  }
  verificationCodes.init({
    mobileNo: {
      type: DataTypes.STRING,
      // validate:{
      //   len:{
      //     args: [6, 10],
      //     msg: "Please supply valid mobile number"
      //   },
      //   notEmpty:{
      //     args: [true],
      //     msg:"Mobile no is required!"
      //  }
      // }
    },
    email: {
      type: DataTypes.STRING(255),
    },
    code: {
      type: DataTypes.STRING,
      validate:{
        len:{
          args: [6],
          msg: 'OPT should be length of 6 digits'
        }
      },
      notEmpty: true
    },
    status: {
      type:DataTypes.ENUM("Active", "Expired"),
      validate:{
        isIn:{
          args: [["Active", "Expired"]],
          msg: 'Status must be IN ("Active", "Expired")'
        }
      }
    },
    IP: DataTypes.STRING,
  }, {
    sequelize,
    timestamps: true,
    tableName: 'verification_codes',
    modelName: 'verificationCodes',
  });
  return verificationCodes;
};