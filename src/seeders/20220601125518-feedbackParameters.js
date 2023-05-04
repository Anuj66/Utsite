'use strict';
const DB = require('../models')
const coursesModel = DB.courses;
const parameters = [
  {
    'course': "Creature FX",
    "params": ['Software knowledge', 'Presentation', 'Footnotes', 'Uniqueness']
  },
  {
    'course': "Look Development",
    "params": ['Concept knowledge', 'Software knowledge', 'Footnotes', 'Aesthetics']
  },
  {
    'course': "VFX Compositing",
    "params": ['Software knowledge', 'Aesthetics', '2D & 3D Comp', 'Look Development', "Complexity Vs Quality"]
  },
  {
    'course': "FX",
    "params": ['Software knowledge', 'Presentation', 'Footnotes', 'Aesthetics']
  },
  {
    'course': "Realtime 3D Cinematics",
    "params": ['Concept knowledge', 'Software knowledge', 'Footnotes', 'Aesthetics']
  }
]

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const courses = await coursesModel.findAll()
    let parametersList = []
    courses.forEach(course => {
      const feedbackParams = parameters.filter((paramCourse) => paramCourse.course === course.title)
      if(feedbackParams.length > 0){
        feedbackParams[0].params.forEach((paramTitle => {
          parametersList.push({
            id:(parametersList.length+1),
            courseId: course.id,
            parameterTitle: paramTitle
          })
        }))
      }
      
    });
    console.log(parametersList);
    await queryInterface.bulkInsert('show_reel_feedback_parameters', parametersList, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('show_reel_feedback_parameters', null, {});
  }
};
