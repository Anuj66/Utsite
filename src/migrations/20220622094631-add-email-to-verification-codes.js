'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.addColumn('verification_codes', 'email', {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: 'mobileNo'
    });
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.removeColumn('verification_codes', 'email');
  }
};
