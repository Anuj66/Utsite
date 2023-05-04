'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('student_applications', 'applied_scholarship', {
      type: Sequelize.BOOLEAN,
      after: 'resume',
      defaultValue: false
    })

    await queryInterface.addColumn('student_applications', 'resason_for_scholaship', {
      type: Sequelize.TEXT,
      after: 'applied_scholarship',
      defaultValue: '',
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('student_applications', 'applied_scholarship', {});
    await queryInterface.removeColumn('student_applications', 'resason_for_scholaship', {});
  }
};