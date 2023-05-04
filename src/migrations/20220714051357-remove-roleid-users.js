'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'roleId', {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'roleId', {
      type: Sequelize.INTEGER,
      refrences:{ model: 'userRoles', key: 'id'},
      after: 'id'
    })
  }
};
