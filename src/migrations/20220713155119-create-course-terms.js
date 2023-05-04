'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('course_terms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      courseId: {
        type: Sequelize.INTEGER,
        References: {model:"courses", key: 'id'}
      },
      termNo: {
        type: Sequelize.STRING
      },
      TermTitle: {
        type: Sequelize.STRING
      },
      overview: {
        type: Sequelize.TEXT
      },
      duration: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('course_terms');
  }
};