'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'enroll_id', {
      type: Sequelize.STRING,
      after:'id'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'enroll_id', {})
  }
};
