'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contents', {
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
        references: { model: "course_terms", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"  
      },
      week: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT,
        defaultValue: null,
        allowNull: true
      },
      attachment: {
        allowNull: true,
        type: Sequelize.JSON,
        defaultValue: null
      },
      type: {
        type: Sequelize.ENUM("Flipped Practical", "Flipped Concept", "Live Practical", "Live Concept"),
        allowNull: false,
        defaultValue: "Flipped Concept"
      },
      status: {
        type: Sequelize.ENUM("Not Applicable", "Not Uploaded", "Uploaded But Not Approved", "Approved"),
        allowNull: false,
        defaultValue: "Not Applicable"
      },
      urlLink: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('contents');
  }
};