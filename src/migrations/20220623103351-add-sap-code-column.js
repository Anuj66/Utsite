'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.addColumn('student_applications', 'code', {
      type: Sequelize.STRING(10)
    })
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.removeColumn('student_applications', 'code')
  }
};
