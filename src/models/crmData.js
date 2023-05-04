'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class crmData extends Model {
    
    static associate(models) {
      this.belongsTo(models.courses);
      // this.belongsTo(models.states, { targetKey: 'id'});
      // this.belongsTo(models.cities, {targetKey: 'id'});
    }}
  crmData.init({
    name: {
      type: DataTypes.STRING,
      validate:{
        notEmpty:{
          args: [true],
          msg: "Name is required!"
        }
      }
    },
    email_address: {
      type: DataTypes.STRING,
      validate:{
        notEmpty:{
          args: [true],
          msg: "Name is required!"
        },
        isEmail:{
          args: [true],
          msg: "Invalid email supplied!"
        }
      }
    },
    mobile: {
      type: DataTypes.STRING,
      validate:{
        notEmpty:{
          args: [true],
          msg: "Mobile is required!"
        },
        len:{
          args: [10],
          msg: "Mobile number must be 10 digit long!",
        }
      }
    },
    state: {
      type: DataTypes.INTEGER,
      references: { model:'states', key:'id' }
    },
    city: {
      type: DataTypes.INTEGER,
      references: { model:'cities', key:'id' }
    },
    courseId: {
      type: DataTypes.INTEGER,
      references: { model:'courses', key:'id' }
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive")
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'crmData',
    tableName:'crm_data',
    timestamps:true,
    updatedAt: false
  });
  return crmData;
};