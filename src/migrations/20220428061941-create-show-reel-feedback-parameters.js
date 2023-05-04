'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('show_reel_feedback_parameters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      courseId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        rederences:{ model: 'courses', key: 'id'},
        onUpdate:'CASCADE',
        onDelete:'CASCADE'
      },
      parameterTitle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('Active', 'Inactive')
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references:{ model:'users', key:'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references:{ model:'users', key:'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('show_reel_feedback_parameters');
  }
};