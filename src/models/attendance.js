'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.courses,{foreignKey:'courseId'});
      this.belongsTo(models.courseBatches,{foreignKey:"batchId"})
      this.belongsTo(models.classes,{foreignKey:'classId'});
      this.belongsTo(models.users,{foreignKey:"studentId"})
    }
  }
  attendance.init({
    courseId: {
      type:DataTypes.INTEGER,
      references: { model: 'courses', key: "id"}
    },
    batchId: {
      type:DataTypes.INTEGER,
      references: { model: 'courseBatches', key: "id"}
    },
    classId: {
      type:DataTypes.INTEGER,
      references: { model: 'classes', key: "id"}
    },
    studentId: {
      type:DataTypes.INTEGER,
      references: { model: 'users', key: "id"}
    },
    staus: {
      type: DataTypes.ENUM('Present', 'Absent'),
      validate: {
        isIn: {
          args: [["Present", "Absent"]],
          msg: 'Staus should be in ("Present", "Absent")!',
        },
      },
    },
  }, {
    sequelize,
    modelName: 'attendance',
    tableName: 'attendances',
    timestamps: true,
  });
  return attendance;
};