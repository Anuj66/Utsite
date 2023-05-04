'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('courses', 'fees', { 
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('courses', 'description', { 
      type: Sequelize.TEXT,
      after: "overview" 
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('courses', 'description', {});
  }
};
