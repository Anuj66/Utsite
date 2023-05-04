'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('course_users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references:{ model: 'users', key: 'id'},
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
        allowNull: true
      },
      courseId: {
        type: Sequelize.INTEGER,
        references:{ model: 'courses', key: 'id'},
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },{
      uniqueKeys:{
        course_users:{
          fields:['userId']
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('course_users');
  }
};