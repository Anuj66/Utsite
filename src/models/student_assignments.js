'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class student_assignments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.users, {foreignKey: 'studentId'})
      this.belongsTo(models.users, {foreignKey: 'approvedBy'})
      this.belongsTo(models.assignments, {foreignKey: 'assignmentId'})
    }
  }
  student_assignments.init({
    studentId: {
      type:DataTypes.INTEGER,
      references: { model: 'users', key: "id"}
    },
    assignmentId: {
      type:DataTypes.INTEGER,
      references: { model: 'assignments', key: "id"}
    },
    resource: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    status: DataTypes.ENUM("Pending Review", "Reassigned", "Completed"),
    publishSatus: DataTypes.ENUM("Pending", "Published"),
    approvedBy: {
      type:DataTypes.INTEGER,
      references: { model: 'users', key: "id"}
    },
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    deletedBy: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'student_assignments',
    tableName: 'student_assignments',
    timestamps: true,
    paranoid: true
  });
  return student_assignments;
};