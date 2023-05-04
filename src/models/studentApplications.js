'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentApplications extends Model {
    
    static associate(models) {
      // define association here
      this.belongsTo(models.courses, {foreignKey: 'courseId'})
      this.belongsTo(models.users, {foreignKey:'assigedMentor'})
      this.hasOne(models.sapInterview, {foreignKey: 'sapId'})
      this.hasMany(models.sapFeedback, {foreignKey: 'sapId'})
      this.belongsTo(models.states, {foreignKey: 'stateId'})
      this.belongsTo(models.cities, {foreignKey: 'city', as: "cityName"})
    }
  }
  StudentApplications.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    mobileNo: DataTypes.STRING,
    stateId: DataTypes.STRING,
    city: DataTypes.STRING,
    pincode: DataTypes.INTEGER,
    courseId: DataTypes.INTEGER,
    occupation: DataTypes.STRING,
    showReel: {
      type: DataTypes.ENUM("Yes", "No"),
    },
    showreelLink:DataTypes.STRING,
    practicalScheduledOn:DataTypes.DATE,
    department:DataTypes.STRING,
    companyName:DataTypes.STRING,
    noOfExperienceYears:DataTypes.INTEGER,
    resume:DataTypes.STRING,
    assigedMentor:{
      type: DataTypes.INTEGER,
      references: {model: 'users', key: 'id'},
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allownull: true
    },
    assignedDate: DataTypes.DATE,
    feedbackDate: DataTypes.DATE,
    feedbackComment: DataTypes.TEXT,
    selectionMailSent: DataTypes.ENUM('Yes', 'No'),
    status:{
      type:DataTypes.ENUM("Pending", "Assigned", "Approved", "Rejected", "Deleted", "Interview Pending")
    },
    applied_scholarship: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    resason_for_scholaship: DataTypes.TEXT,
    // feedbackStep: DataTypes.INTEGER,
    code: DataTypes.STRING(10)
  }, {
    sequelize,
    tableName: 'student_applications',
    modelName: 'studentApplications',
    timestamps: true,
    paranoid:true
  });
  return StudentApplications;
};