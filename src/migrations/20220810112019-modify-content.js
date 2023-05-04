'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("contents", "evaluationStatus", {
      type: Sequelize.ENUM(
        "Not Applicable",
        "Not Uploaded",
        "Pending For Evaluation",
        "Evaluated But Not Approved",
        "Approved"
      ),
      allowNull: true,
      after: "urlLink",
    });

    await queryInterface.addConstraint('contents', {
      type: 'unique',
      name: 'unique_constraint_record',
      fields: ['courseId', 'termId', 'type', 'week']
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn('contents', 'evaluationStatus')
    await queryInterface.removeConstraint('contents', 'contents_ibfk_1')
    await queryInterface.removeConstraint('contents', 'contents_ibfk_2')
    await queryInterface.removeConstraint('contents', 'unique_constraint')
    await queryInterface.removeColumn('contents', 'week')
  }
};
