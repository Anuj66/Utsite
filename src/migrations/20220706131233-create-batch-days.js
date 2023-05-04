'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('batch_days', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      batchId: {
        type: Sequelize.INTEGER,
        references:{ model: "course_batches", key: 'id'}
      },
      weekDay: {
        type: Sequelize.INTEGER
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('batch_days');
  }
};