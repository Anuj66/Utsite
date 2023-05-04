
'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('assignments', 'week', { 
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'termId'
    });

    await queryInterface.addColumn('assignments', 'status', { 
      type: Sequelize.ENUM("Not Applicable", "Not Uploaded", "Uploaded But Not Approved", "Approved"),
      allowNull: true,
      after: 'submittionDueDate'
    });

    await queryInterface.addColumn("assignments", "evaluationStatus", {
      type: Sequelize.ENUM(
        "Not Applicable",
        "Not Uploaded",
        "Pending For Evaluation",
        "Evaluated But Not Approved",
        "Approved"
      ),
      allowNull: true,
      after: "status",
      default: 'NULL'
    });

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('assignments', 'week')
    await queryInterface.removeColumn('assignments', 'status')
    await queryInterface.removeColumn('assignments', 'evaluationStatus')
  }
};
