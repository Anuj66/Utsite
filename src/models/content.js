'use strict';
const { INTEGER } = require('sequelize');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class content extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.courses, {foreignKey:'courseId'})
      this.belongsTo(models.courseTerms, {foreignKey:'termId'})
    }
  }
  content.init({
    courseId: {
      type:DataTypes.INTEGER,
      references: { model: 'courses', key: "id"}
    },
    termId: {
      type: DataTypes.INTEGER,
      references: { model: "courseTerms", key: "id"}
    }, 
    description: {
      type: DataTypes.TEXT
    },
    week: {
      type: DataTypes.INTEGER,
    },
    attachment: {
      type: DataTypes.TEXT
    },
    type: {
      type: DataTypes.ENUM("Flipped Practical", "Flipped Concept", "Live Practical", "Live Concept")
    },
    status: {
      type: DataTypes.ENUM("Pending", "Not Applicable", "Not Uploaded", "Pending For Evaluation", "Uploaded But Not Approved", "Approved")
    },
    day:{
      type: DataTypes.INTEGER
    },
    urlLink: {
      type: DataTypes.STRING
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
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
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
    order:{
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'content',
    tableName: 'contents',
    timestamps: true,
    paranoid: true
  });
  return content;
};