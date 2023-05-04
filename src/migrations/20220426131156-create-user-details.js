'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        references:{ model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      address1: {
        type: Sequelize.STRING,
      },
      address2: {
        type: Sequelize.STRING,
      },
      address3: {
        type: Sequelize.STRING,
      },
      zipcode: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.INTEGER,
      },
      state: {
        type: Sequelize.INTEGER,
      },
      country: {
        type: Sequelize.STRING,
      },
      courseProgress:{
        type: Sequelize.INTEGER,
      },
      profile_pic:{
        type: Sequelize.STRING,
      },
      '3d_profile_pic':{
        type: Sequelize.STRING,
      },
      experience:{
        type: Sequelize.TEXT
      },
      promo_video:{
        type: Sequelize.STRING
      },
      createdBy: {
        type: Sequelize.INTEGER
      },
      updatedBy: {
        type: Sequelize.INTEGER
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        References: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        References: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deletedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        References: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_details');
  }
};