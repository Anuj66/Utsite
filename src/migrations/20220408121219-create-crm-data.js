'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('crm_data', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(100)
      },
      email_address: {
        type: Sequelize.STRING(150)
      },
      mobile: {
        type: Sequelize.STRING(13),
        unique:true
      },
      state: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        references:{model:'states', key:'id'},
        onUpdate:"CASCADE",
        onDelete:"SET NULL"
      },
      city: {
        type: Sequelize.INTEGER,
        defaultValue:0,
        references:{ model:"cities", key:'id'},
        onUpdate:"CASCADE",
        onDelete:"SET NULL"
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        references: { model:"courses", key:'id'},
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      status: {
        type: Sequelize.ENUM("Active", "Inactive"),
        defaultValue:'Active'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('crm_data');
  }
};