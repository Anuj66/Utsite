'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('assignments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{model:'courses', key:'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      termId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      batchId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{model:'course_batches', key:'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      submittionDueDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {model: 'users', key:'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {model: 'users', key:'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deletedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {model: 'users', key:'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('assignments');
  }
};