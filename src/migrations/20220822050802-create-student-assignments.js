'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('student_assignments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{ model: 'users', key:'id'},
        onUpdate:'CASCADE',
        onDelete: 'CASCADE'
      },
      assignmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{ model: 'assignments', key:'id'},
        onUpdate:'CASCADE',
        onDelete: 'CASCADE'
      },
      resource: {
        type: Sequelize.JSON,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM("Pending Review", "Reassigned", "Completed"),
        allowNull: false,
        defaultValue: 'Pending Review'
      },
      publishSatus: {
        type: Sequelize.ENUM("Pending", "Published"),
        allowNull: false,
        defaultValue: "Pending"
      },
      approvedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key:'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.dropTable('student_assignments');
  }
};