'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('batch_students', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      studentId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: {model: "users", key:'id'},
        onUpdate: 'CASCADE',
        onDelete:"CASCADE"
      },
      batchId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: {model: "course_batches", key:'id'},
        onUpdate: 'CASCADE',
        onDelete:"CASCADE"
      },
      createdAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('batch_students');
  }
};