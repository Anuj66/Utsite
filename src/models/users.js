'use strict';
const req = require('express/lib/request');
const { Model } = require('sequelize');
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const moment = require("moment")

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    
    static associate(models) {
      // define association here
      
      this.hasOne(models.userDetails, {foreignKey: 'userId'})
      // this.hasMany(models.userFollowings, {foreignKey: 'userId'})
      // this.hasMany(models.showReels, {foreignKey: 'userId'})
      // this.hasMany(models.follwersLikes, {foreignKey: 'userId'})
      this.hasMany(models.courseUser, {foreignKey: 'userId'})
      this.belongsToMany(models.courses, {through: 'courseUser'})
      this.hasMany(models.studentApplications, {as: 'mentor', foreignKey:'assigedMentor'})
      this.hasMany(models.refreshToken, {foreignKey: 'userId'})
      this.hasMany(models.assignedRoles, {foreignKey: 'userId'})
      this.hasMany(models.communication, {foreignKey: 'reciever'})
      this.hasMany(models.student_assignments, {foreignKey: 'studentId'})
      this.hasMany(models.student_assignments, {foreignKey: 'approvedBy'})
      // this.hasOne(models.courseBatches, {through:"batchStudents", foreignKey: 'studentId'})
    }

    static generateAuthToken(user){
      return jwt.sign(
        {
          email: user.email,
          userId: user.id
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES }
      );
    }
  }
  Users.init({
    id: {
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true,
      allowNull:false
    },
    enroll_id:{
      type: DataTypes.STRING(10),
    },
    userName:{
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.fname} ${this.lname}`;
      },
      set(value) {
        throw new Error('Do not try to set the `fullName` value!');
      }
    },
    userType:{
      type: DataTypes.VIRTUAL,
      get() {
        if(this.assignedRoles && this.assignedRoles.length > 0){
          const roles = this.assignedRoles.map(role => {
            return (role.userRole) ? role.userRole.role : ''
          })
          return roles.join(', ');
        }else{
          return '';
        }
      },
      set(value) {
        throw new Error('Do not try to set the `fullName` value!');
      }
    },
    fname:{
     type: DataTypes.STRING(100),
    },
    lname:{
      type:DataTypes.STRING(100),
    },
    email:{
      type:DataTypes.STRING(200),
    },
    phone_prefix:{
      type: DataTypes.STRING(5)
    },
    mobileNo:{
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    password:{
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status:{
      type: DataTypes.ENUM("Active", "Inactive", "Academic Dropout", "Deleted"),
    },
    joinDate:{
      type: DataTypes.VIRTUAL,
      get() {
        return moment(this.createdAt).format(process.env.FRONTEND_DATEFORMAT);
      },
      set(value) {
        throw new Error('Do not try to set the `fullName` value!');
      }
    },
    isMobileVerified:DataTypes.BOOLEAN,
    isEmailVerified:DataTypes.BOOLEAN,
    createdBy:DataTypes.INTEGER,
    updatedBy:DataTypes.INTEGER,
    updatedAt: DataTypes.DATE,
    deletedBy:DataTypes.INTEGER,
    deletedAt: DataTypes.DATE 
  }, {
    sequelize,
    modelName: 'users',
    tableName: 'users',
    timestamps:true,
    paranoid: true,
    hooks:{
      beforeSave: async ( user, options) => {
        if (user.password && user.changed('password')) {
          user.password= await bcrypt.hash(user.password,8)
        }
      },
    }
  });

  return Users;
};