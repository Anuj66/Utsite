'use strict';
const { classDates } = require("../utils/Batches");
const DB = require("../models");
const moment = require("moment");

const CourseModel = DB.courses;
const BatchModel = DB.courseBatches;
const ClassesModel = DB.classes;
const BatchDaysModel = DB.batchDays;

module.exports = {
  async up (queryInterface, Sequelize) {
    try{

      const batches = await BatchModel.findAll({
        attributes: ["id", "startDate", "courseId", "leactureStartTime", "leactureEndTime"],
        include:[
          {
            model: CourseModel,
            attributes:["duration"]
          },
          {
            model: BatchDaysModel,
            attributes: ["weekDay"]
          }
        ]
      })

      if(batches.length > 0){
        
        await Promise.all(batches.map(async (batch) => {
          const arrayOfBatchDays = batch.batchDays.map(batchDay => {
            return batchDay.weekDay
          })
          
         let classesList = classDates(
            batch.startDate,
            batch.course.duration,
            arrayOfBatchDays
          );

          classesList = classesList.map((classDate) => {
            return {
              courseId: batch.courseId,
              batchId: batch.id,
              classDate: moment(classDate).format('YYYY-MM-DD'),
              startTime: batch.leactureStartTime,
              endTime: batch.leactureEndTime
            }
          })
          
          await ClassesModel.bulkCreate(classesList)

        }))
      }
    }catch(e){
      console.log(e);
    }
  },

  async down (queryInterface, Sequelize) {
    try{
      const batches = await BatchModel.findAll({
        attributes: ["id"]
      })

      if(batches.length > 0){
        
        await Promise.all(batches.map(async (batch) => {
          return await ClassesModel.destroy({
            where: {
              batchId: batch.id
            }
          });

        }))
      }
    }catch(e){
      console.log(e);
    }
  }
};
