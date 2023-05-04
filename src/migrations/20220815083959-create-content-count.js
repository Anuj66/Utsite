'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('content_counts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{ model: "courses", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      termId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{ model: "course_terms", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      flipped_concept: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      flipped_practical: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      live_concept: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      live_practical: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      assignments: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      createdBy:{
        type:Sequelize.INTEGER,
        allowNull: true,
        references:{ model: 'users', key:'id' },
        onUpdate:"CASCADE",
        onDelete:"SET NULL"
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      updatedBy:{
        type:Sequelize.INTEGER,
        allowNull:true,
        references:{model: 'users', key:'id'},
        onUpdate:"CASCADE",
        onDelete:"SET NULL"
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      deletedBy:{
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {model: 'users', key:'id'},
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('content_counts');
  }
};