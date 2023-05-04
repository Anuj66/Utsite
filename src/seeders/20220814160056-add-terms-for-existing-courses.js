'use strict';
const {courseTermsArrToCreate} = require("../utils/Terms")
const DB = require("../models")

const CourseModel = DB.courses;
const CourseTermModel = DB.courseTerms;

module.exports = {
  async up (queryInterface, Sequelize) {
    try{

      const courses = await CourseModel.findAll({
        attributes: ["id"]
      })
      if(courses.length > 0){
        
        await Promise.all(courses.map(async (course) => {
          const TermsList = courseTermsArrToCreate(course.id)
          await CourseTermModel.destroy({
            where: {
              courseId: course.id
            },
            force: true
          });

          return await CourseTermModel.bulkCreate(TermsList)
          
        }))
        
      }
    }catch(e){
      console.log(e);
    }

  },

  async down (queryInterface, Sequelize) {
    try{

      const courses = await CourseModel.findAll({
        attributes: ["id"]
      })
      if(courses.length > 0){
        
        await Promise.all(courses.map(async (course) => {
          return await CourseTermModel.destroy({
            where: {
              courseId: course.id
            }
          });
          
        }))
        
      }
    }catch(e){
      console.log(e);
    }
  }
};
