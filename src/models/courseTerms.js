'use strict';

const { Model } = require('sequelize');
const { Op } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class courseTerms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.courses, { foreignKey:'courseId'})
    }
  }
  courseTerms.init({
    courseId: {
      type: DataTypes.INTEGER,
      references:{ model: "courses", key:"id"}
    },
    termNo: DataTypes.STRING,
    TermTitle: DataTypes.STRING,
    overview: DataTypes.TEXT,
    duration: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'courseTerms',
    tableName: 'course_terms',
    timestamps: true,
    paranoid: true,
    hooks:{
      beforeCreate: async (instance, options) => {
        const {count}= await courseTerms.findAndCountAll({
          where:{
            courseId: {
              [Op.eq]: instance.courseId
            }
          }
        })
        const termCount = count+1
        instance.termNo = `Term ${termCount}`
      }
    }
  });
  return courseTerms;
};