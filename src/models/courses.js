'use strict';
const {
  Model, DATE
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class courses extends Model {

    static associate(models) {
      // define association here
      this.hasMany(models.crmData),
      this.hasMany(models.assignments, {foreignKey: 'courseId'}),
      this.hasMany(models.courseTerms, {foreignKey: 'courseId'}),
      this.hasMany(models.courseBatches, {foreignKey: 'courseId'})
      this.hasMany(models.studentApplications, {foreignKey: 'courseId'})
      this.belongsToMany(models.users, {through: 'course_users'})
    }
  }
  courses.init({
    title: {
      type: DataTypes.STRING,
    },
    overview:{
      type: DataTypes.TEXT,
    },
    description:{
      type: DataTypes.TEXT
    },
    learningOutcome:{
      type: DataTypes.TEXT,
    },
    fees:{
      type: DataTypes.STRING,
    },
    duration:{
      type: DataTypes.STRING
    },
    batchIntake:{
      type: DataTypes.INTEGER
    },
    thumbnail:{
      type: DataTypes.TEXT
    },
    promotionalVideo:{
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.ENUM("Active", "InActive")
    },
    lastDateToApply:{
      type: DataTypes.DATEONLY
    },
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    deletedBy: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'courses',
    tableName: 'courses',
    timestamps:true,
    paranoid: true
  });
  return courses;
};