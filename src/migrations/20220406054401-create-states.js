'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('states', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      countryID: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      stateName: {
        type: Sequelize.STRING(150),
        allowNull:false,
        unique:true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('states');
  }
};