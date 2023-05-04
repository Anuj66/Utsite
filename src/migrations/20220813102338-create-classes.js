'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('classes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{ model: "courses", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      batchId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{ model: "course_batches", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      classDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: null
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('classes');
  }
};