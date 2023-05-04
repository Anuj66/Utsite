'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('student_applications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        isEmail: true,
        unique: true
      },
      mobileNo: {
        type: Sequelize.STRING(13),
        allowNull: false,
        isNumeric: true,
        len: [0,10],
      },
      stateId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references:{model:'states', key:'id'},
        onUpdate:"CASCADE",
        onDelete:"SET NULL"
      },
      city: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references:{model:'cities', key:'id'},
        onUpdate:"CASCADE",
        onDelete:"SET NULL"
      },
      pincode: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{model:'courses', key:'id'},
        onUpdate:"CASCADE",
        onDelete:"CASCADE"
      },
      occupation: {
        type: Sequelize.ENUM("3D VFX Student", "Working Professional"),
        allowNull: false
      },
      showReel: {
        type: Sequelize.ENUM("Yes", "No"),
        allowNull: false,
      },
      showreelLink:{
        type: Sequelize.STRING(255),
        isUrl: true
      },
      practicalScheduledOn:{
        type: Sequelize.DATE,
        isDate: true
      },
      department:{
        type: Sequelize.STRING(150)
      },
      companyName:{
        type: Sequelize.STRING(150)
      },
      noOfExperienceYears:{
        type: Sequelize.INTEGER
      },
      resume:{
        type: Sequelize.STRING
      },
      status:{
        type: Sequelize.ENUM("Active", "Inactive", "Deleted"),
        defaultValue:"Active"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      updatedBy:{
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key:'id'},
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      deletedBy:{
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key:'id'},
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
    });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('student_applications');
  }
};