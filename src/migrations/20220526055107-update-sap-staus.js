'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('student_applications', 'status', { /* query options */ });
    await queryInterface.addColumn('student_applications', 'status', { 
      type: Sequelize.ENUM("Pending", "Assigned", "Interview Pending", "Interview Scheduled", "Not Appeared For Interview", "Approved", "Rejected", "Deleted"),
      defaultValue:"Pending",
      after: 'resume'
    });
  },

  async down (queryInterface, Sequelize) {
    // await queryInterface.removeColumn('student_applications', 'status', { /* query options */ });
  }
};
