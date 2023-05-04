'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
     await queryInterface.addColumn('create_sap_interviews', 'rescheduleReason', {
      type: Sequelize.TEXT,
      after: "interviewLink"
     })
  },

  async down (queryInterface, Sequelize) {
    
     await queryInterface.removeColumn('create_sap_interviews', 'rescheduleReason');
  }
};
