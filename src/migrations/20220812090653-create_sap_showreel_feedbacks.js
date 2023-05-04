'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    
    await queryInterface.createTable('sap_showreel_feedbacks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sapId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'student_applications', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      feedbackParameterId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'show_reel_feedback_parameters', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      feedback: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      grade: {
        type: Sequelize.STRING,
        allowNull: false
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
    
    await queryInterface.dropTable('sap_showreel_feedbacks');
  }
};