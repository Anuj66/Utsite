'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.addColumn('users', 'phone_prefix', {
      type: Sequelize.STRING(5),
      after:'email'
    })
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.removeColumn('users', 'phone_prefix', {});
  }
};
