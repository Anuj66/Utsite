'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addConstraint("course_terms", {
      fields: ['courseId'],
      type: 'foreign key',
      name: 'term_courseId', // optional
      references: {
        table: 'courses',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })

    await queryInterface.addColumn("course_terms", "deletedAt", {
      type: Sequelize.DATE,
      after:"updatedAt"
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("course_terms", 'term_courseId')

    await queryInterface.removeColumn("course_terms", "deletedAt")
  }
};
