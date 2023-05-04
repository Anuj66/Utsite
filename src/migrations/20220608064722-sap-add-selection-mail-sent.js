'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.addColumn('student_applications', 'selectionMailSent', { 
      type: Sequelize.ENUM('Yes', 'No'),
      defaultValue: 'No',
      after: 'feedbackComment'
    });
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.removeColumn('student_applications', 'selectionMailSent');
  }
};
