'use strict';
const crypto = require("crypto");
const moment = require("moment")
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class refreshToken extends Model {
    
    static associate(models) {
      // define association here
      this.belongsTo(models.users, { foreignKey: 'userId'})
    }
    
  }
  refreshToken.init({
    userId: { type: DataTypes.INTEGER},
    token: { type: DataTypes.STRING },
    revokedAt: { type: DataTypes.DATE },
    revokedByIp: { type: DataTypes.STRING },
    replacedByToken: { type: DataTypes.STRING },
    createdByIp: { type: DataTypes.STRING },
    expires: { type: DataTypes.DATE },
    isExpired: {
        type: DataTypes.VIRTUAL,
        get() { return Date.now() >= this.expires; }
    },
    isActive: {
        type: DataTypes.VIRTUAL,
        get() { return !this.revoked && !this.isExpired; }
    }
  }, {
    sequelize,
    modelName: 'refreshToken',
    tableName: 'refresh_tokens',
    timestamps: true,
    updatedAt: false,
    hooks:{
      beforeSave: async(instane, options) => {
        if(!instane.token){
          instane.token = crypto.randomBytes(40).toString('hex')
        }
        if(!instane.expires){
          const temp = process.env.JWT_REFERESHTOKEN_EXPIRES.split(" ")
          instane.expires = moment().add(temp[0], temp[1])
        }
      }
    }
  });
  return refreshToken;
};