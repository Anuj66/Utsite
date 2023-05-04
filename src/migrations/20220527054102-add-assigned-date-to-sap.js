'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.addColumn('student_applications', 'assignedDate', { 
      type: Sequelize.DATE,
      after: 'assigedMentor'
    });

    await queryInterface.addColumn('student_applications', 'feedbackDate', { 
      type: Sequelize.DATE,
      after: 'assignedDate'
    });

    await queryInterface.addColumn('student_applications', 'feedbackComment', { 
      type: Sequelize.TEXT,
      after: 'feedbackDate'
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('student_applications', 'assignedDate');
    await queryInterface.removeColumn('student_applications', 'feedbackDate');
    await queryInterface.removeColumn('student_applications', 'feedbackComment');
  }
};
