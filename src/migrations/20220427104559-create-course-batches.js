'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('course_batches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      batchCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        referencers: { model: 'courses', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      mentor: {
        type: Sequelize.INTEGER,
        allowNull: true,
        referencers: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'  
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      enddate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      leactureStartTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      leactureEndTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      noOfStudents: {
        type: Sequelize.INTEGER,
        allowNull: false,
        toDefaultValue: 0
      },
      status: {
        type: Sequelize.ENUM("Active", "Inactive", "Deleted"),
        defaultValue: 'Active',
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        referencers: { model:'users', key:'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        referencers: { model:'users', key:'id' },
        onUpdated: 'CASCADE',
        onDelete: 'SET NULL'
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deletedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        referencers: { model:'users', key:'id' },
        onUpdated: 'CASCADE',
        onDelete: 'SET NULL'
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('course_batches');
  }
};