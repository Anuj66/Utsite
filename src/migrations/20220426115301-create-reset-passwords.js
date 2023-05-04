'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reset_passwords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull:true,
        defaultValue:0,
        references:{ model: 'users', key:'id'},
        onUpdate:"CASCADE",
        onDelete:'SET NULL'
      },
      token: {
        type: Sequelize.STRING,
        allowNull:false,
      },
      status:{
        type:Sequelize.ENUM("Active", 'Expired'),
        defaultValue:"Active",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('reset_passwords');
  }
};