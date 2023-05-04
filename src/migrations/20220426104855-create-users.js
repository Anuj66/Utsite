'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
      },
      roleId:{
        type:Sequelize.INTEGER,
        allowNull:true,
        references:{ model: "user_roles", key:'id' },
        onUpdate:"CASCADE",
        onDelete:"SET NULL"
      },
      fname:{
        type:Sequelize.STRING(100),
        allowNull:false
      },
      lname:{
        type:Sequelize.STRING(100),
        allowNull:false
      },
      email:{
        type:Sequelize.STRING(200),
        allowNull:false,
      },
      mobileNo:{
        type:Sequelize.STRING(13),
        allowNull:true,
      },
      password:{
        type:Sequelize.TEXT,
        allowNull:false,
      },
      status:{
        type:Sequelize.ENUM("Active", "InActive", "Academic Dropout", "Deleted"),
        allowNull:false,
        defaultValue:"Active"
      },
      isMobileVerified:{
        type:Sequelize.BOOLEAN,
        defaultValue:0
      },
      isEmailVerified:{
        type:Sequelize.BOOLEAN,
        defaultValue:0
      },
      createdBy:{
        type:Sequelize.INTEGER,
        allowNull: true,
        references:{ model: 'users', key:'id' },
        onUpdate:"CASCADE",
        onDelete:"SET NULL"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedBy:{
        type:Sequelize.INTEGER,
        allowNull:true,
        references:{model: 'users', key:'id'},
        onUpdate:"CASCADE",
        onDelete:"SET NULL"
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deletedBy:{
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {model: 'users', key:'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};