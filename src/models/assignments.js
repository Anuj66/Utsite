"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class assignments extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.courses,{foreignKey:'courseId'});
      this.belongsTo(models.courseTerms, { foreignKey: "termId" });
    }
  }
  assignments.init(
    {
      courseId: {
        type: DataTypes.INTEGER,
        references: { model: "courses", key: "id" },
      },
      termId: {
        type: DataTypes.INTEGER,
        references: { model: "courseTerms", key: "id" },
      },
      week: {
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.TEXT,
      },
      attachment: {
        type: DataTypes.TEXT
      },
      order:{
        type: DataTypes.INTEGER,
      },
      submittionDueDate: {
        type: DataTypes.DATEONLY,
      },
      status: {
        type: DataTypes.ENUM(
          "Pending",
          "Not Applicable",
          "Not Uploaded",
          "Pending For Evaluation",
          "Uploaded But Not Approved",
          "Approved"
        ),
      },
      isApplicable:{
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      isNotApplicable:{
        type: DataTypes.VIRTUAL,
        get() {
          return !this.isApplicable;
        },
      },
      uploadedByMentor:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      // evaluationStatus: {
      //   type: DataTypes.ENUM(
      //     "Pending",
      //     "Not Applicable",
      //     "Not Uploaded",
      //     "Pending For Evaluation",
      //     "Evaluated But Not Approved",
      //     "Approved"
      //   ),
      // },
      createdBy: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
      deletedBy: DataTypes.INTEGER,
      type: {
        type: DataTypes.VIRTUAL,
        get() {
          return 'assignment';
        },
      }
    },
    {
      sequelize,
      modelName: "assignments",
      tableName: "assignments",
      timestamps: true,
      paranoid: true,
    }
  );
  return assignments;
};
