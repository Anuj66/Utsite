'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.removeColumn('courses', 'termsCount', {})
    queryInterface.removeColumn('courses', 'batchesCount', {})
  },

  async down (queryInterface, Sequelize) {
    
  }
};
