'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('emails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false
      },
      template: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      placeHolders: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        References:{ model: 'users', key:'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        References:{ model: 'users', key:'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('emails');
  }
};