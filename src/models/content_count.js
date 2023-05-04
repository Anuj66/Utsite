'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class content_count extends Model {
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
  content_count.init({
    courseId: {
      type:DataTypes.INTEGER,
      references: { model: 'courses', key: "id"}
    },
    termId: {
      type: DataTypes.INTEGER,
      references: { model: "courseTerms", key: "id"}
    },
    flipped_concept: {
      type: DataTypes.INTEGER
    },
    flipped_practical: {
      type: DataTypes.INTEGER
    },
    live_concept: {
      type: DataTypes.INTEGER
    },
    live_practical: {
      type: DataTypes.INTEGER
    },
    assignments: {
      type: DataTypes.INTEGER
    },
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    deletedBy: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'content_count',
    tableName: 'content_counts',
    timestamps: true,
    paranoid: true
  });
  return content_count;
};