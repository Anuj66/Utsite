'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      role: {
        type: Sequelize.STRING,
        unique:true
      },
      status:{
        type:Sequelize.ENUM("Active", "Inactive", "Deleted"),
        defaultValue:"Active",
        allowNull:false
      },
      createdBy:{
        type:Sequelize.INTEGER,
        defaultValue:0,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedBy:{
        type:Sequelize.INTEGER,
        allowNull:true,
        defaultValue: 0,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deletedBy:{
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_roles');
  }
};