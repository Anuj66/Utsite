'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("assignments", "isApplicable", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      after: "evaluationStatus"
    });

    await queryInterface.removeColumn("assignments", "evaluationStatus");
    
    await queryInterface.addColumn('assignments', 'uploadedByMentor', {
      type: Sequelize.BOOLEAN,
      after: "isApplicable"
    })

    await queryInterface.changeColumn('assignments', 'status', { 
      type: Sequelize.ENUM("Pending", "Not Applicable", "Not Uploaded", "Pending For Evaluation", "Uploaded But Not Approved", "Approved"),
      allowNull: true,
      after: 'submittionDueDate'
    });

    /* content table modifications */

    await queryInterface.removeColumn("contents", "evaluationStatus");

    await queryInterface.addColumn('contents', 'uploadedByMentor', {
      type: Sequelize.BOOLEAN,
      after: "isApplicable"
    })

    await queryInterface.changeColumn('contents', 'status', { 
      type: Sequelize.ENUM("Pending", "Not Applicable", "Not Uploaded", "Pending For Evaluation", "Uploaded But Not Approved", "Approved"),
      allowNull: true,
      after: 'type'
    });

    await queryInterface.addColumn('contents', 'day', { 
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'week'
    });

  },

  async down (queryInterface, Sequelize) {

    await queryInterface.changeColumn("assignments", "isApplicable", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      after: "deletedAt"
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

    await queryInterface.removeColumn('assignments', 'uploadedByMentor')

    await queryInterface.changeColumn('assignments', 'status', { 
      type: Sequelize.ENUM("Not Applicable", "Not Uploaded", "Uploaded But Not Approved", "Approved"),
      allowNull: true,
      after: 'submittionDueDate'
    });

    await queryInterface.changeColumn('assignments', 'status', { 
      type: Sequelize.ENUM("Pending", "Not Applicable", "Not Uploaded", "Uploaded But Not Approved", "Approved"),
      allowNull: true,
      after: 'submittionDueDate'
    });

    /* content table modification */

    await queryInterface.addColumn("contents", "evaluationStatus", {
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
    
    await queryInterface.removeColumn('contents', 'uploadedByMentor')

    await queryInterface.changeColumn('contents', 'status', { 
      type: Sequelize.ENUM("Pending", "Not Applicable", "Not Uploaded", "Uploaded But Not Approved", "Approved"),
      allowNull: true,
      after: 'type'
    });

    await queryInterface.removeColumn('contents', 'day')

  }
};
