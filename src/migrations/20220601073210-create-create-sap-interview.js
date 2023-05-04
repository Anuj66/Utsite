'use strict';

const { sequelize } = require("../models");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('create_sap_interviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sapId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        References: { model:  'users', 'key': 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      interviewDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      interviewTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      interviewLink: {
        type: Sequelize.STRING,
        allowNull: false
      },
      satus: {
        type: Sequelize.ENUM('Scheduled', 'Attended', 'Not appeared'),
        defaultValue: 'Scheduled'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('create_sap_interviews');
  }
};