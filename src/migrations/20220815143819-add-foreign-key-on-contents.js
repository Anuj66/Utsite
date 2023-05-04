'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
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
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("contents", "contents_ibfk_1")
    await queryInterface.removeConstraint("contents", "contents_ibfk_2")
  }
};
