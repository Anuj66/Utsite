'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class courseUser extends Model {
    
    static associate(models) {
      // define association here
      this.belongsTo(models.users, {foreignKey: 'userId'})
      this.belongsTo(models.courses, {foreignKey: 'courseId'})
    }
  }
  courseUser.init({
    userId: {
      type: DataTypes.INTEGER,
      references:{ model: 'users', key: 'id'},
      onDelete:'CASCADE',
      onUpdate:'CASCADE',
      allowNull: true
    },
    courseId: {
      type: DataTypes.INTEGER,
      references:{ model: 'courses', key: 'id'},
      onDelete:'CASCADE',
      onUpdate:'CASCADE',
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'courseUser',
    tableName: 'course_users',
    timestamps: true
  });
  return courseUser;
};