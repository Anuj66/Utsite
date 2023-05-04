'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userDetails extends Model {
    
    static associate(models) {
      // define association here
      this.belongsTo(models.users, {foreignKey:'userId'})
    }
  }
  userDetails.init({
    userId: DataTypes.INTEGER,
    address1: DataTypes.STRING,
    address2: DataTypes.STRING,
    address3: DataTypes.STRING,
    zipcode: DataTypes.STRING,
    city: DataTypes.INTEGER,
    state: DataTypes.INTEGER,
    country: DataTypes.STRING,
    courseProgress: DataTypes.INTEGER,
    profile_pic: DataTypes.STRING,
    '3d_profile_pic': DataTypes.STRING,
    experience:DataTypes.TEXT,
    promo_video: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    deletedBy: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'userDetails',
    tableName: 'user_details',
    timestamps:true,
    paranoid: true
  });
  return userDetails;
};