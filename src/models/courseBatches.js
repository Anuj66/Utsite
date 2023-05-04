'use strict';
const { Model, Op } = require('sequelize');
const moment = require('moment');


module.exports = (sequelize, DataTypes) => {
  class courseBatches extends Model {
    
    static associate(models) {
      // define association here
      this.belongsTo(models.courses, {foreignKey: 'courseId'})
      this.belongsTo(models.users, { as: 'mentorAssigned', foreignKey: 'mentor' })
      this.hasMany(models.batchStudents, { foreignKey: 'batchId'})
      this.hasMany(models.batchDays, {foreignKey: "batchId"})
      this.hasMany(models.attendance, {foreignKey: 'batchId'})
      this.hasMany(models.classes, {foreignKey: 'batchId'})
    }
  }
  courseBatches.init({
    courseId: {
      type: DataTypes.INTEGER,
      references:{ model: 'courses', key: 'id' },
    },
    batchNo:{
      type: DataTypes.STRING(10)
    },
    batchCode: {
      type: DataTypes.STRING(10),
      unique: true,
    },
    mentor: {
      type: DataTypes.INTEGER,
      references:{ model: 'users', key: 'id' },
    },
    startDate: {
      type: DataTypes.DATEONLY,
    },
    enddate: {
      type: DataTypes.DATEONLY,
    },
    leactureStartTime: {
      type: DataTypes.TIME,
    },
    leactureEndTime: {
      type: DataTypes.TIME
    },
    noOfStudents: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive", "Deleted"),
    },
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    deletedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'courseBatches',
    tableName: 'course_batches',
    timestamps: true,
    paranoid: true,
    hooks:{
      beforeCreate: async (batch, options) => {
        const tokenPrefix = `BT-${batch.dataValues.courseId}-`
        const lastRecord = await courseBatches.findOne({
          attributes:['batchCode'],
          order:[['id', 'DESC']],
          limit:1,
          where:{
            batchCode: {
              [Op.like]: `${tokenPrefix}%`
            }
          },
          paranoid: false
        })
        const lastToken = (!lastRecord) ? tokenPrefix : lastRecord.batchCode
        const newTokenNumber = (lastToken) ? (String(lastToken).replace(tokenPrefix, '')*1+1) : 1
        
        const newToken = tokenPrefix+(String(newTokenNumber).padStart(4, 0))
        batch.batchCode = newToken
      },
    }
  });
  return courseBatches;
};
