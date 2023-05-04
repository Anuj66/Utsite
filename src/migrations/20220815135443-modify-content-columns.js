'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.removeConstraint("contents", "contents_ibfk_1")
    await queryInterface.removeConstraint("contents", "contents_ibfk_2")
    await queryInterface.removeConstraint("contents", "unique_constraint_record")

    await queryInterface.changeColumn("contents", "attachment", {
      type:Sequelize.TEXT
    })

    await queryInterface.changeColumn("contents", "type", {
      type: Sequelize.ENUM("Flipped Practical", "Flipped Concept", "Live Practical", "Live Concept"),
      allowNull: true,
      defaultValue: null
    })

    await queryInterface.changeColumn("contents", "status", {
      type: Sequelize.ENUM("Not Applicable", "Not Uploaded", "Uploaded But Not Approved", "Approved"),
      allowNull: true,
      defaultValue: null
    })

    await queryInterface.addColumn("contents", "order", {
      type:Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: "evaluationStatus"
    })

    await queryInterface.addColumn("contents", "isApplicable", {
      type:Sequelize.BOOLEAN,
      defaultValue: 1,
      after: "order"
    })

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addConstraint("contents", {
      type: "foreign key",
      name:"contents_ibfk_1",
      fields:["courseId"],
      references:{
        table:"courses",
        field: "id"
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    await queryInterface.addConstraint("contents", {
      type: "foreign key",
      name:"contents_ibfk_2",
      fields:["termId"],
      references:{
        table:"course_terms",
        field: "id"
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })

    await queryInterface.addConstraint('contents', {
      type: 'unique',
      name: 'unique_constraint_record',
      fields: ['courseId', 'termId', 'type', 'week']
    });

    await queryInterface.changeColumn("contents", "attachment", {
      type:Sequelize.JSON
    })

    await queryInterface.changeColumn("contents", "type", {
      type: Sequelize.ENUM("Flipped Practical", "Flipped Concept", "Live Practical", "Live Concept"),
      allowNull: false,
      defaultValue: "Flipped Concept"
    })

    await queryInterface.changeColumn("contents", "status", {
      type: Sequelize.ENUM("Not Applicable", "Not Uploaded", "Uploaded But Not Approved", "Approved"),
      allowNull: false,
      defaultValue: "Not Applicable"
    })

    await queryInterface.removeColumn("contents", "order")
    await queryInterface.removeColumn("contents", "isApplicable")
  }
};
