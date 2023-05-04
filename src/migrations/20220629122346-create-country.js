'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('countries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      country_name: {
        type: Sequelize.STRING(150)
      },
      country_code: {
        type: Sequelize.STRING(2)
      },
      phone_code: {
        type: Sequelize.STRING(9)
      },
      status:{
        type: Sequelize.ENUM('Active', 'Inactive'),
        defaultValue:'Active' 
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('countries');
  }
};